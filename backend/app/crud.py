import uuid
from typing import Any, Optional

from sqlmodel import Session, select

from app.core.security import get_password_hash, verify_password
from app.models import Item, ItemCreate, User, UserCreate, UserUpdate, UserSession, UserSessionCreate


def create_user(*, session: Session, user_create: UserCreate) -> User:
    db_obj = User.model_validate(
        user_create, update={
            "hashed_password": get_password_hash(user_create.password)}
    )
    session.add(db_obj)
    session.commit()
    session.refresh(db_obj)
    return db_obj


def update_user(*, session: Session, db_user: User, user_in: UserUpdate) -> Any:
    user_data = user_in.model_dump(exclude_unset=True)
    extra_data = {}
    if "password" in user_data:
        password = user_data["password"]
        hashed_password = get_password_hash(password)
        extra_data["hashed_password"] = hashed_password
    db_user.sqlmodel_update(user_data, update=extra_data)
    session.add(db_user)
    session.commit()
    session.refresh(db_user)
    return db_user


def get_user_by_email(*, session: Session, email: str) -> User | None:
    statement = select(User).where(User.email == email)
    session_user = session.exec(statement).first()
    return session_user


def authenticate(*, session: Session, email: str, password: str) -> User | None:
    db_user = get_user_by_email(session=session, email=email)
    if not db_user:
        return None
    if not verify_password(password, db_user.hashed_password):
        return None
    return db_user


def create_item(*, session: Session, item_in: ItemCreate, owner_id: uuid.UUID) -> Item:
    db_item = Item.model_validate(item_in, update={"owner_id": owner_id})
    session.add(db_item)
    session.commit()
    session.refresh(db_item)
    return db_item


def create_user_session(*, session: Session, session_create: UserSessionCreate) -> UserSession:
    db_obj = UserSession.model_validate(session_create)
    session.add(db_obj)
    session.commit()
    session.refresh(db_obj)
    return db_obj


def get_user_session(*, session: Session, session_id: str, user_id: uuid.UUID) -> Optional[UserSession]:
    statement = select(UserSession).where(
        UserSession.session_id == session_id, UserSession.user_id == user_id)
    return session.exec(statement).first()


def deactivate_user_session(*, session: Session, session_id: str, user_id: uuid.UUID) -> Optional[UserSession]:
    db_session = get_user_session(
        session=session, session_id=session_id, user_id=user_id)
    if db_session:
        db_session.is_active = False
        session.add(db_session)
        session.commit()
        session.refresh(db_session)
    return db_session


def get_user_sessions(*, session: Session, user_id: uuid.UUID, skip: int = 0, limit: int = 100) -> list[UserSession]:
    statement = select(UserSession).where(
        UserSession.user_id == user_id,
    ).order_by(UserSession.created_at.desc()).offset(skip).limit(limit)
    return session.exec(statement).all()
