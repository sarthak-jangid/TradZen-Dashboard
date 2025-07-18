import React, { useState, useContext } from "react";
import GeneralContext from "./GeneralContext";
import "./BuyActionWindow.css"; // Reuse the same CSS
import { Link } from "react-router-dom";
import axios from "axios";

const SellActionWindow = ({ uid, stock }) => {
  const [stockQuantity, setStockQuantity] = useState(1);
  const [flashMsg, setFlashMsg] = useState("");
  const [flashType, setFlashType] = useState("success");
  const { closeSellWindow, triggerHoldingsUpdate } = useContext(GeneralContext);
  const [isSelling, setIsSelling] = useState(false);

  const handleSellClick = async () => {
    if (isSelling) return;
    setIsSelling(true);
    const qty = Number(stockQuantity) || 0;
    if (!stock) {
      setFlashType("error");
      setFlashMsg("Stock does not exist in your holdings.");
      setTimeout(() => setFlashMsg(""), 2000);
      return;
    }
    if (qty > stock.qty || qty <= 0) {
      setFlashType("error");
      setFlashMsg("Invalid quantity to sell.");
      setTimeout(() => setFlashMsg(""), 2000);
      return;
    }
    try {
      // Your sell API call here
      const res = await axios.post(
        "https://tradzen-backend-production.up.railway.app/api/newOrder",
        {
          name: uid,
          qty: qty,
          price: stock.price,
          mode: "SELL",
          stock: stock,
        },
        {
          withCredentials: true,
        }
      );
      setFlashType("success");
      setFlashMsg(res.data && "Stock sold successfully!");
      setTimeout(() => {
        closeSellWindow();
        triggerHoldingsUpdate();
        setFlashMsg("");
      }, 1000);
    } catch (err) {
      // Show the error message from backend if available
      const errorMsg =
        err?.response?.data || "Sell order failed. Please try again.";
      setFlashType("error");
      setFlashMsg(errorMsg);
      setTimeout(() => setFlashMsg(""), 2000);
    }
  };

  const handleCancelClick = () => {
    closeSellWindow();
  };

  return (
    <div className="container" id="buy-window" draggable="true">
      {flashMsg && (
        <div className={`flash-message ${flashType}`}>{flashMsg}</div>
      )}

      {/* Stock details section */}
      <div
        className="stock-details"
        style={{
          marginBottom: "1rem",
          padding: "1rem 0.5rem",
        }}
      >
        <h2
          style={{
            fontWeight: "bold",
            fontSize: "1.5rem",
            margin: 0,
            paddingBottom: "0.3rem",
          }}
        >
          {stock?.name ?? "Stock"}
        </h2>
        <div
          style={{
            fontSize: "1.05em",
            color: "#555",
            paddingLeft: "0.2rem",
          }}
        >
          <span>
            LTP: <b>₹{stock?.price ?? "--"}</b>
          </span>
          {stock?.sector && (
            <span style={{ marginLeft: "1.5rem" }}>
              Sector: <b>{stock.sector}</b>
            </span>
          )}
          {stock?.symbol && (
            <span style={{ marginLeft: "1.5rem" }}>
              Symbol: <b>{stock.symbol}</b>
            </span>
          )}
        </div>
      </div>

      <div className="regular-order">
        <div className="inputs" style={{ marginBottom: "0" }}>
          <fieldset>
            <legend>Qty.</legend>
            <input
              type="number"
              name="qty"
              id="qty"
              min={1}
              max={stock?.qty ?? 1}
              onChange={(e) => {
                const val = e.target.value;
                // Allow empty string for controlled input
                if (val === "" || (Number(val) >= 0 && Number(val) <= 100))
                  if (e.target.value > stock.qty) {
                    alert(
                      "not have qty to sell stock .! Available stock is (" +
                        stock.qty +
                        ")"
                    );
                  } else if (e.target.value < 0) {
                    alert("enter valid qty.");
                  } else {
                    setStockQuantity(val);
                  }
              }}
              value={stockQuantity}
            />
          </fieldset>
          <fieldset>
            <legend style = {{color :"#30398B00"}}>Price</legend>
            <input
              type="number"
              className="price-input"
              name="price"
              id="price"
              step="0.05"
              min={1}
              value={
                Math.max(
                  0,
                  Math.min(Number(stockQuantity) || 0, stock?.qty ?? 1)
                ) * (stock?.price ?? 0)
              }
              readOnly
            />
          </fieldset>
        </div>
        <span style={{ fontSize: "0.8em", marginLeft: "10px" }}>
          (Available: {stock?.qty ?? 0})
        </span>
      </div>

      <div className="total-price-summary">
        Total Price:{" "}
        <span className="total-price-value">
          ₹
          {(
            Math.max(0, Math.min(Number(stockQuantity) || 0, stock?.qty ?? 1)) *
            (stock?.price ?? 0)
          ).toLocaleString("en-IN")}
        </span>
      </div>

      <div className="buttons">
        <span>Margin required ₹140.65</span>
        <div>
          <Link to="" className="btn btn-blue" onClick={handleSellClick}>
            {isSelling ? "Selling..." : "Sell"}
          </Link>
          {isSelling == false && (
            <Link to="" className="btn btn-grey" onClick={handleCancelClick}>
              Cancel
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default SellActionWindow;
