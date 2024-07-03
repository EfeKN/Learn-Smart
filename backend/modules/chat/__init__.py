import os
from dotenv import load_dotenv

load_dotenv()

CHATS_DIR = os.getenv("CHATS_DIR") # The directory where the chat history files are stored