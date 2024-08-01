// src/redux/store.ts
import { configureStore } from '@reduxjs/toolkit';
import symbolsReducer from './symbolsSlice';

export const store = configureStore({
  reducer: {
    symbols: symbolsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
