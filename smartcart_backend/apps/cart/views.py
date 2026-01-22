from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth.models import User
from .models import Cart, CartItem
from .serializers import CartSerializer
from apps.products.models import Product

# Create your views here.

class CartView(APIView):
    def get(self, request, user_id):
        cart, created = Cart.objects.get_or_create(user_id=user_id)
        serializer = CartSerializer(cart)
        return Response(serializer.data, status=status.HTTP_200_OK)


class AddToCartAPIView(APIView):
    def post(self, request):
        user_id = request.data.get("user_id")
        product_id = request.data.get("product_id")
        quantity = int(request.data.get("quantity", 1))

        cart, _ = Cart.objects.get_or_create(user_id=user_id)
        product = Product.objects.get(id=product_id)

        cart_item, created = CartItem.objects.get_or_create(
            cart=cart,
            product=product
        )

        if not created:
            cart_item.quantity += quantity
        else:
            cart_item.quantity = quantity

        cart_item.save()
        return Response({"message": "Item added to cart"}, status=status.HTTP_200_OK)


class UpdateCartItemAPIView(APIView):
    def put(self, request):
        cart_item_id = request.data.get("cart_item_id")
        quantity = int(request.data.get("quantity"))

        cart_item = CartItem.objects.get(id=cart_item_id)
        cart_item.quantity = quantity
        cart_item.save()

        return Response({"message": "Cart updated"}, status=status.HTTP_200_OK)


class RemoveCartItemAPIView(APIView):
    def delete(self, request):
        cart_item_id = request.data.get("cart_item_id")

        CartItem.objects.get(id=cart_item_id).delete()
        return Response({"message": "Item removed"}, status=status.HTTP_200_OK)
