import { useEffect, useState } from "react";
import { getUserOrders } from "../api/apiService";
import "./Orders.css";

function Orders() {
  // Temporary user ID (later from AuthContext)
  const userId = 1;

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getUserOrders(userId)
      .then((res) => setOrders(res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="orders-loading">Loading orders...</p>;

  return (
    <div className="orders-container">
      <h2>My Orders</h2>

      {orders.length === 0 ? (
        <p>No orders found</p>
      ) : (
        orders.map((order) => (
          <div key={order.id} className="order-card">
            <div className="order-header">
              <span><strong>Order ID:</strong> #{order.id}</span>
              <span className={`status ${order.status.toLowerCase()}`}>
                {order.status}
              </span>
            </div>

            <p><strong>Total:</strong> ₹{order.total_price}</p>
            <p><strong>Address:</strong> {order.address}</p>
            <p><strong>Date:</strong> {new Date(order.created_at).toLocaleString()}</p>

            <div className="order-items">
              <h4>Items</h4>
              {order.items.map((item, index) => (
                <div key={index} className="order-item">
                  <span>{item.product.name}</span>
                  <span>Qty: {item.quantity}</span>
                  <span>₹{item.price}</span>
                </div>
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default Orders;
