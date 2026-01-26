// ✅ FILE: src/components/Footer.jsx
import { useNavigate } from "react-router-dom";
import "./Footer.css";

function Footer() {
  const navigate = useNavigate();

  return (
    <footer className="footer">
      <div className="footer-container">
        {/* BRAND */}
        <div className="footer-section">
          <h3>SmartCart AI</h3>
          <p>
            Smart electronics shopping platform with AI-powered product
            comparison and recommendations.
          </p>
        </div>

        {/* QUICK LINKS */}
        <div className="footer-section">
          <h4>Quick Links</h4>
          <ul>
            <li onClick={() => navigate("/")}>Home</li>
            <li onClick={() => navigate("/products")}>Products</li>
            <li onClick={() => navigate("/compare")}>Compare</li>
            <li onClick={() => navigate("/cart")}>Cart</li>
            <li onClick={() => navigate("/orders")}>Orders</li>
          </ul>
        </div>

        {/* CONTACT */}
        <div className="footer-section">
          <h4>Contact</h4>
          <p>Email: support@smartcart.ai</p>
          <p>Phone: +91 98765 43210</p>
          <p>Location: India</p>
        </div>
      </div>

      {/* COPYRIGHT */}
      <div className="footer-bottom">
        © {new Date().getFullYear()} SmartCart AI. All rights reserved.
      </div>
    </footer>
  );
}

export default Footer;
