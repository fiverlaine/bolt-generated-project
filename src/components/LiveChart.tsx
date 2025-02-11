import React, { useEffect, useRef, useState } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import annotationPlugin from 'chartjs-plugin-annotation';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  annotationPlugin
);

interface Props {
  data: {
    labels: string[];
    prices: number[];
    rsi: number[];
    signals: Array<'buy' | 'sell' | null>;
    tendency: string;
    period: string;
  };
}

const LiveChart: React.FC<Props> = ({ data }) => {
  const chartRef = useRef<ChartJS>(null);
  const [gradient, setGradient] = useState<CanvasGradient | null>(null);

  useEffect(() => {
    const chart = chartRef.current;
    if (chart) {
      const ctx = chart.ctx;
      const gradient = ctx.createLinearGradient(0, 0, 0, 300);
      gradient.addColorStop(0, 'rgba(34, 197, 94, 0.1)');
      gradient.addColorStop(1, 'rgba(34, 197, 94, 0)');
      setGradient(gradient);
    }
  }, []);

  const signalPoints = data.signals.map((signal, index) => ({
    x: data.labels[index],
    y: data.prices[index],
    signal
  })).filter(point => point.signal);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    animation: { duration: 0 },
    interaction: {
      mode: 'index' as const,
      intersect: false,
    },
    scales: {
      x: {
        display: true,
        grid: { display: false },
        ticks: {
          color: '#9CA3AF',
          maxRotation: 0,
          autoSkip: true,
          maxTicksLimit: 6,
          font: { size: 10 }
        }
      },
      y: {
        position: 'right' as const,
        grid: { color: 'rgba(255, 255, 255, 0.05)' },
        ticks: {
          color: '#9CA3AF',
          font: { size: 10 },
          callback: (value: number) => `$${value.toLocaleString()}`
        }
      }
    },
    plugins: {
      legend: { display: false },
      annotation: {
        annotations: {
          ...signalPoints.map((point, index) => ({
            type: 'point',
            xValue: point.x,
            yValue: point.y,
            backgroundColor: point.signal === 'buy' ? '#22C55E' : '#EF4444',
            borderColor: 'white',
            borderWidth: 1,
            radius: 4,
            pointStyle: 'triangle',
            rotation: point.signal === 'buy' ? 0 : 180,
          }))
        }
      },
      tooltip: {
        enabled: true,
        mode: 'index',
        intersect: false,
        backgroundColor: 'rgba(17, 24, 39, 0.9)',
        padding: 8,
        titleFont: { size: 11 },
        bodyFont: { size: 11 },
        titleColor: '#fff',
        bodyColor: '#fff',
        borderColor: '#22C55E',
        borderWidth: 1,
        displayColors: false,
        callbacks: {
          label: (context: any) => {
            const price = context.raw;
            const signal = data.signals[context.dataIndex];
            const rsi = data.rsi[context.dataIndex];
            return [
              `Preço: $${price.toLocaleString()}`,
              signal ? `Sinal: ${signal.toUpperCase()}` : null,
              `RSI: ${rsi?.toFixed(1)}%`
            ].filter(Boolean);
          }
        }
      }
    }
  };

  const chartData = {
    labels: data.labels,
    datasets: [{
      data: data.prices,
      borderColor: '#22C55E',
      borderWidth: 1.5,
      pointRadius: 0,
      tension: 0.2,
      fill: true,
      backgroundColor: gradient || 'rgba(34, 197, 94, 0.05)',
    }]
  };

  return (
    <div className="space-y-3">
      <div className="bg-gray-800 p-3 rounded-lg">
        <div className="flex items-center space-x-2">
          <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
          <p className="text-sm text-white">
            {data.tendency === 'Alta' ? '📈' : '📉'} RSI: {data.rsi[data.rsi.length - 1]?.toFixed(1)}%
          </p>
        </div>
      </div>

      <div className="bg-gray-900 rounded-lg p-3 h-[250px]">
        <Line ref={chartRef} data={chartData} options={options} />
      </div>

      <div className="grid grid-cols-2 gap-3 text-xs">
        <div className="bg-gray-800 p-2 rounded-lg">
          <div className="flex space-x-3">
            <div className="flex items-center">
              <div className="w-2 h-2 bg-green-500 rotate-0 transform mr-1"></div>
              <span className="text-white">Compra</span>
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-red-500 rotate-180 transform mr-1"></div>
              <span className="text-white">Venda</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveChart;
