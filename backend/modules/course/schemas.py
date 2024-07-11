from pydantic import BaseModel
from typing import Optional

class CourseCreationRequest(BaseModel):
    """
    Represents a request to create a new course.

    Attributes:
        course_name (str): The name of the course. # Example: Operating Systems
        description (str): The description of the course.
        course_code (str): The title of the course. # Example: CS 342
    """
    course_name: str
    course_code: str
    description: Optional[str] = None
