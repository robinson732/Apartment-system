from extensions import db

class Landlord(db.Model):
    __tablename__ = "landlords"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), nullable=False)
    password = db.Column(db.String(255), nullable=False)  # hashed password

    houses = db.relationship("House", backref="landlord")
