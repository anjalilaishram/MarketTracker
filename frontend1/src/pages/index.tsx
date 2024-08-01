// frontend/src/pages/index.tsx

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { addSymbol } from "../redux/symbolsSlice";
import TradingViewChart from "../components/TradingViewChart";
import SymbolTable from "../components/SymbolTable";

const IndexPage: React.FC = () => {
  const [symbol, setSymbol] = useState("");
  const [data, setData] = useState([]);
  const symbols = useSelector((state: RootState) => state.symbols.symbols); // Access symbols array correctly
  const dispatch = useDispatch();

  const handleAddSymbol = () => {
    if (symbol && !symbols.includes(symbol)) {
      dispatch(addSymbol(symbol));
      setSymbol("");
    }
  };

  useEffect(() => {
    // Fetch initial data for the first symbol in the list
    if (symbols.length > 0) {
      const fetchData = async () => {
        const response = await fetch(`/api/data/live/${symbols[0]}`);
        const result = await response.json();
        setData(result.data);
      };
      fetchData();
    }
  }, [symbols]);

  return (
    <div>
      <h1>Real-Time Data Tracker</h1>
      <div>
        <input
          type="text"
          value={symbol}
          onChange={(e) => setSymbol(e.target.value)}
          placeholder="Add Symbol"
        />
        <button onClick={handleAddSymbol}>Add Symbol</button>
      </div>
      <SymbolTable />
      {symbols.length > 0 && <TradingViewChart data={data} />}
    </div>
  );
};

export default IndexPage;
