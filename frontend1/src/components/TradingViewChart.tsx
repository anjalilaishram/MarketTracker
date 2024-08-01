
// frontend/src/components/TradingViewChart.tsx

import React, { useEffect } from "react";
import { createChart, IChartApi } from "lightweight-charts";

interface TradingViewChartProps {
    data: any[];
}

const TradingViewChart: React.FC<TradingViewChartProps> = ({ data }) => {
    useEffect(() => {
        const chart: IChartApi = createChart(document.getElementById("chart")!, { width: 600, height: 400 });
        const candleSeries = chart.addCandlestickSeries();
        candleSeries.setData(data);

        return () => chart.remove();
    }, [data]);

    return <div id="chart" />;
};

export default TradingViewChart;

