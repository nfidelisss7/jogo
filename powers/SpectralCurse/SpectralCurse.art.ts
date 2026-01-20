
import { PowerArt } from '../../types';

export const art: PowerArt = {
  drawProjectile(ctx, x, y, size, time, level, angle) {
    ctx.save();
    ctx.translate(x, y);
    
    // Ghostly Bob
    ctx.translate(0, Math.sin(time * 3) * 5);
    ctx.globalAlpha = 0.8;

    // Skull
    ctx.fillStyle = '#e0e0e0';
    ctx.beginPath();
    ctx.arc(0, -5, size * 0.5, 0, Math.PI*2); // Cranium
    ctx.rect(-size*0.3, 0, size*0.6, size*0.4); // Jaw
    ctx.fill();

    // Eyes
    ctx.fillStyle = '#000';
    ctx.beginPath();
    ctx.arc(-5, -5, 3, 0, Math.PI*2);
    ctx.arc(5, -5, 3, 0, Math.PI*2);
    ctx.fill();

    // Aura
    ctx.strokeStyle = 'rgba(200, 255, 200, 0.5)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(0, 0, size * 0.8, 0, Math.PI*2);
    ctx.stroke();

    ctx.restore();
  }
};
