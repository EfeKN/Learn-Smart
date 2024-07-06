import os
from dotenv import load_dotenv
import google.generativeai as genai

load_dotenv()

CHATS_DIR = os.getenv("CHATS_DIR") # The directory where the chat history files are stored

GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")
genai.configure(api_key=GOOGLE_API_KEY)