from extensions import db

class Payment(db.Model):
    __tablename__ = "payments"

    id = db.Column(db.Integer, primary_key=True)
    tenant_id = db.Column(db.Integer, db.ForeignKey("tenants.id"), nullable=False)
    type = db.Column(db.String(50), nullable=False)  # rent, water, electricity
    amount = db.Column(db.Numeric, nullable=False)
    date_paid = db.Column(db.DateTime, server_default=db.func.now())
