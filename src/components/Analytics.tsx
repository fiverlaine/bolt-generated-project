import React, { useState } from 'react';
import { DateRangePicker } from './DateRangePicker';
import { PerformanceMetrics } from './analytics/PerformanceMetrics';
import { PairPerformance } from './analytics/PairPerformance';
import { TradeHistory } from './analytics/TradeHistory';
import { useAnalytics } from '../hooks/useAnalytics';
import { Loader2, AlertTriangle } from 'lucide-react';
import { Card } from './ui/Card';

export const Analytics: React.FC = () => {
  const [dateRange, setDateRange] = useState<{ start: Date; end: Date }>({
    start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    end: new Date()
  });

  const { trades, metrics, pairStats, loading, error } = useAnalytics(dateRange);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="animate-spin text-green-500" size={32} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64 text-red-500">
        <AlertTriangle className="mr-2" size={24} />
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="bg-[#090C14]/80">
        <div className="flex flex-col gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">Dashboard de Performance</h2>
            <p className="text-gray-400">Análise detalhada dos seus resultados de trading</p>
          </div>
          <DateRangePicker
            onChange={setDateRange}
            value={dateRange}
            className="w-full"
          />
        </div>

        <div className="space-y-6">
          <section>
            <h3 className="text-lg font-semibold text-white mb-4">Métricas Principais</h3>
            <PerformanceMetrics {...metrics} />
          </section>

          <section>
            <h3 className="text-lg font-semibold text-white mb-4">Performance por Par</h3>
            <PairPerformance stats={pairStats} />
          </section>

          <section>
            <h3 className="text-lg font-semibold text-white mb-4">Histórico Detalhado</h3>
            <TradeHistory trades={trades} successRate={metrics.winRate} />
          </section>
        </div>
      </Card>
    </div>
  );
};
