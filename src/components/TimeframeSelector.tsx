import React from 'react';
import { Clock } from 'lucide-react';

interface Props {
  timeframe: number;
  onTimeframeChange: (timeframe: number) => void;
}

const TimeframeSelector: React.FC<Props> = ({ timeframe, onTimeframeChange }) => {
  return (
    <div className="w-full">
      <div className="flex items-center space-x-4">
        <Clock className="text-gray-400 flex-shrink-0" size={20} />
        <div className="grid grid-cols-4 gap-2 w-full relative z-10">
          {[1, 5, 10, 15].map((time) => (
            <button
              key={time}
              onClick={() => onTimeframeChange(time)}
              className={`px-3 py-2 rounded-lg font-medium transition-all ${
                timeframe === time
                  ? 'bg-green-500 text-white shadow-lg shadow-green-500/20'
                  : 'bg-gray-800/50 text-gray-400 hover:bg-gray-700 border border-gray-700'
              }`}
            >
              {time}m
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TimeframeSelector;
