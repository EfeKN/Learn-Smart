from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from dotenv import load_dotenv
import os

load_dotenv()
DATABASE_URL = os.getenv("DATABASE_URL")

# Database connection with connection pooling:
# the pool_size parameter sets the number of connections to be kept open in the pool.
# the max_overflow parameter sets the number of connections that can be opened beyond the pool_size.
# the pool_timeout parameter sets the number of seconds to wait for a connection from the pool.
engine = create_engine(
    DATABASE_URL,
    pool_size=20,
    max_overflow=10,
    pool_timeout=30
)

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