import { Queue, Worker, QueueEvents } from 'bullmq';
import { CandleModel } from "../models/candleModel";
import { CONFIG } from "../config/constants";
import { fetchOHLCV } from './historicalDataHandler';
import redisClient from '../config/redis'; // Import redis client

const connection = {
    host: CONFIG.REDIS_HOST,
    port: CONFIG.REDIS_PORT,
};

const candleQueue = new Queue('candleQueue', { connection });

const queueEvents = new QueueEvents('candleQueue', { connection });

queueEvents.on('completed', ({ jobId }) => {
    // console.log(`Job completed: ${jobId}`);
});

queueEvents.on('failed', ({ jobId, failedReason }) => {
    console.error(`Job failed: ${jobId}, Reason: ${failedReason}`);
});

const worker = new Worker('candleQueue', async job => {
    const { type, data, symbol, startTime, endTime } = job.data;

    if (type === 'historical') {
        const historicalData = await fetchOHLCV(symbol, '1s', startTime, endTime);
        // console.log(`Processed historical data for ${symbol} from ${startTime} to ${endTime}`);
    } else if (type === 'live') {
        await CandleModel.create(data);
        // console.log(`Processed live candle data for ${data.s}`);
    }

    await redisClient.set(`last_cached_${symbol || data.s}`, JSON.stringify(data || { symbol, startTime, endTime }));
}, { connection });

export const addToQueue = async (payload: any) => {
    await candleQueue.add('candleJob', payload);
};

export default candleQueue;
