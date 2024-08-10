import google.generativeai as genai
from modules.course.util import *
import json
import logging

logging.basicConfig(level=logging.DEBUG)

def create_study_plan(course_syllabus_file_content, course_id):
    try:
        logging.debug("Initializing the model...")
        model = genai.GenerativeModel(MODEL_VERSION, system_instruction=SYSTEM_PROMPT,
                                      generation_config={"response_mime_type": "application/json"})

        logging.debug("Generating content...")
        response = model.generate_content([WEEKLY_STUDY_PLAN_PROMPT, course_syllabus_file_content]).text
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
    course_syllabus_file_content = """
    Course Title: Introduction to Computer Science
    Course ID: CS101
    Instructor: Dr. Jane Doe

    Course Description:
    This course provides an introduction to the fundamental concepts of computer science, including programming, algorithms, and data structures. Students will gain hands-on experience through various projects and assignments.

    Course Objectives:
    1. Understand the basics of programming in Python.
    2. Learn how to design and implement algorithms.
    3. Gain experience with data structures such as lists, stacks, and queues.
    4. Develop problem-solving skills through coding challenges.

    Course Schedule:
    Week 1: Introduction to Python
    Week 2: Control Structures and Functions
    Week 3: Data Structures - Lists and Tuples
    Week 4: Data Structures - Dictionaries and Sets
    Week 5: Algorithms - Sorting and Searching
    Week 6: Midterm Exam
    Week 7: Advanced Topics in Algorithms
    Week 8: Project Development
    Week 9: Project Presentation
    Week 10: Final Exam

    Assessment:
    - Midterm Exam: 30%
    - Final Exam: 40%
    - Project: 30%

    Resources:
    - Textbook: "Introduction to Computer Science" by John Smith
    - Online Tutorials: Codecademy, Coursera
    - Office Hours: Monday and Wednesday, 2-4 PM
    """
    course_id = "CS101" 
    success, study_plan_path = create_study_plan(course_syllabus_file_content, course_id)
    print(f"Success: {success}, Study Plan Path: {study_plan_path}")
