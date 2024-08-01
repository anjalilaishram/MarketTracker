// backend/src/config/websocket.ts

import WebSocket from "ws";
import { CONFIG } from "./constants";

const wsUrl = `${CONFIG.BINANCE_API_BASE_URL.replace("https", "wss")}/ws`;

let ws: WebSocket;

export const connectWebSocket = () => {
    ws = new WebSocket(wsUrl);

    ws.on("open", () => {
        console.log("Connected to Binance WebSocket");
    });

    ws.on("message", (data) => {
        const message = JSON.parse(data.toString());
        handleWebSocketMessage(message);
    });

    ws.on("error", (error) => {
        console.error("WebSocket error:", error);
    });

    ws.on("close", () => {
        console.log("WebSocket connection closed, reconnecting...");
        setTimeout(connectWebSocket, 5000);
    });
};

const handleWebSocketMessage = (message: any) => {
    // Handle incoming WebSocket messages here
    console.log("Received WebSocket message:", message);
    // Process and store the message as needed
};

export const subscribeToSymbol = (symbol: string) => {
    if (ws && ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({
            method: "SUBSCRIBE",
            params: [`${symbol}@kline_1s`],
            id: Date.now(),
        }));
        console.log(`Subscribed to ${symbol}`);
    }
};

export const unsubscribeFromSymbol = (symbol: string) => {
    if (ws && ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({
            method: "UNSUBSCRIBE",
            params: [`${symbol}@kline_1s`],
            id: Date.now(),
        }));
        console.log(`Unsubscribed from ${symbol}`);
    }
};
