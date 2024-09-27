from dotenv import load_dotenv
import os

from flask_cors import CORS

# import redis

load_dotenv()


class Config:
    SECRET_KEY = os.getenv("SECRET_KEY")
    SQLALCHEMY_DATABASE_URI = os.getenv("DEV_DATABASE")
    # SQLALCHEMY_DATABASE_URI = os.getenv("PRODUCTION_DATABASE")
    JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY")
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SQLALCHEMY_ECHO = True
    CORS_HEADERS = "Content-Type"
