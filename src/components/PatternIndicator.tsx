import React from 'react';
import { AlertTriangle, TrendingUp, TrendingDown } from 'lucide-react';
import { CandlePattern } from '../types/trading';

interface Props {
  patterns: CandlePattern[];
}

export const PatternIndicator: React.FC<Props> = ({ patterns }) => {
  if (!patterns.length) return null;

  return (
    <div className="space-y-2">
      {patterns.map((pattern, index) => (
        <div 
          key={index}
          className={`flex items-center gap-2 p-3 rounded-lg ${
            pattern.strength === 'strong' 
              ? 'bg-green-500/10 border border-green-500/20'
              : pattern.strength === 'medium'
              ? 'bg-yellow-500/10 border border-yellow-500/20'
              : 'bg-gray-500/10 border border-gray-500/20'
          }`}
        >
          {pattern.strength === 'strong' ? (
            <TrendingUp className="text-green-500" size={18} />
          ) : pattern.strength === 'medium' ? (
            <AlertTriangle className="text-yellow-500" size={18} />
          ) : (
            <TrendingDown className="text-gray-500" size={18} />
          )}
          <div>
            <p className="text-sm font-medium text-white">
              {pattern.type.charAt(0).toUpperCase() + pattern.type.slice(1)}
            </p>
            <p className="text-xs text-gray-400">{pattern.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
};
