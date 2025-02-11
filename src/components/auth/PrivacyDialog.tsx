import React from 'react';
import { X } from 'lucide-react';
import { Button } from '../ui/Button';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const PrivacyDialog: React.FC<Props> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gray-900 rounded-xl border border-gray-800 w-full max-w-2xl max-h-[90vh] overflow-hidden animate-fade-in">
        <div className="p-6 border-b border-gray-800 flex items-center justify-between">
          <h2 className="text-xl font-bold text-white">Política de Privacidade</h2>
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
            <h3 className="text-lg font-semibold text-white mb-3">1. Coleta de Dados</h3>
            <p className="text-gray-400">
              Coletamos apenas as informações necessárias para o funcionamento da plataforma, incluindo seu endereço de e-mail e dados relacionados ao uso do serviço.
            </p>
          </section>

          <section>
            <h3 className="text-lg font-semibold text-white mb-3">2. Uso dos Dados</h3>
            <p className="text-gray-400">
              Utilizamos seus dados para:
            </p>
            <ul className="list-disc list-inside text-gray-400 mt-2 space-y-1">
              <li>Fornecer e manter nossos serviços</li>
              <li>Enviar notificações importantes sobre a plataforma</li>
              <li>Melhorar nossos algoritmos e análises</li>
              <li>Proteger a segurança de nossos usuários</li>
            </ul>
          </section>

          <section>
            <h3 className="text-lg font-semibold text-white mb-3">3. Proteção de Dados</h3>
            <p className="text-gray-400">
              Implementamos medidas de segurança técnicas e organizacionais para proteger seus dados contra acesso não autorizado, alteração, divulgação ou destruição.
            </p>
          </section>

          <section>
            <h3 className="text-lg font-semibold text-white mb-3">4. Compartilhamento</h3>
            <p className="text-gray-400">
              Não compartilhamos suas informações pessoais com terceiros, exceto quando necessário para a prestação do serviço ou quando exigido por lei.
            </p>
          </section>

          <section>
            <h3 className="text-lg font-semibold text-white mb-3">5. Seus Direitos</h3>
            <p className="text-gray-400">
              Você tem o direito de acessar, corrigir ou excluir seus dados pessoais a qualquer momento. Para exercer esses direitos, entre em contato conosco.
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
