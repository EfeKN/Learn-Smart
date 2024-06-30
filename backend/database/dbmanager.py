from abc import ABC, abstractmethod

from database.connection import db_connection
from controllers import authentication as auth
from modules.user.schemas import UserCreationRequest
from modules.user.model import User
from database import DATABASE_URL

class DatabaseInterface(ABC):
    """
    Interface for the database manager.
    """

    @staticmethod
    @abstractmethod
    def create(obj):
        """
        Creates a new object in the database.

        Args:
        - obj: The object to be created.

        Returns:
        - The created object.

        Raises:
        - NotImplementedError: This method should be implemented by subclasses.

        """
        pass

    @staticmethod
    @abstractmethod
    def fetch(**kwargs):
        """
        Abstract method for fetching data from the database.

        Args:
        - **kwargs: Additional keyword arguments for specifying query parameters.

        Returns:
        - None

        Raises:
        - NotImplementedError: This method should be implemented by subclasses.
        """
        pass

    @staticmethod
    @abstractmethod
    def update(obj):
        """
        Updates an object in the database.

        Args:
        - obj: The object to be updated.

        Returns:
        - The updated object.

        Raises:
        - NotImplementedError: This method should be implemented by subclasses.

        """
        pass

    @staticmethod
    @abstractmethod
    def delete(**kwargs):
        """
        Deletes records from the database based on the provided criteria.

        Args:
        - **kwargs: Keyword arguments representing the criteria for deletion.

        Returns:
        - None

        Raises:
        - NotImplementedError: This method should be implemented by subclasses.
        """
        pass


class UserDB(DatabaseInterface):
    """
    Database interface for the User model.
    """

    @staticmethod
    def create(obj: UserCreationRequest):
        """
        Creates a new user in the database.

        Args:
        - obj (UserCreationRequest): The user creation request object containing user details.

        Returns:
        - dict: A dictionary representation of the created user object.
        """
        # Check if a user with the same email already exists
        user = UserDB.fetch(email=obj.email)
        if user:
            raise ValueError("Username already registered")
        
        # Create a new user object
        user = User(name=obj.name, nickname=obj.nickname,
                    email=obj.email, hashed_password=auth.hash_password(obj.password))
        
        # save the user object in the database
        with db_connection as db:
            db.add(user)
            db.commit()
            db.refresh(user)

            return user.to_dict()

    def fetch(**kwargs):
        """
        Fetches a user from the database based on the provided query parameters.

        Args:
            **kwargs: Keyword arguments representing the query parameters.
                Possible keyword arguments:
                - nickname (str): The nickname of the user.
                - email (str): The email of the user.
                - id (int): The ID of the user.

        Returns:
            dict or None: A dictionary representing the user if found, or None if no user is found.

        Raises:
            ValueError: If no query parameters are provided.
        """
        nickname = kwargs.get("nickname")
        email = kwargs.get("email")
        id = kwargs.get("id")

        with db_connection as db:
            if nickname:
                user = db.query(User).filter(User.nickname == nickname).first() # fetch the first user with the given nickname
            elif email:
                user = db.query(User).filter(User.email == email).first() # fetch the first user with the given email
            elif id:
                user = db.query(User).filter(User.id == id).first() # fetch the first user with the given ID
            else:
                raise ValueError("No query parameters provided")
            
            if user:
                return user.to_dict()

            return None
            
    def update(obj: User):
        """
        Updates a user in the database.

        Args:
        - obj (User): The user object to be updated.

        Returns:
        - User: The updated user object.

        """
        pass

    def delete(**kwargs):
        """
        Deletes a user from the database.

        Args:
        - **kwargs: Additional keyword arguments for specifying query parameters.

        """
        pass