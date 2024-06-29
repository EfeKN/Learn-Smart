# Creation Date: 26.06.2024

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from database import Base, engine
from modules.user.router import router as users_router
from modules.genai.router import router as genai_router
from controllers.router import router as files_router


Base.metadata.create_all(bind=engine)  # create the tables in the database

app = FastAPI()  # create the FastAPI app

# Add CORS middleware to allow cross-origin requests
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

routers = [users_router, genai_router, files_router]

# Include the router in the app with the "/api" prefix for all routes
for router in routers:
    app.include_router(router, prefix="/api")
