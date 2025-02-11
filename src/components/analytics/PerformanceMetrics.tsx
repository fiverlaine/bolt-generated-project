import React from 'react';
import { BarChart2, TrendingUp } from 'lucide-react';

interface Props {
  totalTrades: number;
  winRate: number;
}

export const PerformanceMetrics: React.FC<Props> = ({ 
  totalTrades, 
  winRate
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div className="bg-[#090C14]/50 rounded-xl p-4 border border-gray-800/50 hover:border-green-500/30 transition-colors">
        <div className="flex items-center gap-2">
          <h4 className="text-gray-400 text-sm">Total de Trades</h4>
          <BarChart2 className="text-green-500" size={18} />
        </div>
        <p className="text-2xl font-bold text-white mt-2">{totalTrades}</p>
      </div>
      
      <div className="bg-[#090C14]/50 rounded-xl p-4 border border-gray-800/50 hover:border-green-500/30 transition-colors">
        <div className="flex items-center gap-2">
          <h4 className="text-gray-400 text-sm">Taxa de Acerto</h4>
          <TrendingUp className="text-green-500" size={18} />
        </div>
        <p className="text-2xl font-bold text-white mt-2">{winRate.toFixed(2)}%</p>
      </div>
    </div>
  );
};
