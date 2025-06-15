import React from 'react';
import ReactApexChart from 'react-apexcharts';
import { ApexOptions } from 'apexcharts';

const chartOptions: ApexOptions = {
  chart: {
    type: 'candlestick',
    height: 400,
    toolbar: {
      show: true,
      tools: {
        download: false,
        selection: true,
        zoom: true,
        zoomin: true,
        zoomout: true,
        pan: true,
      },
    },
  },
  xaxis: {
    type: 'datetime',
  },
  yaxis: {
    tooltip: {
      enabled: true,
    },
  },
};

// Sample data - in real app, this would come from your API
const sampleData = [
  {
    x: new Date(2024, 2, 1),
    y: [150.23, 152.42, 149.85, 151.34]
  },
  {
    x: new Date(2024, 2, 2),
    y: [151.34, 153.98, 151.21, 153.45]
  },
  // Add more data points as needed
];

export function Chart() {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">BTC/USD</h2>
        <div className="flex gap-2">
          <button className="px-3 py-1 text-sm rounded-lg bg-gray-100 hover:bg-gray-200">1H</button>
          <button className="px-3 py-1 text-sm rounded-lg bg-blue-600 text-white">1D</button>
          <button className="px-3 py-1 text-sm rounded-lg bg-gray-100 hover:bg-gray-200">1W</button>
          <button className="px-3 py-1 text-sm rounded-lg bg-gray-100 hover:bg-gray-200">1M</button>
        </div>
      </div>
      <ReactApexChart
        options={chartOptions}
        series={[{ data: sampleData }]}
        type="candlestick"
        height={400}
      />
    </div>
  );
}