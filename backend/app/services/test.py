from boxed_service import SandboxService
import asyncio

async def main():
    service = SandboxService(0)
    async with service.session_scope() as session_id:
        # await service.install_packages(session_id, ["numpy"])
        result = await service.exec_code(session_id, "print(1+1)")
        print(result)
    # 检查离开 async with 时是否会自动调用 destroy(session_id)
    try:
        await service.exec_code(session_id, "print(1+1)")
    except Exception as e:
        print(e)
        assert session_id in str(e)

if __name__ == "__main__":
    asyncio.run(main())
