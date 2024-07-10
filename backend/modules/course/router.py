from fastapi import APIRouter, Depends, HTTPException

from controllers import authentication as auth
from database.dbmanager import CourseDB, ChatDB
from modules.course.schemas import CourseCreationRequest

router = APIRouter(prefix="/course", tags=["Course"])

@router.get("/{course_id}")
async def get_course(course_id: int, current_user: dict = Depends(auth.get_current_user)):
    """
    Get course details by course ID.

    Args:
        course_id (int): The ID of the course to retrieve.
        current_user (User): The current authenticated user (used for authentication).

    Returns:
        dict: A dictionary containing the course details.
    """
    course = CourseDB.fetch(course_id=course_id)

    if not course:
        raise HTTPException(status_code=404, detail="Course not found.")

    # Check if the user is authorized to view the course
    # This can happen if the user tries to view a course they don't own
    if course["user_id"] != current_user["user_id"]:
        raise HTTPException(status_code=403, detail="Forbidden.")

    chats = ChatDB.fetch(course_id=course_id, all=True)
    course["chats"] = [{chat["chat_id"]: chat["title"]} for chat in chats] # add chat titles to course

    return course

@router.post("/create")
async def create_course(course: CourseCreationRequest, current_user: dict = Depends(auth.get_current_user)):
    """
    Create a new course.

    Args:
        course (CourseCreationRequest): The course details.
        current_user (dict, optional): The current user. Defaults to Depends(auth.get_current_user).

    Returns:
        The created course.

    Raises:
        HTTPException: If there is an error creating the course.
    """
    try:
        course = CourseDB.create(name=course.course_name, description=course.description, 
                                user_id=current_user["user_id"])
        return course
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

    