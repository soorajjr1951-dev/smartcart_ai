import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getProductDetails,
  addToCart,
  addToCompare,
  getProductReviews,
  addProductReview,
  fixImageUrl,
} from "../api/apiService";

import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import "./ProductDetails.css";

function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { fetchCart } = useCart();

  const userId = user?.id;

  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const res = await getProductDetails(id);
      setProduct(res.data);
    } catch (err) {
      console.error(err);
      alert("Failed to load product details ❌");
    } finally {
      setLoading(false);
    }
  };

  const fetchReviews = async () => {
    try {
      const res = await getProductReviews(id);
      setReviews(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchProduct();
    fetchReviews();
  }, [id]);

  const handleAddToCart = async () => {
    if (!userId) return navigate("/login");

    try {
      await addToCart({
        user_id: userId,
        product_id: product.id,
        quantity: 1,
      });

      await fetchCart();
      alert("Added to cart ✅");
    } catch {
      alert("Add to cart failed ❌");
    }
  };

  const handleAddToCompare = async () => {
    if (!userId) return navigate("/login");

    try {
      await addToCompare({
        user_id: userId,
        product_ids: [product.id],
      });

      alert("Added to compare ✅");
      navigate("/compare");
    } catch {
      alert("Compare failed ❌");
    }
  };

  const handleSubmitReview = async () => {
    if (!userId) return navigate("/login");

    try {
      await addProductReview(id, {
        user_id: userId,
        rating,
        comment,
      });

      setComment("");
      setRating(5);
      fetchReviews();
      fetchProduct();
      alert("Review submitted ✅");
    } catch {
      alert("Review failed ❌");
    }
  };

  if (loading) return <p className="status-text">Loading...</p>;
  if (!product) return <p className="status-text">Product not found</p>;

  const imgSrc = fixImageUrl(product.images?.[0]?.image);

  return (
    <div className="product-details-page">
      <div className="product-details-card">
        <div className="product-main">
          <div className="product-image-box">
            {imgSrc ? (
              <img src={imgSrc} alt={product.name} className="product-image" />
            ) : (
              <p className="status-text">No Image Available</p>
            )}
          </div>

          <div className="product-info">
            <h2>{product.name}</h2>
            <p className="brand">Brand: {product.brand}</p>
            <p className="price">₹{product.price}</p>

            <p className="stock">
              Status: <b>{product.stock_status}</b> | Stock: {product.stock}
            </p>

            <p className="description">{product.description}</p>

            <div className="actions">
              <button
                className="btn-cart"
                onClick={handleAddToCart}
                disabled={product.stock_status === "OUT_OF_STOCK"}
              >
                Add to Cart
              </button>

              <button className="btn-compare" onClick={handleAddToCompare}>
                Compare
              </button>
            </div>

            <div className="rating-summary">
              ⭐ Avg Rating: <b>{product.avg_rating}</b> ({product.review_count}{" "}
              reviews)
            </div>
          </div>
        </div>

        {/* SPECS */}
        <div className="specs-section">
          <h3>Specifications</h3>
          <table className="specs-table">
            <tbody>
              {Object.entries(product.specs || {}).map(([key, value]) => (
                <tr key={key}>
                  <td className="spec-key">{key}</td>
                  <td>{value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* REVIEWS */}
        <div className="reviews-section">
          <h3>Reviews</h3>

          {reviews.length === 0 ? (
            <p>No reviews yet</p>
          ) : (
            reviews.map((r) => (
              <div key={r.id} className="review-card">
                <p>
                  <b>{r.username}</b> ⭐ {r.rating}
                </p>
                <p>{r.comment}</p>
                <small>{new Date(r.created_at).toLocaleString()}</small>
              </div>
            ))
          )}

          <div className="review-form">
            <h4>Add a Review</h4>
            <select value={rating} onChange={(e) => setRating(e.target.value)}>
              {[5, 4, 3, 2, 1].map((x) => (
                <option key={x} value={x}>
                  {x} Stars
                </option>
              ))}
            </select>

            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Write your review..."
            />

            <button onClick={handleSubmitReview}>Submit Review</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetails;
