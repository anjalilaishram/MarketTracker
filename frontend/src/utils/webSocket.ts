// utils/webSocket.ts
export const connectWebSocket = (symbol: string) => {
    const socket = new WebSocket(
      `wss://stream.binance.com:9443/ws/${symbol.toLowerCase()}@kline_1s`
    );
    return socket;
  };
  
  export const handleWebSocketMessage = (event: MessageEvent) => {
    const message = JSON.parse(event.data);
    const kline = message.k;
    return {
      time: kline.t / 1000,
      open: parseFloat(kline.o),
      high: parseFloat(kline.h),
      low: parseFloat(kline.l),
      close: parseFloat(kline.c),
      volume: parseFloat(kline.v),
    };
  };
  