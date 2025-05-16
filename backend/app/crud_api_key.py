import secrets
from sqlmodel import Session
from app.models import User


def generate_api_key() -> str:
    return secrets.token_urlsafe(32)  # 生成64字符长度的安全随机字符串


def create_user_api_key(db: Session, user_id: int) -> str:
    # 确保每个用户只有一个有效API Key
    user = db.get(User, user_id)
    if not user:
        raise ValueError("User not found")

    user.api_key = generate_api_key()
    db.commit()
    return user.api_key
