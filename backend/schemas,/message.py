from extensions import ma

class MessageSchema(ma.Schema):
    class Meta:
        fields = (
            "id",
            "sender",
            "content",
            "created_at"
        )
        ordered = True
