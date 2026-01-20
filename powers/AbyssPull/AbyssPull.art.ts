
import { PowerArt } from '../../types';

export const art: PowerArt = {
  drawProjectile(ctx, x, y, size, time, level, angle) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(time * 2);

    // Singularity
    ctx.fillStyle = '#000';
    ctx.beginPath();
    ctx.arc(0, 0, size * 0.3, 0, Math.PI*2);
    ctx.fill();
    ctx.strokeStyle = '#fff';
    ctx.stroke();

    // Accretion
    ctx.strokeStyle = '#8a2be2';
    ctx.lineWidth = 2;
    const rings = 3;
    for(let i=0; i<rings; i++) {
        const r = size * (0.5 + i*0.2);
        ctx.beginPath();
        ctx.arc(0, 0, r, i, i + Math.PI);
        ctx.stroke();
    }

    ctx.restore();
  }
};
