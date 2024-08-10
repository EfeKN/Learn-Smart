import google.generativeai as genai
from modules.course.util import *
import json
import logging

logging.basicConfig(level=logging.DEBUG)

def create_flashcards(course_flashcard_file_content, course_id):
    try:
        logging.debug("Initializing the model...")
        model = genai.GenerativeModel(MODEL_VERSION, system_instruction=SYSTEM_PROMPT,
                                      generation_config={"response_mime_type": "application/json"})

        logging.debug("Generating content...")
        response = model.generate_content([FLASHCARD_PROMPT, course_flashcard_file_content]).text
        logging.debug(f"Response: {response}")

        logging.debug("Parsing JSON response...")
        response_dict = json.loads(response)
        logging.debug(f"Response dict: {response_dict}")

        logging.debug("Getting study plan path...")
        study_plan_path = get_study_plan_path(course_id)
        logging.debug(f"Study plan path: {study_plan_path}")

        logging.debug("Extracting success and data...")
        success = response_dict.get("success")
        data = response_dict.get("data")
        logging.debug(f"Success: {success}, Data: {data}")

        logging.debug("Writing data to file...")
        with open(study_plan_path, 'w') as file:
            file.write(data)

        logging.debug("Returning success and study plan path...")
        return success, study_plan_path

    except Exception as e:
        logging.error(f"An error occurred: {e}")
        return False, None

if __name__ == "__main__":
    course_flashcard_file_content = """
    Course Title: Introduction to Computer Science
    Course ID: CS101
    Instructor: Dr. Jane Doe

    Flashcard Topics:
    1. Basic Syntax of Python
    2. Control Structures (if, else, loops)
    3. Functions and Modules
    4. Data Structures (lists, tuples, dictionaries)
    5. Algorithms (sorting, searching)
    6. Object-Oriented Programming
    7. File I/O
    8. Exception Handling
    9. Regular Expressions
    10. Introduction to Data Science
    """
    course_id = "CS101"
    success, study_plan_path = create_flashcards(course_flashcard_file_content, course_id)
    print(f"Success: {success}, Study Plan Path: {study_plan_path}")
