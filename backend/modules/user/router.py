from fastapi import Depends, HTTPException, APIRouter
from fastapi.security import OAuth2PasswordRequestForm

from modules.user.model import User
import modules.user.schemas as schemas
from database.dbmanager import UserDB
from controllers import authentication as auth

router = APIRouter(prefix="/users", tags=["User"])

@router.post("/login", response_model=auth.Token, include_in_schema=False)
def login(form_data: OAuth2PasswordRequestForm = Depends()):
    """
    Endpoint for user login.

    Parameters:
    - form_data: OAuth2PasswordRequestForm object containing user login credentials.

    Returns:
    - Token: Token object containing the JWT access token.

    """
    return auth.login_for_access_token(form_data)


@router.post("/create", response_model=schemas.UserResponse)
def create_user(user: schemas.UserCreationRequest):
    """
    Create a new user.

    Args:
        user (schemas.UserCreationRequest): The user data to be created.

    Returns:
        schemas.UserResponse: The created user data.

    Raises:
        HTTPException: If there is an error creating the user.
    """
    try:
        db_user: User = UserDB.create(user)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    
    return schemas.UserResponse.model_validate(db_user) # validate the model attributes and return the user data


@router.get("/{nickname}", response_model=schemas.UserResponse)
def get_user(nickname: str, current_user: User = Depends(auth.get_current_user)):
    """
    Retrieve a user by their nickname.

    Args:
        nickname (str): The nickname of the user to retrieve.
        current_user (User): The currently authenticated user (used for authentication).

    Returns:
        UserResponse: The response model containing the user's information.

    Raises:
        HTTPException: If the user is not found.
    """
    db_user = UserDB.fetch(nickname=nickname)

    if not db_user: # if the user is not found
        raise HTTPException(status_code=404, detail="User not found")

    return schemas.UserResponse.model_validate(db_user) # validate the model attributes and return the user data