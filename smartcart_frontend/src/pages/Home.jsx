import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getProducts } from "../api/apiService";
import "./Home.css";
import ProductCard from "../components/ProductCard";


function Home() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProducts()
      .then((res) => setProducts(res.data.slice(0, 6)))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="home">
      {/* HERO */}
      <section className="hero">
        <div className="hero-content">
          <h1>SmartCart AI</h1>
          <p>Buy smarter with AI-powered product comparison</p>
          <button onClick={() => navigate("/products")}>Shop Now</button>
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="section">
        <h2 className="section-title">Categories</h2>
        <div className="categories">
          <div
            className="category-card"
            onClick={() => navigate("/products?category=LAPTOP")}
          >
            💻 <span>Laptops</span>
          </div>
          <div
            className="category-card"
            onClick={() => navigate("/products?category=KEYBOARD")}
          >
            ⌨️ <span>Keyboards</span>
          </div>
          <div
            className="category-card"
            onClick={() => navigate("/products?category=MOUSE")}
          >
            🖱️ <span>Mouse</span>
          </div>
        </div>
      </section>

      {/* PRODUCTS */}
      <section className="section">
        <h2 className="section-title">Featured Products</h2>

        {loading ? (
          <p className="loading">Loading products...</p>
        ) : (
          <div className="products-grid">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default Home;
