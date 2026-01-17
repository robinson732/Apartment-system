from flask import Blueprint, jsonify, request
from models.payment import Payment
from models.tenant import Tenant
from extensions import db

payments_bp = Blueprint("payments", __name__, url_prefix="/api/payments")


@payments_bp.route("/", methods=["GET"])
def get_all_payments():
    """Get all payments for payment history"""
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


@payments_bp.route("/tenant/<int:tenant_id>", methods=["GET"])
def get_tenant_payments(tenant_id):
    """Get payment history for a specific tenant"""
    try:
        payments = Payment.query.filter_by(tenant_id=tenant_id).all()
        
        payments_data = [
            {
                "id": p.id,
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
