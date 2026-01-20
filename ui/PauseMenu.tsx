
import React from 'react';

interface PauseMenuProps {
  onResume: () => void;
  onQuit: () => void;
}

const PauseMenu: React.FC<PauseMenuProps> = ({ onResume, onQuit }) => {
  return (
    <div style={{
      position: 'absolute', inset: 0,
      background: 'rgba(0,0,0,0.8)',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      gap: '20px', zIndex: 100
    }}>
      <h1 style={{ fontFamily: 'Cinzel', color: '#ffd700' }}>PAUSED</h1>
      <button onClick={onResume} className="reroll-btn">RESUME</button>
      <button onClick={onQuit} className="reroll-btn" style={{ borderColor: '#f00', color: '#f00' }}>QUIT</button>
    </div>
  );
};

export default PauseMenu;
