import { useEffect, useState } from "react";
import {
  getCompareList,
  getAIRecommendation,
  getProducts,
} from "../api/apiService";
import CompareTable from "../components/CompareTable";
import AIChat from "../components/AIChatWidget";
import { useAuth } from "../context/AuthContext";
import "./Compare.css";

function Compare() {
  const { user } = useAuth();
  const userId = user?.id;

  const [compareList, setCompareList] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);

  const [preference, setPreference] = useState("gaming");
  const [recommendation, setRecommendation] = useState(null);
  const [loading, setLoading] = useState(false);

  const loadCompare = () => {
    if (!userId) return;

    getCompareList(userId)
      .then((res) => {
        const prods = res.data.products || [];
        setCompareList(prods);

        if (prods.length > 0) {
          setSelectedIds(prods.map((p) => p.id));
        } else {
          setSelectedIds([]);
        }
      })
      .catch(console.error);
  };

  useEffect(() => {
    if (!userId) return;

    loadCompare();

    getProducts()
      .then((res) => setAllProducts(res.data))
      .catch(console.error);
  }, [userId]);

  const handleSelectChange = (index, newId) => {
    const updated = [...selectedIds];
    updated[index] = Number(newId);
    setSelectedIds(updated);

    const updatedProducts = updated
      .map((id) => allProducts.find((p) => p.id === id))
      .filter(Boolean);

    setCompareList(updatedProducts);
  };

  const handleRecommend = () => {
    if (!compareList || compareList.length < 2) {
      alert("Add at least 2 products to compare");
      return;
    }

    setLoading(true);

    getAIRecommendation({
      user_id: userId,
      preference,
    })
      .then((res) => {
        setRecommendation(res.data);
      })
      .catch((err) => {
        console.error(err);
        alert("AI Recommendation failed ❌");
      })
      .finally(() => setLoading(false));
  };

  if (!userId) {
    return (
      <p className="status-text">Please login to compare products</p>
    );
  }

  return (
    <div className="compare-container">
      <h2>Compare Products</h2>

      {selectedIds.length > 0 && (
        <div
          style={{
            display: "flex",
            gap: 12,
            flexWrap: "wrap",
            marginBottom: 12,
          }}
        >
          {selectedIds.map((id, idx) => (
            <select
              key={idx}
              value={id}
              onChange={(e) => handleSelectChange(idx, e.target.value)}
              style={{ padding: 10 }}
            >
              {allProducts.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          ))}
        </div>
      )}

      <CompareTable products={compareList} />

      <div className="ai-section">
        <h3>AI Recommendation</h3>

        <select
          value={preference}
          onChange={(e) => setPreference(e.target.value)}
        >
          <option value="gaming">Best for Gaming</option>
          <option value="coding">Best for Coding</option>
          <option value="student">Best for Students</option>
          <option value="value">Best Value for Money</option>
        </select>

        <button onClick={handleRecommend} disabled={loading}>
          {loading ? "Analyzing..." : "Get Recommendation"}
        </button>

        {recommendation && (
          <div className="recommendation">
            <h4>Recommended Product</h4>
            <p>
              <strong>{recommendation.recommended_product}</strong>
            </p>

            <ul>
              {(recommendation.explanation || []).map((point, index) => (
                <li key={index}>{point}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div style={{ marginTop: 20 }}>
        <AIChat />
      </div>
    </div>
  );
}

export default Compare;
