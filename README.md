# Learn Smart

LearnSmart is a web application. Application designed to help students study their courses more effectively by intending to improve their grade output with its learning guide.  LearnSmart intends to offer holistic help for students across all facets of their academic progress through newly developed technologies, such as LLMs, and it is intended to be delivered with the future scope of mobile/tablet/metaverse. 

Scholarly articles, textbooks, class slides, syllabi, and other necessary study resources can be uploaded by students to the platform. LearnSmart provides thorough explanations using LLMs on a page-by-page basis or in the context of the entire content, where content can be slides, photos, reports, part of a book, and many more. This feature ensures that students can grasp the content thoroughly, enhancing their understanding and retention of course material. The platform includes interactive learning tools like flashcards and quizzes to reinforce learning and assess knowledge.

Additionally, LearnSmart offers customized study schedules tailored to each student’s preferences and syllabus schedule. These tools help students stay organized, manage their time effectively, and optimize their study practices. LearnSmart wants to add a question-answer system with a chatbot capable of answering course-related queries and assisting with study questions. 

In summary, LearnSmart provides essential tools and resources through a web application to support students' academic endeavors. By integrating lecture presentations, syllabi, and other study materials with advanced LLM capabilities and offering interactive learning tools, LearnSmart aims to enhance the efficiency and effectiveness of student learning.

## [Design Document](https://docs.google.com/document/d/1yBGZlqTAZuNbOirmpqzgfHXvrq4RJoF7VfEGX3V5clY/edit#heading=h.yr1n1w74g294)

## [Demo Video](https://drive.google.com/file/d/19HlsxClf0-VlwYFk9slciC6GaGLtUUIj/view)

## Build

1. Use node 20.15.0

2. Use python 3.12.4

3. You'll see a .env file inside the root folder of the project, populated with the below content. Adjust the ```DATABASE_URL``` field accordingly after setting up MySQL database.

    * `GOOGLE_API_KEY=AIzaSyCyyUXqPM4k1jSvObaTI9gu8zeZXQrndRs`
    * `DATABASE_URL=` (your MySQL DB URI, example: `mysql://\<username>:\<password>@localhost/<database_name>`)
    * `FILES_DIR="files"`
    * `CHATS_DIR="chat_histories"`
    * `LOGS_DIR="logs"`
    * `SECRET_KEY=bc8338b8fdbdde68a9f3b555b8994563e0ad1c47863f56f7b300ff96c54cd822`
    * `ALGORITHM=HS256`
    * `ACCESS_TOKEN_EXPIRE_MINUTES=30000`
    * `BACKEND_API_URL=http://localhost:8000/api`
    * `MODEL_VERSION="gemini-1.5-flash"`
    * `SYSTEM_PROMPT=You are an intelligent educational assistant helping students study their courses. Throughout the conversation with the student, maintain an appropriate language and engaging tone. Use precise language to explain concepts and be informative. You have the following responsibilities: 1. Student Interaction: Reject to answer questions unrelated to educational/course content because you're a teaching assistant, not a personal assistant, i.e. someone to chat with. 2. Slide-Based Instruction: Students may upload their course slides before the chat starts. In that case, you'll receive each of the slides one-by-one as the student wants to proceed. Provide detailed explanations and context for each slide, ensuring comprehension of the material. Present information in a logical sequence, ensuring continuity and relevance. 3. Quiz and Flashcard Generation: Students can ask you to create quizzes and flashcards from the current chat history or content provided before to reinforce learning and practice. In that case, you cannot refer to or draw information outside of the the content provided. Ensure the generated quizzes and flashcards align with the uploaded content and chat interactions. 4. Week by Week Study Plan Generation: Students will upload their syllabi. If you are given one, analyze their content and create a study plan on a weekly basis.`
    * `WEEKLY_STUDY_PLAN_PROMPT=You are given the contents of a file. Analyze the contents to determine if it is a syllabus. If the content does not constitute a syllabus, provide an error message explaining why you cannot generate a week-by-week study plan. If the content is a syllabus, generate a well-structured week-by-week study plan based solely on the provided information. Do not use or infer any data beyond what is given in the file. In cases where the syllabus is ambiguous or lacks detail, create a study plan to the best of your ability using the available information without assuming any specific number of weeks. If the number of weeks is not explicitly mentioned and cannot be inferred, create a general study plan, NOT on a weekly basis. You have to return a JSON response with the following scheme: {success: true, data: 'GENERATED STUDY PLAN'} or {success: false, data: 'FAILURE REASON'}. If successful, the data field of the response must be a single markdown-formatted string. Example: Successful: { success: true, data: '### Week-by-Week Study Plan\n\n**Week 1:**\n- Topic: Introduction to Computing\n- Activities: Read Chapter 1, Complete exercises 1.1 - 1.5\n\n**Week 2:**\n- Topic: Basics of Programming\n- Activities: Read Chapter 2, Practice basic programming problems\n\n**Week 3:**\n- Topic: Control Structures\n- Activities: Read Chapter 3, Write programs using loops and conditionals\n' }. Unsuccessful: { success: false, data: 'The provided content is not a syllabus. It includes personal notes and unrelated information, which is not suitable for creating a week-by-week study plan.' }`
    * `EXPLAIN_SLIDE_PROMPT=Generate an explanation of the given content.`
    * `FLASHCARD_PROMPT=Based on the provided chat history, generate three or four flashcards. Each flashcard should consist of a concept and its explanation. The flashcards must capture the context and all key concepts discussed in the chat. If there are any concepts that the student appeared to struggle with, ensure they are included in the flashcards. Do not use or infer any information beyond what is given in the chat history. Return a JSON response with the following scheme: If flashcard generation is successfull: {success: true, data: [{topic: 'topic 1', explanation: 'explanation for topic 1'}, {topic: 'topic 2', explanation: 'explanation for topic 2'}, ...] }. If unsuccessfull: {success: false, data: 'FAILURE REASON'}. Insert appropriate content (flashcards topic and explanations, or failure reason) in the corresponding fields in JSON. Examples: Successfull: { success: true, data: [{topic: 'Process Scheduling', explanation: 'Process scheduling is the method by which an operating system allocates CPU time to various processes. It aims to maximize CPU usage, ensure fair resource distribution, minimize waiting times, and improve response times. There are two main types: preemptive (where processes can be interrupted) and non-preemptive (where processes run to completion). Key concepts include CPU bursts, I/O bursts, and context switches, with performance measured by throughput, turnaround time, waiting time, and response time.'}] }. Unsuccessfull: {success: false, data: 'The chat history does not contain enough relevant information to generate flashcards.'}.`
    * `QUIZZES_PROMPT=Based on the provided chat history, generate a well-formatted quiz. The quiz must capture the context and all key concepts discussed in the chat. You cannot refer to or draw information outside of the context of the content provided. You have to return a JSON response with the following scheme: {success: true, data: 'GENERATED QUIZ'} or {success: false, data: 'FAILURE REASON'}. Insert appropriate content (quiz or failure reason) in the corresponding fields in JSON. If successfull, the data field of the response must be a single markdown-formatted string.`

## Frontend

1. `cd frontend`

2. `npm install`

3. `npm run dev`

## Backend

1. `python -m venv backend`

2. * `backend\Scripts\activate` for Windows
   * `source backend/bin/activate` for Unix

3. `cd backend && mkdir files chat_histories` for Unix
    `cd backend && mkdir files && chat_histories`. for Windows. This is where the file uploads are stored (for now).

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

2. Add the following string to the .env file: `MYSQL_ROOT_PASSWORD=<your_password>` you can change the password as you wish

3. Make sure docker is running and run the following command line: `docker compose up`.

4. If you make changes to the database do: `docker compose rm` and `docker volume rm learn-smart_db` then do `docker compose build` then `docker compose up`. You may need to stop before removing.

5. If you get an error indicating that port 3306 is being used, stop mysql in your machine or change the port in the docker-compose.yml as `3307:3306`.
