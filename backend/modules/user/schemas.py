from pydantic import BaseModel, model_validator, EmailStr, ConfigDict, Field
from typing import Optional
from abc import ABC

class UserLoginRequest(BaseModel, ABC):
    model_config = ConfigDict(str_strip_whitespace=True)

    name: Optional[str] = None
    nickname: Optional[str] = None
    email: Optional[EmailStr] = None
    password: str

    @model_validator(mode="after")
    def check_credentials(cls, v: "UserLoginRequest"):
        if v.nickname is None and v.email is None:
            raise ValueError("Either nickname or email must be provided.")
        return v
    

class UserCreationRequest(BaseModel, ABC):
    name: str
    nickname: str
    email: EmailStr
    password: str


class UserResponse(BaseModel, ABC):
    model_config = ConfigDict(from_attributes=True)

    id: Optional[int] = None
    name: Optional[str] = None
    nickname: Optional[str] = None
    email: Optional[EmailStr] = None
    