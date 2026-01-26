import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaShoppingCart } from "react-icons/fa";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import "./Navbar.css";

function Navbar() {
  const navigate = useNavigate();
  const { cartCount } = useCart();
  const { user, logout } = useAuth();

  const [menuOpen, setMenuOpen] = useState(false);

  const isLoggedIn = !!user;

  const handleLogout = () => {
    logout();
    navigate("/login");
    setMenuOpen(false);
  };

  const handleNav = (path) => {
    navigate(path);
    setMenuOpen(false);
  };

  return (
    <nav className="navbar">
      {/* LOGO */}
      <div className="navbar-logo" onClick={() => handleNav("/")}>
        SmartCart AI
      </div>

      {/* BURGER ICON */}
      <div
        className={`burger ${menuOpen ? "open" : ""}`}
        onClick={() => setMenuOpen(!menuOpen)}
      >
        <span></span>
        <span></span>
        <span></span>
      </div>

      {/* NAV LINKS */}
      <ul className={`navbar-links ${menuOpen ? "active" : ""}`}>
        <li onClick={() => handleNav("/home")}>Home</li>
        <li onClick={() => handleNav("/products")}>Products</li>
        <li onClick={() => handleNav("/compare")}>Compare</li>
        <li onClick={() => handleNav("/orders")}>Orders</li>
        <li onClick={() => handleNav("/chat")}>Chat AI</li>

        <div className="cart-icon" onClick={() => handleNav("/cart")}>
          <FaShoppingCart />
          {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
        </div>

        {/* MOBILE AUTH BUTTON */}
        <div className="mobile-auth">
          {isLoggedIn ? (
            <button className="logout-btn" onClick={handleLogout}>
              Logout
            </button>
          ) : (
            <button className="login-btn" onClick={() => handleNav("/login")}>
              Login
            </button>
          )}
        </div>
      </ul>

      {/* DESKTOP AUTH BUTTON */}
      <div className="navbar-auth desktop-only">
        {isLoggedIn ? (
          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        ) : (
          <button className="login-btn" onClick={() => handleNav("/login")}>
            Login
          </button>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
