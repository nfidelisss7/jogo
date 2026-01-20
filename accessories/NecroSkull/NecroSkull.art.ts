
import { AccessoryArt } from '../../types/accessoryTypes';

export const art: AccessoryArt = {
  drawIcon: (ctx, x, y, size) => {
    ctx.save();
    ctx.translate(x, y);
    // Skull
    ctx.fillStyle = '#ccffcc'; // Pale Green
    ctx.beginPath();
    ctx.arc(0, -5, size*0.4, 0, Math.PI*2);
    ctx.rect(-5, 2, 10, 8);
    ctx.fill();
    
    // Eyes
    ctx.fillStyle = '#0f0'; // Neon Green
    ctx.beginPath();
    ctx.arc(-4, -5, 2, 0, Math.PI*2);
    ctx.arc(4, -5, 2, 0, Math.PI*2);
    ctx.fill();
    ctx.restore();
  },
  drawWorld: (ctx, x, y, size, time) => {
    art.drawIcon(ctx, x, y + Math.sin(time * 3) * 4, size);
  }
};
