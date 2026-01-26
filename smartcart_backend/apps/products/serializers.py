from rest_framework import serializers
from .models import Product, ProductImage, Review

class ProductImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductImage
        fields = ["image"]


class ReviewSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source="user.username", read_only=True)

    class Meta:
        model = Review
        fields = ["id", "product", "user", "username", "rating", "comment", "created_at"]
        read_only_fields = ["user", "product", "created_at"]


class ProductSerializer(serializers.ModelSerializer):
    images = ProductImageSerializer(many=True, read_only=True)
    avg_rating = serializers.SerializerMethodField()
    review_count = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = [
            "id",
            "images",
            "name",
            "brand",
            "category",
            "price",
            "stock",
            "stock_status",
            "description",
            "specs",
            "avg_rating",
            "review_count",
            "created_at",
        ]

    def get_avg_rating(self, obj):
        reviews = obj.reviews.all()
        if not reviews.exists():
            return 0
        return round(sum([r.rating for r in reviews]) / reviews.count(), 1)

    def get_review_count(self, obj):
        return obj.reviews.count()
