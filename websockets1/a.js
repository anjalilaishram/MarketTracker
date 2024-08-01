const WebSocket = require("ws");

const symbol = "btcusdt"; // Symbol for BTC/USDT
const interval = "1s"; // Interval for OHLCV data (1 second)

// Create a WebSocket connection to Binance
const ws = new WebSocket(
  `wss://stream.binance.com:9443/ws/${symbol}@kline_${interval}`
);

ws.on("open", () => {
  console.log("WebSocket connection opened");
});

ws.on("message", (data) => {
  const parsedData = JSON.parse(data);
  const kline = parsedData.k;
  const timestamp = kline.t;
  const open = kline.o;
  const high = kline.h;
  const low = kline.l;
  const close = kline.c;
  const volume = kline.v;

  const date = new Date(timestamp);
  console.log(
    `Local Time: ${date.toLocaleString()} | Open: ${open} | High: ${high} | Low: ${low} | Close: ${close} | Volume: ${volume}`
  );
});

ws.on("close", () => {
  console.log("WebSocket connection closed");
});

ws.on("error", (error) => {
  console.error("WebSocket error:", error);
});
