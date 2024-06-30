"""
TODO:
After migration to AWS S3, modify the save and delete methods in the FileManager 
classes to interact with the S3 bucket instead of the local file system.
"""

import os
import pymupdf
from pptx import Presentation
from docx import Document
from fastapi import UploadFile
from abc import ABC, abstractmethod
from PIL import Image

class FileManager(ABC):
    """
    Abstract base class for file managers.
    """

    @abstractmethod
    def save(self, path: str, file: UploadFile):
        """
        Save the uploaded file to the specified path.

        Args:
        - path (str): The path where the file should be saved.
        - file (UploadFile): The uploaded file to be saved.
        """
        pass

    @abstractmethod
    def delete(self, path: str):
        """
        Delete the file at the specified path.

        Args:
        - path (str): The path of the file to be deleted.
        """
        pass

    @abstractmethod
    def get(self, path: str):
        """
        Get the file at the specified path.

        Args:
        - path (str): The path of the file to be retrieved.

        Returns:
        - bytes: The content of the file.
        """
        pass


class ImageManager(FileManager):
    """
    A class that handles image file operations.
    """

    def save(self, path: str, file: UploadFile, size: tuple = (256, 256)):
        """
        Saves the image file to the specified path, resizing it to the given size.

        Args:
        - path (str): The path where the image file should be saved.
        - file (UploadFile): The image file to be saved.
        - size (tuple, optional): The desired size of the saved image. Defaults to (256, 256).

        Returns:
        - None
            
        """
        file_content = file.file.read()

        with open(path, "wb") as file:
            file.write(file_content)

        img = Image.open(path)
        img = img.resize(size=size)
        img.save(path)

    def delete(self, path):
        """
        Deletes a file at the specified path.

        Args:
        - path (str): The path of the file to be deleted.

        Raises:
        - FileNotFoundError: If the file does not exist at the specified path.
        - PermissionError: If the user does not have permission to delete the file.

        Returns:
        - None
        """
        os.remove(path)
        
    def get(self, path):
        """
        Retrieves an image from the specified path.

        Args:
        - path (str): The path to the image file.

        Returns:
        - PIL.Image.Image: The image object.

        """
        img = Image.open(path)
        return img


class PDFManager(FileManager):
    """
    A class that provides functionality for managing PDF files.
    """

    class ResourceWrapper:
        """
        A helper context manager class that wraps a resource object.

        This class provides a convenient way to manage resources that need to be properly closed
        after they are used within a 'with' block.

        Args:
        - obj (pymupdf.Document): The resource object to be wrapped.

        Attributes:
        - obj (pymupdf.Document): The wrapped resource object.

        """
        def __init__(self, obj: pymupdf.Document):
            self.obj = obj

        def __enter__(self):
            """
            Returns the object to be used within the 'with' block.
            """
            return self.obj

        def __exit__(self, exc_type, exc_val, exc_tb):
            """
            Closes the object when exiting the context manager.
            """
            # Ensure the object is properly closed
            self.obj.close()
            
    def save(self, path: str, file: UploadFile):
        """
        Saves the uploaded file to the specified path.

        Args:
        - path (str): The path where the file should be saved.
        - file (UploadFile): The uploaded file object.

        Returns:
        - None

        """
        file_content = file.file.read()

        with open(path, "wb") as file:
            file.write(file_content)

    def delete(self, path):
        """
        Deletes a file at the specified path.

        Args:
        - path (str): The path of the file to be deleted.

        Raises:
        - FileNotFoundError: If the file does not exist at the specified path.
        - PermissionError: If the user does not have permission to delete the file.

        Returns:
        - None

        """
        os.remove(path)

    def get(self, path):
        """
        Opens a PDF document at the specified path and returns a resource wrapper.

        Args:
        - path (str): The path to the PDF document.

        Returns:
        - PDFManager.ResourceWrapper: A resource wrapper for the opened PDF document. \
            The document should be used within a 'with' block to ensure it is properly closed.
        """
        doc = pymupdf.open(path)
        return PDFManager.ResourceWrapper(doc)


class SlidesManager(FileManager):
    """
    A class that manages slides files.
    """

    def save(self, path: str, file: UploadFile):
        """
        Saves the file content to the specified path.

        Args:
        - path (str): The path where the file should be saved.
        - file (UploadFile): The file to be saved.

        Returns:
        - None
        """
        file_content = file.file.read()

        with open(path, "wb") as file:
            file.write(file_content)

    def delete(self, path):
        """
        Deletes the file at the specified path.

        Args:
        - path (str): The path of the file to be deleted.

        Raises:
        - FileNotFoundError: If the file does not exist at the specified path.
        - PermissionError: If the user does not have permission to delete the file.

        Returns:
        - None
        """
        os.remove(path)

    def get(self, path):
        """
        Returns a Presentation object for the file at the specified path.

        Args:
        - path (str): The path of the file.

        Returns:
        - Presentation: A Presentation object representing the file.
        """
        return Presentation(path)
    

class DocumentManager(FileManager):
    """
    A class that manages documents, including saving, deleting, and retrieving them.
    """

    def save(self, path: str, file: UploadFile):
        """
        Saves the given file to the specified path.

        Args:
        - path (str): The path where the file should be saved.
        - file (UploadFile): The file to be saved.

        Returns:
        - None
        """
        file_content = file.file.read()

        with open(path, "wb") as file:
            file.write(file_content)

    def delete(self, path):
        """
        Deletes the file at the specified path.

        Args:
        - path (str): The path of the file to be deleted.

        Raises:
        - FileNotFoundError: If the file does not exist at the specified path.
        - PermissionError: If the user does not have permission to delete the file.

        Returns:
        - None
        """
        os.remove(path)

    def get(self, path):
        """
        Retrieves the document at the specified path.

        Args:
        - path (str): The path of the document to be retrieved.

        Returns:
        - Document: The retrieved document.
        """
        return Document(path)


class FileManagerFactory:
    """
    Factory class for creating file managers based on the file type.
    """

    def __call__(self, type):
        if type in ["png", "jpg", "jpeg"]:
            return ImageManager()
        elif type == 'pdf':
            return PDFManager()
        elif type == 'pptx':
            return SlidesManager()
        elif type == 'docx':
            return DocumentManager()
        else:
            raise ValueError(f"Invalid file type provided: {type}. Available values are 'png', 'jpg', 'jpeg', 'pdf', 'pptx', 'docx'")
        