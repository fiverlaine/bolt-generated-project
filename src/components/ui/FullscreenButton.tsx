import React from 'react';
import { Maximize2, Minimize2 } from 'lucide-react';
import { Button } from './Button';

interface Props {
  isFullscreen: boolean;
  onClick: () => void;
}

export const FullscreenButton: React.FC<Props> = ({ isFullscreen, onClick }) => {
  return (
    <Button
      variant="secondary"
      onClick={onClick}
      icon={isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
      className="!p-2"
    >
      {isFullscreen ? 'Sair' : 'Expandir'}
    </Button>
  );
};
