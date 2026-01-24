import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  checkoutOrder,
  createPayment,
  verifyPayment,
} from "../api/apiService";
import "./Checkout.css";

function Checkout() {
  const navigate = useNavigate();
  const location = useLocation();

  const userId = 1;

  // ✅ Get selected product from previous page
  const { product, quantity = 1 } = location.state || {};

  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);

  // Safety check
  if (!product) {
    return <p className="status-text">No product selected</p>;
  }

  // ✅ Calculate totals dynamically
  const itemsTotal = product.price * quantity;
  const deliveryCharge = 0;
  const totalAmount = itemsTotal + deliveryCharge;

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
        product_id: product.id,
        quantity,
      });

      const paymentRes = await createPayment({
        order_id: orderRes.data.id,
        amount: totalAmount,
      });

      const options = {
        key: paymentRes.data.razorpay_key,
        amount: totalAmount * 100,
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
        {/* LEFT */}
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
            <h3>Order Item</h3>
            <p><strong>{product.name}</strong></p>
            <p>Price: ₹{product.price}</p>
            <p>Quantity: {quantity}</p>
          </div>
        </div>

        {/* RIGHT */}
        <div className="checkout-right">
          <div className="price-card">
            <h3>Price Details</h3>

            <div className="price-row">
              <span>Items Total</span>
              <span>₹{itemsTotal}</span>
            </div>

            <div className="price-row">
              <span>Delivery Charges</span>
              <span className="free">FREE</span>
            </div>

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
