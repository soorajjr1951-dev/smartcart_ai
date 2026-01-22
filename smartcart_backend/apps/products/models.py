from django.db import models

# Create your models here.
class Product(models.Model):
    CATEGORY_CHOICES = (
        ('LAPTOP', 'Laptop'),
        ('KEYBOARD', 'Keyboard'),
        ('MOUSE', 'Mouse'),
    )
    name = models.CharField(max_length=200)
    brand = models.CharField(max_length=100)
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    stock = models.PositiveIntegerField()
    description = models.TextField()
    specs = models.JSONField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name
class ProductImage(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name="images")
    image = models.ImageField(upload_to="product_images/")
