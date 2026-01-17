from extensions import ma

class HouseSchema(ma.Schema):
    class Meta:
        fields = (
            "id",
            "house_number",
            "house_type",
            "rent",
            "is_occupied",
            "landlord_id"
        )
        ordered = True
