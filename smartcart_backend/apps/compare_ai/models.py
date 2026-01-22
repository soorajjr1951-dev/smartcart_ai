from django.db import models
from django.contrib.auth.models import User
from apps.products.models import Product

# Create your models here.

class CompareList(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    products = models.ManyToManyField(Product)
    created_at = models.DateTimeField(auto_now_add=True)

class AIRecommendationLog(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    preference = models.CharField(max_length=100)
    recommended_product = models.ForeignKey(Product, on_delete=models.SET_NULL, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
