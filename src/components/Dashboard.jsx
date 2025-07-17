import { Routes, Route } from "react-router-dom";
import Apps from "./Apps";
import Funds from "./Funds";
import Holdings from "./Holdings";
import Orders from "./Orders";
import Positions from "./Positions";
import Summary from "./Summary";
import WatchList from "./WatchList";
import { GeneralContextProvider } from "./GeneralContext";

const Dashboard = ({ userName }) => {
  return (
    <div className="dashboard-container">
      <GeneralContextProvider>
        <WatchList />
      </GeneralContextProvider>
      <div className="content">
        <Routes>
          <Route
            path="/"
            element={<Summary userName={userName}  />}
          />
          <Route path="/orders" element={<Orders />} />
          <Route
            path="/holdings"
            element={
              <GeneralContextProvider>
                <Holdings />
              </GeneralContextProvider>
            }
          />
          <Route path="/positions" element={<Positions />} />
          <Route path="/funds" element={<Funds userName={userName}  />} />
          <Route path="/apps" element={<Apps />} />
        </Routes>
      </div>
    </div>
  );
};

export default Dashboard;
