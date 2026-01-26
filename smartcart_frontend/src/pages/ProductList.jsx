import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { getProducts } from "../api/apiService";
import "./ProductList.css";
import ProductCard from "../components/ProductCard";

function ProductList() {
  const location = useLocation();
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const queryParams = new URLSearchParams(location.search);
  const category = queryParams.get("category");

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await getProducts({ category, search });
      setProducts(res.data);
    } catch (err) {
      console.error(err);
      alert("Failed to load products ❌");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [category]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchProducts();
  };

  return (
    <div className="product-page">
      <div className="product-header">
        <h2>{category ? category : "All"} Products</h2>

        <form className="search-bar" onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button type="submit">Search</button>
        </form>
      </div>

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
