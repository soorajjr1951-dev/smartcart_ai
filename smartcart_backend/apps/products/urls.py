from django.urls import path
from .views import ProductListAPIView, ProductDetailAPIView
from .review_views import ProductReviewsAPIView

urlpatterns = [
    path("", ProductListAPIView.as_view()),
    path("<int:pk>/", ProductDetailAPIView.as_view()),
    path("<int:product_id>/reviews/", ProductReviewsAPIView.as_view()),
]
