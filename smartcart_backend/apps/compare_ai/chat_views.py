import re
from rest_framework.views import APIView
from rest_framework.response import Response
from django.conf import settings
from groq import Groq

from apps.products.models import Product


def parse_number(value: str):
    if not value:
        return None
    nums = re.findall(r"\d+", str(value))
    return int(nums[0]) if nums else None


def extract_ram_from_specs(specs: dict):
    if not specs:
        return None
    for k, v in specs.items():
        if str(k).strip().lower() in ["ram", "memory"]:
            return parse_number(v)
    return None


def extract_battery(specs: dict):
    if not specs:
        return None
    for k, v in specs.items():
        if str(k).strip().lower() in ["battery", "battery life"]:
            return str(v)
    return None


def detect_intent(message: str):
    msg = message.lower()

    intent = {
        "metric": None,
        "category": None,
        "mode": "best",
        "budget": None,
    }

    if "keyboard" in msg:
        intent["category"] = "KEYBOARD"
    elif "mouse" in msg:
        intent["category"] = "MOUSE"
    else:
        intent["category"] = "LAPTOP"

    if "ram" in msg or "memory" in msg:
        intent["metric"] = "ram"
        intent["mode"] = "highest"
    elif "cheap" in msg or "lowest price" in msg or "budget" in msg:
        intent["metric"] = "price"
        intent["mode"] = "cheapest"
    elif "battery" in msg:
        intent["metric"] = "battery"
        intent["mode"] = "highest"

    budget_match = re.search(r"(under|below|less than)\s*₹?\s*(\d+)", msg)
    if budget_match:
        intent["budget"] = int(budget_match.group(2))

    return intent


def filter_products_by_intent(intent, limit=10):
    qs = Product.objects.all()

    if intent["category"]:
        qs = qs.filter(category=intent["category"])

    if intent["budget"]:
        qs = qs.filter(price__lte=intent["budget"])

    enriched = []
    for p in qs:
        specs = p.specs or {}
        enriched.append({
            "id": p.id,
            "name": p.name,
            "brand": p.brand,
            "category": p.category,
            "price": float(p.price),
            "stock": p.stock,
            "stock_status": getattr(p, "stock_status", "IN_STOCK"),
            "description": p.description,
            "specs": specs,
            "ram": extract_ram_from_specs(specs),
            "battery": extract_battery(specs),
            "product_url": f"/products/{p.id}",
            "actions": {
                "add_to_cart": {"user_id": None, "product_id": p.id, "quantity": 1},
                "add_to_compare": {"user_id": None, "product_ids": [p.id]},
            },
        })

    metric = intent["metric"]
    mode = intent["mode"]

    if metric == "ram":
        enriched.sort(key=lambda x: (x["ram"] or 0), reverse=True)
    elif metric == "price" and mode == "cheapest":
        enriched.sort(key=lambda x: x["price"])
    elif metric == "battery":
        enriched.sort(key=lambda x: (parse_number(x["battery"]) or 0), reverse=True)
    else:
        enriched.sort(key=lambda x: x["price"])

    return enriched[:limit]


class ChatAPIView(APIView):
    def post(self, request):
        message = request.data.get("message", "").strip()
        user_id = request.data.get("user_id", None)

        if not message:
            return Response({"error": "Message required"}, status=400)

        if not getattr(settings, "GROQ_API_KEY", None):
            return Response({"error": "GROQ_API_KEY missing"}, status=500)

        intent = detect_intent(message)
        selected = filter_products_by_intent(intent, limit=10)

        if not selected:
            return Response({"reply": "No matching products found in SmartCart."}, status=200)

        for p in selected:
            p["actions"]["add_to_cart"]["user_id"] = user_id
            p["actions"]["add_to_compare"]["user_id"] = user_id

        client = Groq(api_key=settings.GROQ_API_KEY)

        system_prompt = """
You are SmartCart AI assistant.
Answer ONLY using given products.

Return:
1) short best answer
2) top 3 products with Name + Price + key specs
3) keep it simple
"""

        ai_products = [{
            "id": p["id"],
            "name": p["name"],
            "brand": p["brand"],
            "category": p["category"],
            "price": p["price"],
            "stock_status": p["stock_status"],
            "specs": p["specs"]
        } for p in selected]

        user_prompt = f"""
User Request: {message}
Detected Intent: {intent}
Products: {ai_products}
"""

        response = client.chat.completions.create(
            model="llama-3.1-8b-instant",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt},
            ],
            temperature=0.25
        )

        reply = response.choices[0].message.content

        return Response({
            "reply": reply,
            "products": selected
        }, status=200)
