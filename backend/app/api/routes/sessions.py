import asyncio
from contextlib import asynccontextmanager
from typing import Any

from fastapi import APIRouter, FastAPI, HTTPException, status, Response
from pydantic import BaseModel, Field

from app.services.boxed_service import BoxedService
from app.api.deps import (
    CurrentUser,
    SessionDep,
)
from app.crud import (
    create_user_session,
    deactivate_user_session,
    get_user_session,
    get_user_sessions,
)
from app.models import UserSession, UserSessionCreate, UserSessionPublic


router = APIRouter(prefix="/sessions", tags=["Boxed"])
boxed_service = BoxedService(prewarm_count=2)


@asynccontextmanager
async def service_lifespan(app: FastAPI):
    """
    FastAPI 生命周期钩子，用于初始化和清理 BoxedService。
    """
    await boxed_service.init()
    yield
    # await boxed_service.close()


# ==========================
# Request / Response Models
# ==========================


class CodeExecRequest(BaseModel):
    code: str = Field(..., description="Python 代码")


class CodeExecResponse(BaseModel):
    result: str


class PackageInstallRequest(BaseModel):
    packages: list[str] = Field(..., description="要安装的包名列表")


class SnapshotResponse(BaseModel):
    snapshot_id: str


class SnapshotRestoreRequest(BaseModel):
    snapshot_id: str


class SessionResponse(BaseModel):
    session_id: str


# ==========================
# Session APIs
# ==========================


@router.post("", response_model=SessionResponse)
async def create_session(session: SessionDep, current_user: CurrentUser) -> Any:
    """
    创建新的沙箱会话。
    """
    session_id = await boxed_service.create_session()

    # 创建用户会话记录
    session_create = UserSessionCreate(session_id=session_id, user_id=current_user.id)
    create_user_session(session=session, session_create=session_create)

    return SessionResponse(session_id=session_id)


# boxed.py


@router.get("", response_model=list[UserSessionPublic])
def get_my_sessions(
    session: SessionDep,
    current_user: CurrentUser,
    skip: int = 0,
    limit: int = 100,
) -> Any:
    """
    获取当前用户的所有会话，默认按创建时间降序排列
    """
    return get_user_sessions(
        session=session,
        user_id=current_user.id,
        skip=skip,
        limit=limit,
    )


def _check_user_session(
    session: SessionDep, session_id: str, current_user: CurrentUser
) -> UserSession:
    """
    检查会话是否处于活跃状态。
    """
    user_session = get_user_session(
        session=session, session_id=session_id, user_id=current_user.id
    )
    if user_session is None:
        raise HTTPException(status_code=404, detail="Session not found")
    return user_session


@router.delete("/{session_id}", status_code=status.HTTP_204_NO_CONTENT)
async def destroy_session(
    session_id: str, session: SessionDep, current_user: CurrentUser
) -> Response:
    """
    销毁沙箱会话。
    """
    _check_user_session(session, session_id, current_user)
    try:
        # 标记会话为非活跃状态
        deactivate_user_session(
            session=session, session_id=session_id, user_id=current_user.id
        )
        await boxed_service.destroy(session_id)
    except KeyError:
        raise HTTPException(status_code=404, detail="Session not found")
    return Response(status_code=204)


# ==========================
# Code Execution API
# ==========================


@router.post("/{session_id}/exec", response_model=CodeExecResponse)
async def exec_code(
    session_id: str,
    request: CodeExecRequest,
    session: SessionDep,
    current_user: CurrentUser,
) -> Any:
    """
    执行代码。
    """
    _check_user_session(session, session_id, current_user)
    try:
        result = await boxed_service.exec_code(session_id, request.code)
        return CodeExecResponse(result=result)
    except (KeyError, RuntimeError) as e:
        raise HTTPException(status_code=404, detail=str(e))


# ==========================
# Package Installation
# ==========================


@router.post("/{session_id}/packages", status_code=status.HTTP_204_NO_CONTENT)
async def install_packages(
    session_id: str,
    request: PackageInstallRequest,
    session: SessionDep,
    current_user: CurrentUser,
) -> Response:
    """
    安装 Python 包。
    """
    _check_user_session(session, session_id, current_user)
    try:
        await boxed_service.install_packages(session_id, request.packages)
    except KeyError:
        raise HTTPException(status_code=404, detail="Session not found")
    return Response(status_code=204)


# ==========================
# Hibernate (Snapshot + Kill)
# ==========================


@router.post("/{session_id}/hibernate", response_model=SnapshotResponse)
async def hibernate_session(
    session_id: str, session: SessionDep, current_user: CurrentUser
) -> Any:
    """
    休眠会话（保存快照并终止进程）。
    """
    _check_user_session(session, session_id, current_user)
    try:
        snapshot_id = await boxed_service.snapshot(session_id)
        return SnapshotResponse(snapshot_id=snapshot_id)
    except KeyError:
        raise HTTPException(status_code=404, detail="Session not found")


# ==========================
# Restore Snapshot
# ==========================


@router.post("/{session_id}/restore", status_code=status.HTTP_204_NO_CONTENT)
async def restore_session(
    session_id: str,
    request: SnapshotRestoreRequest,
    session: SessionDep,
    current_user: CurrentUser,
) -> Response:
    """
    从快照恢复会话。
    """
    _check_user_session(session, session_id, current_user)
    try:
        await boxed_service.restore(session_id, request.snapshot_id)
    except KeyError:
        raise HTTPException(status_code=404, detail="Session not found")
    return Response(status_code=204)
