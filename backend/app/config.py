import os

from dotenv import load_dotenv

load_dotenv()


class Config:
    SECRET_KEY = os.getenv("SECRET_KEY", "dev-secret-key")
    APP_ENV = os.getenv("APP_ENV", "development")
    LOG_LEVEL = os.getenv("LOG_LEVEL", "INFO")
    SQLALCHEMY_DATABASE_URI = os.getenv("DATABASE_URL", "sqlite:///prometheus.db")
    SQLALCHEMY_TRACK_MODIFICATIONS = False
