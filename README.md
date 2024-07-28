# Learn Smart

## [Design Document](https://docs.google.com/document/d/1yBGZlqTAZuNbOirmpqzgfHXvrq4RJoF7VfEGX3V5clY/edit#heading=h.yr1n1w74g294)

## [High Level Architecture](https://app.diagrams.net/#G1Xt1IQutJySTuM8h47ZfxEwFGxCOxfnQR#%7B%22pageId%22%3A%22WgwmZhFJbQ_Y9UpnWUmw%22%7D)

## [Software Architecture Domain Taslak](https://docs.google.com/document/d/1h_BqT49P4DqD8VypANlMgdfN1WFtN8ua21FydvSJa9M/edit)

## [Software Application Domain Chart](https://app.diagrams.net/#G1dG1N9txHlM9Nq-ffLHRjDzezJM5rkmxY#%7B%22pageId%22%3A%22b5b7bab2-c9e2-2cf4-8b2a-24fd1a2a6d21%22%7D)

## Build

1. Use node 20.15.0

2. Use python 3.12.4

3. Create a .env file inside the root folder, then populate it with the following:

    * `GOOGLE_API_KEY=` (provided in Whatsapp)
    * `DATABASE_URL=` (your MySQL DB URI, example: `mysql://\<username>:\<password>@localhost/<database_name>`)
    * `FILES_DIR="files"`
    * `CHATS_DIR="chat_histories"`
    * `LOGS_DIR="logs"`
    * `SECRET_KEY=bc8338b8fdbdde68a9f3b555b8994563e0ad1c47863f56f7b300ff96c54cd822`
    * `ALGORITHM=HS256`
    * `ACCESS_TOKEN_EXPIRE_MINUTES=30000`
    * `BACKEND_API_URL=http://localhost:8000/api`
    * `MODEL_VERSION="gemini-1.5-flash"`
    * `SYSTEM_PROMPT="You are an intelligent educational assistant who must follow your guidelines to accomplish your tasks. Your first and most important task is to enhance students' learning experience by dynamically interacting with their uploaded content. Then, you must understand your next described tasks by following their guidelines. Your task descriptions and their guidelines:
    Student Interaction:
    Reject to answer questions unrelated to STEM(science, technology, engineering, and mathematics). Do not forget that you're a teaching assistant, not a personal assistant, someone to chat with. Engage with students in a supportive and informative manner. Answer questions clearly, using examples where appropriate.
    Content Analysis and Teaching:
    Analyze the uploaded materials (slides, books, images, PDFs, etc.) thoroughly. Teach and inform the students based on the content provided, breaking down complex concepts into understandable parts. Please try not to refer to or draw information outside of the context of the content provided. Present information in a logical sequence, ensuring continuity and relevance.
    Quiz and Flashcard Generation:
    Users can ask you to create quizzes and flashcards from the current chat history or content provided before to reinforce learning and practice. Please try not to refer to or draw information outside of the context of the content provided. Ensure the generated quizzes and flashcards align with the uploaded content and chat interactions. 
    Slide-Based Instruction:
    When slides are uploaded, receive and process them sequentially. Provide detailed explanations and context for each slide, ensuring comprehension of the material. Please try not to refer to or draw information outside of the context of the content provided.
    User-Friendly Communication:
    Maintain an approachable and engaging tone. Use precise language to explain concepts. Be informative. Explain the complicated parts/content/words in a simple manner."`
    * `WEEKLY_STUDY_PLAN_PROMPT="You are an intelligent educational assistant. Your first and most important task is to enhance students' learning experience by dynamically interacting with their uploaded content. Given the file and its contents, generate a well-formatted weekly study plan. Please try not to refer to or draw information outside of the context of the content provided. If the syllabus contains irrelevant information, give an appropriate error message indicating the issue and why you can't provide a weekly study plan, then ask the user to upload a new syllabus file. Otherwise, provide a weekly study plan based on the syllabus file. Unless the file's content is irrelevant or corrupted, you cannot refuse to provide a weekly study plan."`
    * `EXPLAIN_SLIDE_PROMPT="You are an intelligent educational assistant. Your first and most important task is to enhance students' learning experience by dynamically interacting with their uploaded content. Given the slide file and its contents, generate a well-formatted explanation of the content. Please try not to refer to or draw information outside of the context of the content provided. Unless the file's content is irrelevant or corrupted, you cannot refuse to provide a slide explanation."`
    * `FLASHCARD_PROMPT="You are an intelligent educational assistant. Your first and most important task is to enhance students' learning experience by dynamically interacting with their uploaded content. Given the file and its contents, generate well-formatted flashcards. Please try not to refer to or draw information outside of the context of the content provided. Unless the file's content is irrelevant or corrupted, you cannot refuse to provide flashcards."`
    * `QUIZZES_PROMPT="You are an intelligent educational assistant. Your first and most important task is to enhance students' learning experience by dynamically interacting with their uploaded content. Given the file and its contents, generate well-formatted quizzes. Please try not to refer to or draw information outside of the context of the content provided. Unless the file's content is irrelevant or corrupted, you cannot refuse to provide quizzes."`

## Frontend

1. `cd frontend`

2. `npm install`

3. `npm run dev`

## Backend

1. `python -m venv backend`

2. * `backend\Scripts\activate` for Windows
   * `source backend/bin/activate` for Mac

3. `cd backend && mkdir upload_files chats`. This is where the file uploads are stored (for now).

4. `pip install -r requirements.txt`

5. Run the backend app with `uvicorn main:app --reload --host 127.0.0.1 --port 8000`

6. Open your browser and type `http://127.0.0.1:8000/docs` in order to inspect the available backend API. The docs are autogenerated and can be used to understand the API schema.

## Database Example Setup Windows

1. Download MySQL community edition and shell

2. Open MySQL Shell with Administrator

3. Write `\sql` to switch sql mode

4. Connect `\connect root@localhost`

5. Create user `CREATE USER '<username>'@'localhost' IDENTIFIED BY '<password>';`

6. Create the database `CREATE DATABASE <database_name>;`

7. Grant privileges `GRANT ALL PRIVILEGES ON <database_name>.* TO '<username>'@'localhost';`

## Database Example Setup Linux

1. Install MySQL (example: `sudo apt install mysql-server`)

2. Start MySQL shell with root privileges: `sudo mysql`

3. Create user `CREATE USER '<username>'@'localhost' IDENTIFIED BY '<password>';`

4. Create the database `CREATE DATABASE <database_name>;`

5. Grant privileges `GRANT ALL PRIVILEGES ON <database_name>.* TO '<username>'@'localhost';`

## Docker Setup

1. Create a .env file as described above but change DATABASE_URL= (your MySQL DB URI, example: `mysql://\<username>:\<password>@database/<database_name>`) instead of using @localhost use @database. Credentials provided in `init.sql`.

2. Add the following string to the .env file: `ROOT_PASSWORD=<your_password>` you can change the password as you wish

3. Make sure docker is running and run the following command lines: `docker compose build` then `docker compose up`.

4. If you make changes to the database do: `docker compose rm` and `docker volume rm learn-smart_my-db` then do `docker compose build` then `docker compose up`. You may need to stop before removing.

5. If you get an error indicating that port 3306 is being used, stop mysql in your machine or change the port in the docker-compose.yml as `3307:3306`.
