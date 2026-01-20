
import { AccessoryArt } from '../../types/accessoryTypes';

export const art: AccessoryArt = {
  drawIcon: (ctx, x, y, size) => {
    ctx.save();
    ctx.translate(x, y);
    // Wing/Feather shape
    ctx.fillStyle = '#0ff';
    ctx.beginPath();
    ctx.ellipse(0, 0, size*0.3, size*0.7, Math.PI/4, 0, Math.PI*2);
    ctx.fill();
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 1;
    ctx.stroke();
    // Motion lines
    ctx.beginPath();
    ctx.moveTo(-size*0.5, size*0.2);
    ctx.lineTo(-size*0.2, -size*0.2);
    ctx.stroke();
    ctx.restore();
  },
  drawWorld: (ctx, x, y, size, time) => {
    art.drawIcon(ctx, x, y + Math.sin(time * 5) * 5, size);
  }
};
