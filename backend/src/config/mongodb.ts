
// backend/src/config/mongodb.ts

import mongoose from "mongoose";
import { CONFIG } from "./constants";

export const connectToMongoDB = async (): Promise<void> => {
    try {
        await mongoose.connect(CONFIG.MONGODB_URI);
        console.log("Connected to MongoDB");
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
        process.exit(1);
    }
};

