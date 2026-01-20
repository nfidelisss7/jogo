
import React, { useEffect, useRef, useState } from 'react';
import { GameEngine } from './engine/GameEngine';
import { GameState, WeaponType } from './types';
import { AccessoryType } from './types/accessoryTypes';
import GameUI from './GameUI';
import GameOverUI from './GameOverUI';
import StartScreen from './StartScreen';
import './style.css';

type ViewState = 'MENU' | 'GAME';

const App: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<GameEngine | null>(null);
  
  const [view, setView] = useState<ViewState>('MENU');
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [upgradeOptions, setUpgradeOptions] = useState<WeaponType[] | null>(null);
  const [accessoryOptions, setAccessoryOptions] = useState<AccessoryType[] | null>(null);

  // Initialize Game Engine ONLY when view is GAME
  useEffect(() => {
    if (view !== 'GAME' || !canvasRef.current) return;

    const canvas = canvasRef.current;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Fresh Engine Instance
    const engine = new GameEngine(
      canvas,
      (state) => setGameState(state),
      (options) => setUpgradeOptions(options),
      (options) => setAccessoryOptions(options)
    );
    engineRef.current = engine;
    
    engine.initSelection();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      engine.destroy();
      engineRef.current = null;
    };
  }, [view]);

  const handleStartGame = () => {
    setView('GAME');
  };

  const handleReturnToMenu = () => {
    setView('MENU');
    setGameState(null);
  };

  const handleSelectUpgrade = (type: WeaponType) => {
    if (engineRef.current) {
      engineRef.current.resume(type);
      setUpgradeOptions(null);
      canvasRef.current?.focus();
    }
  };

  const handleSelectAccessory = (type: AccessoryType) => {
    if (engineRef.current) {
      engineRef.current.selectAccessory(type);
      setAccessoryOptions(null);
      canvasRef.current?.focus();
    }
  };

  const handleRerollUpgrade = () => {
    if (engineRef.current) {
      const newOptions = engineRef.current.rerollUpgrades();
      if (newOptions) setUpgradeOptions(newOptions);
    }
  };

  const handleRerollAccessory = () => {
    if (engineRef.current) {
      const newOptions = engineRef.current.rerollAccessories();
      if (newOptions) setAccessoryOptions(newOptions);
    }
  };

  const handleRestart = () => {
    if (engineRef.current) {
      engineRef.current.restart();
    }
  };

  return (
    <div id="app-root" style={{ width: '100vw', height: '100vh', position: 'relative', overflow: 'hidden' }}>
      
      {view === 'MENU' && (
        <StartScreen onStart={handleStartGame} />
      )}

      {view === 'GAME' && (
        <div id="game-container" style={{ width: '100%', height: '100%' }}>
          <canvas 
            ref={canvasRef} 
            tabIndex={0} 
            style={{ outline: 'none', display: 'block' }}
          />
          
          {gameState && gameState.isGameOver && (
            <GameOverUI stats={gameState} onRetry={handleRestart} />
          )}

          {gameState && !gameState.isGameOver && (
            <GameUI 
              state={gameState} 
              upgradeOptions={upgradeOptions} 
              onSelectUpgrade={handleSelectUpgrade}
              accessoryOptions={accessoryOptions}
              onSelectAccessory={handleSelectAccessory}
              onRerollUpgrade={handleRerollUpgrade}
              onRerollAccessory={handleRerollAccessory}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default App;
