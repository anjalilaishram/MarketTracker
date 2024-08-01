// backend/src/config/constants.ts

export const CONFIG = {
    BINANCE_API_BASE_URL: process.env.BINANCE_API_BASE_URL || "https://api.binance.com",
    BINANCE_WS_URL: process.env.BINANCE_WS_URL || "wss://stream.binance.com:9443/ws",
    MONGODB_URI: process.env.MONGODB_URI || "mongodb://localhost:27017/market_tracker",
    REDIS_HOST: process.env.REDIS_HOST || "localhost",
    REDIS_PORT: process.env.REDIS_PORT ? parseInt(process.env.REDIS_PORT) : 6379
};
