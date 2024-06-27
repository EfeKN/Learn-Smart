# Creation Date: 28.06.2024

from sqlalchemy import Column, Integer, String, create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from dotenv import load_dotenv
import os

load_dotenv()
DATABASE_URL = os.getenv("DATABASE_URL")

# Database setup
engine = create_engine(DATABASE_URL)  # Database connection
SessionLocal = sessionmaker(
    autocommit=False, autoflush=False, bind=engine
)  # Session factory
Base = declarative_base()  # Base class for ORM models


# User model
# This model represents a user in the database.
class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(50), unique=True, index=True, nullable=False)
    password = Column(String(100), nullable=False)
