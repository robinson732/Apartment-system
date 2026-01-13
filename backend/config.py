# config.py
import os

class Config:
    # PostgreSQL database URI
    SQLALCHEMY_DATABASE_URI = "postgresql://postgres:kimani@localhost:5432/apartments_db"
    
    # Secret key for signing JWT tokens and session cookies
    SECRET_KEY = "ed29c4f2cf8e67a98b175cf08a5040fb3d0dbbf87302e14af7ca7124103b5e9a"
    
    # Disable modification tracking to avoid unnecessary warnings
    SQLALCHEMY_TRACK_MODIFICATIONS = False
