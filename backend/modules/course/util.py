from middleware import FILES_DIR

def get_course_img_path(course_id):
    return f"{FILES_DIR}/course_{course_id}/course_img.png"
