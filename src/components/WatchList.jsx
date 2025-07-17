import { useState } from "react";
import GeneralContext from "./GeneralContext";
import { watchlist } from "../data/data";
import { Tooltip, Grow } from "@mui/material";
import {
  BarChartOutlined,
  KeyboardArrowDown,
  KeyboardArrowUp,
  MoreHoriz,
} from "@mui/icons-material";
import { useContext } from "react";
import { DoughnutChart } from "./DoughnutChart";
import { useRef } from "react";

const labels = watchlist.map((h) => h["name"]);

const WatchList = () => {
  const chartRef = useRef(null);

  const data = {
    labels,
    datasets: [
      {
        label: "Price",
        data: watchlist.map((stock) => stock.price),
        backgroundColor: [
          "rgba(255, 99, 132, 0.6)",
          "rgba(54, 162, 235, 0.6)",
          "rgba(255, 206, 86, 0.6)",
          "rgba(75, 192, 192, 0.6)",
          "rgba(153, 102, 255, 0.6)",
          "rgba(255, 159, 64, 0.6)",
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(153, 102, 255, 1)",
          "rgba(255, 159, 64, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="watchlist-container">
      <div className="search-container">
        <input
          type="text"
          name="search"
          id="search"
          placeholder="Search eg:infy, bse, nifty fut weekly, gold mcx"
          className="search"
        />
        <span className="counts"> {watchlist.length}/ 50</span>
      </div>

      <ul className="list">
        {watchlist.map((stock, idx) => {
          return <WatchlistItems stock={stock} key={idx} chartRef={chartRef} />;
        })}
      </ul>

      <div ref={chartRef}>
        <DoughnutChart data={data} />
      </div>
    </div>
  );
};

const WatchlistItems = ({ stock, idx, chartRef }) => {
  const [showWishlistActions, setShowWishlistActions] = useState(true);

  const handleMouseEnter = (e) => {
    setShowWishlistActions(true);
  };

  const handleMouseLeave = (e) => {
    setShowWishlistActions(false);
  };
  return (
    <li onMouseLeave={handleMouseLeave} onMouseEnter={handleMouseEnter}>
      <div className="item">
        <p className={stock.isDown ? "down mt-3" : "up mt-3"}>{stock.name}</p>
        <div className="item-info">
          <span className="percent">{stock.percent}</span>
          <span className={stock.isDown ? "down" : "up"}>
            {stock.isDown ? <KeyboardArrowDown /> : <KeyboardArrowUp />}
          </span>

          <span className="price">{stock.price}</span>
        </div>
      </div>
      {showWishlistActions && (
        <WatchListActions uid={stock.name} stock={stock} chartRef={chartRef} />
      )}
    </li>
  );
};

const WatchListActions = ({ uid, stock, chartRef  }) => {
  const generalContext = useContext(GeneralContext);

  const handleBuyClick = () => {
    generalContext.openBuyWindow(uid, stock);
  };

  const handleSellClick = () => {
    generalContext.openSellWindow(uid, stock);
  };

  const handleAnalyticsClick = () => {
    chartRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <span className="actions">
      <span
        style={{
          display: "flex",
          marginRight: "2rem",
        }}
      >
        <Tooltip title="Buy (B)" placement="top" arrow onClick={handleBuyClick}>
          <button className="buy">Buy</button>
        </Tooltip>

       
        <Tooltip title="Analytics (A)" placement="top" arrow>
          <button className="action" onClick={handleAnalyticsClick}>
            <BarChartOutlined className="icon" />
          </button>
        </Tooltip>
        <Tooltip title="More" placement="top" arrow>
          <button className="action">
            <MoreHoriz className="icon" />
          </button>
        </Tooltip>
      </span>
    </span>
  );
};

export default WatchList;
