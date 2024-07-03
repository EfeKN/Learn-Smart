from fastapi import APIRouter, Depends, HTTPException
import google.generativeai as genai
import jsonpickle

from controllers import authentication as auth
from database.dbmanager import ChatDB, CourseDB
from modules.genai.schemas import MessageCreationRequest

router = APIRouter(prefix="/genai", tags=["GenAI"])

@router.post("/send_message")
async def send_message(message: MessageCreationRequest, 
                       current_user: dict = Depends(auth.get_current_user)):
    """
    Send a message in a chat and generate a response.

    Args:
        message (MessageCreationRequest): The message to be sent.
        current_user (dict): The current user's information.

    Returns:
        dict: The generated response in dictionary format.
    """
    chat_id = message.chat_id
    chat = ChatDB.fetch(chat_id=chat_id)
    if not chat:
        raise HTTPException(status_code=404, detail="Chat not found.")
    
    course = CourseDB.fetch(course_id=chat["course_id"]) # Fetch the course associated with the chat

    # Check if the user is authorized to send a message in the chat
    # This can happen if the user tries to send a message in a chat they don't own
    if course["user_id"] != current_user["user_id"]:
        raise HTTPException(status_code=403, detail="Forbidden.")

    prompt = message.text
    history_url = chat["history_url"] # Get the chat history file path
    
    try:
        with open(history_url, "r") as file:
            chat_content = file.read() # Read the chat history from the file
    except:
        chat_content = None # If the file doesn't exist, set chat_content to None

    history = jsonpickle.decode(chat_content) if chat_content else [] # Decode the chat content from JSON
    chat = genai.GenerativeModel("gemini-pro").start_chat(history=history) # Initialize the chat model with the chat history so far

    
    response = chat.send_message(prompt) # TODO: streaming response

    history = jsonpickle.encode(chat.history, True) # Encode back the updated chat history to JSON

    # Save the updated chat history to the chat file
    with open(history_url, "w") as file:
        file.write(history)

    return response.to_dict()