# Learn Smart

## [Features & Research](https://docs.google.com/document/d/1n-9d7_FFlAlxyvOE3r7Jz7EtxRcYxnx6OD2oDc-vsy4/edit)

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
    * `SYSTEM_PROMPT=` (provided in discord)
    * `WEEKLY_STUDY_PLAN_PROMPT=` (provided in discord)
    * `EXPLAIN_SLIDE_PROMPT=` (provided in discord)
    * `FLASHCARD_PROMPT=` (provided in discord)
    * `QUIZZES_PROMPT=` (provided in discord)

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
