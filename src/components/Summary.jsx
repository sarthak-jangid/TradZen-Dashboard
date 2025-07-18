import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Summary.css";

const Summary = ({ userName }) => {
  const [allHoldings, setAllHoldings] = useState([]);
  const [funds, setFunds] = useState(null);

  const fetchHoldings = () => {
    axios
      .get("https://tradzen-backend-production.up.railway.app/allHoldings", { withCredentials: true })
      .then((res) => setAllHoldings(res.data.holdings));
  };
  const fetchFunds = async () => {
    try {
      const res = await axios.get("https://tradzen-backend-production.up.railway.app/api/funds/my-funds", {
        withCredentials: true, // important for sending cookies
      });
      setFunds(res.data.funds);
    } catch (err) {
      console.error("Error fetching funds:", err);
    }
  };

  useEffect(() => {
    fetchHoldings();
    fetchFunds();
    window.addEventListener("holdingsUpdated", fetchHoldings);
    return () => window.removeEventListener("holdingsUpdated", fetchHoldings);
  }, []);

  //  Prevent crash while funds are loading
  if (!funds) return <p>Loading portfolio summary...</p>;

  // console.log(funds.availableMargin); // safe now

  let totalInvestment = 0;
  let totalCurrentValue = 0;
  allHoldings.forEach((stock) => {
    totalInvestment += (stock.avg ?? 0) * (stock.qty ?? 0);
    totalCurrentValue += (stock.price ?? 0) * (stock.qty ?? 0);
  });

  const totalPL = totalCurrentValue - totalInvestment;
  const totalPLPercent =
    totalInvestment > 0
      ? ((totalPL / totalInvestment) * 100).toFixed(2)
      : "0.00";

  return (
    <div className="summary-wrapper">
      <header className="summary-header">
        <h1>
          Welcome back, <span>{userName}</span> 👋
        </h1>
        <p>Here is your portfolio performance summary.</p>
      </header>

      <section className="summary-section">
        <h2>Equity Overview</h2>
        <div className="summary-card">
          <div className="summary-card-top">
            <div>
              <h3>₹{funds.availableMargin.toFixed(2)}</h3>
              <p className="sub">Margin Available</p>
            </div>
            <div>
              <h3>₹{funds.usedMargin.toFixed(2)}</h3>
              <p className="sub">Margins Used</p>
            </div>
            <div>
              <h3>₹{funds.openingBalance}</h3>
              <p className="sub">Opening Balance</p>
            </div>
          </div>
        </div>
      </section>

      <section className="summary-section">
        <h2>
          Holdings Summary{" "}
          <span className="small">({allHoldings.length} stocks)</span>
        </h2>
        <div className="summary-card">
          <div className="summary-card-top">
            <div>
              <h3 className={totalPL >= 0 ? "profit" : "loss"}>
                ₹{(totalPL / 1000).toFixed(2)}k
              </h3>
              <p className="sub">
                Total P&amp;L{" "}
                <span className="percent">({totalPLPercent}%)</span>
              </p>
            </div>
            <div>
              <h3>
                ₹
                {(totalCurrentValue / 1000).toLocaleString("en-IN", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
                k
              </h3>
              <p className="sub">Current Value</p>
            </div>
            <div>
              <h3>
                ₹
                {(totalInvestment / 1000).toLocaleString("en-IN", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
                k
              </h3>
              <p className="sub">Total Investment</p>
            </div>
          </div>
        </div>
      </section>

      <footer className="summary-footer">
        <p>Updated in real-time based on your latest holdings.</p>
      </footer>
    </div>
  );
};

export default Summary;
