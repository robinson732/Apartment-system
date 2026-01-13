from extensions import db

class House(db.Model):
    __tablename__ = "houses"

    id = db.Column(db.Integer, primary_key=True)
    number = db.Column(db.String(20), nullable=False)
    price = db.Column(db.Numeric, nullable=False)
    type = db.Column(db.String(50), nullable=False)  # bedsitter, 1BR, 2BR

    landlord_id = db.Column(db.Integer, db.ForeignKey("landlords.id"), nullable=False)
    tenants = db.relationship("Tenant", backref="house")
