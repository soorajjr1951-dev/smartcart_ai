import "./CompareTable.css";

function CompareTable({ products }) {
  if (!products || products.length === 0) {
    return <p className="compare-empty">No products to compare</p>;
  }

  // Collect all unique spec keys
  const specKeys = Array.from(
    new Set(
      products.flatMap((product) => Object.keys(product.specs || {}))
    )
  );

  return (
    <div className="compare-table-wrapper">
      <table className="compare-table">
        <thead>
          <tr>
            <th>Specification</th>
            {products.map((product) => (
              <th key={product.id}>{product.name}</th>
            ))}
          </tr>
        </thead>

        <tbody>
          <tr>
            <td>Brand</td>
            {products.map((product) => (
              <td key={product.id}>{product.brand}</td>
            ))}
          </tr>

          <tr>
            <td>Price</td>
            {products.map((product) => (
              <td key={product.id}>₹{product.price}</td>
            ))}
          </tr>

          {specKeys.map((key) => (
            <tr key={key}>
              <td>{key}</td>
              {products.map((product) => (
                <td key={product.id}>
                  {product.specs?.[key] || "-"}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default CompareTable;
