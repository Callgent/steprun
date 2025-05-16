from datetime import datetime
from typing import Optional

from app import crud_sandbox_usage
from app.api.deps import CurrentUser, SessionDep
from app.models import SandboxUsage
from app.schemas import PaginatedUsagesOut
from fastapi import APIRouter, HTTPException, Query
from sqlmodel import func, select

router = APIRouter(prefix="/usages", tags=["usages"])


@router.get("", response_model=PaginatedUsagesOut)
def get_usage_history(
    session: SessionDep, current_user: CurrentUser, skip: int = 0, limit: int = 100,
    time_range: Optional[str] = Query(
        None,
        description="时间范围格式: 2023-01-01T00:00:00,2023-01-31T23:59:59",
        example="2023-01-01T00:00:00,2023-01-31T23:59:59"
    ),
):
    # 解析时间范围
    parsed_time_range = None
    if time_range:
        try:
            start_str, end_str = time_range.split(",")
            parsed_time_range = (datetime.fromisoformat(
                start_str), datetime.fromisoformat(end_str))
        except ValueError:
            raise HTTPException(
                status_code=400,
                detail="Invalid time range format. Expected 'start,end' in ISO format"
            )

    # 计算分页偏移量
    skip = (page - 1) * limit

    # 获取数据
    usages = crud_sandbox_usage.get_by_user(
        db,
        user_id=current_user.id,
        skip=skip,
        limit=limit,
        time_range=parsed_time_range
    )

    # 获取总数
    total_query = select(func.count(SandboxUsage.id)).where(
        SandboxUsage.user_id == current_user.id
    )
    if parsed_time_range:
        total_query = total_query.where(
            SandboxUsage.executed_at.between(*parsed_time_range)
        )
    total = db.exec(total_query).scalar()

    # 获取统计信息
    stats = crud_sandbox_usage.get_usage_stats(
        db,
        user_id=current_user.id,
        time_range=parsed_time_range
    )

    return {
        "items": usages,
        "total": total,
        "page": page,
        "limit": limit,
        "stats": stats
    }
