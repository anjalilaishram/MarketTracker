
// backend/src/services/dataService.ts

import axios from "axios";
import redisClient from "../config/redis";
import { CandleModel } from "../models/candleModel";
import { CONFIG } from "../config/constants";

export class DataService {
    static async getLiveData(symbol: string) {
        const cachedData = await redisClient.get(`live_data_${symbol}`);
        if (cachedData) {
            return JSON.parse(cachedData);
        }

        const response = await axios.get(`${CONFIG.BINANCE_API_BASE_URL}/api/v3/klines`, {
            params: { symbol, interval: "1s" },
        });

        const liveData = response.data;
        await redisClient.set(`live_data_${symbol}`, JSON.stringify(liveData));
        return liveData;
    }

    static async getHistoricalData(symbol: string, startTime: string, endTime: string) {
        const response = await axios.get(`${CONFIG.BINANCE_API_BASE_URL}/api/v3/klines`, {
            params: { symbol, interval: "1s", startTime, endTime },
        });

        const historicalData = response.data;
        for (const candle of historicalData) {
            const [timestamp, open, high, low, close, volume] = candle;
            await CandleModel.create({ symbol, timestamp, open, high, low, close, volume });
        }

        return historicalData;
    }
}

