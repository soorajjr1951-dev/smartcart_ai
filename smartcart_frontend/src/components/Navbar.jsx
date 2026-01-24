import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import "./Navbar.css";

function Navbar() {
  const navigate = useNavigate();

  const { cartCount } = useCart();  
  // Temporary auth state (replace later with AuthContext)
  const isLoggedIn = true;

  const handleLogout = () => {
    alert("Logged out");
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="navbar-logo" onClick={() => navigate("/")}>
        SmartCart AI
      </div>

      <ul className="navbar-links">
        <li onClick={() => navigate("/")}>Home</li>
        <li onClick={() => navigate("/products")}>Products</li>
        <li onClick={() => navigate("/compare")}>Compare</li>
        <li onClick={() => navigate("/orders")}>Orders</li>
        <li onClick={() => navigate("/cart")}>Cart 🛒{cartCount > 0 && <span>({cartCount})</span>}</li>
      </ul>

      <div className="navbar-auth">
        {isLoggedIn ? (
          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        ) : (
          <button
            className="login-btn"
            onClick={() => navigate("/login")}
          >
            Login
          </button>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
