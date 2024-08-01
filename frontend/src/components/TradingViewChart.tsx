"use client";
import React, { useEffect, useRef, useCallback } from "react";
import {
  createChart,
  IChartApi,
  ISeriesApi,
  CandlestickData,
  UTCTimestamp,
  Time,
} from "lightweight-charts";
import styles from "../styles/Chart.module.css";

interface DataItem {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

interface TradingViewChartProps {
  data: DataItem[];
  socketData: DataItem[];
  fetchMoreData: (fromTime: number) => Promise<DataItem[]>;
}

function timeToLocal(originalTime: number): UTCTimestamp {
  const localDate = new Date(originalTime * 1000);
  const offset = localDate.getTimezoneOffset() * 60; // getTimezoneOffset returns minutes, convert to seconds
  const localTimestamp = originalTime - offset;
  return localTimestamp as UTCTimestamp;
}

function localToTime(localTime: number): number {
  const localDate = new Date(localTime * 1000);
  const offset = localDate.getTimezoneOffset() * 60; // getTimezoneOffset returns minutes, convert to seconds
  const utcTimestamp = localTime + offset;
  return utcTimestamp;
}

const TradingViewChart: React.FC<TradingViewChartProps> = ({
  data,
  socketData,
  fetchMoreData,
}) => {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const candlestickSeriesRef = useRef<ISeriesApi<"Candlestick"> | null>(null);
  const isFetchingRef = useRef<boolean>(false);
  const lastFetchedTimeRef = useRef<number | null>(null);

  const updateChartData = useCallback(
    async (visibleRange: { from: Time; to: Time } | null) => {
      if (!visibleRange || isFetchingRef.current) {
        return;
      }

      const { from } = visibleRange;
      const oldestVisibleTime = from as number;

      const oldestVisibleLocalTime = localToTime(oldestVisibleTime);

      if (
        oldestVisibleTime >
        ((candlestickSeriesRef.current?.data()[0]?.time as number) || 0)
      ) {
        return;
      }

      if (lastFetchedTimeRef.current === oldestVisibleLocalTime) {
        return;
      }

      isFetchingRef.current = true;
      try {
        const moreData = await fetchMoreData(oldestVisibleLocalTime);
        const convertedMoreData = moreData.map((item) => ({
          ...item,
          time: timeToLocal(item.time),
        }));
        const existingData = candlestickSeriesRef.current?.data() || [];
        const allData = [...existingData, ...convertedMoreData];
        const uniqueData = Array.from(
          new Map(allData.map((item) => [item.time as number, item])).values()
        );

        uniqueData.sort((a, b) => (a.time as number) - (b.time as number));
        candlestickSeriesRef.current?.setData(
          uniqueData as CandlestickData<UTCTimestamp>[]
        );
        lastFetchedTimeRef.current = oldestVisibleLocalTime;
      } catch (error) {
        console.error("Error fetching more data:", error);
      } finally {
        isFetchingRef.current = false;
      }
    },
    [fetchMoreData]
  );

  useEffect(() => {
    if (chartContainerRef.current && !chartRef.current) {
      const chart = createChart(chartContainerRef.current, {
        width: chartContainerRef.current.clientWidth,
        height: chartContainerRef.current.clientHeight,
        timeScale: {
          timeVisible: true,
          secondsVisible: true,
        },
      });

      chartRef.current = chart;

      const candlestickSeries = chart.addCandlestickSeries({
        upColor: "#26a69a",
        downColor: "#ef5350",
        borderVisible: false,
        wickUpColor: "#26a69a",
        wickDownColor: "#ef5350",
      });

      candlestickSeriesRef.current = candlestickSeries;

      chart.timeScale().subscribeVisibleTimeRangeChange(updateChartData);
    }
  }, [updateChartData]);

  useEffect(() => {
    if (candlestickSeriesRef.current) {
      const convertedData = data.map((item) => ({
        ...item,
        time: timeToLocal(item.time),
      }));
      const existingData = candlestickSeriesRef.current.data() || [];

      const dataMap = new Map<number, DataItem>();
      existingData.forEach((item) => {
        if ("open" in item) {
          dataMap.set(item.time as number, item as unknown as DataItem);
        }
      });
      convertedData.forEach((item) => dataMap.set(item.time, item));

      const allData = Array.from(dataMap.values()).sort(
        (a, b) => a.time - b.time
      );

      candlestickSeriesRef.current.setData(
        allData as unknown as CandlestickData<UTCTimestamp>[]
      );
    }
  }, [data]);

  useEffect(() => {
    if (candlestickSeriesRef.current && socketData.length > 0) {
      const item = socketData[socketData.length - 1];
      candlestickSeriesRef.current.update({
        ...item,
        time: timeToLocal(item.time),
      });
    }
  }, [socketData]);

  useEffect(() => {
    const handleResize = () => {
      if (chartRef.current && chartContainerRef.current) {
        chartRef.current.resize(
          chartContainerRef.current.clientWidth,
          chartContainerRef.current.clientHeight
        );
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return <div ref={chartContainerRef} className={styles.chart}></div>;
};

export default TradingViewChart;
