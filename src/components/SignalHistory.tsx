import React, { useState } from 'react';
import { CheckCircle2, XCircle, Trash2, ChevronLeft, ChevronRight, TrendingUp, TrendingDown, Clock } from 'lucide-react';
import { Signal } from '../types/trading';
import { signalService } from '../services/signalService';
import { useTradeStore } from '../hooks/useTradeStore';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { CryptoIcon } from './CryptoIcon';

interface Props {
  signals: Signal[];
  successRate: number;
  compact?: boolean;
}

const SIGNALS_PER_PAGE = 10;

export const SignalHistory: React.FC<Props> = ({ signals, successRate = 0, compact = false }) => {
  const clearSignals = useTradeStore(state => state.clearSignals);
  const [isClearing, setIsClearing] = React.useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(signals.length / SIGNALS_PER_PAGE);
  const startIndex = (currentPage - 1) * SIGNALS_PER_PAGE;
  const endIndex = startIndex + SIGNALS_PER_PAGE;
  const currentSignals = signals.slice(startIndex, endIndex);

  const handleClearHistory = async () => {
    if (!signals.length || isClearing) return;
    
    try {
      setIsClearing(true);
      await signalService.clearSignalHistory();
      clearSignals();
      setCurrentPage(1);
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
    <div className={`bg-gray-800/30 rounded-lg p-4 hover:bg-gray-800/50 transition-colors ${compact ? 'p-3' : ''}`}>
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
            <div className="flex items-center gap-1 text-gray-400 text-sm">
              <Clock size={14} />
              <span>{trade.time}</span>
              <span className="text-gray-500">•</span>
              <span>{trade.timeframe}min</span>
            </div>
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
            <CryptoIcon symbol={trade.pair} size={compact ? 20 : 24} />
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
    <Card className={compact ? 'p-4' : ''}>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div className="flex flex-col gap-1">
          <h2 className={`font-bold text-white ${compact ? 'text-base' : 'text-lg'}`}>Histórico de Sinais</h2>
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
          disabled={isClearing || !signals.length}
          variant="danger"
          loading={isClearing}
          icon={<Trash2 size={16} />}
          className="w-full sm:w-auto"
        >
          {isClearing ? 'Limpando...' : 'Limpar Histórico'}
        </Button>
      </div>

      <div className="grid gap-3">
        {currentSignals.map((trade) => (
          <TradeCard key={trade.id} trade={trade} />
        ))}
        {signals.length === 0 && (
          <div className="text-center py-8 text-gray-400">
            Nenhuma operação realizada ainda
          </div>
        )}
      </div>

      {signals.length > SIGNALS_PER_PAGE && (
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-800">
          <div className="text-sm text-gray-400">
            {startIndex + 1}-{Math.min(endIndex, signals.length)} de {signals.length}
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              icon={<ChevronLeft size={16} />}
              className="!p-2"
            >
              <span className="sr-only">Anterior</span>
            </Button>
            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${
                    currentPage === page
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-800/50 text-gray-400 hover:bg-gray-700'
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>
            <Button
              variant="secondary"
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              icon={<ChevronRight size={16} />}
              className="!p-2"
            >
              <span className="sr-only">Próxima</span>
            </Button>
          </div>
        </div>
      )}
    </Card>
  );
};
