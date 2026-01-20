
import { AccessoryArt } from '../../types/accessoryTypes';

export const art: AccessoryArt = {
  drawIcon: (ctx, x, y, size) => {
    ctx.save();
    ctx.translate(x, y);
    // Ring shape
    ctx.strokeStyle = '#d00';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(0, 0, size*0.5, 0, Math.PI*2);
    ctx.stroke();
    // Gem
    ctx.fillStyle = '#f00';
    ctx.beginPath();
    ctx.arc(0, -size*0.5, size*0.2, 0, Math.PI*2);
    ctx.fill();
    ctx.restore();
  },
  drawWorld: (ctx, x, y, size, time) => {
    art.drawIcon(ctx, x, y + Math.sin(time * 2) * 3, size);
  }
};
