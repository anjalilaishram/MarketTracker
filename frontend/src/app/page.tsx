// src/app/page.tsx
"use client";
import React from "react";
import { Provider } from "react-redux";
import { store } from "../redux/store";
import TradingViewChart from "../components/TradingViewChart";
import SymbolManager from "../components/SymbolManager";

const Page: React.FC = () => {
  return (
    <Provider store={store}>
      <div>
        <SymbolManager />
        <TradingViewChart />
      </div>
    </Provider>
  );
};

export default Page;
