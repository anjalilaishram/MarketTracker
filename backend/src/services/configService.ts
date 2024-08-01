// backend/src/services/configService.ts

import { ConfigModel } from "../models/configModel";
import redisClient from "../config/redis";
import binanceWebSocket from "../services/binanceWebSocket";

export class ConfigService {
    static async getConfig() {
        const cachedConfig = await redisClient.get("config");
        if (cachedConfig) {
            return JSON.parse(cachedConfig);
        }

        const config = await ConfigModel.find();
        await redisClient.set("config", JSON.stringify(config));
        return config;
    }

    static async updateConfig(configData: any) {
        const existingConfig = await ConfigModel.findOne({ symbol: configData.symbol });

        if (existingConfig) {
            await binanceWebSocket.unsubscribeFromSymbol(existingConfig.symbol);
        }

        const updatedConfig = await ConfigModel.findOneAndUpdate(
            { symbol: configData.symbol },
            configData,
            { new: true, upsert: true }
        );

        await redisClient.del("config");
        await binanceWebSocket.subscribeToSymbol(updatedConfig.symbol);
        return updatedConfig;
    }

    static async deleteConfig(symbol: string) {
        const config = await ConfigModel.findOne({ symbol });

        if (!config) {
            throw new Error('Configuration not found');
        }

        await binanceWebSocket.unsubscribeFromSymbol(symbol);
        await ConfigModel.deleteOne({ symbol });
        await redisClient.del("config");
        return { message: 'Configuration deleted successfully' };
    }
}
