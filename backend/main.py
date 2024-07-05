# Creation Date: 26.06.2024

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from modules.user.router import router as users_router
from modules.genai.router import router as genai_router
from modules.course.router import router as course_router
from modules.chat.router import router as chat_router
from controllers.router import router as files_router
from tools import create_tables, setup

from logger import logger

__DROP__ = False # flag variable to drop tables, must be set when the database schema changes
                # reset to False after the first run, otherwise the database will be reset every
                # time the server starts

app = FastAPI()  # create the FastAPI app

if __DROP__:
    logger.info("Recreating tables...")

create_tables(drop=__DROP__)  # re/create the database tables
setup()  # setup the environment

# Add CORS middleware to allow cross-origin requests
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

routers = [users_router, genai_router, files_router, course_router, chat_router]

# Include the router in the app with the "/api" prefix for all routes
for router in routers:
    app.include_router(router, prefix="/api")

logger.info("FastAPI backend started successfully")