import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  BarElement,
  BarController
} from 'chart.js';
import { Chart } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  BarController,
  Title,
  Tooltip,
  Legend
);

interface Props {
  data: {
    labels: string[];
    macd: Array<{
      MACD: number;
      signal: number;
      histogram: number;
    }>;
  };
}

export const MACDChart: React.FC<Props> = ({ data }) => {
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
        text: 'MACD',
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
        label: 'MACD',
        data: data.macd.map(v => v.MACD),
        borderColor: '#22c55e',
        borderWidth: 1,
        tension: 0.1,
        pointRadius: 0,
        type: 'line'
      },
      {
        label: 'Signal',
        data: data.macd.map(v => v.signal),
        borderColor: '#f59e0b',
        borderWidth: 1,
        tension: 0.1,
        pointRadius: 0,
        type: 'line'
      },
      {
        label: 'Histogram',
        data: data.macd.map(v => v.histogram),
        type: 'bar',
        backgroundColor: (context: any) => {
          const value = context.raw;
          return value >= 0 ? 'rgba(34, 197, 94, 0.5)' : 'rgba(239, 68, 68, 0.5)';
        },
        borderColor: (context: any) => {
          const value = context.raw;
          return value >= 0 ? '#22c55e' : '#ef4444';
        },
        borderWidth: 1
      }
    ]
  };

  return (
    <div className="w-full h-full">
      <Chart type="bar" options={options} data={chartData} />
    </div>
  );
};

export default MACDChart;
