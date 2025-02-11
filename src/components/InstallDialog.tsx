import React from 'react';
import { X, Apple as LogoApple, SmartphoneNfc } from 'lucide-react';
import { Button } from './ui/Button';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  platform: 'ios' | 'android' | null;
}

export const InstallDialog: React.FC<Props> = ({ isOpen, onClose, platform }) => {
  if (!isOpen) return null;

  const instructions = {
    ios: [
      'Abra o Safari e acesse quantumtrade.netlify.app',
      'Toque no ícone de compartilhar (□↑)',
      'Role para baixo e toque em "Adicionar à Tela de Início"',
      'Toque em "Adicionar" no canto superior direito'
    ],
    android: [
      'Abra o Chrome e acesse quantumtrade.netlify.app',
      'Toque no menu (⋮) no canto superior direito',
      'Selecione "Adicionar à tela inicial"',
      'Toque em "Adicionar" para confirmar'
    ]
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gray-900 rounded-xl border border-gray-800 w-full max-w-lg animate-fade-in">
        <div className="p-6 border-b border-gray-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {platform === 'ios' ? (
              <LogoApple className="text-white" size={20} />
            ) : (
              <SmartphoneNfc className="text-green-500" size={20} />
            )}
            <h2 className="text-xl font-bold text-white">
              Instalar no {platform === 'ios' ? 'iOS' : 'Android'}
            </h2>
          </div>
          <Button
            variant="secondary"
            onClick={onClose}
            icon={<X size={18} />}
            className="!p-2"
          >
            <span className="sr-only">Fechar</span>
          </Button>
        </div>

        <div className="p-6">
          <ol className="space-y-4">
            {instructions[platform || 'android'].map((step, index) => (
              <li key={index} className="flex items-start gap-3 text-gray-300">
                <span className="flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-full bg-green-500/10 text-green-500 text-sm">
                  {index + 1}
                </span>
                {step}
              </li>
            ))}
          </ol>

          <div className="mt-6 p-4 bg-gray-800/50 rounded-lg">
            <p className="text-sm text-gray-400">
              Após a instalação, o QuantumTrade funcionará como um aplicativo nativo, 
              com acesso rápido direto da sua tela inicial.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
