from typing import Optional
from fastapi import APIRouter, Depends, Form, HTTPException, File, UploadFile
import google.generativeai as genai
import os, shutil

from middleware import authentication as auth
from middleware.filemanager import FileFactory
from database.dbmanager import CourseDB, ChatDB
from modules.course.schemas import CourseCreationRequest, CourseUpdateRequest
from modules.chat.util import *
from modules.course.util import *
from . import WEEKLY_STUDY_PLAN_PROMPT

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
                        icon_file: UploadFile = File(None),
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
    icon_ext = (splitext(icon_file.filename)[1] if icon_file else None)
    syllabus_ext = (splitext(syllabus_file.filename)[1] if syllabus_file else None)
    
    course_icon_path, syllabus_path, study_plan_path = None, None, None
    try:
        if icon_ext and icon_ext not in ["png", "jpg", "jpeg"]:
            raise ValueError("Invalid image format. Please upload a PNG, JPG, or JPEG file.")
        if syllabus_ext and syllabus_ext not in ["pdf", "docx"]:
            raise ValueError("Invalid syllabus format. Please upload a PDF or a DOCX file.")
        
        course = CourseDB.create(course_name=course_name, course_description=course_description, 
                                course_code=course_code, user_id=current_user["user_id"])
        if icon_file:
            icon_file = FileFactory()(icon_file)
            course_icon_path = get_course_icon_path(course["course_id"])
            icon_file.save(course_icon_path, size=(256, 256))
            course["icon_url"] = course_icon_path # update response dict. with the image URL

        if syllabus_file:
            syllabus_file = FileFactory()(syllabus_file)
            syllabus_path = get_course_syllabus_path(course["course_id"])
            syllabus_file.save(syllabus_path)
            course["syllabus_url"] = syllabus_path # update response dict. with the syllabus URL

            # send the syllabus to LLM for weekly study plan generation
            model = genai.GenerativeModel("gemini-1.5-flash")
            
            response = model.generate_content([WEEKLY_STUDY_PLAN_PROMPT, syllabus_file.content()]).text
            study_plan_path = get_study_plan_path(course["course_id"])

            with open(study_plan_path, 'w') as file:
                file.write(response)
            course["study_plan_url"] = study_plan_path # update response dict. with the study plan URL

        CourseDB.update(course_id=course["course_id"], icon_url=course_icon_path, syllabus_url=syllabus_path,
                        study_plan_url=study_plan_path)
        return course
    except ValueError as e:
        # Rollback changes
        if course_icon_path: FileFactory()(path=course_icon_path).delete()
        if syllabus_path: FileFactory()(path=syllabus_path).delete()
        if study_plan_path: FileFactory()(path=study_plan_path).delete()
        
        CourseDB.delete(course_id=course["course_id"])
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
    if syllabus_url: FileFactory()(path=syllabus_url).delete()
    icon_url = course["icon_url"]
    if icon_url: FileFactory()(path=icon_url).delete()
    study_plan_url = course["study_plan_url"]
    if study_plan_url: FileFactory()(path=study_plan_url).delete()
    
    chats = ChatDB.delete(course_id=course_id, all=True) # delete all chats associated with the course
    CourseDB.delete(course_id=course_id) # delete the course
    for chat in chats:
        history_url, slides_furl = chat["history_url"], chat["slides_furl"]
        metadata_url = get_chat_metadata_path(history_url) if history_url else None
        generator_url = get_generator_path(slides_furl) if slides_furl else None
        items_folder = get_chat_folder_path(chat["chat_id"])

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
                        update_syllabus: bool = Form(False), # flag variable indicating whether to update the syllabus
                        icon_file: UploadFile = File(None),
                        update_icon: bool = Form(False), # flag variable indicating whether to update the image
                        current_user: dict = Depends(auth.get_current_user)):
    """
    Update a course with the given course_id.

    Parameters:
    - course_id (int): The ID of the course to update.
    - course_name (Optional[str]): The updated name of the course (default: None).
    - course_code (Optional[str]): The updated code of the course (default: None).
    - course_description (Optional[str]): The updated course_description of the course (default: None).
    - syllabus_file (UploadFile): The updated syllabus file (default: None).
    - icon_file (UploadFile): The updated image file (default: None).
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

    new_icon_path, new_syllabus_path, new_study_plan_path = None, None, None
    if update_icon and icon_file is None:
        FileFactory()(path=course["icon_url"]).delete() # delete old image
    elif update_icon and icon_file:
        icon_ext = splitext(icon_file.filename)[1]
        if icon_ext not in ["png", "jpg", "jpeg"]:
            raise HTTPException(status_code=400, detail="Invalid image format. Please upload a PNG, JPG, or JPEG file.")
        FileFactory()(path=course["icon_url"]).delete() # delete old image

        new_icon_path = get_course_icon_path(course_id)
        new_icon_file = FileFactory()(icon_file)
        new_icon_file.save(new_icon_path, size=(256, 256))

    if update_syllabus and syllabus_file is None:
        FileFactory()(path=course["syllabus_url"]).delete() # delete old syllabus
    elif update_syllabus and syllabus_file:
        syllabus_ext = splitext(syllabus_file.filename)[1]
        if syllabus_ext not in ["pdf", "docx"]:
            raise HTTPException(status_code=400, detail="Invalid syllabus format. Please upload a PDF or a DOCX file.")
        FileFactory()(path=course["syllabus_url"]).delete() # delete old syllabus
        FileFactory()(path=course["study_plan_url"]).delete() # delete old study plan

        new_syllabus_path = get_course_syllabus_path(course_id)
        new_study_plan_path = get_study_plan_path(course_id)

        syllabus_file = FileFactory()(syllabus_file)
        syllabus_file.save(new_syllabus_path)

        # send the new syllabus to LLM for weekly study plan generation
        model = genai.GenerativeModel("gemini-1.5-flash")
        response = model.generate_content([WEEKLY_STUDY_PLAN_PROMPT, syllabus_file.content()]).text
        with open(new_study_plan_path, 'w') as file:
            file.write(response)

    try:
        course = CourseDB.update(course_id=course_id, course_name=course_name, course_code=course_code,
                                 course_description=("" if course_description is None and update_description else course_description),
                                 icon_url=("" if icon_file is None and update_icon else new_icon_path),
                                 syllabus_url=("" if syllabus_file is None and update_syllabus else new_syllabus_path),
                                 study_plan_url=("" if syllabus_file is None and update_syllabus else new_study_plan_path)
                                )
        return course
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))