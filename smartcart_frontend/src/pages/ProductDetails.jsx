import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getProductDetails,
  addToCart,
  addToCompare,
} from "../api/apiService";
import "./ProductDetails.css";

function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const userId = 1;

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProductDetails(id)
      .then((res) => setProduct(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  const handleAddToCart = () => {
    addToCart({
      user_id: userId,
      product_id: product.id,
      quantity: 1,
    }).then(() => alert("Added to cart"));
  };

  const handleAddToCompare = () => {
    addToCompare({
      user_id: userId,
      product_ids: [product.id],
    }).then(() => navigate("/compare"));
  };

  // ✅ NEW: Buy Now → Checkout with selected product
  const handleBuyNow = () => {
    navigate("/checkout", {
      state: {
        product: product,
        quantity: 1,
      },
    });
  };

  if (loading) return <p className="status-text">Loading...</p>;
  if (!product) return <p className="status-text">Product not found</p>;

  return (
    <div className="product-details-page">
      <div className="product-details-card">
        <div className="product-main">
          <div className="product-info">
            <h2>{product.name}</h2>
            <p className="brand">Brand: {product.brand}</p>
            <p className="price">₹{product.price}</p>
            <p className="description">{product.description}</p>

            <div className="actions">
              <button className="btn-cart" onClick={handleAddToCart}>
                Add to Cart
              </button>

              <button className="btn-buy" onClick={handleBuyNow}>
                Buy Now
              </button>

              <button className="btn-compare" onClick={handleAddToCompare}>
                Compare
              </button>
            </div>
          </div>
        </div>

        <div className="specs-section">
          <h3>Specifications</h3>
          <table className="specs-table">
            <tbody>
              {Object.entries(product.specs).map(([key, value]) => (
                <tr key={key}>
                  <td className="spec-key">{key}</td>
                  <td>{value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default ProductDetails;
