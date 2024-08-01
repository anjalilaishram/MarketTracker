
import { configureStore } from '@reduxjs/toolkit';
import symbolsReducer from './symbolsSlice';

export const store = configureStore({
  reducer: {
    symbols: symbolsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
