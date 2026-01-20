
import { PowerArt } from '../../types';

export const art: PowerArt = {
  drawProjectile(ctx, x, y, size, time, level, angle) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle);

    ctx.fillStyle = '#f5deb3';
    ctx.strokeStyle = '#8b4513';
    ctx.lineWidth = 1;

    ctx.beginPath();
    ctx.rect(-size, -size*0.3, size*2, size*0.6);
    ctx.fill();
    ctx.stroke();

    // Glyphs
    ctx.fillStyle = '#000';
    ctx.font = '10px serif';
    ctx.fillText('⚡', -5, 4);

    ctx.restore();
  }
};
