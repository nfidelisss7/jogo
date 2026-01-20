
import { AccessoryArt } from '../../types/accessoryTypes';

export const art: AccessoryArt = {
  drawIcon: (ctx, x, y, size) => {
    ctx.save();
    ctx.translate(x, y);
    // Pendant
    ctx.strokeStyle = '#8a2be2'; // Violet
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(0, 0, size*0.5, 0, Math.PI*2);
    ctx.stroke();
    
    // Vortex
    ctx.fillStyle = '#4b0082'; // Indigo
    ctx.beginPath();
    ctx.arc(0, 0, size*0.3, 0, Math.PI*2);
    ctx.fill();
    
    // Swirl
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(0, 0, size*0.2, 0, Math.PI);
    ctx.stroke();
    
    ctx.restore();
  },
  drawWorld: (ctx, x, y, size, time) => {
    art.drawIcon(ctx, x, y + Math.sin(time * 2) * 2, size);
    // Rotate world icon
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(time);
    ctx.restore();
  }
};
