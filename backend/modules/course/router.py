from typing import Optional
from fastapi import APIRouter, Depends, Form, HTTPException, File, UploadFile
import os, shutil

from middleware import authentication as auth
from middleware.filemanager import FileFactory
from database.dbmanager import CourseDB, ChatDB
from modules.course.schemas import CourseCreationRequest, CourseUpdateRequest
from modules.chat.util import *
from modules.course.util import *

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

    return course

@router.get("/chats/{course_id}")
async def get_chats(course_id: int, current_user: dict = Depends(auth.get_current_user)):
    """
    Get all chats for a course.
    
    Args:
        course_id (int): The ID of the course.
        current_user (User): The current authenticated user (used for authentication).

    Returns:
        list: A list of chat messages.
    """
    
    course = CourseDB.fetch(course_id=course_id)

    if not course:
        raise HTTPException(status_code=404, detail="Course not found.")

    # Check if the user is authorized to view the course
    # This can happen if the user tries to view a course they don't own
    if course["user_id"] != current_user["user_id"]:
        raise HTTPException(status_code=403, detail="Forbidden.")

    chats = ChatDB.fetch(course_id=course_id, all=True)
    return {"chats": [{"chat_id": chat["chat_id"], 
                       "title": chat["title"]} for chat in chats]} # return chat titles along with chat IDs
    

@router.post("/create")
async def create_course(course_name: str = Form(...), course_code: str = Form(...),
                        course_description: Optional[str] = Form(None), 
                        syllabus_file: UploadFile = File(None),
                        img_file: UploadFile = File(None),
                        current_user: dict = Depends(auth.get_current_user)):
    """
    Create a new course.

    Args:
        course (CourseCreationRequest): The course details.
        current_user (dict, optional): The current user. Defaults to Depends(auth.get_current_user).
    
    Returns:
        The created course.

    Raises:
        HTTPException: If there is an error creating the course.

    TODO:
        Syllabus uploads must go to LLM to generate weekly study plans.
        File structure must be updated too.
    """

    # pydantic input validation
    _ = CourseCreationRequest(course_name=course_name, course_code=course_code, course_description=course_description)
    try:
        img_ext = splitext(img_file.filename)[1]
        if img_ext not in ["png", "jpg", "jpeg"]:
            raise ValueError("Invalid image format. Please upload a PNG, JPG, or JPEG file.")
        course = CourseDB.create(name=course_name, course_description=course_description, 
                                code=course_code, user_id=current_user["user_id"])
        img_file = FileFactory()(img_file)
        course_img_path = get_course_img_path(course["course_id"])
        img_file.save(course_img_path, size=(256, 256))

        CourseDB.update(course_id=course["course_id"], icon_url=course_img_path)
        course["icon_url"] = course_img_path # update response with the image URL
        return course
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.delete("/{course_id}")
async def delete_course(course_id: int, current_user: dict = Depends(auth.get_current_user)):
    """
    Delete a course.

    Args:
        course_id (int): The ID of the course to delete.
        current_user (dict, optional): The current user. Defaults to Depends(auth.get_current_user).
    
    Returns:
        Success message.

    Raises:
        HTTPException: If there is an error deleting the course.
    """
    course = CourseDB.fetch(course_id=course_id)
    if not course:
        raise HTTPException(status_code=404, detail="Course not found.")

    if course["user_id"] != current_user["user_id"]:
        raise HTTPException(status_code=403, detail="Forbidden.")

    syllabus_url = course["syllabus_url"]
    if syllabus_url and os.path.exists(syllabus_url): os.remove(syllabus_url)
    icon_url = course["icon_url"]
    if icon_url and os.path.exists(icon_url): os.remove(icon_url)
    
    chats = ChatDB.delete(course_id=course_id, all=True) # delete all chats associated with the course
    CourseDB.delete(course_id=course_id) # delete the course
    for chat in chats:
        history_url, slides_furl = chat["history_url"], chat["slides_furl"]
        metadata_url = get_chat_metadata_path(history_url) if history_url else None
        generator_url = get_generator_path(slides_furl) if slides_furl else None
        items_folder = get_chat_folder_name(chat["chat_id"])

        if os.path.exists(history_url): os.remove(history_url)
        if items_folder and os.path.exists(items_folder): shutil.rmtree(items_folder)
        if slides_furl and os.path.exists(slides_furl): os.remove(slides_furl)
        if metadata_url and os.path.exists(metadata_url): os.remove(metadata_url)
        if generator_url and os.path.exists(generator_url): os.remove(generator_url)

        # TODO: delete quiz and flashcards too

    return {"message": "Course deleted successfully."}

@router.put("/{course_id}")
async def update_course(course_id: int, course_name: Optional[str] = Form(None),
                        course_code: Optional[str] = Form(None),
                        course_description: Optional[str] = Form(None),
                        update_description: bool = Form(False), # flag variable indicating whether to update the 
                                                                # course_description (necessary because course_description is
                                                                # optional and might be None)
                        syllabus_file: UploadFile = File(None),
                        img_file: UploadFile = File(None),
                        current_user: dict = Depends(auth.get_current_user)):
    """
    Update a course with the given course_id.

    Parameters:
    - course_id (int): The ID of the course to update.
    - course_name (Optional[str]): The updated name of the course (default: None).
    - course_code (Optional[str]): The updated code of the course (default: None).
    - course_description (Optional[str]): The updated course_description of the course (default: None).
    - syllabus_file (UploadFile): The updated syllabus file (default: None).
    - img_file (UploadFile): The updated image file (default: None).
    - current_user (dict): The current user's information.

    Returns:
    - Updated course information.

    Raises:
    - HTTPException(404): If the course is not found.
    - HTTPException(403): If the user is not authorized to update the course.
    - HTTPException(400): If there is a value error during the update process.

    TODO:
        Syllabus updates must go to LLM. syllabus_url field would change too.
    """

    # pydantic input validation
    _ = CourseUpdateRequest(course_name=course_name, course_code=course_code, course_description=course_description)

    course = CourseDB.fetch(course_id=course_id)
    if not course:
        raise HTTPException(status_code=404, detail="Course not found.")
    if course["user_id"] != current_user["user_id"]:
        raise HTTPException(status_code=403, detail="Forbidden.")

    try:
        course = CourseDB.update(course_id=course_id, course_name=course_name, 
                                 course_description=("" if course_description is None and update_description else course_description),
                                 course_code=course_code)
        return course
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))