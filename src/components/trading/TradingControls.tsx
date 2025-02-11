import React, { useState } from 'react';
import { Settings } from 'lucide-react';
import CryptoPairSelector from '../CryptoPairSelector';
import TimeframeSelector from '../TimeframeSelector';
import { SettingsDialog } from '../SettingsDialog';
import { useSettings } from '../../hooks/useSettings';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';

interface Props {
  selectedPair: string;
  timeframe: number;
  onPairChange: (pair: string) => void;
  onTimeframeChange: (timeframe: number) => void;
}

export const TradingControls: React.FC<Props> = ({
  selectedPair,
  timeframe,
  onPairChange,
  onTimeframeChange
}) => {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const { settings } = useSettings();

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 relative z-50">
        <Card className="relative">
          <CryptoPairSelector 
            selectedPair={selectedPair} 
            onPairChange={onPairChange} 
          />
        </Card>
        <Card className="relative">
          <TimeframeSelector 
            timeframe={timeframe} 
            onTimeframeChange={onTimeframeChange} 
          />
        </Card>
        <Card className="relative">
          <Button
            onClick={() => setIsSettingsOpen(true)}
            variant="secondary"
            icon={<Settings size={18} />}
            className="w-full"
          >
            {settings ? 'Configurações' : 'Configurar Trading'}
          </Button>
        </Card>
      </div>

      <SettingsDialog 
        isOpen={isSettingsOpen} 
        onClose={() => setIsSettingsOpen(false)} 
      />
    </>
  );
}
