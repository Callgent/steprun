import sys
import os
import readline
import fcntl
import errno
import atexit

# 验证环境变量
if "PYTHONPATH" in os.environ:
    sys.path.extend(os.environ["PYTHONPATH"].split(":"))

# 禁用历史记录
readline.clear_history()
readline.set_history_length(0)
os.environ["PYTHONHISTFILE"] = "/dev/null"

# 禁用自动缩进
sys.ps1 = ""
sys.ps2 = ""

# 无颜色输出
os.environ["TERM"] = "dumb"
os.environ["NO_COLOR"] = "1"

# vi 编辑模式
try:
    readline.parse_and_bind("set editing-mode vi")
except Exception:
    print("Warning: readline vi mode not supported")


# process lock file in $TMPDIR
def _setup_process_lock(lf_path):
    lock_fd = None
    try:
        # 创建锁文件（如果不存在）
        lock_fd = os.open(lf_path, os.O_CREAT | os.O_RDWR)

        # 尝试获取独占锁（非阻塞）
        fcntl.flock(lock_fd, fcntl.LOCK_EX | fcntl.LOCK_NB)

        # 写入子进程的 PID（可选，便于调试）, virtPID: check dmtcp-command -l
        os.ftruncate(lock_fd, 0)
        os.write(lock_fd, str(os.getpid()).encode())
        os.fsync(lock_fd)

        # 保持文件描述符打开，直到进程退出
        # 文件锁会由操作系统在进程退出时自动释放
        return lock_fd
    except OSError as e:
        try:
            if lock_fd:
                os.close(lock_fd)
        except:
            pass
        if e.errno == errno.EAGAIN:
            print("Lockfile is already locked by another process")
            sys.exit(100)
        else:
            print(f"Failed to create lockfile: {e}")
            sys.exit(101)


def _cleanup_lock(lock_fd, lockfile_path):
    os.close(lock_fd)
    os.remove(lockfile_path)


try:
    _lockfile_path = os.path.join(os.getenv("TMPDIR", os.getcwd()), "_l0ckfi1e")
    _lock_fd = _setup_process_lock(_lockfile_path)
    atexit.register(_cleanup_lock, _lock_fd, _lockfile_path)
except Exception as e:
    print(f"Lock creation failed: {e}")
    sys.exit(1)
