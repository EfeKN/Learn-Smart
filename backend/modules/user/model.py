from sqlalchemy import Column, DateTime, Integer, String, func

from database import Base

class User(Base):
    """
    Represents a user in the database system.

    Attributes:
        id (int): The unique identifier for the user.
        name (str): The name of the user.
        nickname (str): The nickname of the user.
        email (str): The email address of the user.
        hashed_password (str): The hashed password of the user.
        created_at (datetime): The date and time when the user was created.
    """
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(50), nullable=False)
    nickname = Column(String(50), unique=True, index=True, nullable=False)
    email = Column(String(100), unique=True, index=True, nullable=False)
    hashed_password = Column(String(100), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # attributes might be added
    # possible feature: email verification and we'd need some more attributes here
