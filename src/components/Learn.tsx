import React, { useState } from 'react';
import { Card } from './ui/Card';
import { Play, BookOpen, Info, Apple as LogoApple, SmartphoneNfc } from 'lucide-react';
import { Button } from './ui/Button';
import { InstallDialog } from './InstallDialog';

export const Learn: React.FC = () => {
  const [installDialogOpen, setInstallDialogOpen] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState<'ios' | 'android' | null>(null);

  const openInstallDialog = (platform: 'ios' | 'android') => {
    setSelectedPlatform(platform);
    setInstallDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <Card>
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-green-500/10 p-2 rounded-lg">
              <BookOpen className="text-green-500" size={24} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Tutorial da Plataforma</h2>
              <p className="text-sm text-gray-400">Aprenda a usar todas as funcionalidades</p>
            </div>
          </div>

          <div className="aspect-video rounded-lg overflow-hidden bg-gray-900">
            <iframe
              className="w-full h-full"
              src="https://www.youtube.com/embed/szKsU-LQ_w4"
              title="Tutorial QuantumTrade"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      </Card>

      <Card>
        <div className="flex flex-col gap-4">
          <div>
            <h2 className="text-2xl font-bold text-white">Instale o App</h2>
            <p className="text-gray-400 mt-1">
              Acesse o QuantumTrade diretamente da sua tela inicial
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Button
              onClick={() => openInstallDialog('ios')}
              variant="secondary"
              className="group relative overflow-hidden h-12"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-gray-800 to-gray-700 group-hover:from-gray-700 group-hover:to-gray-600 transition-colors" />
              <div className="relative flex items-center justify-center gap-2">
                <LogoApple size={18} />
                <span>Instalar no iOS</span>
              </div>
            </Button>

            <Button
              onClick={() => openInstallDialog('android')}
              variant="secondary"
              className="group relative overflow-hidden h-12"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-gray-800 to-gray-700 group-hover:from-gray-700 group-hover:to-gray-600 transition-colors" />
              <div className="relative flex items-center justify-center gap-2">
                <SmartphoneNfc size={18} />
                <span>Instalar no Android</span>
              </div>
            </Button>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Card>
          <div className="flex items-start gap-4">
            <div className="bg-green-500/10 p-3 rounded-lg">
              <Play className="text-green-500" size={24} />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">Como Começar</h3>
              <ul className="space-y-2 text-gray-400">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                  Configure suas preferências de trading
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                  Escolha o par de trading desejado
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                  Selecione o timeframe adequado
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                  Ative a automação e monitore os sinais
                </li>
              </ul>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-start gap-4">
            <div className="bg-green-500/10 p-3 rounded-lg">
              <Info className="text-green-500" size={24} />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">Dicas Importantes</h3>
              <ul className="space-y-2 text-gray-400">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                  Comece com valores pequenos
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                  Monitore os resultados regularmente
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                  Ajuste as configurações conforme necessário
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                  Mantenha um registro de suas operações
                </li>
              </ul>
            </div>
          </div>
        </Card>
      </div>

      <InstallDialog
        isOpen={installDialogOpen}
        onClose={() => setInstallDialogOpen(false)}
        platform={selectedPlatform}
      />
    </div>
  );
};
