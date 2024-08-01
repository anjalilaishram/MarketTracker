import WebSocket from 'ws';
import { CONFIG } from "../config/constants";
import { addToQueue } from "./redisQueue";
import { ConfigModel } from "../models/configModel";
import { getLastCachedCandle } from './historicalDataHandler';
import redisClient from '../config/redis'; // Import redis client

let ws: WebSocket;

const connectWebSocket = async () => {
    ws = new WebSocket(CONFIG.BINANCE_WS_URL);

    ws.on('open', async () => {
        console.log("WebSocket connection opened");
        const symbols = await fetchSymbolsFromDB();
        const streams = symbols.map(symbol => `${symbol}@kline_1s`);
        const params = { method: "SUBSCRIBE", params: streams, id: 1 };
        ws.send(JSON.stringify(params));
    });

    ws.on('message', async (data) => {
        const message = JSON.parse(data.toString());
        await handleWebSocketMessage(message);
    });

    ws.on('error', (error) => {
        console.error("WebSocket error:", error);
    });

    ws.on('close', () => {
        console.log("WebSocket connection closed, reconnecting...");
        setTimeout(connectWebSocket, 5000);
    });
};

const fetchSymbolsFromDB = async (): Promise<string[]> => {
    const configs = await ConfigModel.find().select("symbol -_id").exec();
    return configs.map(config => config.symbol);
};

const handleWebSocketMessage = async (message: any) => {
    if (message.e === "kline") {
        const kline = message.k;
        const candleData = {
            s: message.s,    // symbol
            t: kline.t,      // timestamp
            o: kline.o,      // open
            h: kline.h,      // high
            l: kline.l,      // low
            c: kline.c,      // close
            v: kline.v,      // volume
        };

        const lastCachedCandle = await getLastCachedCandle(message.s);
        await redisClient.set(`last_cached_${message.s}`, JSON.stringify(candleData));

        if (lastCachedCandle && kline.t > lastCachedCandle.t + 1000) {
            // Historical data is missing
            const startTime = lastCachedCandle.t + 1000;
            const endTime = kline.t - 1000;
            await addToQueue({ type: 'historical', symbol: message.s, startTime, endTime });
        }

        await addToQueue({ type: 'live', data: candleData });
        console.log(`Added candle data for ${message.s} to queue`);
    }
};

export const subscribeToSymbol = async (symbol: string) => {
    const stream = `${symbol}@kline_1s`;
    if (ws && ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({
            method: "SUBSCRIBE",
            params: [stream],
            id: Date.now(),
        }));
        console.log(`Subscribed to ${symbol}`);
    }
};

export const unsubscribeFromSymbol = async (symbol: string) => {
    const stream = `${symbol}@kline_1s`;
    if (ws && ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({
            method: "UNSUBSCRIBE",
            params: [stream],
            id: Date.now(),
        }));
        console.log(`Unsubscribed from ${symbol}`);
    }
};

export { connectWebSocket };
