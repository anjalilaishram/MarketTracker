import { BinanceClient } from "ccxws";
const binance = new BinanceClient();

// market could be from CCXT or genearted by the user
const market = {
  id: "BTCUSDT", // remote_id used by the exchange
  base: "BTC", // standardized base symbol for Bitcoin
  quote: "USDT", // standardized quote symbol for Tether
};

const market1 = {
  id: "ETHUSDT", // remote_id used by the exchange
  base: "ETH", // standardized base symbol for Ethereum
  quote: "USDT", // standardized quote symbol for Tether
};


binance.on("ticker", ticker => console.log(ticker));
binance.on("candle", ticker => console.log(ticker));
// binance.subscribeTicker(market);
binance.subscribeCandles(market);
// binance.subscribeTicker(market1);
