
import { ProceduralArt } from '../../types';
import { DrawUtils } from '../primitives/DrawUtils';

export const CowboyArt: ProceduralArt = {
  draw(ctx, x, y, size, time, angle, state) {
    ctx.save();
    
    // Sauntering walk
    const saunter = Math.sin(time * 5) * 2;
    ctx.translate(0, Math.abs(saunter));
    ctx.rotate(saunter * 0.05);

    const isKing = state?.isKing;
    const vestColor = isKing ? '#000' : '#654321'; // Black vest for Sheriff

    // Legs (Chaps)
    ctx.fillStyle = '#333'; // Jeans
    ctx.fillRect(-5, 5, 4, 12);
    ctx.fillRect(1, 5, 4, 12);
    
    // Body
    ctx.fillStyle = '#ddd'; // Shirt
    ctx.fillRect(-6, -10, 12, 15);
    
    // Vest
    ctx.fillStyle = vestColor;
    ctx.fillRect(-6, -10, 4, 15);
    ctx.fillRect(2, -10, 4, 15);

    // Bandana
    ctx.fillStyle = '#f00';
    ctx.beginPath();
    ctx.moveTo(-4, -5); ctx.lineTo(4, -5); ctx.lineTo(0, 0);
    ctx.fill();

    // Head
    ctx.save();
    ctx.translate(0, -12);
    ctx.fillStyle = '#dcb'; // Skin
    ctx.beginPath();
    ctx.arc(0, 0, 6, 0, Math.PI*2);
    ctx.fill();

    // Cowboy Hat
    ctx.fillStyle = '#8b4513';
    ctx.beginPath();
    ctx.ellipse(0, -3, 10, 3, 0, 0, Math.PI*2); // Brim
    ctx.fill();
    ctx.beginPath();
    ctx.rect(-5, -8, 10, 6); // Top
    ctx.fill();
    
    // Star (Sheriff)
    if (isKing) {
        ctx.fillStyle = '#ffd700';
        ctx.beginPath();
        ctx.arc(0, 5, 2, 0, Math.PI*2); // Badge on chest approx
        ctx.fill();
    }

    ctx.restore();

    // Gun Arm (Right)
    ctx.save();
    ctx.translate(8, -5);
    const aim = Math.sin(time * 2) * 0.2;
    ctx.rotate(aim);
    
    // Arm
    ctx.fillStyle = '#ddd';
    ctx.fillRect(-2, 0, 4, 8);
    
    // Gun
    ctx.translate(0, 8);
    ctx.fillStyle = '#444';
    ctx.fillRect(-2, -2, 10, 4); // Barrel
    ctx.fillRect(-2, 0, 3, 5); // Handle
    
    if (isKing) {
        // Smoke effect if king (rapid fire)
        if (time % 500 < 50) {
            ctx.fillStyle = 'rgba(200,200,200,0.5)';
            ctx.beginPath();
            ctx.arc(12, 0, 4, 0, Math.PI*2);
            ctx.fill();
        }
    }
    
    ctx.restore();

    // Left Arm (Relaxed)
    ctx.fillStyle = '#ddd';
    ctx.fillRect(-8, -5, 4, 10);

    ctx.restore();
  }
};
