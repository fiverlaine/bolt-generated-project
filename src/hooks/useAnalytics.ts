import { useState, useEffect } from 'react';
import { analyticsService } from '../services/analyticsService';
import { Signal } from '../types/trading';

interface PairStats {
  pair: string;
  winRate: number;
  totalTrades: number;
  averageProfit: number;
}

interface AnalyticsMetrics {
  totalTrades: number;
  winRate: number;
  profitFactor: number;
  averageProfit: number;
}

export const useAnalytics = (dateRange?: { start: Date; end: Date }) => {
  const [loading, setLoading] = useState(true);
  const [trades, setTrades] = useState<Signal[]>([]);
  const [metrics, setMetrics] = useState<AnalyticsMetrics>({
    totalTrades: 0,
    winRate: 0,
    profitFactor: 0,
    averageProfit: 0
  });
  const [pairStats, setPairStats] = useState<PairStats[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const data = await analyticsService.fetchAnalytics(dateRange);
        
        setTrades(data.trades);
        setMetrics(data.metrics);
        setPairStats(data.pairStats);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to fetch analytics';
        setError(message);
        console.error('Error fetching analytics:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [dateRange]);

  return { trades, metrics, pairStats, loading, error };
};
