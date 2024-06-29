from sqlalchemy.orm import Session
from modules.user.model import User

def get_user_by_name(db: Session, name: str):
    """
    Retrieve a user from the database by their name.

    Args:
        db (Session): The database session.
        name (str): The name of the user to retrieve.

    Returns:
        User: The user object if found, None otherwise.
    """

    # query the database for a user with the given name and return the first result
    return db.query(User).filter(User.name == name).first()