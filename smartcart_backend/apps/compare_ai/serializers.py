from rest_framework import serializers
from apps.products.serializers import ProductSerializer
from .models import CompareList

class CompareListSerializer(serializers.ModelSerializer):
    products = ProductSerializer(many=True, read_only=True)

    class Meta:
        model = CompareList
        fields = ["id", "products", "created_at"]
