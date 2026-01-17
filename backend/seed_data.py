"""
Seed script to populate database with sample data
Run from backend directory: python seed_data.py
"""

from app import app, db
from models.landlord import Landlord
from models.house import House
from models.tenant import Tenant
from utils.auth import hash_password

def seed_data():
    with app.app_context():
        # Clear existing data (optional)
        print("Clearing existing data...")
        Tenant.query.delete()
        House.query.delete()
        Landlord.query.delete()
        db.session.commit()

        # Create landlord
        print("Creating landlord...")
        landlord = Landlord(
            name="John Doe",
            email="johndoe@example.com",
            password=hash_password("password123")
        )
        db.session.add(landlord)
        db.session.commit()

        # Create houses
        print("Creating houses...")
        house1 = House(
            number="101",
            price=15000,
            type="residential",
            landlord_id=landlord.id
        )
        house2 = House(
            number="102",
            price=20000,
            type="residential",
            landlord_id=landlord.id
        )
        house3 = House(
            number="103",
            price=12000,
            type="residential",
            landlord_id=landlord.id
        )
        db.session.add_all([house1, house2, house3])
        db.session.commit()

        # Create tenants with room preferences
        print("Creating tenants with room preferences...")
        tenants_data = [
            {
                "name": "Alice Johnson",
                "email": "alice@example.com",
                "password": "password123",
                "room_type": "1bedroom",
                "house_id": house1.id
            },
            {
                "name": "Bob Smith",
                "email": "bob@example.com",
                "password": "password123",
                "room_type": "2bedroom",
                "house_id": house2.id
            },
            {
                "name": "Carol Davis",
                "email": "carol@example.com",
                "password": "password123",
                "room_type": "bedsitter",
                "house_id": house1.id
            },
            {
                "name": "David Wilson",
                "email": "david@example.com",
                "password": "password123",
                "room_type": "studio",
                "house_id": house3.id
            },
            {
                "name": "Emma Brown",
                "email": "emma@example.com",
                "password": "password123",
                "room_type": "3bedroom",
                "house_id": house2.id
            },
            {
                "name": "Frank Miller",
                "email": "frank@example.com",
                "password": "password123",
                "room_type": "1bedroom",
                "house_id": None  # Not assigned to a house yet
            },
            {
                "name": "Grace Lee",
                "email": "grace@example.com",
                "password": "password123",
                "room_type": "2bedroom",
                "house_id": None  # Not assigned to a house yet
            }
        ]

        for tenant_data in tenants_data:
            tenant = Tenant(
                name=tenant_data["name"],
                email=tenant_data["email"],
                password=hash_password(tenant_data["password"]),
                room_type=tenant_data["room_type"],
                house_id=tenant_data.get("house_id")
            )
            db.session.add(tenant)

        db.session.commit()
        print("✅ Data seeded successfully!")
        print(f"   - 1 Landlord created")
        print(f"   - 3 Houses created")
        print(f"   - 7 Tenants created with room preferences")

if __name__ == "__main__":
    seed_data()
