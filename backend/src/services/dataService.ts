import axios from "axios";
import redisClient from "../config/redis";
import { CandleModel } from "../models/candleModel";
import { CONFIG } from "../config/constants";
import { fetchOHLCV } from "./historicalDataHandler";

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

    static async getHistoricalData(symbol: string, startTime: number, endTime: number) {
        try {
            // Query the CandleModel for the historical data
            const historicalData = await CandleModel.find({
                s: symbol,
                t: { $gte: startTime, $lte: endTime }
            }).select("-_id -__v").exec();
    
            return historicalData;
        } catch (error) {
            console.error("Error fetching historical data:", error);
            throw error;
        }
    }
}
