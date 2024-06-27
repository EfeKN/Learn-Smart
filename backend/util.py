# Creation Date: 27.06.2024

from sqlalchemy.orm import Session
from models import User
from schemas import UserSchema


# This function creates a new user in the database using the provided user data.
def create_user(db: Session, user: UserSchema):
    """
    Create a new user in the database.

    Args:
        db (Session): The database session.
        user (UserSchema): The user data.

    Returns:
        User: The created user object.
    """

    # Create a new user object
    db_user = User(name=user.name, password=user.password)

    # Add the user to the database
    db.add(db_user)

    # Commit the transaction
    db.commit()

    # Refresh the user object to get the updated values
    db.refresh(db_user)

    return db_user


# This function retrieves a user from the database by their name.
# If the user is not found, it returns None.
def get_user_by_name(db: Session, name: str):
    """
    Retrieve a user from the database by their name.

    Args:
        db (Session): The database session.
        name (str): The name of the user to retrieve.

    Returns:
        User: The user object if found, None otherwise.
    """

    # Query the database for a user with the given name
    # and return the first result
    return db.query(User).filter(User.name == name).first()
