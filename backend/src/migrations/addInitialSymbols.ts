// backend/src/migrations/addInitialSymbols.ts

import mongoose from "mongoose";
import { ConfigModel } from "../models/configModel";
import { CONFIG } from "../config/constants";

// MongoDB connection
const connectToMongoDB = async (): Promise<void> => {
    try {
        await mongoose.connect(CONFIG.MONGODB_URI);
        console.log("Connected to MongoDB");
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
        process.exit(1);
    }
};

const initialSymbols = [
    { symbol: "btcusdt", interval: "1s" },
    { symbol: "ethusdt", interval: "1s" },
    { symbol: "bnbusdt", interval: "1s" },
    { symbol: "adausdt", interval: "1s" },
    { symbol: "xrpusdt", interval: "1s" },
];

const upsertInitialSymbols = async () => {
    try {
        for (const symbol of initialSymbols) {
            await ConfigModel.updateOne(
                { symbol: symbol.symbol },
                { $set: symbol },
                { upsert: true }
            );
        }
        console.log("Initial symbols upserted successfully");
    } catch (error) {
        console.error("Error upserting initial symbols:", error);
    }
};

// Connect to MongoDB and upsert initial symbols
connectToMongoDB().then(() => {
    upsertInitialSymbols().then(() => process.exit());
});
