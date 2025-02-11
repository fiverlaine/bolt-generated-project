import React from 'react';
import { CheckCircle2, XCircle, Trash2, TrendingUp, TrendingDown } from 'lucide-react';
import { Signal } from '../../types/trading';
import { signalService } from '../../services/signalService';
import { useTradeStore } from '../../hooks/useTradeStore';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { CryptoIcon } from '../CryptoIcon';

interface Props {
  trades: Signal[];
  successRate: number;
}

export const TradeHistory: React.FC<Props> = ({ trades, successRate = 0 }) => {
  const clearSignals = useTradeStore(state => state.clearSignals);
  const [isClearing, setIsClearing] = React.useState(false);

  const handleClearHistory = async () => {
    if (!trades.length || isClearing) return;
    
    try {
      setIsClearing(true);
      await signalService.clearSignalHistory();
      clearSignals();
    } catch (error) {
      console.error('Error clearing history:', error);
    } finally {
      setIsClearing(false);
    }
  };

  const formatPrice = (price: number) => {
    return price.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };

  const TradeCard = ({ trade }: { trade: Signal }) => (
    <div className="bg-gray-800/30 rounded-lg p-4 hover:bg-gray-800/50 transition-colors">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
              trade.type === 'buy' 
                ? 'bg-green-500/10 text-green-500' 
                : 'bg-red-500/10 text-red-500'
            }`}>
              {trade.type === 'buy' ? (
                <TrendingUp size={14} className="mr-1" />
              ) : (
                <TrendingDown size={14} className="mr-1" />
              )}
              {trade.type === 'buy' ? 'COMPRA' : 'VENDA'}
            </span>
            <span className="text-gray-400 text-sm">{trade.time}</span>
            {trade.result && (
              <span className={`inline-flex items-center px-2 py-1 rounded-lg text-sm ${
                trade.result === 'win' ? 'text-green-500' : 'text-red-500'
              }`}>
                {trade.result === 'win' ? (
                  <CheckCircle2 className="w-4 h-4 mr-1" />
                ) : (
                  <XCircle className="w-4 h-4 mr-1" />
                )}
                {trade.result === 'win' ? 'WIN' : 'LOSS'}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <CryptoIcon symbol={trade.pair} size={24} />
            <div>
              <h4 className="text-white font-medium">{trade.pair}</h4>
              <p className="text-sm text-gray-400">
                Preço: ${formatPrice(trade.price)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <Card>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div className="flex flex-col gap-1">
          <h2 className="text-lg font-bold text-white">Histórico de Sinais</h2>
          <p className="text-sm text-gray-400">
            Taxa de Acerto: <span className={`font-medium ${
              successRate >= 70 ? 'text-green-500' :
              successRate >= 50 ? 'text-yellow-500' :
              'text-red-500'
            }`}>{successRate.toFixed(2)}%</span>
          </p>
        </div>
        <Button
          onClick={handleClearHistory}
          disabled={isClearing || !trades.length}
          variant="danger"
          loading={isClearing}
          icon={<Trash2 size={16} />}
          className="w-full sm:w-auto"
        >
          {isClearing ? 'Limpando...' : 'Limpar Histórico'}
        </Button>
      </div>

      <div className="grid gap-3">
        {trades.map((trade) => (
          <TradeCard key={trade.id} trade={trade} />
        ))}
        {trades.length === 0 && (
          <div className="text-center py-8 text-gray-400">
            Nenhuma operação realizada ainda
          </div>
        )}
      </div>
    </Card>
  );
};
