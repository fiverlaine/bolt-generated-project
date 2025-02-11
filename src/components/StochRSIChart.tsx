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
    values: Array<{
      k: number;
      d: number;
    }>;
  };
}

const StochRSIChart: React.FC<Props> = ({ data }) => {
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
        text: 'Stochastic RSI',
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
        min: 0,
        max: 100,
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
          drawBorder: false
        },
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
        label: '%K',
        data: data.values.map(v => v.k),
        borderColor: '#22c55e',
        borderWidth: 1,
        tension: 0.1,
        pointRadius: 0
      },
      {
        label: '%D',
        data: data.values.map(v => v.d),
        borderColor: '#f59e0b',
        borderWidth: 1,
        tension: 0.1,
        pointRadius: 0
      },
      {
        label: 'Overbought',
        data: Array(data.labels.length).fill(80),
        borderColor: '#ef4444',
        borderWidth: 1,
        borderDash: [2, 2],
        pointRadius: 0
      },
      {
        label: 'Oversold',
        data: Array(data.labels.length).fill(20),
        borderColor: '#ef4444',
        borderWidth: 1,
        borderDash: [2, 2],
        pointRadius: 0
      }
    ]
  };

  return (
    <div className="w-full h-full bg-gray-900 rounded-lg p-2">
      <Line options={options} data={chartData} />
    </div>
  );
};

export default StochRSIChart;
