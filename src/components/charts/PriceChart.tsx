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
  LineController
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import 'chartjs-plugin-annotation';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  LineController,
  Title,
  Tooltip,
  Legend
);

interface Props {
  data: {
    labels: string[];
    prices: number[];
    ema20: number[];
    ema50: number[];
    supportResistance: Array<{
      price: number;
      strength: number;
      type: 'support' | 'resistance';
    }>;
    pivotPoints: {
      pivot: number;
      r1: number;
      r2: number;
      s1: number;
      s2: number;
    };
  };
}

export const PriceChart: React.FC<Props> = ({ data }) => {
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    animation: { duration: 0 },
    interaction: {
      mode: 'index' as const,
      intersect: false,
    },
    plugins: {
      legend: {
        display: true,
        position: 'top' as const,
        align: 'start' as const,
        labels: {
          boxWidth: 8,
          padding: 8,
          color: '#9CA3AF',
          font: {
            size: 10,
            family: 'system-ui'
          }
        }
      },
      tooltip: {
        enabled: true,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleFont: { size: 10 },
        bodyFont: { size: 10 },
        padding: 8,
        displayColors: true,
        callbacks: {
          label: (context: any) => {
            const label = context.dataset.label || '';
            const value = context.parsed.y;
            return `${label}: $${value.toLocaleString()}`;
          }
        }
      }
    },
    scales: {
      y: {
        display: true,
        position: 'right' as const,
        grid: { 
          color: 'rgba(255, 255, 255, 0.1)',
          drawBorder: false
        },
        ticks: {
          color: '#6B7280',
          font: { size: window.innerWidth < 768 ? 8 : 10 },
          maxTicksLimit: window.innerWidth < 768 ? 4 : 6,
          callback: (value: number) => `$${value.toLocaleString()}`
        }
      },
      x: {
        display: true,
        grid: { 
          display: false 
        },
        ticks: {
          color: '#6B7280',
          font: { size: window.innerWidth < 768 ? 8 : 10 },
          maxRotation: 0,
          autoSkip: true,
          maxTicksLimit: window.innerWidth < 768 ? 4 : 6
        }
      }
    }
  };

  const chartData = {
    labels: data.labels,
    datasets: [
      {
        label: 'Preço',
        data: data.prices,
        borderColor: '#22c55e',
        borderWidth: 1.5,
        tension: 0.1,
        pointRadius: 0,
        fill: false,
        order: 1
      },
      {
        label: 'EMA 20',
        data: data.ema20,
        borderColor: '#3b82f6',
        borderWidth: 1,
        tension: 0.1,
        pointRadius: 0,
        order: 2
      },
      {
        label: 'EMA 50',
        data: data.ema50,
        borderColor: '#f59e0b',
        borderWidth: 1,
        tension: 0.1,
        pointRadius: 0,
        order: 3
      }
    ]
  };

  return (
    <div className="w-full h-full min-h-[300px]">
      <Line options={options} data={chartData} />
    </div>
  );
};
