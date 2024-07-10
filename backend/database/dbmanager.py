from abc import ABC, abstractmethod
from sqlalchemy import and_

from database.connection import db_connection
from controllers import authentication as auth

from modules.user.model import User
from modules.chat.model import Chat
from modules.course.model import Course

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
    def create(name: str, nickname: str, email: str, password: str):
        """
        Create a new user with the provided credentials and save it in the database.

        Args:
        - name (str): The name of the user.
        - nickname (str): The nickname of the user.
        - email (str): The email of the user.
        - password (str): The password of the user.

        Returns:
        - dict: A dictionary representation of the created user object.
        Raises:
        - ValueError: If a user with the same email or nickname already exists.
        """
        # Check if a user with the same email or nickname already exists
        user_by_email = UserDB.fetch(email=email)
        user_by_nickname = UserDB.fetch(nickname=nickname)

        if user_by_email or user_by_nickname:
            raise ValueError("User with provided credentials already registered")

        # Create a new user object
        user = User(name=name, nickname=nickname,
                    email=email, hashed_password=auth.hash_password(password))
        
        # save the user object in the database
        with db_connection as db:
            db.add(user)
            db.commit()
            db.refresh(user)

            return user.to_dict()

    @staticmethod
    def fetch(**kwargs):
        """
        Fetches user(s) from the database based on the provided query parameters.

        Args:
            **kwargs: Keyword arguments representing the query parameters.
                Possible query parameters include:
                - name (str): The name of the user.
                - nickname (str): The nickname of the user.
                - email (str): The email of the user.
                - user_id (int): The ID of the user.
                - all (bool): Flag indicating whether to fetch all users or just the first one. Default is False.

        Returns:
            If `all` is True, returns a list of user dictionaries. Each dictionary represents a user and contains the user's attributes.
            If `all` is False, returns a single user dictionary or None if no user is found.

        Raises:
            ValueError: If no query parameters are provided.
        """
        name = kwargs.get("name", None)
        nickname = kwargs.get("nickname", None)
        email = kwargs.get("email", None)
        user_id = kwargs.get("user_id", None)
        all = kwargs.get("all", False)

        if not any([nickname, email, user_id]):
            raise ValueError("No query parameters provided")

        # Create a list of filters based on the provided query parameters
        filters = []
        if name:
            filters.append(User.name == name)
        if nickname:
            filters.append(User.nickname == nickname)
        if email:
            filters.append(User.email == email)
        if user_id:
            filters.append(User.user_id == user_id)

        with db_connection as db:
            query = db.query(User).filter(and_(*filters)) # apply filters to the query
            result = query.all() if all else query.first() # fetch all users or just the first one

            if all:
                return [user.to_dict() for user in result] if result else [] # return a list of user dicts
            
            return result.to_dict() if result else None # return a single user dict or None
            
    @staticmethod
    def update(obj: User):
        """
        Updates a user in the database.

        Args:
        - obj (User): The user object to be updated.

        Returns:
        - User: The updated user object.

        """
        pass

    @staticmethod
    def delete(**kwargs):
        """
        Deletes a user from the database.

        Args:
        - **kwargs: Additional keyword arguments for specifying query parameters.

        """
        pass


class ChatDB(DatabaseInterface):
    """
    Database interface for the Chat model.
    """

    @staticmethod
    def create(course_id: int, title: str, history_url: str = None, slides_mode: bool = False, 
               slides_fname: str = None, slides_furl: str = None):
        """
        Create a new chat object and save it in the database.

        Parameters:
        - course_id (int): The ID of the course associated with the chat.
        - title (str): The title of the chat.
        - history_url (str, optional): The URL of the chat's history.
        - slides_mode (bool, optional): Indicates whether the chat has slides.
        - slides_fname (str, optional): The filename of the chat's slides.
        - slides_furl (str, optional): The URL of the chat's slides.

        Returns:
        - dict: A dictionary representation of the created chat object.
        """
        chat = Chat(course_id=course_id, title=title, history_url=history_url,
                    slides_mode=slides_mode, slides_fname=slides_fname, slides_furl=slides_furl)
        
        # save the chat object in the database
        with db_connection as db:
            db.add(chat)
            db.commit()
            db.refresh(chat)

            return chat.to_dict()

    @staticmethod
    def fetch(**kwargs):
        """
        Fetches chat data from the database based on the provided query parameters.

        Args:
            chat_id (int): The ID of the chat.
            course_id (int): The ID of the course.
            all (bool, optional): If True, fetches all matching chat records. If False (default), fetches only the first matching record.

        Returns:
            dict or list: A dictionary representing the fetched chat record if `all` is False and a matching record is found. 
                          A list of dictionaries representing all fetched chat records if `all` is True and matching records are found.
                          None if no matching record is found and `all` is False.
                          An empty list if no matching records are found and `all` is True.

        Raises:
            ValueError: If no query parameters are provided.
        """
        chat_id = kwargs.get("chat_id", None)
        course_id = kwargs.get("course_id", None)
        all = kwargs.get("all", False)

        if not any([chat_id, course_id]): # check if any query parameters are provided
            raise ValueError("No query parameters provided")
        
        # Create a list of filters based on the provided query parameters
        filters = []
        if chat_id:
            filters.append(Chat.chat_id == chat_id)
        if course_id:
            filters.append(Chat.course_id == course_id)

        with db_connection as db:
            query = db.query(Chat).filter(and_(*filters)) # apply filters to the query
            result = query.all() if all else query.first() # fetch all chats or just the first one
            
            if all:
                return [chat.to_dict() for chat in result] if result else [] # return a list of chat dicts
            
            return result.to_dict() if result else None # return a single chat dict or None

    @staticmethod
    def update(chat_id: int, **kwargs):
        """
        Update the chat details in the database.

        Args:
            chat_id (int): The ID of the chat to update.
            **kwargs: Keyword arguments for the fields to update. Possible keyword arguments include:
                - title (str): The new title for the chat.
                - history_url (str): The new history URL for the chat.
                - slides_fname (str): The new slides filename for the chat.
                - slides_furl (str): The new slides file URL for the chat.

        Returns:
            dict: A dictionary representing the updated chat details.

        Raises:
            ValueError: If the chat with the specified ID is not found in the database.
        """
        title = kwargs.get("title", None)
        history_url = kwargs.get("history_url", None)
        slides_fname = kwargs.get("slides_fname", None) # get the new slides filename
        slides_furl = kwargs.get("slides_furl", None) # get the new slides file URL

        with db_connection as db:
            chat = db.query(Chat).filter(Chat.chat_id == chat_id).first()
            if not chat:
                raise ValueError(f"Chat with ID {chat_id} not found")

            if title:
                chat.title = title                
            if history_url:
                chat.history_url = history_url
            if slides_fname:
                chat.slides_fname = slides_fname
            if slides_furl:
                chat.slides_furl = slides_furl

            db.commit()
            db.refresh(chat)

            return chat.to_dict()

    @staticmethod
    def delete(chat_id: int):
        """
        Deletes a chat from the database based on the provided chat_id.

        Args:
            chat_id (int): The ID of the chat to be deleted.

        Raises:
            ValueError: If the chat with the provided chat_id is not found in the database.
        """
        with db_connection as db:
            chat = db.query(Chat).filter(Chat.chat_id == chat_id).first()
            if chat:
                db.delete(chat)
                db.commit()
            else:
                raise ValueError(f"Chat with ID {chat_id} not found")


class CourseDB(DatabaseInterface):
    """
    Database interface for the Course model.
    """

    @staticmethod
    def create(name: str, title: str, description: str, user_id: int):
        """
        Create a new course in the database.

        Args:
            name (str): The name of the course.
            description (str): The description of the course.
            user_id (int): The ID of the user who owns the course.

        Returns:
            dict: A dictionary representing the created course.

        Raises:
            ValueError: If a course with the provided name already exists for the user.
        """
        course = CourseDB.fetch(course_title=title, user_id=user_id)
        if course:
            raise ValueError(f"Course {title} with provided name already exists for user {user_id}")

        course = Course(course_name=name, course_title=title,
                        description=description, user_id=user_id) # create a new course object
        
        # save the user object in the database
        with db_connection as db:
            db.add(course)
            db.commit()
            db.refresh(course)

            return course.to_dict()

    @staticmethod
    def fetch(**kwargs):
        """
        Fetches course information from the database based on the provided query parameters.

        Args:
            course_id (int): The ID of the course.
            course_name (str): The name of the course.
            course_title (str): The title of the course.
            user_id (int): The ID of the user.
            all (bool, optional): If True, fetches all matching courses. If False (default), fetches only the first matching course.

        Returns:
            dict or list: A dictionary representing the fetched course information if `all` is False, or a list of dictionaries representing multiple courses if `all` is True. Returns None if no matching course is found.

        Raises:
            ValueError: If no query parameters are provided.
        """
        course_id = kwargs.get("course_id", None)
        course_name = kwargs.get("course_name", None)
        user_id = kwargs.get("user_id", None)
        course_title = kwargs.get("course_title", None)
        all = kwargs.get("all", False)

        if not any([course_id, course_name, user_id, course_title]): # check if any query parameters are provided
            raise ValueError("No query parameters provided")
        
        # Create a list of filters based on the provided query parameters
        filters = []
        if course_id:
            filters.append(Course.course_id == course_id)
        if course_name:
            filters.append(Course.course_name == course_name)
        if user_id:
            filters.append(Course.user_id == user_id)
        if course_title:
            filters.append(Course.course_title == course_title)

        with db_connection as db:
            query = db.query(Course).filter(and_(*filters)) # apply filters to the query
            result = query.all() if all else query.first() # fetch all courses or just the first one
            
            if all:
                return [course.to_dict() for course in result] if result else [] # return a list of course dicts
            
            return result.to_dict() if result else None # return a single course dict or None

    @staticmethod
    def update(obj):
        """
        Updates a course in the database.

        Args:
        - obj: The course object to be updated.

        Returns:
        - dict: A dictionary representation of the updated course object.

        """
        pass

    @staticmethod
    def delete(**kwargs):
        """
        Deletes a course from the database.

        Args:
        - **kwargs: Additional keyword arguments for specifying query parameters.

        """
        pass
