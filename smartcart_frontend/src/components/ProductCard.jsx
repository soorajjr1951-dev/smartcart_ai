import { useNavigate } from "react-router-dom";
import "./ProductCard.css";
import { fixImageUrl } from "../api/apiService";

function ProductCard({ product }) {
  const navigate = useNavigate();

  const imgUrl = fixImageUrl(product.images?.[0]?.image);

  return (
    <div
      className="product-card"
      onClick={() => navigate(`/products/${product.id}`)}
    >
      {imgUrl && (
        <img
          src={imgUrl}
          alt={product.name}
          style={{ width: "100%", height: 160, objectFit: "cover" }}
        />
      )}

      <div className="product-card-body">
        <h4 className="product-name">{product.name}</h4>
        <p className="product-brand">{product.brand}</p>
        <p className="product-price">₹{product.price}</p>

        <p className="stock-status">{product.stock_status}</p>
      </div>
    </div>
  );
}

export default ProductCard;
