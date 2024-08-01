
// backend/src/config/redis.ts

import Redis from "ioredis";
import { CONFIG } from "./constants";

const redisClient = new Redis({
    host: CONFIG.REDIS_HOST,
    port: CONFIG.REDIS_PORT,
});

redisClient.on("connect", () => {
    console.log("Connected to Redis");
});

redisClient.on("error", (err) => {
    console.error("Redis error:", err);
});

export default redisClient;

