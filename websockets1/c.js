const axios = require("axios");

async function fetchOHLCV() {
  const symbol = "BTCUSDT"; // Binance uses uppercase symbol without slash
  const interval = "1s"; // Desired timeframe
  const startTime = new Date("2024-07-31T12:00:00Z").getTime(); // Start time in milliseconds
  const endTime = new Date("2024-07-31T12:05:00Z").getTime(); // End time in milliseconds

  const url = `https://api.binance.com/api/v3/klines?symbol=${symbol}&interval=${interval}&startTime=${startTime}&endTime=${endTime}`;

  try {
    const response = await axios.get(url);
    const ohlcv = response.data;

    ohlcv.forEach((candle) => {
      const [timestamp, open, high, low, close, volume] = candle;
      const date = new Date(timestamp);
      console.log(
        `Local Time: ${date.toLocaleString()} | Open: ${open} | High: ${high} | Low: ${low} | Close: ${close} | Volume: ${volume}`
      );
    });
  } catch (error) {
    console.error(error);
  }
}

fetchOHLCV();
