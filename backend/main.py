from fastapi.responses import StreamingResponse
import asyncio
from dotenv import load_dotenv
import os
import google.generativeai as genai
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

load_dotenv()

google_api_key = os.getenv('GOOGLE_API_KEY')

genai.configure(api_key=os.getenv('GOOGLE_API_KEY'))
model = genai.GenerativeModel('gemini-pro')

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Update this to the specific origins you want to allow
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def generate_response(prompt="hello how can you help me"):
    response = model.generate_content(prompt, stream=True)
    for chunk in response:
        print(chunk.text)

        yield chunk.text

@app.post("/api/generate")
async def generate(request: Request):
    data = await request.json()
    prompt = data.get('prompt')

    return StreamingResponse(generate_response(prompt), media_type="text/event-stream")

@app.get("/api")
async def read_root():
    return {"message": "Hello World"}

