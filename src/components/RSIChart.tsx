import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip
);

interface Props {
  data: {
    labels: string[];
    rsi: number[];
  };
}

const RSIChart: React.FC<Props> = ({ data }) => {
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    animation: { duration: 0 },
    interaction: {
      mode: 'index' as const,
      intersect: false,
    },
    plugins: {
      legend: { display: false },
      title: {
        display: true,
        text: 'RSI',
        color: '#9CA3AF',
        font: { size: 10 },
        padding: { bottom: 10 }
      },
      tooltip: {
        enabled: true,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleFont: { size: 10 },
        bodyFont: { size: 10 },
        callbacks: {
          label: (context: any) => {
            const value = context.raw;
            let status = '';
            if (value >= 70) status = '(Sobrecomprado)';
            else if (value <= 30) status = '(Sobrevendido)';
            return `RSI: ${value.toFixed(2)}% ${status}`;
          }
        }
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
          font: { size: 8 },
          stepSize: 20
        }
      }
    }
  };

  const chartData = {
    labels: data.labels,
    datasets: [
      {
        data: data.rsi,
        borderColor: '#22c55e',
        borderWidth: 1.5,
        tension: 0.1,
        pointRadius: 0,
        fill: false
      },
      {
        data: Array(data.labels.length).fill(70),
        borderColor: '#ef4444',
        borderWidth: 1,
        borderDash: [2, 2],
        pointRadius: 0
      },
      {
        data: Array(data.labels.length).fill(30),
        borderColor: '#ef4444',
        borderWidth: 1,
        borderDash: [2, 2],
        pointRadius: 0
      }
    ]
  };

  return <Line options={options} data={chartData} />;
};

export default RSIChart;
