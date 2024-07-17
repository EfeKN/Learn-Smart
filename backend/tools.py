import hashlib
import time
import uuid
import os
import dotenv
import shutil

from logger import logger, set_debug_mode
from database.connection import db_connection

dotenv.load_dotenv()
CHATS_DIR = os.getenv("CHATS_DIR", "./chat_histories")
FILES_DIR = os.getenv("FILES_DIR", "./files")

# Function to generate hash of a given string based on the strategy
def generate_hash(filename, strategy="sha256"):
    if strategy == "sha256":
        return hashlib.sha256(filename.encode()).hexdigest() # generate a SHA-256 hash
    elif strategy == "uuid":
        return uuid.uuid4().hex # generate a random UUID
    elif strategy == "timestamp":
        return f"{int(time.time())}_{filename}" # generate a timestamp based hash
    else:
        raise ValueError("Invalid strategy provided. Please use 'sha256' or 'uuid'.")


# re/create DB tables, chat histories, and files directories
def init(restart: bool = False, debug_mode: bool = False):
    if restart:
        logger.info("DEBUG:Dropping tables...")
        db_connection.drop_tables()

        logger.info("DEBUG:Deleting chat histories and files...")
        if os.path.exists(CHATS_DIR):
            shutil.rmtree(CHATS_DIR)

        if os.path.exists(FILES_DIR):
            shutil.rmtree(FILES_DIR)
            
    
    # Set the debug mode of the logger, if provided it reinitializes the logger with the new debug mode
    set_debug_mode(debug_mode)
        
    logger.info("Creating tables...")
    
    db_connection.create_tables()

    if not os.path.exists(CHATS_DIR):
        os.makedirs(CHATS_DIR)

    if not os.path.exists(FILES_DIR):
        os.makedirs(FILES_DIR)
    

# Split filename and extension
def splitext(filename: str):
    base_name = os.path.splitext(filename)[0].lower()
    extension = os.path.splitext(filename)[-1][1:].lower()
    return base_name, extension
    
# Validate file extension
def validate_file_extension(filename, valid_extensions: list[str]):
    ext = splitext(filename)[1].lower()
    return (ext in [extension.lower() for extension in valid_extensions]) # whether the extension is in the list