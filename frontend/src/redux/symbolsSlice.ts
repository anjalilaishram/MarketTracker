// frontend/src/redux/symbolsSlice.ts

import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface SymbolsState {
    symbols: string[];
}

const initialState: SymbolsState = {
    symbols: ["btcusdt", "ethusdt", "bnbusdt", "adausdt", "xrpusdt"],
};

const symbolsSlice = createSlice({
    name: "symbols",
    initialState,
    reducers: {
        addSymbol: (state, action: PayloadAction<string>) => {
            state.symbols.push(action.payload);
        },
        removeSymbol: (state, action: PayloadAction<string>) => {
            state.symbols = state.symbols.filter(symbol => symbol !== action.payload);
        },
    },
});

export const { addSymbol, removeSymbol } = symbolsSlice.actions;
export default symbolsSlice.reducer;
