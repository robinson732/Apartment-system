from datetime import timedelta

from flask import current_app
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import (
    JWTManager,
    create_access_token,
    get_jwt_identity,
    jwt_required,
)

from models.landlord import Landlord

jwt = JWTManager()


def init_jwt(app):
    """Initialize JWTManager on the Flask app.

    Ensures `JWT_SECRET_KEY` is set (falls back to `SECRET_KEY`) and
    sets a reasonable default expiry for access tokens.
    """
    app.config.setdefault("JWT_SECRET_KEY", app.config.get("SECRET_KEY") or "change-me")
    app.config.setdefault("JWT_ACCESS_TOKEN_EXPIRES", timedelta(hours=8))
    jwt.init_app(app)


def hash_password(password: str) -> str:
    """Return a secure hash for the given password."""
    return generate_password_hash(password)


def verify_password(hashed: str, password: str) -> bool:
    """Verify a plaintext password against its hash."""
    return check_password_hash(hashed, password)


def create_access_token_for_landlord(landlord: Landlord) -> str:
    """Create a JWT access token for a `Landlord` instance.

    The token identity is a small dict with `id`, `role` and `name` so
    routes can quickly inspect role and identity.
    """
    identity = {"id": landlord.id, "role": "landlord", "name": landlord.name}
    return create_access_token(identity=identity)


def get_current_landlord():
    """Return the `Landlord` for the current JWT identity or `None`.

    Use inside request handlers protected with `@jwt_required()`.
    """
    identity = get_jwt_identity()
    if not identity:
        return None
    # support both dict identity (as created above) or raw id
    landlord_id = identity.get("id") if isinstance(identity, dict) else identity
    try:
        return Landlord.query.get(landlord_id)
    except Exception:
        return None


# Re-export for convenience in routes
__all__ = [
    "jwt",
    "init_jwt",
    "hash_password",
    "verify_password",
    "create_access_token_for_landlord",
    "get_current_landlord",
    "jwt_required",
]
from models.tenant import Tenant


def create_access_token_for_tenant(tenant: Tenant) -> str:
    identity = {
