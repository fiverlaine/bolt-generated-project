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
    rsi: number[];
    ema20: number[];
    ema50: number[];
  };
}

const IndicatorsChart: React.FC<Props> = ({ data }) => {
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
        text: 'Indicadores Técnicos',
        color: '#9CA3AF',
        font: { size: 10 },
        padding: { bottom: 10 }
      },
      tooltip: {
        enabled: true,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        padding: 6,
        titleFont: { size: 10 },
        bodyFont: { size: 10 },
        callbacks: {
          label: (context: any) => {
            const value = context.raw;
            const datasetLabel = context.dataset.label;
            if (datasetLabel === 'RSI') {
              let status = '';
              if (value >= 70) status = '(Sobrecomprado)';
              else if (value <= 30) status = '(Sobrevendido)';
              return `RSI: ${value.toFixed(2)}% ${status}`;
            }
            return `${datasetLabel}: ${value.toFixed(2)}`;
          }
        }
      }
    },
    scales: {
      x: {
        display: true,
        grid: { display: false },
        ticks: {
          display: false
        }
      },
      y: {
        display: true,
        position: 'right' as const,
        grid: { display: false },
        ticks: {
          color: '#6B7280',
          font: { size: 8 },
          callback: (value: number) => `${value}`
        }
      }
    }
  };

  const chartData = {
    labels: data.labels,
    datasets: [
      {
        label: 'RSI',
        data: data.rsi,
        borderColor: '#22c55e',
        borderWidth: 1,
        tension: 0.1,
        yAxisID: 'y'
      },
      {
        label: 'EMA 20',
        data: data.ema20,
        borderColor: '#3b82f6',
        borderWidth: 1,
        tension: 0.1,
        yAxisID: 'y'
      },
      {
        label: 'EMA 50',
        data: data.ema50,
        borderColor: '#f59e0b',
        borderWidth: 1,
        tension: 0.1,
        yAxisID: 'y'
      }
    ]
  };

  return (
    <div className="w-full h-full bg-gray-900 rounded-lg p-2">
      <Line options={options} data={chartData} />
      <div className="flex justify-center gap-4 mt-1 text-[10px] text-gray-400">
        <div className="flex items-center">
          <span className="w-2 h-2 border border-red-500 mr-1"></span>
          Níveis RSI 30/70
        </div>
      </div>
    </div>
  );
};

export default IndicatorsChart;
