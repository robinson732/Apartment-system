from extensions import db

class Message(db.Model):
    __tablename__ = "messages"

    id = db.Column(db.Integer, primary_key=True)
    tenant_id = db.Column(db.Integer, db.ForeignKey("tenants.id"), nullable=True)
    title = db.Column(db.String(255))
    content = db.Column(db.Text)
    date_sent = db.Column(db.DateTime, server_default=db.func.now())
