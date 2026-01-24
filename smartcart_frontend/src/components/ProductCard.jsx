import { useNavigate } from "react-router-dom";
import "./ProductCard.css";

function ProductCard({ product }) {
  const navigate = useNavigate();

  return (
    <div
      className="product-card"
      onClick={() => navigate(`/products/${product.id}`)}
    >
      <div className="product-card-body">
        <h4 className="product-name">{product.name}</h4>
        <p className="product-brand">{product.brand}</p>
        <p className="product-price">₹{product.price}</p>
      </div>
    </div>
  );
}

export default ProductCard;
