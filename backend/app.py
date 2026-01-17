from flask import Flask
from flask_cors import CORS
from flask_migrate import Migrate
from config import Config
from extensions import db, ma
from models import Tenant, Landlord, House, Payment, Message
from routes import auth_bp, tenant_bp, landlord_bp, payments_bp

app = Flask(__name__)
app.config.from_object(Config)

# Initialize extensions
db.init_app(app)
ma.init_app(app)
migrate = Migrate(app, db)

# Enable CORS
CORS(app)

# Register blueprints
app.register_blueprint(auth_bp)
app.register_blueprint(tenant_bp)
app.register_blueprint(landlord_bp)
app.register_blueprint(payments_bp)

if __name__ == "__main__":
    app.run(debug=True, port=5000)