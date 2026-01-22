from django.urls import path
from .views import AddToCompareAPIView, GetCompareAPIView, AIRecommendationAPIView

urlpatterns = [
    path("add/", AddToCompareAPIView.as_view()),
    path("view/<int:user_id>/", GetCompareAPIView.as_view()),
    path("recommend/", AIRecommendationAPIView.as_view()),
]
