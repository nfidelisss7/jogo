
import { AccessoryArt } from '../../types/accessoryTypes';

export const art: AccessoryArt = {
  drawIcon: (ctx, x, y, size) => {
    ctx.save();
    ctx.translate(x, y);
    ctx.fillStyle = '#777';
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 2;
    // Heart Shield
    ctx.beginPath();
    ctx.moveTo(0, size*0.5);
    ctx.bezierCurveTo(size, -size*0.5, size, -size, 0, -size*0.5);
    ctx.bezierCurveTo(-size, -size, -size, -size*0.5, 0, size*0.5);
    ctx.fill();
    ctx.stroke();
    ctx.restore();
  },
  drawWorld: (ctx, x, y, size, time) => {
    art.drawIcon(ctx, x, y + Math.sin(time * 3) * 5, size);
  }
};
