from django.shortcuts import render
import razorpay
from django.conf import settings
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from apps.orders.models import Order
from .models import PaymentTransaction

# Create your views here.

client = razorpay.Client(
    auth=(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_KEY_SECRET)
)

class CreatePaymentAPIView(APIView):
    def post(self, request):
        order_id = request.data.get("order_id")

        order = Order.objects.get(id=order_id)

        razorpay_order = client.order.create({
            "amount": int(order.total_price * 100),  # paise
            "currency": "INR",
            "payment_capture": 1
        })

        PaymentTransaction.objects.create(
            order=order,
            razorpay_order_id=razorpay_order["id"],
            amount=order.total_price,
            status="CREATED"
        )

        return Response({
            "razorpay_order_id": razorpay_order["id"],
            "razorpay_key": settings.RAZORPAY_KEY_ID,
            "amount": order.total_price
        }, status=status.HTTP_200_OK)


class VerifyPaymentAPIView(APIView):
    def post(self, request):
        razorpay_order_id = request.data.get("razorpay_order_id")
        razorpay_payment_id = request.data.get("razorpay_payment_id")
        razorpay_signature = request.data.get("razorpay_signature")

        payment = PaymentTransaction.objects.get(
            razorpay_order_id=razorpay_order_id
        )

        payment.razorpay_payment_id = razorpay_payment_id
        payment.razorpay_signature = razorpay_signature
        payment.status = "PAID"
        payment.save()

        order = payment.order
        order.status = "PAID"
        order.save()

        return Response(
            {"message": "Payment verified successfully"},
            status=status.HTTP_200_OK
        )
