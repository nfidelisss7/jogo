
import { PowerArt } from '../../types';

export const art: PowerArt = {
  drawProjectile(ctx, x, y, size, time, level, angle) {
    ctx.save();
    ctx.translate(x, y);

    // Liquid surface
    ctx.fillStyle = '#800000';
    ctx.strokeStyle = '#ff0000';
    ctx.lineWidth = 2;
    
    ctx.beginPath();
    const pts = 12;
    for(let i=0; i<=pts; i++) {
        const theta = (i/pts) * Math.PI*2;
        const r = size + Math.sin(theta*3 + time*5) * 2;
        const px = Math.cos(theta)*r;
        const py = Math.sin(theta)*r;
        if(i===0) ctx.moveTo(px,py); else ctx.lineTo(px,py);
    }
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Shine
    ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.beginPath();
    ctx.ellipse(-size*0.3, -size*0.3, size*0.2, size*0.1, Math.PI/4, 0, Math.PI*2);
    ctx.fill();

    ctx.restore();
  }
};
