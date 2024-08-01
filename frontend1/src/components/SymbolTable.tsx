// frontend/src/components/SymbolTable.tsx

import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../redux/store";
import { removeSymbol } from "../redux/symbolsSlice";

const SymbolTable: React.FC = () => {
  const symbols = useSelector((state: RootState) => state.symbols.symbols); // Access symbols array correctly
  const dispatch = useDispatch();

  const handleRemove = (symbol: string) => {
    dispatch(removeSymbol(symbol));
  };

  return (
    <table>
      <thead>
        <tr>
          <th>Symbol</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        {symbols.map((symbol) => (
          <tr key={symbol}>
            <td>{symbol}</td>
            <td>
              <button onClick={() => handleRemove(symbol)}>Remove</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default SymbolTable;
