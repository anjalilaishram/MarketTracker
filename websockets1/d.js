const axios = require("axios");

async function getBinanceSymbols() {
  const url = "https://api.binance.com/api/v3/exchangeInfo";

  try {
    const response = await axios.get(url);
    const symbols = response.data.symbols.map(
      (symbolInfo) => symbolInfo.symbol
    );
    return symbols;
  } catch (error) {
    console.error(`Failed to get data: ${error}`);
    return [];
  }
}

// Fetch and print all symbols
getBinanceSymbols().then((symbols) => {
  console.log(symbols);
});
