// backend/src/dataMiningService.ts

import express from 'express';
import cors from 'cors';
import { connectToMongoDB } from './config/mongodb';
import { connectWebSocket } from './services/websocket';
import candleQueue from './services/redisQueue';
import { CONFIG } from './config/constants';

const app = express();
const port = process.env.DATA_MINING_PORT || 6000;

app.use(cors());
app.use(express.json());

connectToMongoDB();
connectWebSocket();

app.listen(port, () => {
    console.log(`Data mining service running on port ${port}`);
});

// Example endpoint to check queue status
app.get('/queue/status', async (req, res) => {
    const jobCounts = await candleQueue.getJobCounts();
    res.json(jobCounts);
});
