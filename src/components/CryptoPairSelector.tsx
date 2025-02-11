import React, { useState, useRef, useEffect } from 'react';
import { Search, ChevronDown, AlertTriangle } from 'lucide-react';
import { CryptoIcon } from './CryptoIcon';
import { useTradeStore } from '../hooks/useTradeStore';

const AVAILABLE_PAIRS = [
  'BTC/USD',
  'DOGE/USD',
  'ETH/USD',
  'SOL/USD',
  'USDT/USD',
  'XRP/USD',
];

interface Props {
  selectedPair: string;
  onPairChange: (pair: string) => void;
}

const CryptoPairSelector: React.FC<Props> = ({ selectedPair, onPairChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { currentSignal } = useTradeStore();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handlePairChange = (pair: string) => {
    if (currentSignal) {
      alert('Não é possível trocar o par durante uma operação em andamento');
      return;
    }
    onPairChange(pair);
    setIsOpen(false);
  };

  return (
    <div className="w-full relative" ref={dropdownRef}>
      <div className="relative">
        <div
          onClick={() => !currentSignal && setIsOpen(!isOpen)}
          className={`w-full pl-10 pr-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-green-500 cursor-pointer flex items-center justify-between transition-colors ${
            currentSignal ? 'opacity-50 cursor-not-allowed hover:border-gray-700' : 'hover:border-green-500/50'
          }`}
        >
          <div className="flex items-center gap-2">
            <Search className="absolute left-3 text-gray-400" size={20} />
            <div className="flex items-center gap-2 ml-6">
              <CryptoIcon symbol={selectedPair} size={20} />
              <span>{selectedPair}</span>
            </div>
          </div>
          <ChevronDown className={`text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} size={20} />
        </div>

        {currentSignal && (
          <div className="absolute -bottom-1 left-0 right-0 transform translate-y-full">
            <div className="mt-1 flex items-center gap-1 px-1">
              <AlertTriangle size={12} className="text-yellow-500 flex-shrink-0" />
              <span className="text-yellow-500 text-xs">Aguarde a conclusão</span>
            </div>
          </div>
        )}
      </div>

      {isOpen && !currentSignal && (
        <div className="absolute left-0 right-0 mt-1 bg-gray-800 border border-gray-700 rounded-lg shadow-xl z-[100] max-h-[calc(100vh-200px)] overflow-y-auto">
          {AVAILABLE_PAIRS.map((pair) => (
            <div
              key={pair}
              onClick={() => handlePairChange(pair)}
              className={`flex items-center gap-2 px-4 py-3 cursor-pointer transition-colors ${
                selectedPair === pair
                  ? 'bg-green-500/10 text-white'
                  : 'text-gray-400 hover:bg-gray-700/50'
              }`}
            >
              <CryptoIcon symbol={pair} size={20} />
              <span>{pair}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CryptoPairSelector;
