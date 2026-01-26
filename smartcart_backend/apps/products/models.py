from django.db import models
from django.contrib.auth.models import User

class Product(models.Model):
    CATEGORY_CHOICES = (
        ("LAPTOP", "Laptop"),
        ("KEYBOARD", "Keyboard"),
        ("MOUSE", "Mouse"),
    )

    STOCK_STATUS_CHOICES = (
        ("IN_STOCK", "In Stock"),
        ("LIMITED", "Limited"),
        ("OUT_OF_STOCK", "Out of Stock"),
    )

    name = models.CharField(max_length=200)
    brand = models.CharField(max_length=100)
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES)
    price = models.DecimalField(max_digits=10, decimal_places=2)

    stock = models.PositiveIntegerField(default=0)

    stock_status = models.CharField(
        max_length=20,
        choices=STOCK_STATUS_CHOICES,
        default="IN_STOCK",
    )

    description = models.TextField()
    specs = models.JSONField(default=dict)
    created_at = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):
        if self.stock <= 0:
            self.stock_status = "OUT_OF_STOCK"
        elif self.stock <= 4:
            self.stock_status = "LIMITED"
        else:
            self.stock_status = "IN_STOCK"
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name


class Review(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name="reviews")
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    rating = models.IntegerField()
    comment = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)


class ProductImage(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name="images")
    image = models.ImageField(upload_to="product_images/")
