from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
import google.generativeai as genai
import jsonpickle
import os
import json

from controllers.filemanager import FileManagerFactory
from controllers import authentication as auth
from modules.user.model import User
from database.dbmanager import ChatDB, CourseDB
from tools import generate_hash
from modules.chat.util import slide_generator
from modules.chat import CHATS_DIR
from controllers import FILES_DIR

router = APIRouter(prefix="/chat", tags=["Chat"])

@router.post("/create")
async def create_chat(course_id: int, title: str, slides: UploadFile = File(None),
                      current_user: dict = Depends(auth.get_current_user)):
    """
    Create a new chat for a course.

    Args:
        course_id (int): The ID of the course.
        title (str): The title of the chat.
        slides (UploadFile, optional): The slides file for the chat. Defaults to None.
        current_user (dict, optional): The current user. Defaults to Depends(auth.get_current_user).

    Returns:
        dict: A dictionary containing the chat ID and a success message.

    Raises:
        HTTPException: If the course is not found or the user is not authorized to create the chat.
        HTTPException: If the file extension is invalid.

    """
    course = CourseDB.fetch(course_id=course_id) # Fetch the course associated with the chat
    if not course:
        raise HTTPException(status_code=404, detail="Course not found.")
    
    # Check if the user is authorized to create the chat
    # This can happen if the user tries to create a chat in a course they don't own
    if course["user_id"] != current_user["user_id"]:
        raise HTTPException(status_code=403, detail="Forbidden.")
    
    chat = ChatDB.create(course_id=course_id, title=title,
                         slides_mode=(True if slides else False)) # Create a new chat in the database
    
    history_fname = f"user_{current_user['user_id']}_course_{course_id}_chat_{chat['chat_id']}" # convention
    history_url = os.path.join(CHATS_DIR, f"{generate_hash(history_fname)}.txt") # chat history file path

    slides_furl, slides_fname = None, None # initialize the slides name and URL

    if slides: # then we're creating a chat in slides mode
        slides_fname = slides.filename # get the slides file name, e.g. Lecture_1.pptx
        name, extension = slides_fname.rsplit(".", 1)

        if extension not in ["pptx", "pdf"]:
            raise HTTPException(status_code=400, detail="Invalid file extension.")
        
        factory = FileManagerFactory() # Create a factory object

        try:
            file_manager = factory(extension) # Get the file manager object based on the file extension

            os.makedirs(f"{FILES_DIR}/chat_{chat["chat_id"]}", exist_ok=True) # create a directory for the chat's files
            slides_furl = os.path.join(FILES_DIR, f"chat_{chat["chat_id"]}", 
                                       f"{generate_hash(name, strategy="uuid")}.{extension}") # construct the file path

            file_manager.save(slides_furl, slides) # save the file in file system
            generator = slide_generator(slides_furl) # create a generator object to yield slides one by one
            dumped_generator = jsonpickle.encode(generator) # dump the generator object into a string

            dumped_generator_path = slides_furl + "_generator.txt" # construct the dumped generator path
            with open(dumped_generator_path, "w") as file:
                file.write(dumped_generator)

        # Rollback changes
        except ValueError as e: # If the file extension is invalid (file manager can't handle it)
            ChatDB.delete(chat["chat_id"]) # Delete the chat from the database
            raise HTTPException(status_code=400, detail=str(e))
        """ except Exception as e: # Unsupported platform in slide_generator call
            ChatDB.delete(chat["chat_id"])
            file_manager.delete(slides_furl) # Delete the slides file
            raise HTTPException(status_code=500, detail=str(e)) """

    ChatDB.update(chat["chat_id"], history_url=history_url, slides_fname=slides_fname,
                  slides_furl=slides_furl) # Update the chat in the database
    
    return {"chat_id": chat["chat_id"], "message": "Chat created successfully."}


@router.get("/chat/{chat_id}")
async def get_chat(chat_id: int, current_user: dict = Depends(auth.get_current_user)):
    """
    Retrieve a chat by its ID and return the chat details along with its history.

    Args:
        chat_id (int): The ID of the chat to retrieve.
        current_user (dict, optional): The current user's information. Defaults to Depends(auth.get_current_user).

    Returns:
        dict: A dictionary containing the chat details and its history.

    Raises:
        HTTPException: If the chat is not found or the user is not authorized to access the chat.
    """
    chat = ChatDB.fetch(chat_id=chat_id)
    if not chat:
        raise HTTPException(status_code=404, detail="Chat not found.")
    
    # Check if the user is authorized to create the chat
    # This can happen if the user tries to create a chat in a course they don't own
    course = CourseDB.fetch(course_id=chat["course_id"])    
    if course["user_id"] != current_user["user_id"]:
        raise HTTPException(status_code=403, detail="Forbidden.")
    
    fname_prefix = f"user_{current_user['user_id']}_course_{course["course_id"]}_chat_{chat['chat_id']}" # convention
    fname = generate_hash(fname_prefix) # generate a unique hash for the chat history file
    file_path = os.path.join(CHATS_DIR, f"{fname}.txt") # chat history file path
    metadata_path = os.path.join(CHATS_DIR, f"{fname}_metadata.json") # chat metadata file path

    with open(metadata_path, "r") as file:
        metadata = json.load(file)
    metadata_dict = {item['id']: item for item in metadata}

    chat_content = None # set chat_content to None if no chat history yet
    if os.path.exists(file_path):
        with open(file_path, "r") as file:
            chat_content = file.read() # Read the chat history from the file
    
    history = jsonpickle.decode(chat_content) if chat_content else [] # Decode the chat content from JSON

    # parse the chat history and create a new dictionary with 'message' and 'role' keys
    messages = []
    for idx, content in enumerate(history):
        if idx in metadata_dict and metadata_dict[idx].get('skip', False):
            continue

        for part in content._pb.parts: # Google's protobuf message parts
            # Create a dictionary with the message, role, and ID of the chat
            chat_dict = {"message": part.text, "role": content._pb.role, "id": idx}

            if idx in metadata_dict and 'media_url' in metadata_dict[idx]:
                chat_dict['media_url'] = metadata_dict[idx]['media_url']

            if not messages or chat_dict["id"] != messages[-1]["id"]:
                messages.append(chat_dict) # Append the dictionary to the history list
    
    chat["history"] = messages # Add the chat history to response
    return chat


@router.get("/chat/{chat_id}/next_slide")
def get_next_slide(chat_id: int, current_user: User = Depends(auth.get_current_user)):
    """
    Get the next slide content for a given chat.

    Args:
        chat_id (int): The ID of the chat.
        current_user (User, optional): The current user. Defaults to Depends(auth.get_current_user).

    Returns:
        dict: The response containing the next slide content.

    Raises:
        HTTPException: If the user is not authorized or if the chat has no slides uploaded.
    """
    chat = ChatDB.fetch(chat_id=chat_id)
    course = CourseDB.fetch(course_id=chat["course_id"])

    # Check if the user is authorized to get the next slide
    if course["user_id"] != current_user["user_id"]:
        raise HTTPException(status_code=403, detail="Forbidden.")
    
    slides_furl = chat["slides_furl"] # get the slides file URL
    if not slides_furl:
        raise HTTPException(status_code=404, detail="This chat has no slides uploaded.")
    
    dumped_generator_path = slides_furl + "_generator.txt" # path of the jsonpickle dumped generator object

    with open(dumped_generator_path, "r") as file:
        dumped_generator = file.read() # read the dumped generator object from the file
    
    generator = jsonpickle.decode(dumped_generator) # decode the generator object from JSON

    try:
        content_url, content = next(generator) # get the next slide content

        history_url = chat["history_url"] # Get the chat history file path
    
        chat_content = None # If the file doesn't exist (i.e. it's the very first message), set chat_content to None
        if os.path.exists(history_url):
            with open(history_url, "r") as file:
                chat_content = file.read() # Read the chat history from the file

        history = jsonpickle.decode(chat_content) if chat_content else [] # Decode the chat content from JSON

        metadata_path = os.path.splitext(history_url)[0] + "_metadata.json"
        data1 = {"id": len(history), "skip": True} # Skip the "explain this slide" message, we don't want to show it in the chat
        data2 = {"id": len(history) + 1, "media_url": content_url} # (+1) for we want to draw it like the slide is uploaded by the LLM
        # Check if the file exists
        if os.path.exists(metadata_path):
            with open(metadata_path, "r") as file:
                try:
                    data = json.load(file)
                    # Assuming the data is a list of dictionaries
                    if data2 not in data:
                        data.append(data1)
                        data.append(data2)
                except json.JSONDecodeError:
                    # If the file is not a valid JSON, start fresh
                    data = [data1, data2]
        else:
            # If the file does not exist, start with the new data
            data = [data1, data2]

        # Write the updated content back to the file
        with open(metadata_path, "w") as file:
            json.dump(data, file, indent=4)

        chat_model = genai.GenerativeModel("gemini-1.5-flash").start_chat(history=history) # Initialize the chat model with the chat history so far
        response = chat_model.send_message(["Explain this slide", content]) # TODO: streaming response

        history = jsonpickle.encode(chat_model.history, True) # Encode back the updated chat history to JSON
        with open(history_url, "w") as file: # Save the updated chat history to the chat file
            file.write(history)
        
        generator = jsonpickle.encode(generator) # dump back the generator object to a string
        with open(dumped_generator_path, "w") as file:
            file.write(generator)

        return response.to_dict() # return the response in dictionary format
    
    except StopIteration:
        raise HTTPException(status_code=404, detail="No more slides to show.")
    

@router.post("/{chat_id}/send_message")
async def send_message(chat_id: int, text: str, file: UploadFile = File(None),
                       current_user: dict = Depends(auth.get_current_user)):
    """
    Send a message in a chat and generate a response.

    Args:
        message (MessageCreationRequest): The message to be sent.
        current_user (dict): The current user's information.

    Returns:
        dict: The generated response in dictionary format.
    """
    chat = ChatDB.fetch(chat_id=chat_id) # Fetch the chat by its ID
    if not chat:
        raise HTTPException(status_code=404, detail="Chat not found.")
    
    course = CourseDB.fetch(course_id=chat["course_id"]) # Fetch the course associated with the chat

    # Check if the user is authorized to send a message in the chat
    # This can happen if the user tries to send a message in a chat they don't own
    if course["user_id"] != current_user["user_id"]:
        raise HTTPException(status_code=403, detail="Forbidden.")

    prompt = text
    img = None # img: the image file to be sent in the chat (if any)

    if file:
        filename = file.filename
        name, extension = filename.rsplit(".", 1) # split name and extension, e.g. myfile.pdf -> (myfile, pdf)

        factory = FileManagerFactory() # Create a factory object

        try:
            file_manager = factory(extension) # Get the file manager object based on the file extension

            # Generate a unique filename, while preserving the original filename for easy retrieval
            hashed_fname = f"{generate_hash(name, strategy="timestamp")}.{extension}" # e.g. <hashed_name>_<actual_name>.pdf

            os.makedirs(f"{FILES_DIR}/chat_{chat_id}", exist_ok=True) # create a directory for the chat's files
            path = os.path.join(FILES_DIR, f"chat_{chat_id}", hashed_fname) # construct the file path

            file_manager.save(path, file) # save the file in file system
            img = file_manager.get(path) # get the file from the file system 
            # TODO: assuming the file is an image for now
            # o/w, we'll get TypeError: Could not create `Blob`, expected `Blob`, `dict` or an `Image` type(`PIL.Image.Image` or `IPython.display.Image`)
    
        except ValueError as e:
            raise HTTPException(status_code=400, detail=str(e))

    history_url = chat["history_url"] # Get the chat history file path
    
    chat_content = None # If the file doesn't exist (i.e. it's the very first message), set chat_content to None
    if os.path.exists(history_url): # if the history file exists
        with open(history_url, "r") as file:
            chat_content = file.read() # Read the chat history from the file

    history = jsonpickle.decode(chat_content) if chat_content else [] # Decode the chat content from JSON
    chat = genai.GenerativeModel("gemini-1.5-flash").start_chat(history=history) # Initialize the chat model with the chat history so far

    # TODO: streaming response
    if img:
        metadata = os.path.splitext(history_url)[0] + "_metadata.json"
        new_data = {"id": len(history), "media_url": path}
        # Check if the file exists
        if os.path.exists(metadata):
            with open(metadata, "r") as file:
                try:
                    data = json.load(file)
                    # Assuming the data is a list of dictionaries
                    if new_data not in data:
                        data.append(new_data)
                except json.JSONDecodeError:
                    # If the file is not a valid JSON, start fresh
                    data = [new_data]
        else:
            # If the file does not exist, start with the new data
            data = [new_data]

        # Write the updated content back to the file
        with open(metadata, "w") as file:
            json.dump(data, file, indent=4)
        response = chat.send_message([prompt, img])
    else:
        response = chat.send_message(prompt)

    history = jsonpickle.encode(chat.history, True) # Encode back the updated chat history to JSON
    with open(history_url, "w") as file: # Save the updated chat history to the chat file
        file.write(history)

    return response.to_dict()