import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { checkoutOrder, createPayment, verifyPayment } from "../api/apiService";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import "./Checkout.css";

function Checkout() {
  const navigate = useNavigate();
  const { cart, fetchCart } = useCart();
  const { user } = useAuth();

  const userId = user?.id;

  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);

  if (!userId) return <p className="status-text">Please login to checkout</p>;
  if (!cart || !cart.items || cart.items.length === 0)
    return <p className="status-text">Your cart is empty</p>;

  const totalAmount = cart.total_price;

  const getImg = (item) => {
    const img = item.product?.images?.[0]?.image;
    if (!img) return null;
    return img.startsWith("http") ? img : `http://127.0.0.1:8000${img}`;
  };

  const handlePlaceOrder = async () => {
    if (!address.trim()) {
      alert("Please enter delivery address");
      return;
    }

    try {
      setLoading(true);

      const orderRes = await checkoutOrder({
        user_id: userId,
        address,
      });

      const paymentRes = await createPayment({
        order_id: orderRes.data.id,
      });

      const options = {
        key: paymentRes.data.razorpay_key,
        amount: Number(totalAmount) * 100,
        currency: "INR",
        name: "SmartCart AI",
        description: "Order Payment",
        order_id: paymentRes.data.razorpay_order_id,
        handler: function (response) {
          verifyPayment({
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
          }).then(() => {
            fetchCart();
            navigate("/orders");
          });
        },
        theme: { color: "#2874f0" },
      };

      new window.Razorpay(options).open();
    } catch (err) {
      console.error(err);
      alert("Checkout failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="checkout-page">
      <div className="checkout-container">
        <div className="checkout-left">
          <div className="checkout-card">
            <h3>Delivery Address</h3>
            <textarea
              placeholder="Enter delivery address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>

          <div className="checkout-card">
            <h3>Cart Items</h3>

            {cart.items.map((item) => (
              <div
                key={item.id}
                style={{
                  display: "flex",
                  gap: 12,
                  alignItems: "center",
                  marginBottom: 12,
                }}
              >
                {getImg(item) && (
                  <img
                    src={getImg(item)}
                    alt={item.product.name}
                    style={{
                      width: 70,
                      height: 70,
                      objectFit: "cover",
                      borderRadius: 8,
                    }}
                  />
                )}

                <div>
                  <p style={{ margin: 0 }}>
                    <strong>{item.product.name}</strong>
                  </p>
                  <p style={{ margin: 0 }}>₹{item.product.price}</p>
                  <p style={{ margin: 0 }}>Qty: {item.quantity}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="checkout-right">
          <div className="price-card">
            <h3>Price Details</h3>

            <div className="price-row total">
              <span>Total Amount</span>
              <span>₹{totalAmount}</span>
            </div>

            <button
              className="place-order-btn"
              onClick={handlePlaceOrder}
              disabled={loading}
            >
              {loading ? "Processing..." : "Place Order"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Checkout;
