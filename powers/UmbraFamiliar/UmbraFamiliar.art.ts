
import { PowerArt } from '../../types';

export const art: PowerArt = {
  drawProjectile(ctx, x, y, size, time, level, angle) {
    ctx.save();
    ctx.translate(x, y);
    ctx.globalAlpha = 0.7;

    ctx.fillStyle = '#000';
    ctx.shadowBlur = 10;
    ctx.shadowColor = '#4b0082';

    // Hood
    ctx.beginPath();
    ctx.arc(0, -size * 0.5, size * 0.4, 0, Math.PI*2);
    ctx.fill();
    // Body
    ctx.beginPath();
    ctx.moveTo(0, -size * 0.2);
    ctx.lineTo(size * 0.6, size);
    ctx.lineTo(-size * 0.6, size);
    ctx.fill();

    // Eyes
    ctx.fillStyle = '#8a2be2';
    ctx.shadowBlur = 5;
    ctx.beginPath();
    ctx.arc(-3, -size*0.5, 2, 0, Math.PI*2);
    ctx.arc(3, -size*0.5, 2, 0, Math.PI*2);
    ctx.fill();

    ctx.restore();
  }
};
