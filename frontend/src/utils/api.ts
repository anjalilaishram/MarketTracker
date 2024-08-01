
import axios from 'axios';

const API_URL = 'http://127.0.0.1:5000/api';

export const fetchHistoricalData = async (symbol: string, startTime: number, endTime: number) => {
  const response = await axios.get(`${API_URL}/data/historical/${symbol}`, {
    params: { startTime, endTime },
  });
  return response.data;
};
