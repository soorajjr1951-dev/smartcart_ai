from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Review
from .serializers import ReviewSerializer

class ProductReviewsAPIView(APIView):
    def get(self, request, product_id):
        reviews = Review.objects.filter(product_id=product_id).order_by("-created_at")
        return Response(ReviewSerializer(reviews, many=True).data)

    def post(self, request, product_id):
        user_id = request.data.get("user_id")

        if not user_id:
            return Response({"error": "user_id is required"}, status=status.HTTP_400_BAD_REQUEST)

        serializer = ReviewSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(product_id=product_id, user_id=user_id)
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
