import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const fetchHistoricalData = async (symbol: string, startTime: number, endTime: number) => {
  const response = await axios.get(`${API_URL}/data/historical/${symbol}`, {
    params: { startTime, endTime },
  });
  return response.data;
};
