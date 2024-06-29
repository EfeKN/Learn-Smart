from sqlalchemy import create_engine
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


def get_db():
    """
    Returns a database session.

    Yields:
        db: The database session.

    """

    db = SessionLocal() # factory for creating new Session objects

    try:
        yield db  # return the database session
    finally:
        db.close()  # close the database session after the request is finished