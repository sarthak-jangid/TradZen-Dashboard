import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import "./Funds.css"; // We’ll write styles here

const Funds = ({ userName }) => {
  const [funds, setFunds] = useState(null);
  const [amount, setAmount] = useState("");

  useEffect(() => {
    const fetchFunds = async () => {
      try {
        const res = await axios.get(
          "http://localhost:3002/api/funds/my-funds",
          {
            withCredentials: true, // important for sending cookies
          }
        );
        setFunds(res.data.funds);
      } catch (err) {
        console.error("Error fetching funds:", err);
      }
    };

    fetchFunds();
  }, []);

  //  Razorpay Payment Handler
  const handleAddFunds = async () => {
    if (!amount || isNaN(amount) || amount <= 0) {
      alert("Enter a valid amount");
      return;
    }

    try {
      const { data: keyData } = await axios.get(
        "http://localhost:3002/api/payments/get-razorpay-key",
        {
          withCredentials: true, // important for sending cookies
        }
      );

      const { data } = await axios.post(
        "http://localhost:3002/api/payments/create-order",
        { amount: Number(amount) }, // always convert to number
        { withCredentials: true }
      );

      // console.log(data.order.amount); // log to check structure
      const order = data.order;

      const options = {
        key: keyData.key,
        amount: order.amount,
        currency: "INR",
        name: "TradZen",
        description: "Add Funds",
        order_id: order.id,
        handler: async function (response) {
          // console.log("Payment success", response);

          try {
            await axios.post(
              "http://localhost:3002/api/payments/update-funds",
              { amount: Number(amount) },
              {
                withCredentials: true, //  This sends cookies with the request
              }
            );

            window.location.reload(); //  Refresh to show updated funds
          } catch (err) {
            console.error("Error updating funds:", err);
            alert("Payment succeeded but fund update failed.");
          }
        },

        prefill: {
          name: userName || "User", // fallback if userName is undefined
          email: "your@email.com",
        },
        theme: {
          color: "#3399cc",
        },
      };

      const razor = new window.Razorpay(options);
      razor.open();
    } catch (err) {
      console.error("Razorpay error:", err);
      alert("Something went wrong during payment.");
    }
  };

  const handleWithdrawFunds = async () => {
    if (!amount || isNaN(amount) || amount <= 0) {
      alert("Enter a valid amount");
      return;
    }

    if (amount > funds.availableCash) {
      alert("Insufficient funds to withdraw.");
      return;
    }

    try {
      await axios.post(
        "http://localhost:3002/api/funds/withdraw",
        { amount: Number(amount) },
        { withCredentials: true }
      );

      alert("Funds withdrawn successfully!");
      window.location.reload();
    } catch (err) {
      console.error("Withdraw error:", err);
      alert("Failed to withdraw funds.");
    }
  };

  if (!funds) return <p>Loading fund data...</p>;

  return (
    <div className="funds-container">
      <div className="funds-header">
        <p className="headline">Instant, zero-cost fund transfers with UPI</p>
        <div className="funds-actions">
          <input
            type="number"
            placeholder="Enter amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
          <button onClick={handleAddFunds} className="btn green">
            Add Funds
          </button>
          <button onClick={handleWithdrawFunds} className="btn blue">
            Withdraw
          </button>
        </div>
      </div>

      <div className="funds-card">
        <h2>Equity Funds Summary</h2>
        <div className="funds-grid">
          <FundItem
            label="Available Margin"
            value={`₹${funds.availableMargin.toFixed(2)}`}
            highlight
          />
          <FundItem label="Used Margin" value={`₹${funds.usedMargin.toFixed(2)}`} />
          <FundItem label="Available Cash" value={`₹${funds.availableCash.toFixed(2)}`} />
          <FundItem
            label="Opening Balance"
            value={`₹${funds.openingBalance}`}
          />
          <FundItem label="Payin" value={`₹${funds.payin}`} />
        </div>  
      </div>
    </div>
  );
};

const FundItem = ({ label, value, highlight }) => (
  <div className={`fund-item ${highlight ? "highlight" : ""}`}>
    <p className="label">{label}</p>
    <p className="value">{value}</p>
  </div>
);

export default Funds;
