import React from 'react';
import { X } from 'lucide-react';
import { Button } from '../ui/Button';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const TermsDialog: React.FC<Props> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gray-900 rounded-xl border border-gray-800 w-full max-w-2xl max-h-[90vh] overflow-hidden animate-fade-in">
        <div className="p-6 border-b border-gray-800 flex items-center justify-between">
          <h2 className="text-xl font-bold text-white">Termos de Uso</h2>
          <Button
            variant="secondary"
            onClick={onClose}
            icon={<X size={18} />}
            className="!p-2"
          >
            <span className="sr-only">Fechar</span>
          </Button>
        </div>

        <div className="p-6 overflow-y-auto space-y-6">
          <section>
            <h3 className="text-lg font-semibold text-white mb-3">1. Aceitação dos Termos</h3>
            <p className="text-gray-400">
              Ao acessar e usar a plataforma QuantumTrade, você concorda em cumprir e estar vinculado a estes Termos de Uso. Se você não concordar com qualquer parte destes termos, não poderá acessar o serviço.
            </p>
          </section>

          <section>
            <h3 className="text-lg font-semibold text-white mb-3">2. Uso do Serviço</h3>
            <p className="text-gray-400">
              A plataforma QuantumTrade é uma ferramenta de análise técnica e geração de sinais para trading. Os sinais e análises fornecidos são baseados em algoritmos e indicadores técnicos, não constituindo recomendação de investimento.
            </p>
          </section>

          <section>
            <h3 className="text-lg font-semibold text-white mb-3">3. Riscos do Trading</h3>
            <p className="text-gray-400">
              Trading envolve riscos significativos e pode resultar em perdas financeiras. Você é o único responsável por suas decisões de trading e deve estar ciente dos riscos envolvidos.
            </p>
          </section>

          <section>
            <h3 className="text-lg font-semibold text-white mb-3">4. Limitação de Responsabilidade</h3>
            <p className="text-gray-400">
              A QuantumTrade não se responsabiliza por perdas ou danos decorrentes do uso da plataforma ou das decisões tomadas com base nas análises e sinais fornecidos.
            </p>
          </section>

          <section>
            <h3 className="text-lg font-semibold text-white mb-3">5. Modificações</h3>
            <p className="text-gray-400">
              Reservamos o direito de modificar ou substituir estes termos a qualquer momento. Alterações substanciais serão notificadas através da plataforma.
            </p>
          </section>
        </div>

        <div className="p-6 border-t border-gray-800 flex justify-end">
          <Button onClick={onClose}>Entendi</Button>
        </div>
      </div>
    </div>
  );
};
