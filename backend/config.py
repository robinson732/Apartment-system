# config.py
import os

class Config:
    # PostgreSQL database URI
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL', "postgresql://postgres:kimani@localhost:5432/apartments_db")
    
    # Secret key for signing JWT tokens and session cookies
    SECRET_KEY = os.environ.get('SECRET_KEY', "ed29c4f2cf8e67a98b175cf08a5040fb3d0dbbf87302e14af7ca7124103b5e9a")
    
    # Disable modification tracking to avoid unnecessary warnings
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    
    # Landlord access code for registration
    LANDLORD_ACCESS_CODE = os.environ.get('LANDLORD_ACCESS_CODE', "landlord123")
    
    # Hardcoded landlord credentials
    LANDLORD_EMAIL = os.environ.get('LANDLORD_EMAIL', "johndoe@example.com")
    LANDLORD_PASSWORD = os.environ.get('LANDLORD_PASSWORD', "password123")
