
import { AccessoryArt } from '../../types/accessoryTypes';

export const art: AccessoryArt = {
  drawIcon: (ctx, x, y, size) => {
    ctx.save();
    ctx.translate(x, y);
    // Spiky shape
    ctx.fillStyle = '#555';
    ctx.strokeStyle = '#f00';
    ctx.lineWidth = 1;
    ctx.beginPath();
    for(let i=0; i<8; i++) {
        const a = (i/8) * Math.PI * 2;
        const r = (i%2===0) ? size * 0.7 : size * 0.3;
        const px = Math.cos(a)*r;
        const py = Math.sin(a)*r;
        if(i===0) ctx.moveTo(px,py); else ctx.lineTo(px,py);
    }
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.restore();
  },
  drawWorld: (ctx, x, y, size, time) => {
    art.drawIcon(ctx, x, y + Math.sin(time * 6) * 2, size);
  }
};
