from extensions import db
from datetime import datetime

class Payment(db.Model):
    __tablename__ = 'payments'
    id = db.Column(db.Integer, primary_key=True)
    tenant_id = db.Column(db.Integer, db.ForeignKey('tenants.id'), nullable=False)
    amount = db.Column(db.Numeric(10, 2), nullable=False)
    payment_type = db.Column(db.String(50), nullable=False)  # rent, water, electricity
    date_paid = db.Column(db.DateTime, default=datetime.utcnow)
    status = db.Column(db.String(20), default='completed')  # pending, completed

