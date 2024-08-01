
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface SymbolState {
  trackedSymbols: string[];
}

const initialState: SymbolState = {
  trackedSymbols: [],
};

const symbolsSlice = createSlice({
  name: 'symbols',
  initialState,
  reducers: {
    addSymbol: (state, action: PayloadAction<string>) => {
      state.trackedSymbols.push(action.payload);
    },
    removeSymbol: (state, action: PayloadAction<string>) => {
      state.trackedSymbols = state.trackedSymbols.filter(symbol => symbol !== action.payload);
    },
  },
});

export const { addSymbol, removeSymbol } = symbolsSlice.actions;
export default symbolsSlice.reducer;
