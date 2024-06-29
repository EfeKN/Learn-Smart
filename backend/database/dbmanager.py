from abc import ABC, abstractmethod

from controllers import authentication as auth
from modules.user.schemas import UserCreationRequest
from modules.user.model import User
from database import session

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

    class DBManager:
        @staticmethod
        def create(obj: UserCreationRequest):
            """
            Creates a new user in the database.

            Args:
                obj (UserCreationRequest): The user creation request object containing user details.

            Returns:
                User: The newly created user object.

            Raises:
                ValueError: If the username is already registered.
            """

            # Check if a user with the same email already exists
            db_user = UserDB.fetch(email=obj.email)
            if db_user:
                raise ValueError("Username already registered")

            # Create a new user object
            db_user = User(name=obj.name, nickname=obj.nickname,
                        email=obj.email, hashed_password=auth.hash_password(obj.password))

            # save the user object in the database
            with session() as db:
                db.add(db_user)
                db.commit()
                db.refresh(db_user)

            return db_user

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
            User: The user object retrieved from the database.

        Raises:
            ValueError: If no query parameters are provided.
        """
        nickname = kwargs.get("nickname")
        email = kwargs.get("email")
        id = kwargs.get("id")

        # Fetch the user based on the provided query parameters
        # It doesn't matter which parameter is provided, since all of them are unique identifiers of users
        with session() as db:
            if nickname:
                return db.query(User).filter(User.nickname == nickname).first() # fetch the first user with the given nickname
            elif email:
                return db.query(User).filter(User.email == email).first() # fetch the first user with the given email
            elif id:
                return db.query(User).filter(User.id == id).first() # fetch the first user with the given ID
            else:
                raise ValueError("No query parameters provided")

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