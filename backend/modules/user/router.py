from fastapi import HTTPException, Depends, APIRouter
from sqlalchemy.orm import Session

from modules.user.model import User, UserSchema
from database import get_db
from modules.user.util import get_user_by_name

router = APIRouter(prefix="/users", tags=["User"])

@router.post("/login", response_model=UserSchema)
def login(user: UserSchema, db: Session = Depends(get_db)):
    """
    Endpoint for user login.

    Args:
        user (schemas.UserSchema): The user object containing the login credentials.

    Returns:
        schemas.UserSchema: The user object if login is successful.

    Raises:
        HTTPException: If the username is not found or the password is incorrect.
    """

    # Get the user from the database by name
    db_user = get_user_by_name(db, name=user.name)

    # Check if the user exists and the password is correct
    if db_user is None:
        raise HTTPException(status_code=400, detail="Username not found")
    if db_user.password != user.password:
        raise HTTPException(status_code=400, detail="Incorrect password")
    return db_user


@router.post("/create", response_model=UserSchema)
def create_user(user: UserSchema, db: Session = Depends(get_db)):
    """
    Create a new user.

    Args:
        user (schemas.UserSchema): The user data to be created.

    Returns:
        schemas.UserSchema: The created user data.

    Raises:
        HTTPException: If the username is already registered.
    """

    # Get the user from the database by name
    db_user = get_user_by_name(db, name=user.name)

    # check if the user already exists
    if db_user:
        raise HTTPException(status_code=400, detail="Username already registered")

    db_user = User(name=user.name, password=user.password)

    db.add(db_user)
    db.commit()
    db.refresh(db_user)

    return db_user