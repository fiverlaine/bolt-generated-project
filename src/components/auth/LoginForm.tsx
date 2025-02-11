import React, { useState } from 'react';
import { Mail, Loader2, Cpu } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { Button } from '../ui/Button';
import { TermsDialog } from '../auth/TermsDialog';
import { PrivacyDialog } from '../auth/PrivacyDialog';
import { useTradeStore } from '../../hooks/useTradeStore'; // Import useTradeStore

export const LoginForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showTerms, setShowTerms] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);
  const { signIn, session } = useAuth();
  const { setView } = useTradeStore(); // Get setView from useTradeStore

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || loading) return;

    setLoading(true);
    setError(null);

    try {
      const response = await signIn(email);
      if (response.success) {
        setView('learn'); // Redirect to learn page after successful login
      } else {
        setError(response.error);
      }
    } catch (err) {
      setError('Erro ao fazer login. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  if (session) return null;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-b from-black to-gray-900">
      <div className="w-full max-w-md space-y-8">
        {/* Logo and Title */}
        <div className="text-center space-y-6">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-green-500/20 to-green-500/5 backdrop-blur-sm border border-green-500/10 animate-pulse">
            <Cpu className="w-10 h-10 text-green-500" />
          </div>

          <div className="space-y-2">
            <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
              QUANTUM<span className="text-green-500">TRADE</span>
            </h1>
            <p className="text-gray-400">
              Plataforma inteligente de análise e sinais para trading
            </p>
          </div>
        </div>

        {/* Login Form */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 to-blue-500/10 rounded-2xl blur-xl" />
          <div className="relative bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl p-8 shadow-xl">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-400 mb-2">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="seu@email.com"
                    className="w-full pl-10 pr-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500/20 transition-all"
                    disabled={loading}
                  />
                </div>
              </div>

              {error && (
                <div className="p-4 rounded-xl text-sm bg-red-500/10 border border-red-500/30 text-red-500 animate-fade-in">
                  {error}
                </div>
              )}

              <Button
                type="submit"
                className="w-full py-3"
                loading={loading}
                disabled={!email || loading}
              >
                {loading ? 'Entrando...' : 'Entrar na Plataforma'}
              </Button>
            </form>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-sm text-gray-500">
          Ao entrar, você concorda com nossos{' '}
          <button
            onClick={() => setShowTerms(true)}
            className="text-green-500 hover:text-green-400 transition-colors"
          >
            Termos de Uso
          </button>{' '}
          e{' '}
          <button
            onClick={() => setShowPrivacy(true)}
            className="text-green-500 hover:text-green-400 transition-colors"
          >
            Política de Privacidade
          </button>
        </p>
      </div>

      <TermsDialog isOpen={showTerms} onClose={() => setShowTerms(false)} />
      <PrivacyDialog isOpen={showPrivacy} onClose={() => setShowPrivacy(false)} />
    </div>
  );
};
