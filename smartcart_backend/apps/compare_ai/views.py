from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from .models import CompareList
from apps.products.models import Product

from django.conf import settings
from groq import Groq


class AddToCompareAPIView(APIView):
    def post(self, request):
        user_id = request.data.get("user_id")
        product_ids = request.data.get("product_ids", [])

        if not user_id or not product_ids:
            return Response(
                {"error": "user_id and product_ids are required"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        compare_list, _ = CompareList.objects.get_or_create(user_id=user_id)

        products = Product.objects.filter(id__in=product_ids)
        for p in products:
            compare_list.products.add(p)

        # limit compare to max 4 products
        if compare_list.products.count() > 4:
            extra = compare_list.products.all()[4:]
            compare_list.products.remove(*extra)

        return Response({"message": "Added to compare list ✅"}, status=200)


class GetCompareAPIView(APIView):
    def get(self, request, user_id):
        compare_list = CompareList.objects.filter(user_id=user_id).first()

        if not compare_list:
            return Response({"products": []}, status=200)

        products = compare_list.products.all()

        data = []
        for p in products:
            data.append(
                {
                    "id": p.id,
                    "name": p.name,
                    "brand": p.brand,
                    "category": p.category,
                    "price": str(p.price),
                    "stock": p.stock,
                    "stock_status": getattr(p, "stock_status", "IN_STOCK"),
                    "description": p.description,
                    "specs": p.specs or {},
                    "images": [{"image": img.image.url} for img in p.images.all()],
                }
            )

        return Response({"products": data}, status=200)


class AIRecommendationAPIView(APIView):
    def post(self, request):
        user_id = request.data.get("user_id")
        preference = request.data.get("preference", "value")

        compare_list = CompareList.objects.filter(user_id=user_id).first()

        if not compare_list or compare_list.products.count() < 2:
            return Response(
                {"error": "Add at least 2 products to compare"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        products = compare_list.products.all()

        product_data = []
        for p in products:
            product_data.append(
                {
                    "id": p.id,
                    "name": p.name,
                    "brand": p.brand,
                    "category": p.category,
                    "price": str(p.price),
                    "specs": p.specs or {},
                }
            )

        if not getattr(settings, "GROQ_API_KEY", None):
            return Response(
                {"error": "GROQ_API_KEY missing in settings.py"},
                status=500,
            )

        client = Groq(api_key=settings.GROQ_API_KEY)

        system_prompt = """
You are SmartCart AI recommendation engine.
Pick the BEST product from the list given based on user preference.

Return JSON strictly in this format:
{
  "recommended_product": "Product Name",
  "explanation": ["point1", "point2", "point3", "point4"]
}

Preferences:
gaming -> prioritize GPU, RAM
coding -> prioritize CPU, RAM, SSD
student -> battery, value
value -> best specs for price
"""

        user_prompt = f"""
Preference: {preference}
Products: {product_data}
"""

        res = client.chat.completions.create(
            model="llama-3.1-8b-instant",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt},
            ],
            temperature=0.2,
        )

        text = res.choices[0].message.content

        import json
        try:
            parsed = json.loads(text)
            return Response(parsed, status=200)
        except:
            return Response(
                {
                    "recommended_product": "AI could not parse JSON",
                    "explanation": [text],
                },
                status=200,
            )
