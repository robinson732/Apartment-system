from extensions import ma

class LandlordSchema(ma.Schema):
    class Meta:
        fields = (
            "id",
            "name",
            "email",
            "created_at"
        )
        ordered = True
