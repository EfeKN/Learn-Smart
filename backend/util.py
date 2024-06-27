from sqlalchemy.orm import Session
from models import User
from schemas import UserSchema

def create_user(db: Session, user: UserSchema):
    """
    Create a new user in the database.

    Args:
        db (Session): The database session.
        user (UserSchema): The user data.

    Returns:
        User: The created user object.
    """
    db_user = User(name=user.name, password=user.password)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def get_user_by_name(db: Session, name: str):
    """
    Retrieve a user from the database by their name.

    Args:
        db (Session): The database session.
        name (str): The name of the user to retrieve.

    Returns:
        User: The user object if found, None otherwise.
    """
    return db.query(User).filter(User.name == name).first()