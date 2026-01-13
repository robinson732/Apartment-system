from extensions import db

class Tenant(db.Model):
    __tablename__ = "tenants"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), nullable=False)
    house_id = db.Column(db.Integer, db.ForeignKey("houses.id"), nullable=False)

    rent_paid = db.Column(db.Boolean, default=False)
    water_paid = db.Column(db.Boolean, default=False)
    electricity_paid = db.Column(db.Boolean, default=False)

    payments = db.relationship("Payment", backref="tenant")
    messages = db.relationship("Message", backref="tenant")
