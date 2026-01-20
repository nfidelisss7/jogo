
import { AccessoryArt } from '../../types/accessoryTypes';

export const art: AccessoryArt = {
  drawIcon: (ctx, x, y, size) => {
    ctx.save();
    ctx.translate(x, y);
    // Fangs
    ctx.fillStyle = '#fff';
    ctx.strokeStyle = '#ccc';
    ctx.beginPath();
    ctx.moveTo(-size*0.4, -size*0.3);
    ctx.lineTo(-size*0.2, size*0.5);
    ctx.lineTo(0, -size*0.3);
    ctx.lineTo(size*0.2, size*0.5);
    ctx.lineTo(size*0.4, -size*0.3);
    ctx.fill();
    ctx.stroke();
    
    // Blood Drop
    ctx.fillStyle = '#ff0000';
    ctx.beginPath();
    ctx.arc(-size*0.2, size*0.7, 3, 0, Math.PI*2);
    ctx.fill();
    ctx.restore();
  },
  drawWorld: (ctx, x, y, size, time) => {
    art.drawIcon(ctx, x, y + Math.sin(time * 4) * 3, size);
  }
};
