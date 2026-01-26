import { useNavigate } from "react-router-dom";
import { updateCartItem, removeCartItem } from "../api/apiService";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import "./Cart.css";

function Cart() {
  const navigate = useNavigate();
  const { cart, loading, fetchCart } = useCart();
  const { user } = useAuth();

  if (!user) return <p className="status-text">Please login to view cart</p>;

  const handleQuantityChange = (itemId, quantity) => {
    if (quantity < 1) return;

    updateCartItem({
      cart_item_id: itemId,
      quantity,
    }).then(fetchCart);
  };

  const handleRemove = (itemId) => {
    removeCartItem({
      cart_item_id: itemId,
    }).then(fetchCart);
  };

  if (loading) return <p className="status-text">Loading cart...</p>;
  if (!cart || !cart.items || cart.items.length === 0)
    return <p className="status-text">Your cart is empty</p>;

  return (
    <div className="cart-page">
      <h2>Your Cart</h2>

      <div className="cart-layout">
        <div className="cart-items">
          {cart.items.map((item) => (
            <div key={item.id} className="cart-item">
              <div className="item-info">
                <h4>{item.product.name}</h4>
                <p className="price">₹{item.product.price}</p>
              </div>

              <div className="item-controls">
                <div className="qty-controls">
                  <button
                    onClick={() =>
                      handleQuantityChange(item.id, item.quantity - 1)
                    }
                  >
                    −
                  </button>
                  <span>{item.quantity}</span>
                  <button
                    onClick={() =>
                      handleQuantityChange(item.id, item.quantity + 1)
                    }
                  >
                    +
                  </button>
                </div>

                <button
                  className="remove-btn"
                  onClick={() => handleRemove(item.id)}
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="cart-summary">
          <h3>Price Details</h3>

          <div className="summary-row">
            <span>Total Items</span>
            <span>{cart.items.length}</span>
          </div>

          <div className="summary-row total">
            <span>Total Amount</span>
            <span>₹{cart.total_price}</span>
          </div>

          <button className="checkout-btn" onClick={() => navigate("/checkout")}>
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  );
}

export default Cart;
