from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import CompareList, AIRecommendationLog
from .serializers import CompareListSerializer
from apps.products.models import Product
from .ai_logic import recommend_product


class AddToCompareAPIView(APIView):
    def post(self, request):
        user_id = request.data.get("user_id")
        product_ids = request.data.get("product_ids")

        compare, _ = CompareList.objects.get_or_create(user_id=user_id)
        products = Product.objects.filter(id__in=product_ids)
        compare.products.set(products)

        serializer = CompareListSerializer(compare)
        return Response(serializer.data, status=status.HTTP_200_OK)


class GetCompareAPIView(APIView):
    def get(self, request, user_id):
        compare = CompareList.objects.get(user_id=user_id)
        serializer = CompareListSerializer(compare)
        return Response(serializer.data, status=status.HTTP_200_OK)


class AIRecommendationAPIView(APIView):
    def post(self, request):
        user_id = request.data.get("user_id")
        preference = request.data.get("preference")

        compare = CompareList.objects.get(user_id=user_id)
        products = compare.products.all()

        best_product, explanation = recommend_product(products, preference)

        AIRecommendationLog.objects.create(
            user_id=user_id,
            preference=preference,
            recommended_product=best_product
        )

        return Response({
            "recommended_product": best_product.name,
            "explanation": explanation
        }, status=status.HTTP_200_OK)
