import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "./menu.css";

const Menu = ({ userName }) => {
  const [selectedMenu, setSelectedMenu] = useState(0);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [username, setUsername] = useState("USER");

  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    if (storedUsername) setUsername(storedUsername);
  }, []);

  const handleLogout = async () => {
    try {
      await axios.get("tradzen-backend-production.up.railway.app/logout", {
        withCredentials: true,
      });
      window.location.href = "https://trad-zen-frontend-hcz2.vercel.app/?logout=true";
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  const handleMenuClick = (idx) => {
    setSelectedMenu(idx);
  };

  const menuItems = [
    "Dashboard",
    "Orders",
    "Holdings",
    "Positions",
    "Funds",
    "Apps",
  ];

  return (
    <div className="menu-container">
      <div className="menu-left">
        <img src="/logo.png" alt="Logo" className="logo" />
        <ul className="menu-items">
          {menuItems.map((item, idx) => (
            <li key={idx}>
              <Link
                to={idx === 0 ? "/" : `/${item.toLowerCase()}`}
                onClick={() => handleMenuClick(idx)}
                className={selectedMenu === idx ? "active-link" : ""}
              >
                {item}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <div
        className="profile-section"
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
      >
        <div className="avatar">
          {(userName || username).slice(0, 2).toUpperCase()}
        </div>
        <span className="username">{userName || username}</span>
        <i
          className={`fa-solid fa-caret-down caret ${
            isDropdownOpen ? "rotate" : ""
          }`}
        ></i>

        {isDropdownOpen && (
          <div className="dropdown">
            <p
              onClick={() => (window.location.href = "https://trad-zen-frontend-hcz2.vercel.app/")}
            >
              🏠 Go to Home
            </p>
            <p onClick={handleLogout} className="logout">
              🚪 Logout
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Menu;
