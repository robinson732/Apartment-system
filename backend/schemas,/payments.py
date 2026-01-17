from extensions import ma

class PaymentSchema(ma.Schema):
    class Meta:
        fields = (
            "id",
            "tenant_id",
            "amount",
            "payment_type",
            "status",
            "created_at"
        )
        ordered = True
