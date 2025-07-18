import { useEffect, useState } from "react";
import axios from "axios";
import "./Orders.css"; // Ensure this CSS is imported

const Orders = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get("https://tradzen-backend-production.up.railway.app/api/orders", {
          withCredentials: true,
        });
        setOrders(res.data);
      } catch (err) {
        console.error("Error fetching orders", err);
      }
    };

    fetchOrders();
  }, []);

  if (orders.length === 0) {
    return (
      <div className="orders-container">
        <div className="no-orders">
          <p>You haven’t placed any orders today.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="orders-container">
      <h2 className="title">Your Orders</h2>
      <div className="orders-grid">
        {orders.map((order) => (
          <div key={order._id} className={`order-card ${order.mode.toLowerCase()}`}>
            <div className="order-top">
              <span className="stock-name">{order.name}</span>
              <span className="order-type">{order.mode}</span>
            </div>
            <div className="order-middle">
              <p>
                Qty: <strong>{order.qty}</strong>
              </p>
              <p>
                Price: <strong>₹{order.price}</strong>
              </p>
            </div>
            <div className="order-bottom">
              <span>{new Date(order.date).toLocaleString()}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Orders;
