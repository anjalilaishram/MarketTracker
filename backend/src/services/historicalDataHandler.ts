import axios from 'axios';
import { CONFIG } from '../config/constants';
import { CandleModel } from '../models/candleModel';
import redisClient from '../config/redis'; // Import redis client

export const fetchOHLCV = async (symbol: string, interval: string, startTime: number, endTime: number) => {
    const results = [];
    let fetchStartTime = startTime;
    let fetchEndTime = endTime;

    while (fetchStartTime < endTime) {
        const url = `${CONFIG.BINANCE_API_BASE_URL}/api/v3/klines?symbol=${symbol}&interval=${interval}&startTime=${fetchStartTime}&endTime=${fetchEndTime}&limit=500`;
        try {
            const response = await axios.get(url);
            const data = response.data.map((candle: any) => ({
                s: symbol,
                t: candle[0],
                o: candle[1],
                h: candle[2],
                l: candle[3],
                c: candle[4],
                v: candle[5],
            }));

            results.push(...data);

            if (data.length < 500) {
                break; // No more data available
            }

            // Move the fetch start time to the next set of data
            fetchStartTime = data[data.length - 1].t + 1;
        } catch (error) {
            console.error('Error fetching historical data:', error);
            throw error;
        }
    }

    return results;
};

export const getLastCachedCandle = async (symbol: string) => {
    const lastCandle = await redisClient.get(`last_cached_${symbol}`);
    return lastCandle ? JSON.parse(lastCandle) : null;
};
