// backend/src/services/configService.ts

import { ConfigModel } from "../models/configModel";
import redisClient from "../config/redis";
import { subscribeToSymbol, unsubscribeFromSymbol } from "../config/websocket";

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
            await unsubscribeFromSymbol(existingConfig.symbol);
        }

        const updatedConfig = await ConfigModel.findOneAndUpdate(
            { symbol: configData.symbol },
            configData,
            { new: true, upsert: true }
        );

        await redisClient.del("config");
        await subscribeToSymbol(updatedConfig.symbol);
        return updatedConfig;
    }
}
