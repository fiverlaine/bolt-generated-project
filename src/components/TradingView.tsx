import React, { useEffect } from 'react';
import { Card } from './ui/Card';
import { useTradeStore } from '../hooks/useTradeStore';
import { TrendingUp, TrendingDown, AlertTriangle, Clock } from 'lucide-react';
import { CryptoIcon } from './CryptoIcon';
import { useSignalResults } from '../hooks/useSignalResults';
import { useAutomation } from '../hooks/useAutomation';
import { playAlert } from '../utils/sound';

interface Props {
  selectedPair: string;
  timeframe: number;
  onPairChange: (pair: string) => void;
  onTimeframeChange: (timeframe: number) => void;
}

export const TradingView: React.FC<Props> = ({ 
  selectedPair,
  timeframe
}) => {
  const { currentSignal, updateSignal, isAutomated } = useTradeStore();
  const { checkSignalResult } = useSignalResults();

  const { analyzing, error } = useAutomation(
    selectedPair,
    timeframe,
    (signal) => {
      if (signal) {
        playAlert(signal.type);
        console.log('Novo sinal gerado na view de trading:', signal);
      }
    }
  );

  useEffect(() => {
    if (currentSignal && !currentSignal.result) {
      checkSignalResult(currentSignal, timeframe, updateSignal);
    }
  }, [currentSignal, timeframe, checkSignalResult, updateSignal]);

  const formatPrice = (price: number) => {
    return price.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };

  return (
    <div className="flex flex-col space-y-4">
      {/* Status da Automação */}
      {isAutomated && (
        <Card className="bg-green-500/10 border-green-500/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-green-500 font-medium">
                Automação Ativa
              </span>
            </div>
            {analyzing && (
              <span className="text-sm text-gray-400">
                Analisando mercado...
              </span>
            )}
          </div>
        </Card>
      )}

      {/* Error Message */}
      {error && (
        <Card className="bg-red-500/10 border-red-500/20">
          <div className="flex items-center gap-2 text-red-500">
            <AlertTriangle size={16} />
            <span>{error}</span>
          </div>
        </Card>
      )}

      {/* Current Signal */}
      {currentSignal && (
        <Card>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="flex items-center gap-2">
                <CryptoIcon symbol={currentSignal.pair} size={24} />
                <div>
                  <h3 className="text-white font-medium">{currentSignal.pair}</h3>
                  <div className="flex flex-wrap items-center gap-3 text-sm text-gray-400">
                    <p>Preço: ${formatPrice(currentSignal.price)}</p>
                    <div className="flex items-center gap-1">
                      <Clock size={14} />
                      <span>{currentSignal.time}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className={`flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                currentSignal.type === 'buy' 
                  ? 'bg-green-500/10 text-green-500' 
                  : 'bg-red-500/10 text-red-500'
              }`}>
                {currentSignal.type === 'buy' ? (
                  <TrendingUp size={14} className="mr-1" />
                ) : (
                  <TrendingDown size={14} className="mr-1" />
                )}
                {currentSignal.type === 'buy' ? 'COMPRA' : 'VENDA'}
              </div>
            </div>

            {currentSignal.result && (
              <div className={`px-3 py-1 rounded-lg text-sm font-medium ${
                currentSignal.result === 'win' 
                  ? 'bg-green-500/10 text-green-500' 
                  : 'bg-red-500/10 text-red-500'
              }`}>
                {currentSignal.result === 'win' ? 'WIN' : 'LOSS'}
              </div>
            )}
          </div>
        </Card>
      )}

      {/* Trading Platform */}
      <div className="h-[calc(100vh-12rem)]">
        <iframe
          src="https://www.homebroker.com/?ref=scbfJBOK"
          className="w-full h-full rounded-xl"
          title="Trading Platform"
          style={{ 
            border: 'none',
            backgroundColor: '#090C14'
          }}
        />
      </div>
    </div>
  );
};
