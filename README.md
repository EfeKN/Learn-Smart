# Learn Smart

# [Design Document](https://docs.google.com/document/d/1yBGZlqTAZuNbOirmpqzgfHXvrq4RJoF7VfEGX3V5clY/edit#heading=h.yr1n1w74g294)

# [High Level Architecture](https://app.diagrams.net/#G1Xt1IQutJySTuM8h47ZfxEwFGxCOxfnQR#%7B%22pageId%22%3A%22WgwmZhFJbQ_Y9UpnWUmw%22%7D)

# [Software Architecture Domain Taslak](https://docs.google.com/document/d/1h_BqT49P4DqD8VypANlMgdfN1WFtN8ua21FydvSJa9M/edit)

# [Software Application Domain Chart](https://app.diagrams.net/#G1dG1N9txHlM9Nq-ffLHRjDzezJM5rkmxY#%7B%22pageId%22%3A%22b5b7bab2-c9e2-2cf4-8b2a-24fd1a2a6d21%22%7D)

# [Mail](https://docs.google.com/document/d/1mu62y1eWLkKjPer3fI6g34gRVuPORGVI4WnqlDdkhW0/edit)

# [Discussion Map](https://docs.google.com/document/d/1OhDog1Vck4J2s1bXXQ-9e6eDtEOZcHduP9GsoGeX4aM/edit?usp=sharing)

# [Roadmap](https://docs.google.com/document/d/1RZOr8Z2wiJ9KE8IRMvFYCXnN--1jCvMNxdqoBKGoteU/edit?usp=sharing)

# Build

Use node 20.15.0

Use python 3.12.4

# Frontend

1. Create a .env file inside the `frontend` folder, then populate it with the following string: `BACKEND_API_URL=http://localhost:8000/api`

1. `npm install`

1. `npm run dev`

# Backend

1. Create a .env file inside the `backend/` folder, then populate it with the `GOOGLE_API_KEY` (provided in Whatsapp) and `DATABASE_URL` (your MySQL DB URI) variables.

1. `python -m venv backend`

1. `backend\Scripts\activate`

1. `cd backend`

1. `pip install -r requirements.txt`

1. `uvicorn main:app --reload`

# Clean

`.\clean.ps1` Windows