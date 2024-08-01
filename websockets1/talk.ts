const ccxt = require('ccxt');

async function fetchOHLCV() {
    const exchange = new ccxt.binance();
    const symbol = 'BTC/USDT';  // Replace with your desired trading pair
    const timeframe = '1s';  // Replace with your desired timeframe (e.g., '1m', '5m', '1h', '1d', etc.)
    const since = exchange.parse8601('2024-07-31T12:00:00Z');  // Replace with your desired start date

    try {
        const ohlcv = await exchange.fetchOHLCV(symbol, timeframe, since);
        ohlcv.forEach((candle: any) => {
            const [timestamp, open, high, low, close, volume] = candle;
            const date = new Date(timestamp);
            console.log(`Local Time: ${date.toLocaleString()} | Open: ${open} | High: ${high} | Low: ${low} | Close: ${close} | Volume: ${volume}`);
        });
    } catch (error) {
        console.error(error);
    }
}

fetchOHLCV();
