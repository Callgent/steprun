from .boxed_factory import SessionFactory, BoxedManager
from contextlib import asynccontextmanager

class BoxedService:
    def __init__(self, prewarm_count: int = 5):
        self.manager = BoxedManager(prewarm_count=prewarm_count)
        self.factory = SessionFactory(self.manager)
        
    async def init(self):
        await self.manager.init()
        return self

    async def create_session(self) -> str:
        session_id, _ = await self.factory.create_session()
        return session_id

    async def exec_code(self, session_id: str, code: str) -> str:
        box_id = self._get_box_id(session_id)
        proc = self.manager.box_registry.get(box_id)
        if not proc:
            raise RuntimeError(f"No process found for box {box_id}")
        return await proc.execute(code)

    async def install_packages(self, session_id: str, packages: list[str]) -> None:
        box_id = self._get_box_id(session_id)
        await self.manager.install_packages(box_id, packages)

    async def snapshot(self, session_id: str) -> str:
        return await self.factory.snapshot_session(session_id)

    async def restore(self, session_id: str, snapshot_id: str) -> None:
        return await self.factory.restore_session(session_id, snapshot_id)

    @asynccontextmanager
    async def session_scope(self):
        """
        async with sandbox_service.session_scope() as session_id:
            await sandbox_service.install_packages(session_id, ["numpy"])
            result = await sandbox_service.exec_code(session_id, "print(1+1)")
            print(result)
        # 离开 async with 时会自动调用 destroy(session_id)
        """
        session_id = await self.create_session()
        try:
            yield session_id
        finally:
            await self.destroy(session_id)

    async def destroy(self, session_id: str) -> None:
        await self.factory.destroy_session(session_id)

    def _get_box_id(self, session_id: str) -> str:
        box_id = self.factory.session_map.get(session_id)
        if not box_id:
            raise KeyError(f"Session {session_id} not found in session_map")
        return box_id
