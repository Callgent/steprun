import asyncio
import errno
import fcntl
import logging
import os
import re
import time
from typing import Optional

from nanoid import generate

log_level = os.getenv("LOG_LEVEL", "INFO").upper()
logging.basicConfig(
    level=logging._nameToLevel.get(log_level),
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
)
logger = logging.getLogger(__name__)
logger.info("Log level set to %s", log_level)

SANDBOX_ROOT = os.getenv("SANDBOX_ROOT", "/sandboxes/")
logger.info("\t\tSandbox root: %s", SANDBOX_ROOT)

SANDBOX_PREFIX = SANDBOX_ROOT + os.getenv("SANDBOX_PREFIX", "sandbox_")
SHARED_LIBS_PATH = SANDBOX_ROOT + os.getenv("SHARED_LIBS_PATH", "shared_libs")


class BoxedProcess:
    def __init__(self, box_id: str):
        self.box_id = box_id
        # TODO: put a sub-process lock file in the sandbox. in case sub-process crash, we
        self.process: Optional[asyncio.subprocess.Process] = None
        self._lock = asyncio.Lock()
        self._timeout = 5
        self._monitor_task = None
        self._health_check_interval = 10  # 每10秒检查一次进程健康状态

    async def __aenter__(self):
        """支持异步上下文管理器协议"""
        await self.start()
        return self

    async def __aexit__(self, exc_type, exc_val, exc_tb):
        """退出上下文时停止进程"""
        await self.stop()

    def __del__(self):
        """确保对象被垃圾回收时进程也被终止"""
        if self.process:
            # 创建一个新的事件循环来运行同步代码
            try:
                loop = asyncio.get_event_loop()
                if loop.is_running():
                    loop.create_task(self.stop())
                else:
                    loop.run_until_complete(self.stop())
            except Exception:
                # 如果无法获取事件循环，直接终止进程
                if hasattr(self.process, "kill"):
                    self.process.kill()
            finally:
                self._clear()

    async def start(self) -> None:
        """启动沙箱进程并设置监控"""
        async with self._lock:
            if self.is_running:
                return

            sandbox_path = f"{SANDBOX_PREFIX}{self.box_id}"
            env = {
                "PYTHONPATH": f"{sandbox_path}/lib:{SHARED_LIBS_PATH}",
                "PYTHONSTARTUP": "/usr/local/bin/python_startup.py",
                "PYTHONUSERBASE": f"{sandbox_path}/lib",
                "HOME": f"{sandbox_path}/work",
                "TMPDIR": f"{sandbox_path}/tmp",
                "PATH": "/usr/local/bin:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin",
            }

            # 限制资源在子进程启动前同步设置
            def _preexec():
                pass
                # resource.setrlimit(resource.RLIMIT_AS, (200*1024*1024, 200*1024*1024))  # 内存限制
                # resource.setrlimit(resource.RLIMIT_NOFILE, (32, 32))  # 文件描述符限制
                # resource.setrlimit(resource.RLIMIT_CPU, (60, 60))  # CPU 时间限制60秒
                # resource.setrlimit(resource.RLIMIT_CORE, (0, 0))  # 禁止核心转储
                # resource.setrlimit(resource.RLIMIT_FSIZE, (10*1024*1024, 10*1024*1024))  # 文件大小限制

            # gosu sandboxed dmtcp_launch -j --ckpt-signal 10 --allow-file-overwrite --no-gzip python -i -s -q -u
            self.process = await asyncio.create_subprocess_exec(
                "gosu",
                "sandboxed",
                "dmtcp_launch",
                "-j",
                "--ckpt-signal",
                "10",
                "--allow-file-overwrite",
                "--no-gzip",
                "python",
                "-i",
                "-q",
                "-s",
                "-u",
                cwd=f"{sandbox_path}/work",
                env=env,
                preexec_fn=_preexec,
                stdin=asyncio.subprocess.PIPE,
                stdout=asyncio.subprocess.PIPE,
                stderr=asyncio.subprocess.PIPE,
            )
            logger.info("Box %s started with PID %s", self.box_id, self.process.pid)

            # 启动监控任务
            if self._monitor_task is None:
                self._monitor_task = asyncio.create_task(self._monitor_process())

    async def execute(self, code: str, timeout: float = 200.0) -> tuple[str, str]:
        """
        在沙箱中执行代码，自动处理进程状态
        Args:
            code (str): 要执行的代码。
            timeout (float): 执行的最大等待时间（秒）。
        Returns:
            tuple: (stdout_output, stderr_output)，分别为标准输出和错误输出的字符串。
        """
        async with self._lock:
            if not self.process or not self.is_running or self.process.stdin is None:
                raise RuntimeError("Box process not running")

            marker = f"__COMPLETE_{generate()}__"
            # 限制localhost/127.0.0.1访问
            sanitized = re.sub(
                r"(localhost|127\.0\.0\.1|0\.0\.0\.0)", "blocked_address", code
            )
            logger.debug(
                "Box %s executing code: %s%s",
                self.box_id,
                sanitized[:100],
                "..." if len(sanitized) > 100 else "",
            )
            sanitized = sanitized + '\nprint("' + marker + '")\n'

            try:
                # 清空可能的残留输出，设置超时防止阻塞
                try:
                    await asyncio.wait_for(
                        asyncio.gather(
                            self._clear_stream(self.process.stdout),
                            self._clear_stream(self.process.stderr),
                        ),
                        timeout=1.0,
                    )
                except asyncio.TimeoutError:
                    logger.debug("Box %s clear stream timeout", self.box_id)

                self.process.stdin.write(sanitized.encode())
                await self.process.stdin.drain()

                # 读取输出和错误
                stdout, stderr = await asyncio.wait_for(
                    self._read_process_output(marker), timeout=10.0
                )
                return stdout, stderr
            except asyncio.TimeoutError:
                logger.warning("Box %s execution timed out", self.box_id)
                raise RuntimeError("执行超时")
            except (BrokenPipeError, ConnectionResetError) as e:
                # 进程可能已死亡
                logger.error("Box %s pipe error: %s", self.box_id, str(e))
                raise RuntimeError(f"进程通信错误: {str(e)}，已尝试重启")

    async def _read_process_output(self, marker: str, timeout=10.0):
        """
        安全读取子进程的 stdout 和 stderr，直到检测到 marker 或超时。

        Args:
            marker (str): 用于标识输出结束的标记。
            timeout (float): 读取的最大等待时间（秒）。

        Returns:
            tuple: (stdout_output, stderr_output)，分别为标准输出和错误输出的字符串。
        """
        # 检查进程是否还活着
        if (
            not self.is_running
            or self.process is None
            or self.process.stdin is None
            or self.process.stdin.is_closing()
        ):
            return "", ""

        stdout_buffer = []
        stderr_buffer = []

        async def read_stream(stream, buffer):
            """异步读取流并将数据添加到缓冲区。"""
            while True:
                try:
                    data = await stream.read(1024)  # 每次读取 1024 字节
                    if not data:  # 流结束
                        break
                    buffer.append(data.decode("utf-8", errors="replace"))
                except asyncio.CancelledError:
                    break
                except Exception as e:
                    buffer.append(f"[Stream read error: {e}]\n")
                    break

        try:
            # 并发读取 stdout 和 stderr
            tasks = [
                asyncio.create_task(read_stream(self.process.stdout, stdout_buffer)),
                asyncio.create_task(read_stream(self.process.stderr, stderr_buffer)),
            ]

            # 等待 marker 出现或超时
            async def wait_for_marker():
                while True:
                    # 检查 stdout 是否包含 marker，假定marker一定在末尾
                    # 只检查最后一部分，避免每次都拼接全部内容
                    if stdout_buffer:
                        last_chunk = stdout_buffer[-1]
                        if marker in last_chunk:
                            break

                    # 检查子进程是否已终止
                    if self.process is None or self.process.returncode is not None:
                        break

                    # 等待一小段时间，避免忙等待
                    await asyncio.sleep(0.3)

            # 使用 timeout 限制等待时间
            await asyncio.wait_for(wait_for_marker(), timeout)

            # 取消未完成的任务
            for task in tasks:
                task.cancel()
            await asyncio.gather(*tasks, return_exceptions=True)

        except asyncio.TimeoutError:
            stderr_buffer.append("[Error: Reading output timed out]\n")
        except Exception as e:
            stderr_buffer.append(f"[Error: {e}]\n")

        # 合并缓冲区内容
        stdout_output = "".join(stdout_buffer)
        stderr_output = "".join(stderr_buffer)

        # 分离 marker 之前的内容
        idx = stdout_output.find(marker)
        if idx >= 0:
            stdout_output = stdout_output[:idx].rstrip()

        return stdout_output, stderr_output

    async def _quick_execute(self, code: str, timeout: float = 3.0) -> bool:
        """轻量级执行方法，仅用于内部指令"""
        async with self._lock:  # 使用与execute相同的锁
            if not self.is_running:
                return False

            try:
                # 简单命令，不需要标记
                if (
                    self.process is None
                    or self.process.stdin is None
                    or self.process.stdin.is_closing()
                ):
                    return False

                self.process.stdin.write(code.encode() + b"\n")
                await asyncio.wait_for(self.process.stdin.drain(), timeout=timeout)

                # 读取可能的输出，但不关心内容，只是为了清空缓冲区
                try:
                    await asyncio.wait_for(
                        asyncio.gather(
                            self._clear_stream(self.process.stdout),
                            self._clear_stream(self.process.stderr),
                        ),
                        timeout=1.0,
                    )
                except asyncio.TimeoutError:
                    # 超时是可以接受的，只要我们能写入就表示进程还活着
                    logger.debug("Box %s clear stream timeout", self.box_id)

                return True
            except Exception:
                return False

    async def _clear_stream(self, stream):
        """清空流中的所有现有数据。"""
        try:
            while True:
                data = await asyncio.wait_for(stream.read(1024), timeout=0.1)
                if not data:  # 没有更多数据
                    break
        except asyncio.TimeoutError:
            pass  # 超时表示没有更多数据可读
        except Exception as e:
            pass  # 忽略其他错误，确保清空过程不中断

    async def stop(self) -> None:
        """停止进程，确保资源完全释放"""
        async with self._lock:
            if not self.process:
                return

            # 取消监控任务
            if self._monitor_task and not self._monitor_task.done():
                self._monitor_task.cancel()
                try:
                    await self._monitor_task
                except asyncio.CancelledError:
                    pass

            # 尝试优雅终止进程
            try:
                # 先尝试发送退出命令
                if self.process.stdin and not self.process.stdin.is_closing():
                    try:
                        await self._quick_execute("exit()\n", timeout=3.0)
                    except RuntimeError:
                        pass

                # 然后尝试终止信号
                if self.process.returncode is None:
                    self.process.terminate()
                    try:
                        await asyncio.wait_for(
                            self.process.wait(), timeout=self._timeout
                        )
                    except asyncio.TimeoutError:
                        # 如果超时，强制杀死
                        logger.warning("Box %s terminate timeout, killing", self.box_id)
                        self.process.kill()
                        await asyncio.wait_for(self.process.wait(), timeout=2)
            except Exception as e:
                logger.warning("Box %s failed to stop: %s", self.box_id, str(e))
                # 最后尝试
                if hasattr(self.process, "kill"):
                    try:
                        self.process.kill()
                    except:
                        pass
            finally:
                logger.info("Box %s stopped", self.box_id)
                self._clear()

    @property
    def is_running(self) -> bool:
        """检查进程是否在运行"""
        return self.process is not None and self.process.returncode is None

    async def _monitor_process(self):
        """check process lock_file"""
        try:
            await asyncio.sleep(5)
            while self.is_running and self.process:
                try:
                    locked = self._is_process_file_locked()
                    logger.debug(
                        "Box %s process lock file check: %s",
                        self.box_id,
                        "locked" if locked else "unlocked",
                    )
                    if not locked:  # process terminated
                        logger.warning(
                            "Box %s process terminated unexpectedly with code %s",
                            self.box_id,
                            self.process.returncode,
                        )
                        self._clear()
                        break
                except Exception as e:
                    logger.error(
                        "Box %s error checking process lock file: %s",
                        self.box_id,
                        str(e),
                    )
                await asyncio.sleep(self._health_check_interval)

        except Exception as e:
            logger.error("Box %s monitor error: %s", self.box_id, str(e), exc_info=True)
        finally:
            self._monitor_task = None

    def _is_process_file_locked(self):
        """
        check process lock file: $TMPDIR/_l0ckfi1e
        """
        lockfile_path = os.path.join(
            f"{SANDBOX_PREFIX}{self.box_id}", "tmp", "_l0ckfi1e"
        )
        if not os.path.exists(lockfile_path):
            logger.warning(
                "Lockfile %s does not exist, process may have terminated",
                lockfile_path,
            )
            return False

        try:
            with open(lockfile_path, "r") as f:
                # non-blocking lock check
                fcntl.flock(f.fileno(), fcntl.LOCK_EX | fcntl.LOCK_NB)
                # successfully acquired the lock
                logger.info(
                    "Lockfile %s is not locked, process is running", lockfile_path
                )
                return False
        except OSError as e:
            if e.errno == errno.EAGAIN:
                # file is already locked by another process
                return True
            else:
                raise
            
    def _clear(self):
        self.process = None
        self._monitor_task = None

    # async def _restart_process(self):
    #     """尝试重启进程"""
    #     try:
    #         if self.process:
    #             await self.stop()
    #         await self.start()
    #     except Exception as e:
    #         logger.error("Failed to restart box %s: %s",
    #                      self.box_id, str(e), exc_info=True)
