import sys
import os
import readline

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

# 自动导入 dmtcp
# try:
#     import dmtcp
# except ImportError:
#     print("Warning: dmtcp module not found")
