
import React, { useEffect, useRef, useState } from 'react';
import { TitleRenderer } from './art/title/TitleRenderer';

interface StartScreenProps {
  onStart: () => void;
}

const StartScreen: React.FC<StartScreenProps> = ({ onStart }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rendererRef = useRef<TitleRenderer | null>(null);
  const animationRef = useRef<number>(0);
  
  // Interaction State
  const mousePosRef = useRef({ x: 0, y: 0 });
  const [fadingOut, setFadingOut] = useState(false);

  useEffect(() => {
    if (!canvasRef.current) return;
    
    // Init Renderer
    const canvas = canvasRef.current;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    rendererRef.current = new TitleRenderer(canvas.getContext('2d')!);

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      rendererRef.current?.resize(canvas.width, canvas.height);
    };
    window.addEventListener('resize', handleResize);

    // Animation Loop
    const loop = (time: number) => {
      if (rendererRef.current) {
        rendererRef.current.draw(time, mousePosRef.current.x, mousePosRef.current.y);
      }
      animationRef.current = requestAnimationFrame(loop);
    };
    animationRef.current = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationRef.current);
    };
  }, []);

  const handleMouseMove = (e: React.MouseEvent) => {
    mousePosRef.current = { x: e.clientX, y: e.clientY };
  };

  const handleStartClick = () => {
    setFadingOut(true);
    // Delay actual start for transition effect
    setTimeout(() => {
        onStart();
    }, 1500);
  };

  return (
    <div 
      className={`start-screen-container ${fadingOut ? 'fade-out' : ''}`} 
      onMouseMove={handleMouseMove}
    >
      <canvas ref={canvasRef} className="start-canvas" />
      
      <div className="title-overlay">
        <div className="title-group">
          <h1 className="main-title">ELDRITCH SURVIVOR</h1>
          <h2 className="sub-title">VOID REBIRTH</h2>
        </div>

        <div className="menu-group">
          <button className="menu-btn start-btn" onClick={handleStartClick}>
            <span className="btn-text">ENTER THE VOID</span>
            <span className="btn-glitch" aria-hidden="true">ENTER THE VOID</span>
          </button>
          
          <div className="version-info">BUILD v0.9.4 // PROTOTYPE</div>
        </div>
      </div>
    </div>
  );
};

export default StartScreen;
