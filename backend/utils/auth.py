# auth.py
from flask import current_app
from werkzeug.security import generate_password_hash, check_password_hash
import jwt
from datetime import datetime, timedelta

# Hash a plain password (used during signup)
def hash_password(password: str) -> str:
    return generate_password_hash(password)

# Verify a password against the hash (used during login)
def verify_password(password: str, hashed: str) -> bool:
    return check_password_hash(hashed, password)

# Generate a JWT token for a user
def create_token(user_id: int, role: str, expires_minutes: int = 60) -> str:
    payload = {
        "user_id": user_id,
        "role": role,
        "exp": datetime.utcnow() + timedelta(minutes=expires_minutes)
    }
    token = jwt.encode(payload, current_app.config["SECRET_KEY"], algorithm="HS256")
    return token

# Decode and verify a JWT token
def decode_token(token: str) -> dict:
    try:
        payload = jwt.decode(token, current_app.config["SECRET_KEY"], algorithms=["HS256"])
        return payload
    except jwt.ExpiredSignatureError:
        raise Exception("Token has expired")
    except jwt.InvalidTokenError:
        raise Exception("Invalid token")
