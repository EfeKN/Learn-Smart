WEEKLY_STUDY_PLAN_PROMPT = """
    Given the file and its contents, generate a well-formatted weekly study plan. If the syllabus contains \
    irrelevant information, give an appropriate error message indicating the issue and the reason you \
    can't provide a weekly study plan, then ask the user to upload a new syllabus file. Otherwise, \
    provide a weekly study plan based on the syllabus file. Unless the content of the file is irrelevant, \
    you cannot reject to provide a weekly study plan.
    """