import asyncio
import logging
import os
import re
from typing import Optional

from nanoid import generate

SANDBOX_ROOT = os.environ.get('SANDBOX_ROOT', '/sandboxes')

SANDBOX_PREFIX = SANDBOX_ROOT + os.environ.get('SANDBOX_PREFIX', '/sandbox_')
SHARED_LIBS_PATH = SANDBOX_ROOT + os.environ.get('SHARED_LIBS_PATH', '/shared_libs')

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


class BoxedProcess:
    def __init__(self, box_id: str):
        self.box_id = box_id
        self.process: Optional[asyncio.subprocess.Process] = None
        self._lock = asyncio.Lock()
        self._timeout = 5
        self._monitor_task = None
        self._terminated = False
        self._health_check_interval = 30  # 每30秒检查一次进程健康状态

    async def start(self) -> None:
        """启动沙箱进程并设置监控"""
        async with self._lock:
            if self.is_running:
                return
            self._terminated = False

            sandbox_path = f"{SANDBOX_PREFIX}{self.box_id}"
            env = {
                'PYTHONPATH': f"{sandbox_path}/lib:{SHARED_LIBS_PATH}",
                'PYTHONUSERBASE': f"{sandbox_path}/lib",
                'HOME': f"{sandbox_path}/work",
                'TMPDIR': f"{sandbox_path}/tmp",
                'PATH': '/usr/local/bin:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin',
            }

            # 限制资源在子进程启动前同步设置
            def _preexec():
                pass
                # resource.setrlimit(resource.RLIMIT_AS, (200*1024*1024, 200*1024*1024))  # 内存限制
                # resource.setrlimit(resource.RLIMIT_NOFILE, (32, 32))  # 文件描述符限制
                # resource.setrlimit(resource.RLIMIT_CPU, (60, 60))  # CPU 时间限制60秒
                # resource.setrlimit(resource.RLIMIT_CORE, (0, 0))  # 禁止核心转储
                # resource.setrlimit(resource.RLIMIT_FSIZE, (10*1024*1024, 10*1024*1024))  # 文件大小限制
            # gosu sandboxed dmtcp_launch -j --ckpt-signal 10 --allow-file-overwrite --no-gzip python -i -s -q
            self.process = await asyncio.create_subprocess_exec(
                'gosu', 'sandboxed', 'dmtcp_launch', '-j',
                '--ckpt-signal', '10', '--allow-file-overwrite',
                '--no-gzip', 'python', '-i', '-q', '-s',
                cwd=f"{sandbox_path}/work",
                env=env,
                preexec_fn=_preexec,
                stdin=asyncio.subprocess.PIPE,
                stdout=asyncio.subprocess.PIPE,
                stderr=asyncio.subprocess.PIPE,
            )
            logger.info("Box %s started with PID %s",
                        self.box_id, self.process.pid)

            # 启动监控任务
            if self._monitor_task is None:
                self._monitor_task = asyncio.create_task(
                    self._monitor_process())

    async def execute(self, code: str, timeout: float = 200.0) -> str:
        """在沙箱中执行代码，自动处理进程状态"""
        async with self._lock:
            if not self.process or not self.is_running:
                raise RuntimeError("Process 未运行")

            marker = f"__COMPLETE_{generate()}__"
            # 限制localhost/127.0.0.1访问
            sanitized = re.sub(r'[\x00-\x1f]', '', code)
            sanitized = re.sub(r'(localhost|127\.0\.0\.1)',
                               'blocked_address', sanitized)
            sanitized = sanitized + '\nprint("' + marker + '")\n'

            try:
                # 检查进程是否还活着
                if not self.is_running or self.process.stdin.is_closing():
                    raise RuntimeError("Process stdin is closed")

                # 清空可能的残留输出
                await self._drain_output(timeout=1.0, collect=False)

                self.process.stdin.write(sanitized.encode())
                await self.process.stdin.drain()

                # 收集输出直到找到标记或超时
                output = []
                marker_found = False
                start_time = time.time()
                execution_timeout = timeout

                stderr_future = asyncio.create_task(
                    self._read_stderr(execution_timeout))

                while not marker_found and (time.time() - start_time < execution_timeout):
                    # 读取一批输出行
                    batch_timeout = min(
                        5.0, execution_timeout - (time.time() - start_time))
                    lines = await self._drain_output(timeout=batch_timeout, collect=True)

                    for line in lines:
                        # 检查是否找到标记
                        if marker in line:
                            logger.debug(
                                "Box %s marker found in output", self.box_id)
                            marker_found = True
                            break
                        output.append(line)

                    # 如果已找到标记或没有更多输出，退出循环
                    if marker_found or not lines:
                        break

                # 检查是否超时
                if not marker_found:
                    logger.warning("Box %s execution timed out after %.1f seconds",
                                   self.box_id, time.time() - start_time)
                    output.append("\n执行超时，输出可能不完整\n")
                    # 可能需要重启进程
                    # asyncio.create_task(self._restart_process())

                # 获取stderr输出
                try:
                    stderr_output = await asyncio.wait_for(stderr_future, 1.0)
                    if stderr_output:
                        output.append("\n错误输出:\n" + "".join(stderr_output))
                except (asyncio.TimeoutError, asyncio.CancelledError):
                    stderr_future.cancel()

                return ''.join(output)
            except (BrokenPipeError, ConnectionResetError) as e:
                # 进程可能已死亡
                logger.error("Box %s pipe error: %s", self.box_id, str(e))
                raise RuntimeError(f"进程通信错误: {str(e)}，已尝试重启")

    async def _quick_execute(self, code: str, timeout: float = 3.0) -> bool:
        """轻量级执行方法，仅用于内部指令"""
        async with self._lock:  # 使用与execute相同的锁
            if not self.is_running:
                return False

            try:
                # 简单命令，不需要标记
                if self.process.stdin.is_closing():
                    return False

                self.process.stdin.write(code.encode() + b'\n')
                await asyncio.wait_for(self.process.stdin.drain(), timeout=timeout)

                # 读取可能的输出，但不关心内容，只是为了清空缓冲区
                try:
                    await asyncio.wait_for(self._drain_output(), timeout=timeout)
                except asyncio.TimeoutError:
                    # 超时是可以接受的，只要我们能写入就表示进程还活着
                    pass

                return True
            except Exception:
                return False

    async def _drain_output(self, timeout: float = 5.0, collect: bool = False) -> list:
        """
        辅助方法：清空输出缓冲区

        Args:
            timeout: 读取超时时间
            collect: 是否收集并返回输出内容

        Returns:
            如果collect为True，返回收集到的输出行列表；否则返回空列表
        """
        output = []
        start_time = time.time()

        while not self.process.stdout.at_eof() and (time.time() - start_time < timeout):
            try:
                line = await asyncio.wait_for(
                    self.process.stdout.readline(),
                    timeout=min(1.0, timeout - (time.time() - start_time))
                )
                if not line:
                    break

                if collect:
                    output.append(line.decode(errors='ignore'))
            except asyncio.TimeoutError:
                # 短超时，继续尝试读取
                continue

        return output

    async def _read_stderr(self, timeout: float = 5.0) -> list:
        """读取stderr的辅助方法"""
        stderr_output = []
        start_time = time.time()

        while not self.process.stderr.at_eof() and (time.time() - start_time < timeout):
            try:
                line = await asyncio.wait_for(
                    self.process.stderr.readline(),
                    timeout=min(1.0, timeout - (time.time() - start_time))
                )
                if not line:
                    break
                stderr_output.append(line.decode(errors='ignore'))
            except asyncio.TimeoutError:
                # 短超时，继续尝试读取
                continue

        return stderr_output

    async def stop(self) -> None:
        """停止进程，确保资源完全释放"""
        async with self._lock:
            if not self.process:
                return

            self._terminated = True

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
                if not self.process.stdin.is_closing():
                    try:
                        self._quick_execute("exit()\n", timeout=3.0)
                    except (RuntimeError):
                        pass

                # 然后尝试终止信号
                if self.process.returncode is None:
                    self.process.terminate()
                    try:
                        await asyncio.wait_for(self.process.wait(), timeout=self._timeout)
                    except asyncio.TimeoutError:
                        # 如果超时，强制杀死
                        logger.warning(
                            "Box %s terminate timeout, killing", self.box_id)
                        self.process.kill()
                        await asyncio.wait_for(self.process.wait(), timeout=2)
            except Exception as e:
                logger.warning("Box %s failed to stop: %s",
                               self.box_id, str(e))
                # 最后尝试
                if hasattr(self.process, 'kill'):
                    try:
                        self.process.kill()
                    except:
                        pass
            logger.info("Box %s stopped", self.box_id)
            self.process = None

    async def __aenter__(self):
        """支持异步上下文管理器协议"""
        await self.start()
        return self

    async def __aexit__(self, exc_type, exc_val, exc_tb):
        """退出上下文时停止进程"""
        await self.stop()

    def __del__(self):
        """确保对象被垃圾回收时进程也被终止"""
        if self.process and not self._terminated:
            # 创建一个新的事件循环来运行同步代码
            try:
                loop = asyncio.get_event_loop()
                if loop.is_running():
                    loop.create_task(self.stop())
                else:
                    loop.run_until_complete(self.stop())
            except Exception:
                # 如果无法获取事件循环，直接终止进程
                if hasattr(self.process, 'kill'):
                    self.process.kill()

    @property
    def is_running(self) -> bool:
        """检查进程是否在运行"""
        return self.process is not None and self.process.returncode is None

    async def _monitor_process(self):
        """监控进程状态的后台任务"""
        try:
            while self.is_running:
                # 等待进程终止或健康检查间隔
                try:
                    await asyncio.wait_for(self.process.wait(), timeout=self._health_check_interval)
                    # 如果到达这里，说明进程已终止
                    logger.warning("Box %s process terminated unexpectedly with code %s",
                                   self.box_id, self.process.returncode)
                    self.process = None
                    break
                except asyncio.TimeoutError:
                    # 超时意味着进程仍在运行，执行健康检查
                    if not await self._health_check():
                        logger.warning(
                            "Box %s health check failed, restarting", self.box_id)
                        # await self._restart_process()

        except Exception as e:
            logger.error("Box %s monitor error: %s",
                         self.box_id, str(e), exc_info=True)
        finally:
            self._monitor_task = None

    async def _health_check(self) -> bool:
        """使用已有的execute方法进行健康检查"""
        try:
            if not self.is_running:
                return False

            # 使用非侵入性命令检查进程是否响应
            # 这个表达式不会产生输出，但会被解释器处理
            # 我们使用一个带超时的短命令，确保不干扰实际执行
            result = await self._quick_execute("None", timeout=3.0)

            # 检查是否有错误消息
            if "错误输出" in result and len(result.strip()) > 0:
                logger.warning(
                    "Box %s health check returned errors: %s", self.box_id, result.strip())
                return False

            # 如果execute成功完成，说明进程是健康的
            return True

        except Exception as e:
            logger.warning("Box %s health check failed: %s",
                           self.box_id, str(e))
            return False

    # async def _restart_process(self):
    #     """尝试重启进程"""
    #     try:
    #         if self.process:
    #             await self.stop()
    #         await self.start()
    #     except Exception as e:
    #         logger.error("Failed to restart box %s: %s",
    #                      self.box_id, str(e), exc_info=True)
