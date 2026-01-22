from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Order, OrderItem
from .serializers import OrderSerializer
from apps.cart.models import Cart
from apps.products.models import Product

# Create your views here.

class CheckoutAPIView(APIView):
    def post(self, request):
        user_id = request.data.get("user_id")
        address = request.data.get("address")

        cart = Cart.objects.get(user_id=user_id)
        cart_items = cart.items.all()

        if not cart_items.exists():
            return Response(
                {"error": "Cart is empty"},
                status=status.HTTP_400_BAD_REQUEST
            )

        total_price = 0
        for item in cart_items:
            total_price += item.product.price * item.quantity

        order = Order.objects.create(
            user_id=user_id,
            total_price=total_price,
            address=address
        )

        for item in cart_items:
            OrderItem.objects.create(
                order=order,
                product=item.product,
                quantity=item.quantity,
                price=item.product.price
            )

        cart_items.delete()

        serializer = OrderSerializer(order)
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class UserOrdersAPIView(APIView):
    def get(self, request, user_id):
        orders = Order.objects.filter(user_id=user_id).order_by("-created_at")
        serializer = OrderSerializer(orders, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)