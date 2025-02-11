import React from 'react';
import { AlertTriangle, Power, Loader2 } from 'lucide-react';
import { useAutomation } from '../hooks/useAutomation';
import { SignalUpdate } from '../types/trading';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { useSettings } from '../hooks/useSettings';
import { useTradeStore } from '../hooks/useTradeStore';

interface Props {
  selectedPair: string;
  timeframe: number;
  onSignalGenerated: (signal: SignalUpdate | null) => void;
}

export const SignalAnalyzer: React.FC<Props> = ({ selectedPair, timeframe, onSignalGenerated }) => {
  const { settings } = useSettings();
  const { isAutomated, setAutomated, currentSignal } = useTradeStore();
  const {
    analyzing,
    error,
    toggleAutomation
  } = useAutomation(selectedPair, timeframe, onSignalGenerated);

  const handleToggleAutomation = () => {
    if (!settings && !isAutomated) {
      alert('Configure as configurações de trading antes de ativar a automação');
      return;
    }
    if (toggleAutomation()) {
      setAutomated(!isAutomated);
    }
  };

  return (
    <Card className="relative z-10">
      <h2 className="text-xl font-bold text-white mb-4">Análise Técnica</h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
        <div className="bg-gray-800/50 p-4 rounded-lg">
          <h3 className="text-gray-400 text-sm mb-1">Automação</h3>
          <p className="text-lg font-bold text-white">
            {isAutomated ? 'Ativa' : 'Inativa'}
          </p>
        </div>
        
        <div className="bg-gray-800/50 p-4 rounded-lg">
          <h3 className="text-gray-400 text-sm mb-1">Par</h3>
          <p className="text-lg font-bold text-white">{selectedPair}</p>
        </div>

        <div className="bg-gray-800/50 p-4 rounded-lg">
          <h3 className="text-gray-400 text-sm mb-1">Status</h3>
          <p className={`text-lg font-bold flex items-center ${analyzing ? 'text-yellow-500' : 'text-green-500'}`}>
            {analyzing ? (
              <>
                <Loader2 className="animate-spin mr-2" size={16} />
                Analisando
              </>
            ) : 'Aguardando'}
          </p>
        </div>
      </div>
      
      <Button
        onClick={handleToggleAutomation}
        variant={isAutomated ? 'danger' : 'primary'}
        className="w-full"
        icon={<Power size={16} />}
      >
        {isAutomated ? 'Desativar Automação' : 'Ativar Automação'}
      </Button>

      {!settings && !isAutomated && (
        <div className="mt-3 p-4 bg-yellow-500/10 border border-yellow-500/50 rounded-lg">
          <div className="flex items-center text-yellow-500 text-sm">
            <AlertTriangle size={16} className="mr-2 flex-shrink-0" />
            <p>
              Configure as configurações de trading antes de ativar a automação.
            </p>
          </div>
        </div>
      )}

      {currentSignal && (
        <div className="mt-3 p-4 bg-blue-500/10 border border-blue-500/50 rounded-lg">
          <div className="flex items-center text-blue-500 text-sm">
            <AlertTriangle size={16} className="mr-2 flex-shrink-0" />
            <p>
              Operação em andamento. Aguardando conclusão do período de {timeframe} minutos.
            </p>
          </div>
        </div>
      )}
    </Card>
  );
};
