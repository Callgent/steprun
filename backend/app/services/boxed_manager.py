import asyncio
import logging
import os
import re
import shutil
import subprocess
from pathlib import Path
from typing import Dict

from nanoid import generate

from .boxed_process import SANDBOX_ROOT, SANDBOX_PREFIX, BoxedProcess

SNAPSHOT_DIR = SANDBOX_ROOT + os.getenv("SNAPSHOT_DIR", "snapshots")
SANDBOX_STRUCT = ["work", "tmp", "lib", "log"]

logging.basicConfig(
    level=logging.INFO, format="%(asctime)s - %(name)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger(__name__)


class BoxedManager:
    def __init__(self, prewarm_count: int = 0):
        self.proc_registry: Dict[str, BoxedProcess] = {}
        self._available = asyncio.Queue()
        self._prewarm_count = prewarm_count

    async def init(self):
        """在 __init__ 后显式调用，进行预热"""
        for _ in range(self._prewarm_count):
            asyncio.create_task(self._do_prewarm())
        return self

    async def _do_prewarm(self):
        if self._available.qsize() >= self._prewarm_count:
            return  # no more prewarm
        try:
            box_id = await self.start_box()
            await self._available.put(box_id)
        except Exception as e:
            logger.error("Prewarm failed", exc_info=e)

    async def acquire_box(self) -> str:
        try:
            box_id = self._available.get_nowait()
        except asyncio.QueueEmpty:
            box_id = await self.start_box()
        else:
            # 成功从池中取出时，尝试补一个
            if self._prewarm_count > 0:
                asyncio.create_task(self._do_prewarm())
        return box_id

    async def start_box(self) -> str:
        box_id = generate()
        await self._create_box_dirs(box_id)
        proc = BoxedProcess(box_id)
        self.proc_registry[box_id] = proc
        await proc.start()
        return box_id

    async def _create_box_dirs(self, box_id: str) -> None:
        box_path = Path(f"{SANDBOX_PREFIX}{box_id}")
        # 使用线程池非阻塞创建目录和权限，注意chown给sandbox
        loop = asyncio.get_event_loop()
        await loop.run_in_executor(None, box_path.mkdir, True, True)
        await loop.run_in_executor(None, os.chmod, box_path, 0o2770)
        for d in SANDBOX_STRUCT:
            path = box_path / d
            await loop.run_in_executor(None, path.mkdir, True, True)
            await loop.run_in_executor(None, os.chmod, path, 0o2770)
        # 非阻塞执行chown命令
        await loop.run_in_executor(
            None, subprocess.run, ["chown", "-R", "sandboxed:sandboxed", str(box_path)]
        )

    async def install_packages(self, box_id: str, packages: list[str]) -> None:
        if not packages:
            raise ValueError("No packages to install")
        if self.proc_registry.get(box_id) is None:
            raise ValueError(f"Box {box_id} not found")

        pattern = re.compile(r"^[a-zA-Z0-9_.-]+$")
        for pkg in packages:
            if not pattern.match(pkg):
                raise ValueError(f"Invalid package name: {pkg}")
        lib_path = f"{SANDBOX_PREFIX}{box_id}/lib"
        cmd = [
            "gosu",
            "sandboxed",
            "uv",
            "pip",
            "install",
            "--no-deps",
            f"--target={lib_path}",
            *packages,
        ]
        # 非阻塞安装
        loop = asyncio.get_event_loop()
        await loop.run_in_executor(None, subprocess.check_call, cmd)

    async def snapshot_box(self, box_id: str) -> str:
        proc = self.proc_registry.get(box_id)
        if not proc:
            raise ValueError(f"Box {box_id} not found")
        snapshot_id = generate()
        await proc.stop()
        self.proc_registry.pop(box_id)
        # TODO: 拷贝目录到 SNAPSHOT_DIR
        return snapshot_id

    async def restore_box(self, box_id: str, snapshot_id: str) -> None:
        target = Path(f"{SANDBOX_PREFIX}{box_id}")
        # TODO: 清理 target 并复制快照
        proc = BoxedProcess(box_id)
        self.proc_registry[box_id] = proc
        await proc.start()

    async def destroy_box(self, box_id: str) -> None:
        proc = self.proc_registry.pop(box_id, None)
        if proc:
            await proc.stop()
        base = Path(f"{SANDBOX_PREFIX}{box_id}")
        await asyncio.get_event_loop().run_in_executor(None, shutil.rmtree, base, True)
        snap = Path(f"{SNAPSHOT_DIR}/{box_id}")
        await asyncio.get_event_loop().run_in_executor(None, shutil.rmtree, snap, True)
