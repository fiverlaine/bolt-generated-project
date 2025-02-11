import React from 'react';
import { Calendar } from 'lucide-react';

interface Props {
  value?: { start: Date; end: Date };
  onChange: (range?: { start: Date; end: Date }) => void;
  className?: string;
}

export const DateRangePicker: React.FC<Props> = ({ value, onChange, className }) => {
  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      <div className="flex items-center gap-2">
        <Calendar size={20} className="text-green-500 flex-shrink-0" />
        <span className="text-gray-400">Período</span>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <input
          type="date"
          value={value?.start?.toISOString().split('T')[0] || ''}
          onChange={(e) => {
            const start = new Date(e.target.value);
            onChange(value ? { ...value, start } : { start, end: new Date() });
          }}
          className="bg-gray-800/50 text-white px-3 py-2 rounded-lg border border-gray-700 focus:border-green-500 focus:outline-none w-full"
        />
        <input
          type="date"
          value={value?.end?.toISOString().split('T')[0] || ''}
          onChange={(e) => {
            const end = new Date(e.target.value);
            onChange(value ? { ...value, end } : { start: new Date(), end });
          }}
          className="bg-gray-800/50 text-white px-3 py-2 rounded-lg border border-gray-700 focus:border-green-500 focus:outline-none w-full"
        />
      </div>
    </div>
  );
};
