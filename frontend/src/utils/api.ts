import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const fetchHistoricalData = async (symbol: string, startTime: number, endTime: number) => {
  const response = await axios.get(`${API_URL}/data/historical/${symbol}`, {
    params: { startTime, endTime },
  });
  return response.data;
};

export const fetchRecentEntries = async (symbol: string) => {
  const endTime = Math.floor(Date.now() / 1000); // Current time in seconds
  const startTime = endTime - 20 * 60; // 20 minutes ago in seconds
  const historicalData = await fetchHistoricalData(symbol, startTime * 1000, endTime * 1000);
  return historicalData.data.map((candle: any) => ({
    time: candle.t / 1000,
    open: candle.o,
    high: candle.h,
    low: candle.l,
    close: candle.c,
    volume: candle.v,
  }));
};