import { useEffect, useState } from "react";
import Dashboard from "./Dashboard";
import TopBar from "./TopBar";
import axios from "axios";

const Home = () => {
  const [userName, setUserName] = useState(null);
  // Function to fetch holdings
  const fetchHoldings = () => {
    axios
      .get("tradzen-backend-production.up.railway.app/allHoldings", {
        withCredentials: true,
      })
      .then((res) => {
        setUserName(res.data.name);
      });
  };

  useEffect(() => {
    fetchHoldings(); // Initial fetch
  }, []);

  return (
    <>
      <TopBar userName={userName} />
      <Dashboard userName={userName} />
    </>
  );
};

export default Home;
