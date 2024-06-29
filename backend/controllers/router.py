from fastapi import APIRouter, Depends, HTTPException
from fastapi import File, UploadFile

from controllers import authentication as auth
from controllers.filemanager import FileManagerFactory
from modules.user.model import User
from . import FILES_PATH

router = APIRouter(prefix="/files", tags=["Files"])

@router.post("/")
def upload_file(file: UploadFile = File(...), current_user: User = Depends(auth.get_current_user)):
    """
    Uploads a file to the server.

    Args:
        file (UploadFile): The file to be uploaded.
        current_user (User): The current authenticated user (used for authentication).

    Returns:
        dict: A dictionary containing the filename of the uploaded file.

    Raises:
        HTTPException: If there is an error during the file upload process.
    """
    filename = file.filename
    extension = filename.split(".")[-1] # file extension

    factory = FileManagerFactory() # Create a factory object

    try:
        file_manager = factory(extension) # Get the file manager object based on the file extension

        # TODO: after authentication mechanism is added, modify the file path such that:
        # each user has dedicated folder in the root folder with their id
        # each folder will have 3 subfolders: images, documents, and slides

        path = f"{FILES_PATH}/{filename}"
        file_manager.save(path, file) # save the file in file system

        return {"filename": filename}
    
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    

# TODO: the following function makes no sense at the moment.
# after the auth. mechanism is added, this function should be modified such that
# the users should be able to delete their own files.
@router.delete("/{filename}")
def delete_file(filename: str, current_user: User = Depends(auth.get_current_user)):
    """
    Delete a file with the given filename.

    Args:
        filename (str): The name of the file to be deleted.
        current_user (User): The current authenticated user (used for authentication).

    Returns:
        dict: A dictionary containing the deleted filename.

    Raises:
        HTTPException: If the file is not found or if there is a value error.
    """
    factory = FileManagerFactory()
    extension = filename.split(".")[-1]

    try:
        file_manager = factory(extension)
        file_manager.delete(f"{FILES_PATH}/{filename}")
        return {"filename": filename}
    
    except FileNotFoundError:
        raise HTTPException(status_code=404, detail="File not found.")
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    
    
@router.get("/{filename}")
def get_file(filename: str, current_user: User = Depends(auth.get_current_user)):
# TODO: relevant logic must be added here. for example: obtain slide pages one by one, then
# send them to the genai api.
    pass
