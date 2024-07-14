import google.generativeai as genai

from middleware import FILES_DIR
from . import WEEKLY_STUDY_PLAN_PROMPT

def get_course_icon_path(course_id):
    return f"{FILES_DIR}/course_{course_id}/course_img.png"

def get_course_syllabus_path(course_id):
    return f"{FILES_DIR}/course_{course_id}/syllabus.pdf"

def get_study_plan_path(course_id):
    return f"{FILES_DIR}/course_{course_id}/study_plan.md"

def create_study_plan(syllabus_file_content, course_id):
    model = genai.GenerativeModel("gemini-1.5-flash")
    response = model.generate_content([WEEKLY_STUDY_PLAN_PROMPT, syllabus_file_content]).text
    study_plan_path = get_study_plan_path(course_id)
    with open(study_plan_path, 'w') as file:
        file.write(response)
    return study_plan_path