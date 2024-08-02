FROM python:3.12.4

WORKDIR /backend

COPY . .

RUN mkdir -p ./files ./chat_histories

RUN pip install --no-cache-dir -r requirements.txt

EXPOSE 8000

CMD ["uvicorn", "main:app", "--reload", "--host", "0.0.0.0", "--port", "8000"]