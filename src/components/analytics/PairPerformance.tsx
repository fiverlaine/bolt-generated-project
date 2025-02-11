import React, { useState } from 'react';
import { FullscreenButton } from '../ui/FullscreenButton';
import { Card } from '../ui/Card';
import { CryptoIcon } from '../CryptoIcon';

interface PairStats {
  pair: string;
  winRate: number;
  totalTrades: number;
}

interface Props {
  stats: PairStats[];
}

export const PairPerformance: React.FC<Props> = ({ stats }) => {
  const [isFullscreen, setIsFullscreen] = useState(false);

  const PairCard = ({ stat }: { stat: PairStats }) => (
    <Card className="bg-gray-800/30 hover:bg-gray-800/50 transition-colors">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-2">
          <CryptoIcon symbol={stat.pair} size={24} />
          <div>
            <h3 className="text-lg font-medium text-white">{stat.pair}</h3>
            <p className="text-sm text-gray-400">
              {stat.totalTrades} operações
            </p>
          </div>
        </div>
      </div>

      <div className="bg-gray-900/50 rounded-lg p-3">
        <p className="text-sm text-gray-400 mb-1">Taxa de Acerto</p>
        <div className="flex items-baseline">
          <span className="text-lg font-medium text-white">
            {stat.winRate.toFixed(2)}%
          </span>
        </div>
      </div>
    </Card>
  );

  return (
    <div className={isFullscreen ? 'fixed inset-0 z-50 bg-[#090C14] p-6 overflow-y-auto' : ''}>
      <div className="flex justify-between items-center mb-4">
        <div className="flex flex-col gap-1">
          <h2 className="text-lg font-bold text-white">Desempenho por Par</h2>
          <p className="text-sm text-gray-400">Análise detalhada por ativo</p>
        </div>
        <FullscreenButton 
          isFullscreen={isFullscreen} 
          onClick={() => setIsFullscreen(!isFullscreen)} 
        />
      </div>

      <div className="grid gap-4">
        {stats.map(stat => (
          <PairCard key={stat.pair} stat={stat} />
        ))}
        {stats.length === 0 && (
          <div className="text-center py-8 text-gray-400">
            Nenhum par operado ainda
          </div>
        )}
      </div>
    </div>
  );
};
