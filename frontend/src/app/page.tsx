"use client";
import React, { useEffect, useState } from "react";
import { Provider } from "react-redux";
import { store } from "../redux/store";
import TradingViewChart from "../components/TradingViewChart";
import { fetchHistoricalData, fetchRecentEntries } from "../utils/api";
import { connectWebSocket, handleWebSocketMessage } from "../utils/webSocket";

interface DataItem {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

const Page: React.FC = () => {
  const [data, setData] = useState<DataItem[]>([]);
  const [socketData, setSocketData] = useState<DataItem[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const endTime = Math.floor(Date.now() / 1000); // Current time in seconds
      const startTime = endTime - 20 * 60; // 20 minutes ago in seconds
      const historicalData = await fetchHistoricalData(
        "BTCUSDT",
        startTime * 1000,
        endTime * 1000
      );
      setData(
        historicalData.data.map((candle: any) => ({
          time: candle.t / 1000,
          open: candle.o,
          high: candle.h,
          low: candle.l,
          close: candle.c,
          volume: candle.v,
        }))
      );
    };

    fetchData();
  }, []);

  useEffect(() => {
    const socket = connectWebSocket("BTCUSDT");

    socket.onmessage = (event) => {
      const newCandle = handleWebSocketMessage(event);
      setSocketData((prevData) => [...prevData, newCandle]);
    };

    return () => {
      socket.close();
    };
  }, []);

  const fetchMoreData = async (fromTime: number): Promise<DataItem[]> => {
    const endTime = fromTime; // fromTime is already in seconds
    const startTime = endTime - 20 * 60; // 20 minutes before endTime
    const historicalData = await fetchHistoricalData(
      "BTCUSDT",
      startTime * 1000, // Convert to milliseconds for the API call
      endTime * 1000 // Convert to milliseconds for the API call
    );
    const newData = historicalData.data.map((candle: any) => ({
      time: candle.t / 1000,
      open: candle.o,
      high: candle.h,
      low: candle.l,
      close: candle.c,
      volume: candle.v,
    }));
    setData((prevData) => [...newData, ...prevData]);
    return newData;
  };

  return (
    <Provider store={store}>
      <div>
        <TradingViewChart
          data={data}
          socketData={socketData}
          fetchMoreData={fetchMoreData}
        />
      </div>
    </Provider>
  );
};

export default Page;
