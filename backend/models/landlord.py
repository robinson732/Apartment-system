from extensions import db

class Landlord(db.Model):
    __tablename__ = 'landlords'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(255), nullable=False)
    houses = db.relationship('House', backref='landlord', lazy='select')