
import React, { useState, useEffect } from 'react';

const MobileHUD: React.FC = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  if (!isMobile) return null;

  return (
    <div style={{
      position: 'absolute',
      bottom: '20px',
      left: '20px',
      width: '120px',
      height: '120px',
      borderRadius: '50%',
      border: '2px solid rgba(255,255,255,0.2)',
      pointerEvents: 'none' // Visual guide only, touch logic handles the whole screen
    }}>
      <div style={{
        position: 'absolute',
        top: '50%', left: '50%',
        transform: 'translate(-50%, -50%)',
        color: 'rgba(255,255,255,0.5)',
        fontSize: '10px'
      }}>
        DRAG TO MOVE
      </div>
    </div>
  );
};

export default MobileHUD;
