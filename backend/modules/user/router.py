from fastapi import HTTPException, Depends, APIRouter
from sqlalchemy.orm import Session

from modules.user.model import User
import modules.user.schemas as schemas
from database import get_db
from modules.user.util import get_user_by_name

router = APIRouter(prefix="/users", tags=["User"])

@router.post("/login", response_model=schemas.UserResponse)
def login(user: schemas.UserLoginRequest, db: Session = Depends(get_db)):
    """
    Logs in a user by verifying their credentials.

    Args:
        user (schemas.UserSchema): The user object containing the login credentials.
        db (Session, optional): The database session. Defaults to Depends(get_db).

    Returns:
        schemas.UserSchema: The user object without the password field.

    Raises:
        HTTPException: If the username is not found or the password is incorrect.
    """
    # Get the user from the database by name
    db_user = get_user_by_name(db, name=user.name)

    # Check if the user exists and the password is correct
    if db_user is None:
        raise HTTPException(status_code=400, detail="Username not found")
    if db_user.hashed_password != user.password:
        raise HTTPException(status_code=400, detail="Incorrect password")
    
    response = {"id": db_user.id, "name": db_user.name,
                "nickname": db_user.nickname, "email": db_user.email}
        
    return schemas.UserResponse(**response)


@router.post("/create", response_model=schemas.UserResponse)
def create_user(user: schemas.UserCreationRequest, db: Session = Depends(get_db)):
    """
    Create a new user.

    Args:
    - user (schemas.UserSchema): The user data to be created.

    Returns:
    - schemas.UserSchema: The created user data.

    Raises:
    - HTTPException: If the username is already registered.
    """

    db_user = get_user_by_name(db, name=user.name)

    # check if the user already exists
    if db_user:
        raise HTTPException(status_code=400, detail="Username already registered")

    db_user = User(name=user.name, nickname=user.nickname,
                   email=user.email, hashed_password=user.password)

    db.add(db_user)
    db.commit()
    db.refresh(db_user)

    return schemas.UserResponse.model_validate(db_user)