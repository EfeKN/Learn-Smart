from pydantic import BaseModel

class CourseCreationRequest(BaseModel):
    """
    Represents a request to create a new course.

    Attributes:
        course_name (str): The name of the course.
        description (str): The description of the course.
    """
    course_name: str
    description: str
