
import { AccessoryArt } from '../../types/accessoryTypes';

export const art: AccessoryArt = {
  drawIcon: (ctx, x, y, size) => {
    ctx.save();
    ctx.translate(x, y);
    // Mask
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.ellipse(0, 0, size*0.4, size*0.5, 0, 0, Math.PI*2);
    ctx.fill();
    
    // Smile
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(0, 5, 8, 0, Math.PI);
    ctx.stroke();
    
    // Eyes
    ctx.fillStyle = '#000';
    ctx.fillRect(-5, -5, 4, 2);
    ctx.fillRect(1, -5, 4, 2);
    
    ctx.restore();
  },
  drawWorld: (ctx, x, y, size, time) => {
    art.drawIcon(ctx, x, y + Math.sin(time * 2) * 2, size);
  }
};
