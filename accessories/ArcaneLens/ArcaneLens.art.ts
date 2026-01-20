
import { AccessoryArt } from '../../types/accessoryTypes';

export const art: AccessoryArt = {
  drawIcon: (ctx, x, y, size) => {
    ctx.save();
    ctx.translate(x, y);
    // Lens shape
    ctx.fillStyle = 'rgba(200, 200, 255, 0.5)';
    ctx.strokeStyle = '#ccf';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.ellipse(0, 0, size*0.4, size*0.6, Math.PI/4, 0, Math.PI*2);
    ctx.fill();
    ctx.stroke();
    // Shine
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(-5, -5);
    ctx.lineTo(5, 5);
    ctx.stroke();
    ctx.restore();
  },
  drawWorld: (ctx, x, y, size, time) => {
    art.drawIcon(ctx, x, y + Math.sin(time * 2) * 4, size);
  }
};
