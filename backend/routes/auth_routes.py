from flask import Blueprint, request, jsonify, current_app
from models.tenant import Tenant
from models.landlord import Landlord
from extensions import db
from utils.auth import hash_password, verify_password, create_token

# Hardcoded landlord credentials
LANDLORD_EMAIL = "johndoe@example.com"
LANDLORD_PASSWORD_HASH = None  # Will be set on app startup

auth_bp = Blueprint("auth", __name__, url_prefix="/auth")


@auth_bp.route("/signup", methods=["POST"])
def signup():
    data = request.get_json()
    
    if not data or not data.get("email") or not data.get("password"):
        return jsonify({"error": "Email and password are required"}), 400
    
    email = data.get("email")
    password = data.get("password")
    name = data.get("name")
    role = data.get("role", "tenant")
    access_code = data.get("accessCode")
    
    # Check if user is trying to signup as landlord
    if role == "landlord":
        # Only allow the hardcoded landlord email
        if email != LANDLORD_EMAIL:
            return jsonify({"error": "Invalid landlord email. Only authorized landlord email is accepted."}), 403
        
        # Verify access code
        if access_code != "landlord123":
            return jsonify({"error": "Invalid access code"}), 403
        
        # Check if landlord already exists
        existing = Landlord.query.filter_by(email=email).first()
        if existing:
            return jsonify({"error": "Landlord already registered"}), 400
        
        hashed_password = hash_password(password)
        landlord = Landlord(name="John Doe", email=email, password=hashed_password)
        db.session.add(landlord)
        db.session.commit()
        
        token = create_token(landlord.id, "landlord")
        return jsonify({"token": token, "user": {"id": landlord.id, "role": "landlord"}}), 201
    else:
        # Tenant signup
        existing = Tenant.query.filter_by(email=email).first()
        if existing:
            return jsonify({"error": "Email already registered"}), 400
        
        if not name:
            return jsonify({"error": "Name is required for tenant signup"}), 400
        
        hashed_password = hash_password(password)
        tenant = Tenant(name=name, email=email, password=hashed_password)
        db.session.add(tenant)
        db.session.commit()
        
        token = create_token(tenant.id, "tenant")
        return jsonify({"token": token, "user": {"id": tenant.id, "role": "tenant"}}), 201


@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    
    if not data or not data.get("email") or not data.get("password"):
        return jsonify({"error": "Email and password are required"}), 400
    
    email = data.get("email")
    password = data.get("password")
    
    # Try to find tenant first
    tenant = Tenant.query.filter_by(email=email).first()
    if tenant and verify_password(password, tenant.password):
        token = create_token(tenant.id, "tenant")
        return jsonify({"token": token, "user": {"id": tenant.id, "role": "tenant"}}), 200
    
    # Try to find landlord
    landlord = Landlord.query.filter_by(email=email).first()
    if landlord and verify_password(password, landlord.password):
        token = create_token(landlord.id, "landlord")
        return jsonify({"token": token, "user": {"id": landlord.id, "role": "landlord"}}), 200
    
    return jsonify({"error": "Invalid email or password"}), 401
