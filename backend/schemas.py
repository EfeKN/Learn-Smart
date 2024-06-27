# Creation Date: 28.06.2024
from pydantic import BaseModel


# UserSchema
# This schema represents a user object. Used for request and response validation.
# E.g. see localhost:8000/docs (auto-generated API documentation)
class UserSchema(BaseModel):
    name: str
    password: str
