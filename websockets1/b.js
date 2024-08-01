const WebSocket = require("ws");

const symbols = ["btcusdt", "ethusdt", "bnbusdt", "adausdt", "xrpusdt"]; // Symbols for BTC/USDT, ETH/USDT, BNB/USDT, ADA/USDT, XRP/USDT
const interval = "1s"; // Interval for OHLCV data (1 second)

// Create a WebSocket connection to Binance
const ws = new WebSocket("wss://stream.binance.com:9443/ws");

ws.on("open", () => {
  console.log("WebSocket connection opened");

  // Subscribe to multiple streams
  const streams = symbols.map((symbol) => `${symbol}@kline_${interval}`);
  const params = {
    method: "SUBSCRIBE",
    params: streams,
    id: 1,
  };
  ws.send(JSON.stringify(params));
});

ws.on("message", (data) => {
  const parsedData = JSON.parse(data);

  if (parsedData.e && parsedData.e === "kline") {
    const kline = parsedData.k;
    const symbol = parsedData.s;
    const timestamp = kline.t;
    const open = kline.o;
    const high = kline.h;
    const low = kline.l;
    const close = kline.c;
    const volume = kline.v;

    const date = new Date(timestamp);
    console.log(
      `Symbol: ${symbol} | Local Time: ${date.toLocaleString()} | Open: ${open} | High: ${high} | Low: ${low} | Close: ${close} | Volume: ${volume}`
    );
  }
});

ws.on("close", () => {
  console.log("WebSocket connection closed");
});

ws.on("error", (error) => {
  console.error("WebSocket error:", error);
});
