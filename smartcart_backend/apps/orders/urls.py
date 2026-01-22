from django.urls import path
from .views import CheckoutAPIView, UserOrdersAPIView

urlpatterns = [
    path("checkout/", CheckoutAPIView.as_view()),
    path("user/<int:user_id>/", UserOrdersAPIView.as_view()),
]

