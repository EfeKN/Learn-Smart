import hashlib
import time
import uuid
import os
import dotenv

from logger import logger
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


# Invoke the db_connection to create tables
def create_tables(drop: bool = False):
    if drop:
        logger.info("Dropping tables...")
        db_connection.drop_tables()
    db_connection.create_tables()


def setup():
    if not os.path.exists(CHATS_DIR):
        os.makedirs(CHATS_DIR)

    if not os.path.exists(FILES_DIR):
        os.makedirs(FILES_DIR)


# Split filename and extension
def splitext(filename: str):
    base_name = os.path.splitext(filename)[0].lower()
    extension = os.path.splitext(filename)[-1][1:].lower()
    return base_name, extension
    