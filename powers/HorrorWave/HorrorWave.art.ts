
import { PowerArt } from '../../types';

export const art: PowerArt = {
  drawProjectile(ctx, x, y, size, time, level, angle, life = 1, maxLife = 1) {
    ctx.save();
    ctx.translate(x, y);

    const progress = 1 - (life / (maxLife || 600));
    const r = size * progress;
    
    ctx.strokeStyle = `rgba(75, 0, 130, ${1-progress})`;
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.arc(0, 0, r, 0, Math.PI*2);
    ctx.stroke();

    // Secondary ripple
    ctx.strokeStyle = `rgba(138, 43, 226, ${1-progress})`;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(0, 0, r * 0.8, 0, Math.PI*2);
    ctx.stroke();

    ctx.restore();
  }
};
