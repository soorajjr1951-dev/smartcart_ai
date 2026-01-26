from django.urls import path
from .views import AddToCompareAPIView, GetCompareAPIView, AIRecommendationAPIView
from .chat_views import ChatAPIView

urlpatterns = [
    path("add/", AddToCompareAPIView.as_view()),
    path("view/<int:user_id>/", GetCompareAPIView.as_view()),
    path("recommend/", AIRecommendationAPIView.as_view()),
    path("chat/", ChatAPIView.as_view()),
]
