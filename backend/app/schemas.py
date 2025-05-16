from pydantic import BaseModel
from datetime import datetime
from typing import Optional

from .models import SandboxUsageOut


class APIKeyOut(BaseModel):
    api_key: str


# class UsageTimeRange(BaseModel):
#     start: Optional[datetime] = None
#     end: Optional[datetime] = None


class UsageStatsOut(BaseModel):
    total_duration: float
    total_cost: float
    usage_count: int


class PaginatedUsagesOut(BaseModel):
    items: list[SandboxUsageOut]
    total: int
    page: int
    limit: int
    stats: UsageStatsOut
