from sqlalchemy import Column, Integer, String
from pydantic import BaseModel
from abc import ABC

from database import Base

class User(Base):
    """
    Represents a user in the database system.

    Attributes:
        id (int): The unique identifier for the user.
        name (str): The name of the user.
        password (str): The password for the user.
    """
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(50), unique=True, index=True, nullable=False)
    password = Column(String(100), nullable=False)


class UserSchema(BaseModel, ABC):
    """
    Represents a user schema, which is used for request and response validation.
    E.g. see localhost:8000/docs (auto-generated API documentation)

    UserSchema objects are NOT to be instantiated.

    Attributes:
        name (str): The name of the user.
        password (str): The password of the user.
    """
    name: str
    password: str
