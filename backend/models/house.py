from extensions import db

class House(db.Model):
    __tablename__ = 'houses'
    id = db.Column(db.Integer, primary_key=True)
    number = db.Column(db.String(50), nullable=False)
    price = db.Column(db.Numeric, nullable=False)
    type = db.Column(db.String(50), nullable=False)
    landlord_id = db.Column(db.Integer, db.ForeignKey('landlords.id'), nullable=False)
    tenants = db.relationship('Tenant', backref='house', uselist=True, lazy='select')