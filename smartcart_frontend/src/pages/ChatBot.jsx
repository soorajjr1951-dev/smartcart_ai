import { useState } from "react";
import { chatAI, addToCart, addToCompare } from "../api/apiService";
import { useAuth } from "../context/AuthContext";

function ChatBot() {
  const { user } = useAuth();
  const [message, setMessage] = useState("");
  const [reply, setReply] = useState("");
  const [products, setProducts] = useState([]);

  const handleSend = async () => {
    if (!message.trim()) return;

    try {
      const res = await chatWithAI({
        user_id: user?.id || 1,
        message: message,
      });

      setReply(res.data.reply);
      setProducts(res.data.products || []);
      setMessage("");
    } catch (err) {
      console.error(err);
      setReply("❌ Failed to get response");
    }
  };

  const handleAddCart = (p) => {
    addToCart({
      user_id: user?.id || 1,
      product_id: p.id,
      quantity: 1,
    }).then(() => alert("Added to cart ✅"));
  };

  const handleAddCompare = (p) => {
    addToCompare({
      user_id: user?.id || 1,
      product_ids: [p.id],
    }).then(() => alert("Added to compare ✅"));
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>SmartCart AI Chat</h2>

      <div style={{ display: "flex", gap: 10, marginTop: 15 }}>
        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Ask like: highest ram under 60000"
          style={{ flex: 1, padding: 10 }}
        />
        <button onClick={handleSend} style={{ padding: "10px 20px" }}>
          Send
        </button>
      </div>

      {reply && (
        <div style={{ marginTop: 20, padding: 15, background: "#f4f4f4" }}>
          <pre style={{ whiteSpace: "pre-wrap" }}>{reply}</pre>
        </div>
      )}

      {products.length > 0 && (
        <div style={{ marginTop: 20 }}>
          <h3>Recommended Products</h3>

          {products.map((p) => (
            <div
              key={p.id}
              style={{
                border: "1px solid #ddd",
                padding: 15,
                marginTop: 10,
                borderRadius: 10,
              }}
            >
              <h4>{p.name}</h4>
              <p>Brand: {p.brand}</p>
              <p>Price: ₹{p.price}</p>
              <p>Status: {p.stock_status}</p>

              <div style={{ display: "flex", gap: 10, marginTop: 10 }}>
                <button onClick={() => handleAddCart(p)}>Add to Cart</button>
                <button onClick={() => handleAddCompare(p)}>Compare</button>
                <a href={p.product_url}>
                  <button>View</button>
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ChatBot;
