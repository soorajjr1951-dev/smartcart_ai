from django.urls import path
from .views import CreatePaymentAPIView, VerifyPaymentAPIView

urlpatterns = [
    path("create/", CreatePaymentAPIView.as_view()),
    path("verify/", VerifyPaymentAPIView.as_view()),
]
