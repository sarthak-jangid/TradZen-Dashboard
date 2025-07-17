import { useState, useEffect } from "react";
import axios from "axios";
import "./Positions.css";

const Positions = () => {
  const [positions, setPositions] = useState([]);

  useEffect(() => {
    axios
      .get("tradzen-backend-production.up.railway.app/allPositions")
      .then((res) => setPositions(res.data))
      .catch((err) => console.error("Failed to fetch positions:", err));
  }, []);

  const calculatePnL = (stock) => {
    const pnl = (stock.price - stock.avg) * stock.qty;
    return pnl.toFixed(2);
  };

  const getPnLClass = (stock) => {
    const pnl = stock.price - stock.avg;
    return pnl >= 0 ? "profit" : "loss";
  };

  return (
    <div className="positions-wrapper">
      <div className="positions-header">
        <h3 className="positions-title">Positions ({positions.length})</h3>
      </div>

      <div className="positions-table-container">
        <table className="positions-table">
          <thead>
            <tr>
              <th>Product</th>
              <th>Instrument</th>
              <th>Qty</th>
              <th>Avg</th>
              <th>LTP</th>
              <th>P&L</th>
              <th>Chg</th>
            </tr>
          </thead>

          <tbody>
            {positions.map((stock, idx) => (
              <tr key={idx}>
                <td>{stock.product}</td>
                <td>{stock.name}</td>
                <td>{stock.qty}</td>
                <td>{stock.avg.toFixed(2)}</td>
                <td>{stock.price.toFixed(2)}</td>
                <td className={getPnLClass(stock)}>{calculatePnL(stock)}</td>
                <td className={stock.isLoss ? "loss" : "profit"}>
                  {stock.day}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Positions;
