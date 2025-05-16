from sqlmodel import Session, select, col, func
from app.models import SandboxUsage
from app.schemas import SandboxUsageCreate

from datetime import datetime


def create(db: Session, *, obj_in: SandboxUsageCreate) -> SandboxUsage:
    # 自动计算成本单位（示例：每秒0.01单位）
    db_obj = SandboxUsage(
        **obj_in.dict(),
        cost_units=obj_in.duration_seconds * 0.01
    )
    db.add(db_obj)
    db.commit()
    db.refresh(db_obj)
    return db_obj


def get_by_user(
    db: Session,
    user_id: int,
    *,
    skip: int = 0,
    limit: int = 100,
    time_range: tuple[datetime, datetime] | None = None
) -> list[SandboxUsage]:
    query = select(SandboxUsage).where(
        SandboxUsage.user_id == user_id
    )
    if time_range:
        query = query.where(
            col(SandboxUsage.executed_at).between(*time_range))
    return db.exec(query.offset(skip).limit(limit)).all()


def get_total_usage(
    db: Session,
    user_id: int,
    time_range: tuple[datetime, datetime] | None = None
) -> float:
    query = select(func.sum(SandboxUsage.cost_units)).where(
        SandboxUsage.user_id == user_id
    )
    if time_range:
        query = query.where(
            col(SandboxUsage.executed_at).between(*time_range))
    return db.scalar(query) or 0.0
