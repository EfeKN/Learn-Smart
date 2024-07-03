from fastapi import APIRouter, Depends, HTTPException
import jsonpickle
import os

from controllers import authentication as auth
from database.dbmanager import ChatDB, CourseDB
from tools import generate_hash
from modules.chat import CHATS_DIR

router = APIRouter(prefix="/chat", tags=["Chat"])

@router.post("/create")
async def create_chat(course_id: int, title: str, current_user: dict = Depends(auth.get_current_user)):
    """
    Create a new chat for a given course.

    Args:
        course_id (int): The ID of the course.
        title (str): The title of the chat.
        current_user (dict, optional): The current user. Defaults to Depends(auth.get_current_user).

    Returns:
        dict: A dictionary containing the chat ID and a success message.

    Raises:
        HTTPException: If the course is not found or if the user is not authorized to create the chat.
    """
    course = CourseDB.fetch(course_id=course_id)
    if not course:
        raise HTTPException(status_code=404, detail="Course not found.")
    
    # Check if the user is authorized to create the chat
    # This can happen if the user tries to create a chat in a course they don't own
    if course["user_id"] != current_user["user_id"]:
        raise HTTPException(status_code=403, detail="Forbidden.")
    
    chat = ChatDB.create(course_id=course_id, title=title, history_url=None) # Create a new chat in the database
    
    fname_prefix = f"user_{current_user['user_id']}_course_{course_id}_chat_{chat['chat_id']}"
    path = os.path.join(CHATS_DIR, f"{generate_hash(fname_prefix)}.txt") # chat history file path

    ChatDB.update(chat_id=chat["chat_id"], history_url=path) # Update the chat history URL in the database

    return {"chat_id": chat["chat_id"], "message": "Chat created successfully."}

@router.get("/chat/{chat_id}")
async def get_chat(chat_id: int, current_user: dict = Depends(auth.get_current_user)):
    """
    Get chat details by chat ID.

    Args:
        chat_id (int): The ID of the chat to retrieve.
        current_user (User): The current authenticated user (used for authentication).

    Returns:
        dict: A dictionary containing the chat details.
    """
    chat = ChatDB.fetch(chat_id=chat_id)
    if not chat:
        raise HTTPException(status_code=404, detail="Chat not found.")
    
    # Check if the user is authorized to create the chat
    # This can happen if the user tries to create a chat in a course they don't own
    course = CourseDB.fetch(course_id=chat["course_id"])    
    if course["user_id"] != current_user["user_id"]:
        raise HTTPException(status_code=403, detail="Forbidden.")
    
    fname_prefix = f"user_{current_user['user_id']}_course_{course["course_id"]}_chat_{chat['chat_id']}"
    file_path = os.path.join(CHATS_DIR, f"{generate_hash(fname_prefix)}.txt") # chat history file path

    try:
        with open(file_path, "r") as file:
            chat_content = file.read() # Read the chat history from the file
    except:
        chat_content = None # If the file doesn't exist (i.e. it's the very first message to model),
                            # set the chat content to None
    
    history = jsonpickle.decode(chat_content) if chat_content else [] # Decode the chat content from JSON

    # parse the chat history and create a new dictionary with 'message' and 'role' keys
    history_dict = []
    for idx, content in enumerate(history):
        for part in content._pb.parts: # Google's protobuf message parts
            # Create a dictionary with the message, role, and ID of the chat
            chat_dict = {"message": part.text, "role": content._pb.role, "id": idx}
            history_dict.append(chat_dict) # Append the dictionary to the history list
    
    chat["history"] = history_dict # Add the chat history to response
    return chat