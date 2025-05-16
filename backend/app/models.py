from sqlmodel import Field, Index, SQLModel
from datetime import datetime, timezone
import uuid
from sqlalchemy.dialects.postgresql import JSONB  # PostgreSQL 专用
# 或者对于通用数据库使用：from sqlalchemy import JSON

from pydantic import EmailStr
from sqlmodel import Field, Relationship, SQLModel
from typing import Optional, List


# Shared properties
class UserBase(SQLModel):
    email: EmailStr = Field(unique=True, index=True, max_length=255)
    is_active: bool = True
    is_superuser: bool = False
    full_name: str | None = Field(default=None, max_length=255)


# Properties to receive via API on creation
class UserCreate(UserBase):
    password: str = Field(min_length=8, max_length=40)


class UserRegister(SQLModel):
    email: EmailStr = Field(max_length=255)
    password: str = Field(min_length=8, max_length=40)
    full_name: str | None = Field(default=None, max_length=255)


# Properties to receive via API on update, all are optional
class UserUpdate(UserBase):
    email: EmailStr | None = Field(
        default=None, max_length=255)  # type: ignore
    password: str | None = Field(default=None, min_length=8, max_length=40)


class UserUpdateMe(SQLModel):
    full_name: str | None = Field(default=None, max_length=255)
    email: EmailStr | None = Field(default=None, max_length=255)


class UpdatePassword(SQLModel):
    current_password: str = Field(min_length=8, max_length=40)
    new_password: str = Field(min_length=8, max_length=40)


# Database model, database table inferred from class name
class User(UserBase, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    hashed_password: str
    api_key: str | None = Field(default=None, unique=True, index=True)
    items: list["Item"] = Relationship(
        back_populates="owner", cascade_delete=True)
    sessions: list["UserSession"] = Relationship(
        back_populates="user", cascade_delete=True)


# Properties to return via API, id is always required
class UserPublic(UserBase):
    id: uuid.UUID


class UsersPublic(SQLModel):
    data: list[UserPublic]
    count: int


# Shared properties
class ItemBase(SQLModel):
    title: str = Field(min_length=1, max_length=255)
    description: str | None = Field(default=None, max_length=255)


# Properties to receive on item creation
class ItemCreate(ItemBase):
    pass


# Properties to receive on item update
class ItemUpdate(ItemBase):
    title: str | None = Field(
        default=None, min_length=1, max_length=255)  # type: ignore


# Database model, database table inferred from class name
class Item(ItemBase, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    title: str = Field(max_length=255)
    owner_id: uuid.UUID = Field(
        foreign_key="user.id", nullable=False, ondelete="CASCADE"
    )
    owner: User | None = Relationship(back_populates="items")


# Properties to return via API, id is always required
class ItemPublic(ItemBase):
    id: uuid.UUID
    owner_id: uuid.UUID


class ItemsPublic(SQLModel):
    data: list[ItemPublic]
    count: int


# Generic message
class Message(SQLModel):
    message: str


# JSON payload containing access token
class Token(SQLModel):
    access_token: str
    token_type: str = "bearer"


# Contents of JWT token
class TokenPayload(SQLModel):
    sub: str | None = None


class NewPassword(SQLModel):
    token: str
    new_password: str = Field(min_length=8, max_length=40)


class SandboxUsageBase(SQLModel):
    user_id: uuid.UUID = Field(foreign_key="user.id")
    duration_seconds: float = Field(..., description="沙盒执行耗时（秒）")
    cost_units: float = Field(0, ge=0, description="计算成本单位（用于计费）")
    api_key_used: str | None = Field(None, description="触发执行的API Key")
    # metadata: dict = Field(
    #     default_factory=dict,
    #     sa_type=JSONB(none_as_null=True)  # PostgreSQL推荐使用JSONB
    # )


class SandboxUsage(SandboxUsageBase, table=True):
    id: uuid.UUID = Field(
        default_factory=uuid.uuid4,
        primary_key=True,
        index=True,
        nullable=False,
        description="外部暴露的唯一ID"
    )
    user_id: uuid.UUID = Field(foreign_key="user.id", index=True)
    # box_id: int = Field(foreign_key="box.id")
    executed_at: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc),  # 使用时区敏感的UTC时间
    )
    cost_units: float = Field(0, description="计算成本单位（用于计费）")


class SandboxUsageCreate(SandboxUsageBase):
    """创建时自动生成id和executed_at"""
    pass


class SandboxUsageOut(SandboxUsageBase):
    id: uuid.UUID
    user_id: uuid.UUID
    executed_at: datetime


class UserSessionBase(SQLModel):
    session_id: str = Field(unique=True, index=True)
    created_at: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc),
        index=True,  # 添加索引
    )
    expires_at: Optional[datetime] = Field(default=None)
    is_active: bool = Field(default=True)
    # metadata: Optional[dict] = Field(default=None, sa_type=JSONB)


class UserSession(UserSessionBase, table=True):
    __table_args__ = (
        Index('idx_created_at_brin', 'created_at', postgresql_using='brin'),  # 复合索引
    )
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    user_id: uuid.UUID = Field(foreign_key="user.id")
    user: User = Relationship(back_populates="sessions")


class UserSessionCreate(UserSessionBase):
    user_id: uuid.UUID


class UserSessionPublic(UserSessionBase):
    id: uuid.UUID
    user_id: uuid.UUID
