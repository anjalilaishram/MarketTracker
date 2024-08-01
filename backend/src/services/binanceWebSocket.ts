import WebSocket from 'ws';
import { CONFIG } from "../config/constants";
import { addToQueue } from "./redisQueue";
import { ConfigModel } from "../models/configModel";
import { getLastCachedCandle } from './historicalDataHandler';
import redisClient from '../config/redis'; // Import redis client

class BinanceWebSocket {
    private ws: WebSocket | null = null;

    constructor() {
        this.connectWebSocket();
    }

    public async connectWebSocket() {
        if (this.ws && this.ws.readyState !== WebSocket.CLOSED) {
            console.log("WebSocket is already open or connecting.");
            return;
        }

        this.ws = new WebSocket(CONFIG.BINANCE_WS_URL);

        this.ws.on('open', async () => {
            console.log("WebSocket connection opened");
            const symbols = await this.fetchSymbolsFromDB();
            const streams = symbols.map(symbol => `${symbol.toLowerCase()}@kline_1s`);
            const params = { method: "SUBSCRIBE", params: streams, id: 1 };
            this.ws?.send(JSON.stringify(params));
        });

        this.ws.on('message', async (data) => {
            const message = JSON.parse(data.toString());
            await this.handleWebSocketMessage(message);
        });

        this.ws.on('error', (error) => {
            console.error("WebSocket error:", error);
        });

        this.ws.on('close', () => {
            console.log("WebSocket connection closed, reconnecting...");
            setTimeout(() => this.connectWebSocket(), 5000);
        });
    }

    private async fetchSymbolsFromDB(): Promise<string[]> {
        const configs = await ConfigModel.find().select("symbol -_id").exec();
        return configs.map(config => config.symbol);
    }

    private async handleWebSocketMessage(message: any) {
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
            // console.log(`Added candle data for ${message.s} to queue`);
        }
    }

    public async subscribeToSymbol(symbol: string) {
        const stream = `${symbol.toLowerCase()}@kline_1s`;
        if (this.ws && this.ws.readyState === WebSocket.OPEN) {
            this.ws.send(JSON.stringify({
                method: "SUBSCRIBE",
                params: [stream],
                id: Date.now(),
            }));
            console.log(`Subscribed to ${symbol}`);
        } else {
            console.log(`WebSocket is not open. Cannot subscribe to ${symbol}`);
        }
    }

    public async unsubscribeFromSymbol(symbol: string) {
        const stream = `${symbol.toLowerCase()}@kline_1s`;
        if (this.ws && this.ws.readyState === WebSocket.OPEN) {
            this.ws.send(JSON.stringify({
                method: "UNSUBSCRIBE",
                params: [stream],
                id: Date.now(),
            }));
            console.log(`Unsubscribed from ${symbol}`);
        } else {
            console.log(`WebSocket is not open. Cannot unsubscribe from ${symbol}`);
        }
    }
}
const binanceWebSocket = new BinanceWebSocket();
export default binanceWebSocket;
