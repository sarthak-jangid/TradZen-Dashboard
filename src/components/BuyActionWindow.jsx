import React, { useState, useContext } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import GeneralContext from "./GeneralContext";
import "./BuyActionWindow.css";

const BuyActionWindow = ({ uid, stock }) => {
  const [stockQuantity, setStockQuantity] = useState(1);
  // const [stockPrice, setStockPrice] = useState(stock.price);
  const [flashMsg, setFlashMsg] = useState("");
  const [flashType, setFlashType] = useState("success");
  const { closeBuyWindow } = useContext(GeneralContext);
  const [isBuying, setIsBuying] = useState(false);

  const handleBuyClick = async () => {
    if (isBuying) return;
    setIsBuying(true);
    const qty = Number(stockQuantity) || 0; // Treat empty as 0

    if (qty <= 0) {
      setFlashType("error");
      setFlashMsg("Quantity must be greater than 0.");
      setTimeout(() => setFlashMsg(""), 2000);
      return;
    }
    if (qty > 100) {
      setFlashType("error");
      setFlashMsg("You can buy a maximum of 100 stocks at a time.");
      setTimeout(() => setFlashMsg(""), 2000);
      return;
    }

    // console.log("work");

    try {
      await axios.post(
        "tradzen-backend-production.up.railway.app/api/newOrder",
        {
          name: uid,
          qty: qty,
          price: stock.price,
          mode: "BUY",
          stock: stock,
        },
        {
          withCredentials: true, // VERY IMPORTANT to send the cookie
        }
      );
      console.log("work 2");

      setFlashType("success");
      setFlashMsg("Order placed successfully!");
      window.dispatchEvent(new Event("holdingsUpdated")); // <-- Add this line
      setTimeout(() => {
        closeBuyWindow();
        setIsDisable(false);
        setFlashMsg("");
      }, 1000);
    } catch (err) {
      // setFlashType("error");
      // setFlashMsg("Order failed. Please try again.");
      // setTimeout(() => setFlashMsg(""), 2000);
      setIsBuying(false)
      const errorMsg = err?.response?.data || "Order failed. Please try again.";
      setFlashType("error");
      setFlashMsg(errorMsg);
      setTimeout(() => setFlashMsg(""), 2000);
    }
  };

  const handleCancelClick = () => {
    closeBuyWindow();
  };

  return (
    <div className="container" id="buy-window" draggable="true">
      {flashMsg && (
        <div className={`flash-message ${flashType}`}>{flashMsg}</div>
      )}

      {/* Stock details section */}
      <div
        className="stock-details"
        style={{ marginBottom: "1rem", padding: "1rem 0.5rem" }}
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
          style={{ fontSize: "1.05em", color: "#555", paddingLeft: "0.2rem" }}
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
        <div className="inputs">
          <fieldset>
            <legend>Qty.</legend>
            <input
              type="number"
              name="qty"
              id="qty"
              min={1}
              max={100}
              onChange={(e) => {
                const val = e.target.value;
                // Allow empty string for controlled input
                if (val === "" || (Number(val) >= 0 && Number(val) <= 100))
                  setStockQuantity(val);
              }}
              value={stockQuantity}
            />
          </fieldset>
          <fieldset>
            <legend
              style={{
                color: "#1A318A",
              }}
            >
              Price
            </legend>
            <input
              type="number"
              className="price-input"
              name="price"
              id="price"
              step="0.05"
              min={1}
              value={
                Math.max(0, Math.min(Number(stockQuantity) || 0, 100)) *
                (stock?.price ?? 0)
              }
              readOnly
            />
          </fieldset>
        </div>
      </div>

      <div className="total-price-summary">
        Total Price:{" "}
        <span className="total-price-value">
          ₹
          {(
            Math.max(0, Math.min(Number(stockQuantity) || 0, 100)) *
            (stock?.price ?? 0)
          ).toLocaleString("en-IN")}
        </span>
      </div>

      <div className="buttons">
        <span>Margin required ₹140.65</span>
        <div>
          <Link className="btn btn-blue" onClick={handleBuyClick}>
            {isBuying ? "Buying..." : "Buy"}
          </Link>
          {isBuying == false && (
            <Link to="" className="btn btn-grey" onClick={handleCancelClick}>
              Cancel
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default BuyActionWindow;
