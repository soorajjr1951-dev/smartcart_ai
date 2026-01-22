def recommend_product(products, preference):
    scores = {}

    for product in products:
        score = 0
        specs = product.specs

        if preference == "gaming":
            score += int(specs.get("RAM", "0").replace("GB", "")) * 2
            score += 2 if "i7" in specs.get("CPU", "").lower() else 0
            score += 3 if "gpu" in specs else 0

        elif preference == "coding":
            score += int(specs.get("RAM", "0").replace("GB", "")) * 2
            score += 2 if "ssd" in specs.get("Storage", "").lower() else 0

        elif preference == "student":
            score += 3 if product.price < 60000 else 1

        elif preference == "value":
            score += int(100000 / float(product.price))

        scores[product] = score

    best_product = max(scores, key=scores.get)

    explanation = [
        f"Best choice for {preference}",
        f"Has strong specs: {best_product.specs}",
        f"Price: ₹{best_product.price}"
    ]

    return best_product, explanation
