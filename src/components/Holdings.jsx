import { useContext, useEffect, useState } from "react";
import axios from "axios";
import GeneralContext from "./GeneralContext";
import { Tooltip } from "@mui/material";
import { VerticalGraph } from "./VeriticalGraph";
import "./Holdings.css"; // Import the styles

const Holdings = () => {
  const [allHoldings, setAllHoldings] = useState([]);
  const { openSellWindow, holdingsUpdated } = useContext(GeneralContext);
  const [showSellButton, setShowSellButton] = useState(null);

  useEffect(() => {
    fetchHoldings();
  }, [holdingsUpdated]);

  const fetchHoldings = () => {
    axios
      .get("http://localhost:3002/allHoldings", { withCredentials: true })
      .then((res) => setAllHoldings(res.data.holdings));
  };

  const handleSellClick = (uid, stock) => {
    openSellWindow(uid, stock);
  };

  const totalInvestment = allHoldings.reduce(
    (sum, stock) => sum + (stock.avg ?? 0) * (stock.qty ?? 0),
    0
  );
  const totalCurrentValue = allHoldings.reduce(
    (sum, stock) => sum + (stock.price ?? 0) * (stock.qty ?? 0),
    0
  );
  const totalPL = totalCurrentValue - totalInvestment;
  const totalPLPercent =
    totalInvestment > 0
      ? ((totalPL / totalInvestment) * 100).toFixed(2)
      : "0.00";

  const labels = allHoldings.map((h) => h["name"]);
  const data = {
    labels,
    datasets: [
      {
        label: "Stock Price",
        data: allHoldings.map((stock) => stock.price),
        backgroundColor: "rgba(0, 123, 255, 0.6)",
      },
    ],
  };

  return (
    <div className="holdings-wrapper">
      <div className="holdings-header">
        <h2>Holdings ({allHoldings.length})</h2>
        <button className="refresh-btn" onClick={fetchHoldings}>
          Refresh
        </button>
      </div>

      <div className="table-container">
        <table className="holdings-table">
          <thead>
            <tr>
              <th>Stock</th>
              <th>Qty</th>
              <th>Avg Price</th>
              <th>LTP</th>
              <th>Value</th>
              <th>P&L</th>
              <th>Net</th>
              <th>Day</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {allHoldings.map((stock, idx) => {
              const qty = stock.qty ?? 0;
              const avg = stock.avg ?? 0;
              const price = stock.price ?? 0;
              const curValue = price * qty;
              const isProfit = curValue - avg * qty >= 0;
              const profitClass = isProfit ? "profit" : "loss";
              const dayClass = stock.day?.startsWith("-") ? "loss" : "profit";

              return (
                <tr
                  key={idx}
                  onMouseEnter={() => setShowSellButton(idx)}
                  onMouseLeave={() => setShowSellButton(null)}
                >
                  <td>{stock.name}</td>
                  <td>{qty}</td>
                  <td>{avg.toFixed(2)}</td>
                  <td>{price.toFixed(2)}</td>
                  <td>{curValue.toFixed(2)}</td>
                  <td className={profitClass}>
                    {(curValue - avg * qty).toFixed(2)}
                  </td>
                  <td className={profitClass}>{stock.net}</td>
                  <td className={dayClass}>{stock.day}</td>
                  <td>
                    <Tooltip title="Sell" arrow>
                      <button
                        className="sell-btn"
                        style={{ opacity: showSellButton === idx ? 1 : 0 }}
                        onClick={() => handleSellClick(stock.name, stock)}
                      >
                        Sell
                      </button>
                    </Tooltip>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="summary-cards">
        <div className="card">
          <h4>
            ₹{" "}
            {totalInvestment.toLocaleString("en-IN", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </h4>
          <p>Total Investment</p>
        </div>
        <div className="card">
          <h4>
            ₹{" "}
            {totalCurrentValue.toLocaleString("en-IN", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </h4>
          <p>Current Value</p>
        </div>
        <div className="card">
          <h4 className={totalPL >= 0 ? "profit" : "loss"}>
            ₹{" "}
            {totalPL.toLocaleString("en-IN", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}{" "}
            ({totalPLPercent}%)
          </h4>
          <p>P&amp;L</p>
        </div>
      </div>

      {allHoldings.length > 0 && <VerticalGraph data={data} />}
    </div>
  );
};

export default Holdings;
