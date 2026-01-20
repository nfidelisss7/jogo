
import { PowerArt } from '../../types';

export const art: PowerArt = {
  drawProjectile(ctx, x, y, size, time, level, angle) {
    ctx.save();
    ctx.translate(x, y);
    ctx.translate(0, Math.sin(time*3)*5); // Bob

    // Cover
    ctx.fillStyle = '#4b0082';
    ctx.fillRect(-10, -14, 20, 28);
    // Pages
    ctx.fillStyle = '#fff';
    ctx.fillRect(-8, -12, 16, 24);
    // Spine
    ctx.strokeStyle = '#ffd700';
    ctx.beginPath(); ctx.moveTo(0, -14); ctx.lineTo(0, 14); ctx.stroke();

    // Aura
    ctx.fillStyle = 'rgba(0, 255, 255, 0.2)';
    ctx.beginPath();
    ctx.arc(0, 0, size * 1.5, 0, Math.PI*2);
    ctx.fill();

    ctx.restore();
  }
};
