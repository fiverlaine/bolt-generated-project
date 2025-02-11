import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface Props {
  data: {
    labels: string[];
    values: number[];
    atr: number[];
  };
}

const ADXChart: React.FC<Props> = ({ data }) => {
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index' as const,
      intersect: false,
    },
    plugins: {
      legend: {
        display: true,
        position: 'top' as const,
        labels: {
          color: '#9CA3AF',
          font: { size: 8 },
          boxWidth: 8,
          padding: 4
        }
      },
      title: {
        display: true,
        text: 'ADX & ATR',
        color: '#9CA3AF',
        font: { size: 10 },
        padding: { bottom: 10 }
      },
      tooltip: {
        enabled: true,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleFont: { size: 10 },
        bodyFont: { size: 10 }
      }
    },
    scales: {
      x: {
        display: true,
        grid: { display: false },
        ticks: { display: false }
      },
      y: {
        display: true,
        position: 'right' as const,
        grid: { display: false },
        ticks: {
          color: '#6B7280',
          font: { size: 8 }
        }
      },
      y1: {
        display: true,
        position: 'left' as const,
        grid: { display: false },
        ticks: {
          color: '#6B7280',
          font: { size: 8 }
        }
      }
    }
  };

  const chartData = {
    labels: data.labels,
    datasets: [
      {
        label: 'ADX',
        data: data.values,
        borderColor: '#22c55e',
        borderWidth: 1,
        tension: 0.1,
        pointRadius: 0,
        yAxisID: 'y'
      },
      {
        label: 'ATR',
        data: data.atr,
        borderColor: '#f59e0b',
        borderWidth: 1,
        tension: 0.1,
        pointRadius: 0,
        yAxisID: 'y1'
      },
      {
        label: 'Trend Strength',
        data: Array(data.labels.length).fill(25),
        borderColor: '#ef4444',
        borderWidth: 1,
        borderDash: [2, 2],
        pointRadius: 0,
        yAxisID: 'y'
      }
    ]
  };

  return (
    <div className="w-full h-full bg-gray-900 rounded-lg p-2">
      <Line options={options} data={chartData} />
    </div>
  );
};

export default ADXChart;
