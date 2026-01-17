from flask import Blueprint, jsonify, request
from models.tenant import Tenant
from models.payment import Payment
from models.house import House
from extensions import db
from utils.auth import decode_token

landlord_bp = Blueprint("landlords", __name__, url_prefix="/api/landlords")

# Rent pricing table
RENT_PRICES = {
    "Bedsitter": 5000,
    "1-Bedroom": 8000,
    "2-Bedroom": 12000,
    "Studio": 6000,
    "3-Bedroom": 15000,
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


@landlord_bp.route("/tenants", methods=["GET"])
def get_all_tenants():
    """Get all tenants with payment details"""
    payload = get_user_from_token()

    if not payload or payload["role"] != "landlord":
        return jsonify({"error": "Unauthorized"}), 403

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


@landlord_bp.route("/tenants/<int:tenant_id>", methods=["DELETE"])
def delete_tenant(tenant_id):
    """Delete a tenant (when they move out)"""
    payload = get_user_from_token()

    if not payload or payload["role"] != "landlord":
        return jsonify({"error": "Unauthorized"}), 403

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


@landlord_bp.route("/dashboard", methods=["GET"])
def get_dashboard_summary():
    """Get landlord dashboard summary stats"""
    payload = get_user_from_token()

    if not payload or payload["role"] != "landlord":
        return jsonify({"error": "Unauthorized"}), 403

    try:
        tenants = Tenant.query.all()
        
        total_collected = 0
        total_outstanding = 0
        total_possible = 0
        paid_count = 0
        
        for tenant in tenants:
            rent = RENT_PRICES.get(tenant.room_type, 0)
            total_due = rent + UTILITY_BILLS["water"] + UTILITY_BILLS["electricity"]
            total_possible += total_due
            
            # Calculate collected
            collected = 0
            if tenant.rent_paid:
                collected += rent
            if tenant.water_bill_paid:
                collected += UTILITY_BILLS["water"]
            if tenant.electricity_bill_paid:
                collected += UTILITY_BILLS["electricity"]
            
            total_collected += collected
            
            # Calculate outstanding
            outstanding = total_due - collected
            total_outstanding += outstanding
            
            if outstanding == 0:
                paid_count += 1
        
        collection_rate = 0
        if total_possible > 0:
            collection_rate = int((total_collected / total_possible) * 100)
        
        return jsonify({
            "total_tenants": len(tenants),
            "paid_tenants": paid_count,
            "unpaid_tenants": len(tenants) - paid_count,
            "total_collected": total_collected,
            "total_outstanding": total_outstanding,
            "total_possible": total_possible,
            "collection_rate": collection_rate,
            "avg_balance": int(total_outstanding / len(tenants)) if len(tenants) > 0 else 0
        }), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@landlord_bp.route("/payments", methods=["GET"])
def get_payments_summary():
    """Get payment history summary"""
    payload = get_user_from_token()

    if not payload or payload["role"] != "landlord":
        return jsonify({"error": "Unauthorized"}), 403

    try:
        payments = Payment.query.all()
        
        payments_data = [
            {
                "id": p.id,
                "tenant_id": p.tenant_id,
                "tenant_name": p.tenant.name if p.tenant else "Unknown",
                "amount": float(p.amount),
                "payment_type": p.payment_type,
                "status": p.status,
                "date_paid": p.date_paid.isoformat() if p.date_paid else None
            }
            for p in payments
        ]
        
        return jsonify(payments_data), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@landlord_bp.route("/me", methods=["GET"])
def my_dashboard():
    payload = get_user_from_token()

    if not payload or payload["role"] != "landlord":
        return jsonify({"error": "Unauthorized"}), 403

    return jsonify({
        "id": payload["user_id"],
        "role": "landlord"
    })

