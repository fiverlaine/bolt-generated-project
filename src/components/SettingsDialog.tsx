import React, { useState, useMemo } from 'react';
import { Settings, DollarSign, Percent, TrendingDown } from 'lucide-react';
import { TradingSettings } from '../types/trading';
import { useSettings, getProfileSettings } from '../hooks/useSettings';
import { Button } from './ui/Button';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const SettingsDialog: React.FC<Props> = ({ isOpen, onClose }) => {
  const { settings, setSettings } = useSettings();
  const [formData, setFormData] = useState<TradingSettings>(
    settings || {
      balance: 100,
      entryPercentage: 2,
      stopLoss: 10,
      profile: 'moderate'
    }
  );

  const handleProfileChange = (profile: TradingSettings['profile']) => {
    const newSettings = getProfileSettings(profile, formData.balance);
    setFormData(newSettings);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSettings(formData);
    onClose();
  };

  // Calcular valor da entrada baseado na banca e porcentagem
  const entryValue = useMemo(() => {
    const value = (formData.balance * formData.entryPercentage) / 100;
    return value.toFixed(2);
  }, [formData.balance, formData.entryPercentage]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gray-900 rounded-xl border border-gray-800 w-full max-w-lg animate-fade-in max-h-[90vh] overflow-hidden flex flex-col">
        <div className="p-4 sm:p-6 border-b border-gray-800">
          <div className="flex items-center gap-2">
            <Settings className="text-green-500 flex-shrink-0" size={24} />
            <h2 className="text-xl font-bold text-white truncate">Configurações de Trading</h2>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="overflow-y-auto p-4 sm:p-6 space-y-6">
          {/* Perfis Pré-definidos */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {(['conservative', 'moderate', 'aggressive'] as const).map((profile) => (
              <button
                key={profile}
                type="button"
                onClick={() => handleProfileChange(profile)}
                className={`p-3 rounded-lg border transition-colors ${
                  formData.profile === profile
                    ? 'border-green-500 bg-green-500/10'
                    : 'border-gray-800 hover:border-green-500/50'
                }`}
              >
                <h3 className="text-sm font-medium text-white capitalize mb-1 truncate">
                  {profile}
                </h3>
                <p className="text-xs text-gray-400 truncate">
                  {profile === 'conservative' && 'Baixo risco'}
                  {profile === 'moderate' && 'Risco moderado'}
                  {profile === 'aggressive' && 'Alto risco'}
                </p>
              </button>
            ))}
          </div>

          {/* Campos de Configuração */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">
                Banca Inicial
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input
                  type="number"
                  value={formData.balance}
                  onChange={(e) => setFormData({ ...formData, balance: parseFloat(e.target.value) })}
                  className="w-full pl-10 pr-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-green-500"
                  min="0"
                  step="0.01"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">
                  % por Entrada
                </label>
                <div className="relative">
                  <Percent className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                  <input
                    type="number"
                    value={formData.entryPercentage}
                    onChange={(e) => setFormData({ ...formData, entryPercentage: parseFloat(e.target.value) })}
                    className="w-full pl-10 pr-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-green-500"
                    min="0.1"
                    max="100"
                    step="0.1"
                    required
                  />
                </div>
                <p className="mt-1 text-xs text-gray-400 truncate">
                  Valor da entrada: ${entryValue}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">
                  Stop Loss (%)
                </label>
                <div className="relative">
                  <TrendingDown className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                  <input
                    type="number"
                    value={formData.stopLoss}
                    onChange={(e) => setFormData({ ...formData, stopLoss: parseFloat(e.target.value) })}
                    className="w-full pl-10 pr-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-green-500"
                    min="0.1"
                    max="100"
                    step="0.1"
                    required
                  />
                </div>
              </div>
            </div>
          </div>
        </form>

        <div className="p-4 sm:p-6 border-t border-gray-800 bg-gray-900/50">
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <Button type="submit" onClick={handleSubmit} className="w-full sm:w-auto order-2 sm:order-1">
              Salvar Configurações
            </Button>
            <Button type="button" variant="secondary" onClick={onClose} className="w-full sm:w-auto order-1 sm:order-2">
              Cancelar
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
