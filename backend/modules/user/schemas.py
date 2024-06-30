from pydantic import BaseModel, model_validator, EmailStr, ConfigDict, Field
from typing import Optional
from abc import ABC

class UserCreationRequest(BaseModel):
    """
    Represents a request to create a new user.

    Attributes:
        name (str): The name of the user.
        nickname (str): The nickname of the user.
        email (EmailStr): The email address of the user.
        password (str): The password of the user.
    """
    name: str
    nickname: str
    email: EmailStr
    password: str


class UserResponse(BaseModel):
    """
    Represents a generic user response model.

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
    