// src/Pages/Home.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getProducts } from "../api/apiService";
import ProductCard from "../components/ProductCard";
import "./Home.css";

/* HERO SLIDER IMAGES */
import slide1 from "../assets/slider/keyboard.jpeg";
import slide2 from "../assets/slider/mouse.jpeg";
import slide3 from "../assets/slider/laptop.jpeg";
// import slider4 from "../assets/slider/keyboard.jpeg";

/* CATEGORY IMAGES */
import laptopImg from "../assets/categories/laptop.jpeg";
import keyboardImg from "../assets/categories/keyboard.jpeg";
import mouseImg from "../assets/categories/mouse.jpeg";

const slides = [slide1, slide2, slide3];

function Home() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  /* SLIDER STATE */
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    getProducts()
      .then((res) => setProducts(res.data.slice(0, 6)))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  /* AUTO SLIDE */
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="home">
      {/* HERO WITH SLIDER */}
      <section
        className="hero hero-slider"
        style={{ backgroundImage: `url(${slides[current]})` }}
      >
        <div className="hero-overlay"></div>

        <div className="hero-content">
          <h1>SmartCart AI</h1>
          <p>Buy smarter with AI-powered product comparison</p>
          <button onClick={() => navigate("/products")}>Shop Now</button>
        </div>

        {/* DOTS */}
        <div className="slider-dots">
          {slides.map((_, index) => (
            <span
              key={index}
              className={`dot ${current === index ? "active" : ""}`}
              onClick={() => setCurrent(index)}
            />
          ))}
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="section">
        <h2 className="section-title">Categories</h2>

        <div className="categories">
          <div
            className="category-card image-card"
            onClick={() => navigate("/products?category=LAPTOP")}
          >
            <img src={laptopImg} alt="Laptops" />
            <div className="category-overlay">
              <span>Laptops</span>
            </div>
          </div>

          <div
            className="category-card image-card"
            onClick={() => navigate("/products?category=KEYBOARD")}
          >
            <img src={keyboardImg} alt="Keyboards" />
            <div className="category-overlay">
              <span>Keyboards</span>
            </div>
          </div>

          <div
            className="category-card image-card"
            onClick={() => navigate("/products?category=MOUSE")}
          >
            <img src={mouseImg} alt="Mouse" />
            <div className="category-overlay">
              <span>Mouse</span>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURED PRODUCTS */}
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
