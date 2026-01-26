import os
import json
import django

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "smartcart_backend.settings")
django.setup()

from django.core.files import File
from apps.products.models import Product, ProductImage

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_FILE = os.path.join(BASE_DIR, "seed_data", "products.json")
IMAGES_DIR = os.path.join(BASE_DIR, "seed_data", "images")


def run():
    with open(DATA_FILE, "r", encoding="utf-8") as f:
        products = json.load(f)

    created_count = 0

    for item in products:
        images = item.pop("images", [])

        product, created = Product.objects.get_or_create(
            name=item["name"],
            brand=item["brand"],
            defaults=item
        )

        if created:
            created_count += 1

        for img_name in images:
            img_path = os.path.join(IMAGES_DIR, img_name)

            if not os.path.exists(img_path):
                print(f"❌ Image not found: {img_path}")
                continue

            with open(img_path, "rb") as img_file:
                ProductImage.objects.create(
                    product=product,
                    image=File(img_file, name=img_name)
                )

    print(f"✅ Done! Products created: {created_count}")


if __name__ == "__main__":
    run()
