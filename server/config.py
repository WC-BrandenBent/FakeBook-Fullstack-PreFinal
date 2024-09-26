from dotenv import load_dotenv
import os

from flask_cors import CORS

# import redis

load_dotenv()


class Config:
    SECRET_KEY = os.getenv("SECRET_KEY")
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SQLALCHEMY_ECHO = True
    SQLALCHEMY_DATABASE_URI = "mariadb+pymysql://root:@localhost:3306/socialmediadb"
    CORS_HEADERS = "Content-Type"
    JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY")
