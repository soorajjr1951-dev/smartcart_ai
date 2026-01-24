import { useEffect, useState } from "react";
import {
  getCompareList,
  getAIRecommendation,
} from "../api/apiService";
import CompareTable from "../components/CompareTable";
import "./Compare.css";

function Compare() {
  // Temporary user ID (later from AuthContext)
  const userId = 1;

  const [compareList, setCompareList] = useState([]);
  const [preference, setPreference] = useState("gaming");
  const [recommendation, setRecommendation] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getCompareList(userId)
      .then((res) => setCompareList(res.data.products))
      .catch(console.error);
  }, []);

  const handleRecommend = () => {
    if (compareList.length < 2) {
      alert("Add at least 2 products to compare");
      return;
    }

    setLoading(true);

    getAIRecommendation({
      user_id: userId,
      preference,
    })
      .then((res) => setRecommendation(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  return (
    <div className="compare-container">
      <h2>Compare Products</h2>

      {/* REUSABLE COMPARE TABLE */}
      <CompareTable products={compareList} />

      {/* AI RECOMMENDATION */}
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
            <p><strong>{recommendation.recommended_product}</strong></p>

            <ul>
              {recommendation.explanation.map((point, index) => (
                <li key={index}>{point}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

export default Compare;
