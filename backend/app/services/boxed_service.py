from .boxed_manager import BoxedManager


class BoxedService:
    """BoxedService is a wrapper around BoxedManager to provide a higher-level API for managing sandboxed code execution sessions."""

    def __init__(self, prewarm_count: int = 5):
        self.manager = BoxedManager(prewarm_count=prewarm_count)

    async def init(self):
        await self.manager.init()
        return self

    async def create_session(self) -> str:
        return await self.manager.acquire_box()

    async def exec_code(self, box_id: str, code: str) -> tuple[str, str]:
        proc = self.manager.proc_registry.get(box_id)
        if not proc:
            raise RuntimeError(f"No process found for box {box_id}")
        return await proc.execute(code)

    async def install_packages(self, box_id: str, packages: list[str]) -> None:
        await self.manager.install_packages(box_id, packages)

    async def snapshot(self, box_id: str) -> str:
        """
        Returns the snapshot ID.
        """
        return await self.manager.snapshot_box(box_id)

    async def restore(self, box_id: str, snapshot_id: str) -> None:
        return await self.manager.restore_box(box_id, snapshot_id)

    async def destroy(self, box_id: str) -> None:
        await self.manager.destroy_box(box_id)
