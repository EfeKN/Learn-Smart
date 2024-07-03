from fastapi import Depends, HTTPException, APIRouter
from fastapi.security import OAuth2PasswordRequestForm

import modules.user.schemas as schemas
from database.dbmanager import UserDB, CourseDB
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
        user_dict = UserDB.create(**user.model_dump()) # create the user given the user data
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    
    return schemas.UserResponse(**user_dict)


@router.get("/", response_model=schemas.UserResponse)
def get_user(nickname: str = None, id: int = None, current_user: dict = Depends(auth.get_current_user)):
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
    if not nickname and not id:
        raise HTTPException(status_code=400, detail="Nickname or ID must be provided")
    
    user = UserDB.fetch(nickname=nickname, user_id=id)

    if not user: # if the user is not found
        raise HTTPException(status_code=404, detail="User(s) not found")

    return schemas.UserResponse(**user)


@router.get("/me")
def get_current_user(current_user: dict = Depends(auth.get_current_user)):
    """
    Get the current authenticated user.

    Args:
        current_user (User): The current authenticated user.

    Returns:
        User: The current authenticated user.
    """
    # courses = UserDB.fetch(current_user["user_id"])
    courses = CourseDB.fetch(user_id=current_user["user_id"])
    current_user["courses"] = courses # add the user's courses to response
    current_user.pop("hashed_password") # remove the hashed password from the response
    return current_user