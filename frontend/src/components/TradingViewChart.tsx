import React, { useEffect, useRef, useState } from "react";
import {
  createChart,
  IChartApi,
  ISeriesApi,
  CandlestickData,
  UTCTimestamp,
  Time,
} from "lightweight-charts";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { fetchHistoricalData } from "../utils/api";
import { connectWebSocket, handleWebSocketMessage } from "../utils/webSocket";
import styles from "../styles/Chart.module.css";

interface DataItem {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

function timeToLocal(originalTime: number): UTCTimestamp {
  const localDate = new Date(originalTime * 1000);
  const offset = localDate.getTimezoneOffset() * 60;
  return (originalTime - offset) as UTCTimestamp;
}

function localToTime(localTime: number): number {
  const localDate = new Date(localTime * 1000);
  const offset = localDate.getTimezoneOffset() * 60;
  return localTime + offset;
}

const TradingViewChart: React.FC = () => {
  const [data, setData] = useState<DataItem[]>([]);
  const [socketData, setSocketData] = useState<DataItem[]>([]);
  const selectedSymbol =
    useSelector((state: RootState) => state.symbols.selectedSymbol) ||
    "BTCUSDT";
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const candlestickSeriesRef = useRef<ISeriesApi<"Candlestick"> | null>(null);
  const isFetchingRef = useRef<boolean>(false);
  const lastFetchedTimeRef = useRef<number | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const endTime = Math.floor(Date.now() / 1000);
      const startTime = endTime - 20 * 60;
      const historicalData = await fetchHistoricalData(
        selectedSymbol,
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
  }, [selectedSymbol]);

  useEffect(() => {
    const socket = connectWebSocket(selectedSymbol);

    socket.onmessage = (event) => {
      const newCandle = handleWebSocketMessage(event);
      setSocketData((prevData) => [...prevData, newCandle]);
    };

    return () => {
      socket.close();
    };
  }, [selectedSymbol]);

  const fetchMoreData = async (fromTime: number): Promise<DataItem[]> => {
    const endTime = fromTime;
    const startTime = endTime - 20 * 60;
    const historicalData = await fetchHistoricalData(
      selectedSymbol,
      startTime * 1000,
      endTime * 1000
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

  useEffect(() => {
    if (chartContainerRef.current) {
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

      const updateChartData = async (
        visibleRange: { from: Time; to: Time } | null
      ) => {
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
      };

      // Function to format tick marks with dynamic precision
      const formatPrice = (price: number, precision: number) =>
        price.toFixed(precision);

      const updatePriceScalePrecision = () => {
        const priceScale = chart.priceScale("right");
        const dataSeries = candlestickSeriesRef.current?.data() || [];
        if (dataSeries.length === 0) return;

        const minPrice = Math.min(...dataSeries.map((d: any) => d.low));
        const maxPrice = Math.max(...dataSeries.map((d: any) => d.high));
        const range = maxPrice - minPrice;
        const precision = range > 1 ? 2 : range > 0.1 ? 3 : 4;

        priceScale.applyOptions({
          scaleMargins: {
            top: 0.1,
            bottom: 0.2,
          },
        });
      };

      chart.timeScale().subscribeVisibleTimeRangeChange(updateChartData);

      // Initial precision update and subscribe to chart updates
      updatePriceScalePrecision();
      chart.subscribeCrosshairMove(() => {
        updatePriceScalePrecision();
      });

      return () => {
        chart.remove();
        candlestickSeriesRef.current = null;
        chartRef.current = null;
      };
    }
  }, [selectedSymbol]);

  useEffect(() => {
    if (candlestickSeriesRef.current) {
      const convertedData = data.map((item) => ({
        ...item,
        time: timeToLocal(item.time),
      }));
      const uniqueData = Array.from(
        new Map(
          convertedData.map((item) => [item.time as number, item])
        ).values()
      );
      candlestickSeriesRef.current.setData(
        uniqueData as CandlestickData<UTCTimestamp>[]
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
