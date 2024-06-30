from pydantic import BaseModel, EmailStr
from typing import Optional

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
    email: EmailStr # EmailStr is a Pydantic email validator
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

    id: Optional[int] = None
    name: Optional[str] = None
    nickname: Optional[str] = None
    email: Optional[EmailStr] = None # EmailStr is a Pydantic email validator
    