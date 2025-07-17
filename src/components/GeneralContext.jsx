import React, { useState } from "react";

import BuyActionWindow from "./BuyActionWindow";
import SellActionWindow from "./SellActionWindow";

const GeneralContext = React.createContext({
  openBuyWindow: (uid) => {},
  openSellWindow: (uid) => {},
  closeBuyWindow: () => {},
  closeSellWindow: () => {},
});

export const GeneralContextProvider = (props) => {
  const [isBuyWindowOpen, setIsBuyWindowOpen] = useState(false);
  const [isSellWindowOpen, setIsSellWindowOpen] = useState(false);
  const [selectedStockUID, setSelectedStockUID] = useState("");
  const [selectedStock, setSelectedStock] = useState(null);
  const [holdingsUpdated, setHoldingsUpdated] = useState(false);

  const handleOpenBuyWindow = (uid, stock) => {
    setIsBuyWindowOpen(true);
    setSelectedStockUID(uid);
    setSelectedStock(stock);

    setIsSellWindowOpen(false);
  };

  const handleOpenSellWindow = (uid, stock) => {
    setIsSellWindowOpen(true);
    setIsBuyWindowOpen(false);
    setSelectedStockUID(uid);
    setSelectedStock(stock);

    setIsBuyWindowOpen(false);
  };
  const handleCloseBuyWindow = () => {
    setIsBuyWindowOpen(false);
    setSelectedStockUID("");
    setSelectedStock(null);
    setIsSellWindowOpen(false);
  };

  const handleCloseSellWindow = () => {
    setIsSellWindowOpen(false);
    setSelectedStockUID("");
    setSelectedStock(null);
    setIsBuyWindowOpen(false);
  };

  const triggerHoldingsUpdate = () => {
    setHoldingsUpdated((prev) => !prev); // toggles value to trigger useEffect
  };

  return (
    <GeneralContext.Provider
      value={{
        openBuyWindow: handleOpenBuyWindow,
        openSellWindow: handleOpenSellWindow,
        closeSellWindow: handleCloseSellWindow,
        closeBuyWindow: handleCloseBuyWindow,
        holdingsUpdated, //  Export to Holdings.jsx
        triggerHoldingsUpdate, //  Export to SellActionWindow.jsx
      }}
    >
      {props.children}
      {isBuyWindowOpen && (
        <BuyActionWindow uid={selectedStockUID} stock={selectedStock} />
      )}
      {isSellWindowOpen && (
        <SellActionWindow uid={selectedStockUID} stock={selectedStock} />
      )}
    </GeneralContext.Provider>
  );
};

export default GeneralContext;
