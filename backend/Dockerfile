FROM python:latest

WORKDIR /app

COPY . .

RUN mkdir -p ./upload_files ./chats

RUN pip install --no-cache-dir -r requirements.txt

EXPOSE 8000

CMD ["uvicorn", "main:app", "--reload", "--host", "0.0.0.0", "--port", "8000"]