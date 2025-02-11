import { supabase } from './supabase';
import { Signal } from '../types/trading';

export const analyticsService = {
  async fetchAnalytics(dateRange?: { start: Date; end: Date }) {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('User not authenticated');
      }

      let query = supabase
        .from('signals')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (dateRange) {
        query = query
          .gte('created_at', dateRange.start.toISOString())
          .lte('created_at', dateRange.end.toISOString());
      }

      const { data, error } = await query;

      if (error) throw error;

      const trades = (data || []).map(trade => ({
        id: trade.id,
        type: trade.type as 'buy' | 'sell',
        price: Number(trade.price),
        pair: trade.pair,
        confidence: Number(trade.confidence),
        result: trade.result as 'win' | 'loss' | undefined,
        time: new Date(trade.created_at).toLocaleTimeString(),
        created_at: trade.created_at
      }));

      const totalTrades = trades.length;
      const wins = trades.filter(t => t.result === 'win').length;
      const winRate = totalTrades > 0 ? (wins / totalTrades) * 100 : 0;

      const pairStats = this.calculatePairStats(trades);

      return {
        trades,
        metrics: {
          totalTrades,
          winRate
        },
        pairStats
      };
    } catch (error) {
      console.error('Error fetching analytics:', error);
      throw error;
    }
  },

  calculatePairStats(trades: Signal[]) {
    const pairMap = new Map<string, Signal[]>();
    
    trades.forEach(trade => {
      const existing = pairMap.get(trade.pair) || [];
      pairMap.set(trade.pair, [...existing, trade]);
    });
    
    return Array.from(pairMap.entries()).map(([pair, pairTrades]) => {
      const totalTrades = pairTrades.length;
      const wins = pairTrades.filter(t => t.result === 'win').length;
      const winRate = totalTrades > 0 ? (wins / totalTrades) * 100 : 0;
      
      return {
        pair,
        winRate,
        totalTrades
      };
    });
  }
};
