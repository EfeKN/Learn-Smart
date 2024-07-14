from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
import google.generativeai as genai
import shutil, os
import json, jsonpickle

from middleware.filemanager import FileFactory
from middleware import authentication as auth
from modules.user.model import User
from database.dbmanager import ChatDB, CourseDB
from tools import generate_hash, splitext
from modules.chat.util import *
from modules.chat import CHATS_DIR
from middleware import FILES_DIR

# System instruction for the LLM
# To be put in .env file
# TODO: enhance
# TODO: LLM didn't care so much about the system instruction
SYSTEM_INSTRUCTION = """
        You are an intelligent educational assistant. Your task is to enhance the learning experience of students by dynamically interacting with their uploaded content. Follow these guidelines:

        Student Interaction:
        Reject to answer questions that are not related to the course or academics. You're a teaching assistant, not a personal assistant someone to chat with.
        Engage with students in a supportive and informative manner.
        Answer questions clearly, using examples where appropriate.
        
        Content Analysis and Teaching:
        Analyze the uploaded materials (slides, books, PDFs) thoroughly.
        Teach the students based on the content provided, breaking down complex concepts into understandable parts.
        Present information in a logical sequence, ensuring continuity and relevance.
        
        Quiz and Flashcard Generation:
        Users will occasionally ask you to create quizzes and flashcards from the current chat history to reinforce learning.
        Ensure that the generated quizzes and flashcards are aligned with the uploaded content and chat interactions.
        
        Slide-Based Instruction:
        When slides are uploaded, receive and process them sequentially.
        Provide detailed explanations and context for each slide, ensuring comprehension of the material.
        
        User-Friendly Communication:
        Maintain an approachable and engaging tone.
        Use clear and simple language to explain concepts.
        """


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
    
    course = CourseDB.fetch(course_id=course_id)
    if not course:
        raise HTTPException(status_code=404, detail="Course not found.")
    if course["user_id"] != current_user["user_id"]:
        raise HTTPException(status_code=403, detail="Forbidden.")
    
    chat = ChatDB.create(course_id=course_id, title=title, slides_mode=bool(slides))
    history_fname, _ = generate_chat_fnames(current_user["user_id"], course_id, chat["chat_id"])
    history_url = os.path.join(CHATS_DIR, history_fname) # chat history file path

    slides_furl, slides_fname = None, None # initialize the slides name and URL
    if slides: # then it means we're creating a chat in slides mode
        slides_fname = slides.filename
        name, extension = splitext(slides_fname) # split name and extension, e.g. myfile.pdf -> (myfile, pdf)
        if extension not in ["pptx", "pdf"]:
            ChatDB.delete(chat["chat_id"])
            raise HTTPException(status_code=400, detail=f"Invalid file extension: {extension}")
        
        storage_dir = get_chat_folder_path(chat["chat_id"]) # construct the storage directory
        os.makedirs(storage_dir, exist_ok=True) # create a directory to store the chat's files
        slides_furl = os.path.join(storage_dir, f"{generate_hash(name, strategy="uuid")}.{extension}") # construct the file path
        
        try:
            file = FileFactory()(file=slides)
            file.save(slides_furl) # save the file in file system
            generator = slide_generator(slides_furl) # create a generator object to yield slides one by one
            dumped_generator = jsonpickle.encode(generator) # dump the generator object into a string

            dumped_generator_path = get_generator_path(slides_furl) # path of the jsonpickle dumped generator object
            with open(dumped_generator_path, "w") as file:
                file.write(dumped_generator)

        # Rollback changes
        except ValueError as e: # If the file extension is invalid (file manager can't handle it)
            ChatDB.delete(chat_id=chat["chat_id"])
            raise HTTPException(status_code=400, detail=str(e))
        except Exception as e: # Unsupported platform in slide_generator call
            ChatDB.delete(chat_id=chat["chat_id"])
            shutil.rmtree(storage_dir) # "rm -rf chat_<chat_id>", remove the directory and its contents
            raise HTTPException(status_code=500, detail=str(e))

    print("History URL:", history_url)
    ChatDB.update(chat["chat_id"], history_url=history_url, slides_fname=slides_fname,
                  slides_furl=slides_furl) # Update the chat in the database
    
    return {"chat": chat, "message": "Chat created successfully."}


@router.get("/{chat_id}")
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
    
    course = CourseDB.fetch(course_id=chat["course_id"])
    if course["user_id"] != current_user["user_id"]:
        raise HTTPException(status_code=403, detail="Forbidden.")
    
    hist_fname, metadata_fname = generate_chat_fnames(current_user["user_id"], 
                                                  course["course_id"], chat["chat_id"])

    file_path = os.path.join(CHATS_DIR, hist_fname) # chat history file path
    metadata_path = os.path.join(CHATS_DIR, metadata_fname) # chat metadata file path

    with open(metadata_path, "r") as file:
        metadata = {item['id']: item for item in json.load(file)}

    chat_content = None # set chat_content to None if no chat history yet
    if os.path.exists(file_path):
        with open(file_path, "r") as file:
            chat_content = file.read() # Read the chat history from the file
    
    history = jsonpickle.decode(chat_content) if chat_content else [] # Decode the chat content from JSON

    # parse the chat history and create a new dictionary with 'message' and 'role' keys
    messages = []
    for idx, content in enumerate(history):
        if idx in metadata and metadata[idx].get('skip', False): # metadata says skip this message
            continue

        for part in content._pb.parts: # Google's protobuf message parts
            # Create a dictionary with the message, role, and ID of the chat
            chat_dict = {"message": part.text, "role": content._pb.role, "id": idx}

            if idx in metadata and 'media_url' in metadata[idx]: # a file is attached to this message
                chat_dict['media_url'] = metadata[idx]['media_url']

            if not messages or chat_dict["id"] != messages[-1]["id"]: # to remove duplicates, if any
                messages.append(chat_dict)
    
    chat["history"] = messages # Add the chat history to response
    return chat


@router.get("/{chat_id}/next_slide")
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
    if not chat:
        raise HTTPException(status_code=404, detail="Chat not found.")
        
    course = CourseDB.fetch(course_id=chat["course_id"])
    if course["user_id"] != current_user["user_id"]:
        raise HTTPException(status_code=403, detail="Forbidden.")
    
    slides_furl = chat["slides_furl"] # get the slides file URL
    if not slides_furl:
        raise HTTPException(status_code=404, detail="This chat has no slides uploaded.")
    
    dumped_generator_path = get_generator_path(slides_furl) # path of the jsonpickle dumped generator object

    with open(dumped_generator_path, "r") as file:
        generator = jsonpickle.decode(file.read()) # read the dumped generator object from the file
    
    try:
        content_url, content = next(generator) # get the next slide content
        history_url = chat["history_url"] # Get the chat history file path
        metadata_path = get_chat_metadata_path(history_url) # chat metadata file path

        chat_content = None # If the file doesn't exist (i.e. it's the very first message), set chat_content to None
        if os.path.exists(history_url):
            with open(history_url, "r") as file:
                chat_content = file.read() # Read the chat history from the file

        history = jsonpickle.decode(chat_content) if chat_content else [] # Decode the chat content from JSON

        data1 = {"id": len(history), "skip": True} # Skip the "explain this slide" message, we don't want to show it in the chat
        data2 = {"id": len(history) + 1, "media_url": content_url} # (len+1) for we want to draw it like the slide is uploaded by the LLM
        
        if os.path.exists(metadata_path):
            with open(metadata_path, "r") as file:
                try:
                    data = json.load(file)
                    data.extend([data1, data2])
                except Exception as e:
                    raise HTTPException(status_code=500, detail=f"Internal server error occured: {str(e)}")
        else:
            data = [data1, data2]

        # Write the updated content back to the file
        with open(metadata_path, "w") as file:
            json.dump(data, file, indent=4)

        chat_model = genai.GenerativeModel("gemini-1.5-flash", system_instruction=SYSTEM_INSTRUCTION).start_chat(history=history) # Initialize the chat model with the chat history so far
        response = chat_model.send_message(["Explain this slide", content]) # TODO: streaming response

        with open(history_url, "w") as file:
            file.write(jsonpickle.encode(chat_model.history)) # Encode back the updated chat history
        
        with open(dumped_generator_path, "w") as file:
            file.write(jsonpickle.encode(generator)) # dump back the generator object to a string

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
    if course["user_id"] != current_user["user_id"]:
        raise HTTPException(status_code=403, detail="Forbidden.")

    file_content, prompt = None, text
    if file: # if file is uploaded to be sent to the LLM
        filename = file.filename
        name, extension = splitext(filename) # split name and extension, e.g. myfile.pdf -> (myfile, pdf)

        try:
            file = FileFactory()(file=file)
            
            hashed_fname = f"{generate_hash(name, strategy="timestamp")}.{extension}" # e.g. <hashed_name>_<actual_name>.pdf
            os.makedirs(f"{FILES_DIR}/chat_{chat_id}", exist_ok=True) # create a directory for the chat's files
            path = os.path.join(FILES_DIR, f"chat_{chat_id}", hashed_fname) # construct the file path

            # file.save(path) # save the file in file system
            file_content = file.content() # get the file from the file system

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
    chat = genai.GenerativeModel("gemini-1.5-flash", system_instruction=SYSTEM_INSTRUCTION).start_chat(history=history) # Initialize the chat model with the chat history so far

    # TODO: streaming response
    if file_content:
        metadata = get_chat_metadata_path(history_url) # chat metadata file path
        new_data = {"id": len(history), "media_url": path}
    
        if os.path.exists(metadata):
            with open(metadata, "r") as file:
                try:
                    data = json.load(file)
                    data.append(new_data)
                except Exception as e:
                    file.delete() # delete the file from the file system
                    raise HTTPException(status_code=500, detail=f"Internal server error occured: {str(e)}")
        else:
            data = [new_data]

        # Write the updated content back to the file
        with open(metadata, "w") as file:
            json.dump(data, file, indent=4)

        response = chat.send_message([prompt, file_content])
    else:
        response = chat.send_message(prompt)

    history = jsonpickle.encode(chat.history, True) # Encode back the updated chat history to JSON
    with open(history_url, "w") as file: # Save the updated chat history to the chat file
        file.write(history)

    return response.to_dict()