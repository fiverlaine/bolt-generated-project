import React from 'react';
import { Cpu, LineChart, BarChart2, LogOut, Briefcase, Activity, BookOpen } from 'lucide-react';
import { View } from '../../types/trading';
import { useAuth } from '../../hooks/useAuth';
import { useTradeStore } from '../../hooks/useTradeStore';
import { Button } from '../ui/Button';

interface Props {
  currentView: View;
  onViewChange: (view: View) => void;
}

export const Header: React.FC<Props> = ({ currentView, onViewChange }) => {
  const { session, signOut } = useAuth();
  const { isAutomated } = useTradeStore();

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <>
      <header className="bg-[#090C14]/80 border-b border-gray-800 py-4 sm:sticky sm:top-0 z-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            {/* Logo and Title */}
            <div className="flex items-center justify-between sm:justify-start">
              <div className="flex items-center">
                <div className="bg-green-500/10 p-2 rounded-lg">
                  <Cpu className="text-green-500" size={24} />
                </div>
                <div className="ml-3">
                  <h1 className="text-xl sm:text-2xl font-bold tracking-tight">
                    QUANTUM<span className="text-green-500">TRADE</span>
                  </h1>
                  <p className="text-[10px] sm:text-xs text-gray-400">Intelligent Trading Solutions</p>
                </div>
              </div>

              {/* Mobile Sign Out */}
              {session && (
                <Button
                  onClick={handleSignOut}
                  variant="secondary"
                  icon={<LogOut size={16} />}
                  className="sm:hidden !p-2"
                >
                  <span className="sr-only">Sair</span>
                </Button>
              )}
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden sm:flex flex-col sm:flex-row items-center gap-3">
              <nav className="w-full sm:w-auto flex items-center bg-gray-900/50 p-1 rounded-lg border border-gray-800">
                <button
                  onClick={() => onViewChange('learn')}
                  className={`flex-1 sm:flex-none flex items-center justify-center px-2 sm:px-4 py-2 rounded-lg transition-all text-sm sm:text-base ${
                    currentView === 'learn' 
                      ? 'bg-green-500 text-white shadow-lg shadow-green-500/20' 
                      : 'text-gray-400 hover:bg-gray-800/50'
                  }`}
                >
                  <BookOpen size={16} className="mr-1 sm:mr-2" />
                  <span>Aprender</span>
                </button>
                <button
                  onClick={() => onViewChange('signals')}
                  className={`flex-1 sm:flex-none flex items-center justify-center px-2 sm:px-4 py-2 rounded-lg transition-all text-sm sm:text-base ${
                    currentView === 'signals' 
                      ? 'bg-green-500 text-white shadow-lg shadow-green-500/20' 
                      : 'text-gray-400 hover:bg-gray-800/50'
                  }`}
                >
                  <LineChart size={16} className="mr-1 sm:mr-2" />
                  <span>Análises</span>
                  {isAutomated && currentView !== 'signals' && (
                    <Activity size={14} className="ml-1 text-green-500 animate-pulse" />
                  )}
                </button>
                <button
                  onClick={() => onViewChange('trading')}
                  className={`flex-1 sm:flex-none flex items-center justify-center px-2 sm:px-4 py-2 rounded-lg transition-all text-sm sm:text-base ${
                    currentView === 'trading' 
                      ? 'bg-green-500 text-white shadow-lg shadow-green-500/20' 
                      : 'text-gray-400 hover:bg-gray-800/50'
                  }`}
                >
                  <Briefcase size={16} className="mr-1 sm:mr-2" />
                  <span>Operar</span>
                  {isAutomated && currentView !== 'trading' && (
                    <Activity size={14} className="ml-1 text-green-500 animate-pulse" />
                  )}
                </button>
                <button
                  onClick={() => onViewChange('analytics')}
                  className={`flex-1 sm:flex-none flex items-center justify-center px-2 sm:px-4 py-2 rounded-lg transition-all text-sm sm:text-base ${
                    currentView === 'analytics' 
                      ? 'bg-green-500 text-white shadow-lg shadow-green-500/20' 
                      : 'text-gray-400 hover:bg-gray-800/50'
                  }`}
                >
                  <BarChart2 size={16} className="mr-1 sm:mr-2" />
                  <span>Relatório</span>
                </button>
              </nav>

              {/* Desktop Sign Out Button */}
              {session && (
                <Button
                  onClick={handleSignOut}
                  variant="secondary"
                  icon={<LogOut size={16} />}
                  className="hidden sm:flex"
                >
                  Sair
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Bottom Navigation */}
      {session && (
        <nav className="sm:hidden fixed bottom-0 left-0 right-0 bg-[#090C14]/95 backdrop-blur-md border-t border-gray-800 z-50">
          <div className="flex items-center justify-around">
            <button
              onClick={() => onViewChange('learn')}
              className={`flex-1 flex flex-col items-center justify-center py-3 ${
                currentView === 'learn' ? 'text-green-500' : 'text-gray-400'
              }`}
            >
              <BookOpen size={20} />
              <span className="text-xs mt-1">Aprender</span>
            </button>
            <button
              onClick={() => onViewChange('signals')}
              className={`flex-1 flex flex-col items-center justify-center py-3 relative ${
                currentView === 'signals' ? 'text-green-500' : 'text-gray-400'
              }`}
            >
              <LineChart size={20} />
              <span className="text-xs mt-1">Análises</span>
              {isAutomated && currentView !== 'signals' && (
                <span className="absolute top-2 right-1/4 w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              )}
            </button>
            <button
              onClick={() => onViewChange('trading')}
              className={`flex-1 flex flex-col items-center justify-center py-3 relative ${
                currentView === 'trading' ? 'text-green-500' : 'text-gray-400'
              }`}
            >
              <Briefcase size={20} />
              <span className="text-xs mt-1">Operar</span>
              {isAutomated && currentView !== 'trading' && (
                <span className="absolute top-2 right-1/4 w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              )}
            </button>
            <button
              onClick={() => onViewChange('analytics')}
              className={`flex-1 flex flex-col items-center justify-center py-3 ${
                currentView === 'analytics' ? 'text-green-500' : 'text-gray-400'
              }`}
            >
              <BarChart2 size={20} />
              <span className="text-xs mt-1">Relatório</span>
            </button>
          </div>
        </nav>
      )}
    </>
  );
};
