import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../api/apiService";
import { useAuth } from "../context/AuthContext";
import "./Login.css";

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [error, setError] = useState("");

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await loginUser(formData);

      // ✅ Store user globally using AuthContext
      login({
        id: res.data.user_id,
        username: res.data.username,
      });

      navigate("/products");
    } catch {
      setError("Invalid username or password");
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <div className="auth-header">
          <h2>Login</h2>
          <p>Access your orders & AI recommendations</p>
        </div>

        {error && <div className="auth-error">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="field">
            <label>Username</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </div>

          <div className="field">
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" className="auth-btn">
            Login
          </button>
        </form>

        <div className="auth-footer">
          New to SmartCart?
          <span onClick={() => navigate("/register")}>
            {" "}Create an account
          </span>
        </div>
      </div>
    </div>
  );
}

export default Login;
