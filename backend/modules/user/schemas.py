from pydantic import BaseModel, EmailStr, ConfigDict
from typing import Optional
from abc import ABC

class UserCreationRequest(BaseModel, ABC):
    """
    Represents a user creation request.

    Attributes:
        name (str): The name of the user.
        nickname (str): The nickname of the user.
        email (EmailStr): The email address of the user.
        password (str): The password of the user.
    """
    name: str
    nickname: str
    email: EmailStr # EmailStr is a Pydantic email validator
    password: str


class UserResponse(BaseModel, ABC):
    """
    Represents a user response.

    Attributes:
        id (Optional[int]): The user's ID.
        name (Optional[str]): The user's name.
        nickname (Optional[str]): The user's nickname.
        email (Optional[EmailStr]): The user's email.
    """
    model_config = ConfigDict(from_attributes=True) # allows the ORM objects to be mapped to the Pydantic models

    id: Optional[int] = None
    name: Optional[str] = None
    nickname: Optional[str] = None
    email: Optional[EmailStr] = None
    