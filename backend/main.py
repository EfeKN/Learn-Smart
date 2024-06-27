# Creation Date: 26.06.2024

from fastapi.responses import StreamingResponse
from dotenv import load_dotenv
import os
import google.generativeai as genai
from fastapi import FastAPI, Request, HTTPException, Depends, APIRouter
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from models import Base, engine, SessionLocal
import util, schemas

""" 
Explanation about Depends function:

Example: Depends(get_db)
FastAPI will handle the dependency, ensuring that get_db is called and its result is 
passed to the function before executing the main logic.
"""

load_dotenv()
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")
DATABASE_URL = os.getenv("DATABASE_URL")

genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))
model = genai.GenerativeModel("gemini-pro")

Base.metadata.create_all(bind=engine)  # create the tables in the database


# Returns a database session
def get_db():
    """
    Returns a database session.

    Yields:
        db: The database session.

    """

    # The SessionLocal instance is a factory for creating new Session objects.
    db = SessionLocal()

    # The yield statement suspends function’s execution and sends a value back to the caller,
    # but retains enough state to enable function to resume where it is left off.
    try:
        yield db  # return the database session
    finally:
        db.close()  # close the database session


# Generate a response based on the given prompt
def generate_response(prompt="hello how can you help me"):
    """
    Generates a response based on the given prompt.

    Args:
        prompt (str): The prompt to generate a response for. Defaults to "hello how can you help me".

    Yields:
        str: The generated response chunk.

    """

    # Generate the response
    response = model.generate_content(prompt, stream=True)

    # Yield each chunk of the response
    for chunk in response:
        print(chunk.text)  # print the chunk

        yield chunk.text


app = FastAPI()  # create the FastAPI app
router = APIRouter()  # create a router

# Add CORS middleware to allow cross-origin requests
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


### Define the routes for the API endpoints


# Define the route for user login
@router.post("/login", response_model=schemas.UserSchema)
def login(user: schemas.UserSchema, db: Session = Depends(get_db)):
    """
    Endpoint for user login.

    Args:
        user (schemas.UserSchema): The user object containing the login credentials.
        db (Session, optional): The database session. Defaults to Depends(get_db).

    Returns:
        schemas.UserSchema: The user object if login is successful.

    Raises:
        HTTPException: If the username is not found or the password is incorrect.
    """

    # Get the user from the database by name
    db_user = util.get_user_by_name(db, name=user.name)

    # Check if the user exists and the password is correct
    if db_user is None:
        raise HTTPException(status_code=400, detail="Username not found")
    if db_user.password != user.password:
        raise HTTPException(status_code=400, detail="Incorrect password")
    return db_user


# Define the route for creating a new user account
# TODO: Why is the endpoint named "users"?
@router.post("/users", response_model=schemas.UserSchema)
def create_user(user: schemas.UserSchema, db: Session = Depends(get_db)):
    """
    Create a new user.

    Args:
        user (schemas.UserSchema): The user data to be created.
        db (Session, optional): The database session. Defaults to Depends(get_db).

    Returns:
        schemas.UserSchema: The created user data.

    Raises:
        HTTPException: If the username is already registered.
    """

    # Get the user from the database by name
    db_user = util.get_user_by_name(db, name=user.name)

    # Check if the user already exists
    if db_user:
        raise HTTPException(status_code=400, detail="Username already registered")

    # create the user if it does not exist
    return util.create_user(db=db, user=user)


# Define the route for generating a response
# TODO: Why is the endpoint named "generate"? It may be generate_response?
@router.post("/generate")
async def generate(request: Request):
    """
    Generate a (streaming) response based on the given prompt.

    Args:
        request (Request): The HTTP request object.

    Returns:
        StreamingResponse: A streaming response with the generated response.
    """

    # Get the prompt from the request data
    data = await request.json()  # read the request data
    prompt = data.get("prompt")  # get the prompt from the data

    # Return a streaming response with the generated response chunks based on the prompt
    return StreamingResponse(generate_response(prompt), media_type="text/event-stream")


# Dummy route for testing
# TODO: Remove this route or replace it with a meaningful one
@router.get("/")
async def read_root():
    return {"message": "Hello World"}


# Define the ediz's route, a dummy route
# TODO: Remove this route or replace it with a meaningful one
@router.post("/ediz")
async def read_ediz():
    print("Ediz is the best!")
    return {"message": "Ediz is the best!"}


# Include the router in the app with the "/api" prefix for all routes
app.include_router(router, prefix="/api")
