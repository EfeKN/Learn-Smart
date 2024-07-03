import hashlib
import os
import dotenv

from database.connection import db_connection

# Function to generate SHA-256 hash of a given string
def generate_hash(filename):
    return hashlib.sha256(filename.encode()).hexdigest()


# Invoke the db_connection to create tables
def create_tables(drop: bool = False):
    if drop:
        db_connection.drop_tables()
    db_connection.create_tables()


def setup():

    dotenv.load_dotenv()

    CHATS_DIR = os.getenv("CHATS_DIR", "./chats")
    FILES_PATH = os.getenv("FILES_PATH", "./upload_files")

    if not os.path.exists(CHATS_DIR):
        os.makedirs(CHATS_DIR)

    if not os.path.exists(FILES_PATH):
        os.makedirs(FILES_PATH)