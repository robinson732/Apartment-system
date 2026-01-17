from extensions import db

class Tenant(db.Model):
    __tablename__ = 'tenants'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(255), nullable=False)
    room_type = db.Column(db.String(100), nullable=True)  # e.g., "1bedroom", "2bedroom", "bedsitter"
    house_id = db.Column(db.Integer, db.ForeignKey('houses.id'), nullable=True)
    rent_paid = db.Column(db.Boolean, default=False)
    water_bill_paid = db.Column(db.Boolean, default=False)
    electricity_bill_paid = db.Column(db.Boolean, default=False)
    payments = db.relationship('Payment', backref='tenant', lazy='select')
    messages = db.relationship('Message', backref='tenant', lazy='select')