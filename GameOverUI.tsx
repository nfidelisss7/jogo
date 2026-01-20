import React from 'react';
import { GameState } from './types';

interface GameOverUIProps {
  stats: GameState;
  onRetry: () => void;
}

const GameOverUI: React.FC<GameOverUIProps> = ({ stats, onRetry }) => {
  const formattedTime = () => {
    const s = Math.floor(stats.timer / 1000);
    return `${Math.floor(s/60)}:${(s%60).toString().padStart(2, '0')}`;
  };

  return (
    <div className="game-over-overlay">
      <div className="death-container">
        <h1 className="death-title">YOU DIED</h1>
        
        <div className="death-stats-grid">
          <div className="death-stat">
            <span className="ds-label">TIME SURVIVED</span>
            <span className="ds-value">{formattedTime()}</span>
          </div>
          <div className="death-stat">
            <span className="ds-label">SOULS REAPED</span>
            <span className="ds-value">{stats.killCount}</span>
          </div>
          <div className="death-stat">
            <span className="ds-label">LEVEL REACHED</span>
            <span className="ds-value">{stats.level}</span>
          </div>
        </div>

        <button className="retry-btn" onClick={onRetry}>
          RESURRECT
        </button>
      </div>
    </div>
  );
};

export default GameOverUI;
