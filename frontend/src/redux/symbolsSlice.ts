// src/redux/symbolsSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface SymbolState {
  trackedSymbols: string[];
  availableSymbols: string[];
  selectedSymbol: string | null; // Add selectedSymbol state
}

const initialState: SymbolState = {
  trackedSymbols: [],
  availableSymbols: [],
  selectedSymbol: null, // Initialize selectedSymbol
};

const symbolsSlice = createSlice({
  name: 'symbols',
  initialState,
  reducers: {
    setTrackedSymbols: (state, action: PayloadAction<string[]>) => {
      state.trackedSymbols = action.payload;
    },
    setAvailableSymbols: (state, action: PayloadAction<string[]>) => {
      state.availableSymbols = action.payload;
    },
    addSymbol: (state, action: PayloadAction<string>) => {
      state.trackedSymbols.push(action.payload);
    },
    removeSymbol: (state, action: PayloadAction<string>) => {
      state.trackedSymbols = state.trackedSymbols.filter(symbol => symbol !== action.payload);
    },
    setSelectedSymbol: (state, action: PayloadAction<string>) => {
      state.selectedSymbol = action.payload; // Set the selectedSymbol
    },
  },
});

export const { setTrackedSymbols, setAvailableSymbols, addSymbol, removeSymbol, setSelectedSymbol } = symbolsSlice.actions;
export default symbolsSlice.reducer;
