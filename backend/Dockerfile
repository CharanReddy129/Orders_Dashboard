FROM python:3.12-slim
WORKDIR /app/backend

COPY requirements.txt ./requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 8080
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

CMD [ "gunicorn", "-w", "4", "-b", "0.0.0.0:8080","run:app" ]
