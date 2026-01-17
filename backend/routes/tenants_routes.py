from flask import Blueprint, jsonify, request
from models.tenant import Tenant
from models.payment import Payment
from extensions import db
from utils.auth import decode_token
from datetime import datetime

tenant_bp = Blueprint("tenants", __name__, url_prefix="/api/tenants")

# Rent pricing table
RENT_PRICES = {
    "Bedsitter": 5000,
    "1-Bedroom": 8000,
    "2-Bedroom": 12000,
}

UTILITY_BILLS = {
    "water": 800,
    "electricity": 1200,
}


def get_user_from_token():
    auth = request.headers.get("Authorization")
    if not auth:
        return None
    token = auth.split(" ")[1]
    return decode_token(token)


@tenant_bp.route("/", methods=["GET"])
def get_all_tenants():
    """Get all tenants - no auth required for frontend display"""
    try:
        tenants = Tenant.query.all()
        tenants_data = []
        
        for tenant in tenants:
            # Calculate balance
            balance = 0
            if not tenant.rent_paid:
                balance += RENT_PRICES.get(tenant.room_type, 0)
            if not tenant.water_bill_paid:
                balance += UTILITY_BILLS["water"]
            if not tenant.electricity_bill_paid:
                balance += UTILITY_BILLS["electricity"]
            
            tenants_data.append({
                "id": tenant.id,
                "name": tenant.name,
                "email": tenant.email,
                "room_type": tenant.room_type or "Not Selected",
                "house_id": tenant.house_id,
                "rent_paid": tenant.rent_paid,
                "water_bill_paid": tenant.water_bill_paid,
                "electricity_bill_paid": tenant.electricity_bill_paid,
                "balance": balance,
                "total_due": RENT_PRICES.get(tenant.room_type, 0) + 
                            UTILITY_BILLS["water"] + 
                            UTILITY_BILLS["electricity"]
            })
        
        return jsonify(tenants_data), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@tenant_bp.route("<int:tenant_id>", methods=["DELETE"])
def delete_tenant(tenant_id):
    """Delete a tenant (for landlord when tenant moves out)"""
    try:
        tenant = Tenant.query.get(tenant_id)
        if not tenant:
            return jsonify({"error": "Tenant not found"}), 404
        
        # Delete associated payments
        Payment.query.filter_by(tenant_id=tenant_id).delete()
        
        # Delete tenant
        db.session.delete(tenant)
        db.session.commit()
        
        return jsonify({"message": "Tenant removed successfully"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500


@tenant_bp.route("/me", methods=["GET"])
def my_dashboard():
    payload = get_user_from_token()

    if not payload or payload["role"] != "tenant":
        return jsonify({"error": "Unauthorized"}), 403

    tenant = Tenant.query.get(payload["user_id"])

    return jsonify({
        "id": tenant.id,
        "name": tenant.name,
        "house_id": tenant.house_id,
        "rent_paid": tenant.rent_paid,
        "water_paid": tenant.water_paid,
        "electricity_paid": tenant.electricity_paid
    })


@tenant_bp.route("/select-room", methods=["POST"])
def select_room():
    payload = get_user_from_token()

    if not payload or payload["role"] != "tenant":
        return jsonify({"error": "Unauthorized"}), 403

    tenant = Tenant.query.get(payload["user_id"])
    data = request.get_json()

    room_type = data.get("room_type")

    if not room_type:
        return jsonify({"error": "Room type is required"}), 400

    # Validate room type
    valid_rooms = list(RENT_PRICES.keys())
    if room_type not in valid_rooms:
        return jsonify({"error": f"Invalid room type. Choose from: {', '.join(valid_rooms)}"}), 400

    tenant.room_type = room_type
    db.session.commit()

    return jsonify({
        "message": f"Room type {room_type} selected successfully",
        "room_type": tenant.room_type
    }), 200


@tenant_bp.route("/pay/<int:tenant_id>", methods=["PUT"])
def pay_bill(tenant_id):
    """Process payment for a specific bill type"""
    try:
        tenant = Tenant.query.get(tenant_id)
        if not tenant:
            return jsonify({"error": "Tenant not found"}), 404
        
        data = request.get_json()
        bill_type = data.get("type")
        amount = data.get("amount")
        
        if not bill_type or not amount:
            return jsonify({"error": "Bill type and amount are required"}), 400
        
        # Update tenant payment status
        if bill_type == "rent":
            tenant.rent_paid = True
        elif bill_type == "water":
            tenant.water_bill_paid = True
        elif bill_type == "electricity":
            tenant.electricity_bill_paid = True
        else:
            return jsonify({"error": "Invalid bill type"}), 400
        
        # Create payment record for history
        payment = Payment(
            tenant_id=tenant_id,
            amount=amount,
            payment_type=bill_type,
            status="completed",
            date_paid=datetime.utcnow()
        )
        
        db.session.add(payment)
        db.session.commit()
        
        # Calculate new balance
        balance = 0
        if not tenant.rent_paid:
            balance += RENT_PRICES.get(tenant.room_type, 0)
        if not tenant.water_bill_paid:
            balance += UTILITY_BILLS["water"]
        if not tenant.electricity_bill_paid:
            balance += UTILITY_BILLS["electricity"]
        
        return jsonify({
            "message": f"{bill_type} payment completed successfully",
            "balance": balance,
            "tenant": {
                "id": tenant.id,
                "name": tenant.name,
                "rent_paid": tenant.rent_paid,
                "water_bill_paid": tenant.water_bill_paid,
                "electricity_bill_paid": tenant.electricity_bill_paid
            }
        }), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500
