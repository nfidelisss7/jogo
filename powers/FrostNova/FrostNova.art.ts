
import { PowerArt } from '../../types';

export const art: PowerArt = {
  drawProjectile(ctx, x, y, size, time, level, angle, life = 1, maxLife = 1) {
    ctx.save();
    ctx.translate(x, y);

    const progress = Math.min(1, 1 - (life / (maxLife || 600)));
    const r = size * Math.pow(progress, 0.5);

    ctx.shadowBlur = 10;
    ctx.shadowColor = '#00ffff';
    ctx.strokeStyle = `rgba(200, 255, 255, ${1 - progress})`;
    ctx.lineWidth = 3;

    // Hexagon
    ctx.beginPath();
    for(let i=0; i<6; i++) {
        const a = (i/6)*Math.PI*2;
        const px = Math.cos(a)*r;
        const py = Math.sin(a)*r;
        if(i===0) ctx.moveTo(px,py); else ctx.lineTo(px,py);
    }
    ctx.closePath();
    ctx.stroke();

    // Spikes
    if (progress < 0.5) {
        ctx.fillStyle = 'rgba(255,255,255,0.8)';
        for(let i=0; i<6; i++) {
            const a = (i/6)*Math.PI*2;
            const dist = r * 0.8;
            ctx.beginPath();
            ctx.arc(Math.cos(a)*dist, Math.sin(a)*dist, 2, 0, Math.PI*2);
            ctx.fill();
        }
    }

    ctx.restore();
  }
};
