import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { getProducts } from "../api/apiService";
import "./ProductList.css";
import ProductCard from "../components/ProductCard";

function ProductList() {
  const navigate = useNavigate();
  const location = useLocation();

  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const queryParams = new URLSearchParams(location.search);
  const category = queryParams.get("category");

  useEffect(() => {
    fetchProducts();
  }, [category]);

  const fetchProducts = () => {
    setLoading(true);
    getProducts({ category, search })
      .then((res) => setProducts(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchProducts();
  };

  return (
    <div className="product-page">
      <div className="product-header">
        <h2>{category ? category : "All"} Products</h2>

        {/* Search */}
        <form className="search-bar" onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Search for products, brands and more"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button type="submit">Search</button>
        </form>
      </div>

      {/* Products */}
      {loading ? (
        <p className="status-text">Loading products...</p>
      ) : products.length === 0 ? (
        <p className="status-text">No products found</p>
      ) : (
        <div className="product-grid">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}

export default ProductList;
