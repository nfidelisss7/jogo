
import { AccessoryArt } from '../../types/accessoryTypes';

export const art: AccessoryArt = {
  drawIcon: (ctx, x, y, size) => {
    ctx.save();
    ctx.translate(x, y);
    // Mirror Shard
    ctx.fillStyle = '#c0c0c0'; // Silver
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, -size * 0.7);
    ctx.lineTo(size * 0.5, 0);
    ctx.lineTo(0, size * 0.7);
    ctx.lineTo(-size * 0.5, 0);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    
    // Reflection lines
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(-size * 0.2, -size * 0.3);
    ctx.lineTo(size * 0.2, -size * 0.1);
    ctx.stroke();
    
    ctx.restore();
  },
  drawWorld: (ctx, x, y, size, time) => {
    art.drawIcon(ctx, x, y + Math.sin(time * 3) * 5, size);
    // Echo particles
    ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.fillRect(x + Math.sin(time*5)*10, y + Math.cos(time*5)*10, 3, 3);
  }
};
