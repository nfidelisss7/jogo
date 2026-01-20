import { ProceduralArt } from '../../types';

export const BloodOrbArt: ProceduralArt = {
  draw(ctx, x, y, size, time) {
    ctx.save();
    ctx.translate(x, y);

    // Liquid Surface Wobble
    const points = 16;
    ctx.fillStyle = '#880000';
    ctx.strokeStyle = '#ff4444';
    ctx.lineWidth = 2;
    
    ctx.beginPath();
    for(let i=0; i<=points; i++) {
        const ang = (i / points) * Math.PI * 2;
        const noise = Math.sin(ang * 4 + time * 5) * (size * 0.1);
        const r = size + noise;
        const px = Math.cos(ang) * r;
        const py = Math.sin(ang) * r;
        if (i===0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
    }
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Specular Highlight (Blood shine)
    ctx.fillStyle = 'rgba(255, 200, 200, 0.4)';
    ctx.beginPath();
    ctx.ellipse(-size*0.3, -size*0.3, size*0.2, size*0.1, Math.PI/4, 0, Math.PI*2);
    ctx.fill();

    ctx.restore();
  }
};