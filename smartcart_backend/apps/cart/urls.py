from django.urls import path
from .views import CartView, AddToCartAPIView, UpdateCartItemAPIView, RemoveCartItemAPIView

urlpatterns = [
    path("<int:user_id>/", CartView.as_view()),
    path("add/", AddToCartAPIView.as_view()),
    path("update/", UpdateCartItemAPIView.as_view()),
    path("remove/", RemoveCartItemAPIView.as_view()),
]
