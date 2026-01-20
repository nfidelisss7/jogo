
import { PowerArt } from '../../types';

export const art: PowerArt = {
  drawProjectile(ctx, x, y, size, time, level, angle) {
    ctx.save();
    ctx.translate(x, y);

    // Distortion Rings
    for (let i = 0; i < 3; i++) {
        const t = (time * 0.5 + i * 0.33) % 1;
        const r = size * t;
        const alpha = 1 - t;
        
        ctx.strokeStyle = `hsla(180, 100%, 70%, ${alpha})`;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(0, 0, r, 0, Math.PI*2);
        ctx.stroke();
    }

    // Clock Face
    ctx.strokeStyle = 'rgba(0, 255, 255, 0.3)';
    ctx.beginPath();
    ctx.arc(0, 0, size, 0, Math.PI*2);
    ctx.stroke();

    // Hands
    ctx.save();
    ctx.rotate(time);
    ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(0,0); ctx.lineTo(0, -size*0.8); ctx.stroke();
    ctx.restore();

    ctx.save();
    ctx.rotate(time * 0.1); // Slow hand
    ctx.lineWidth = 4;
    ctx.beginPath(); ctx.moveTo(0,0); ctx.lineTo(0, -size*0.5); ctx.stroke();
    ctx.restore();

    ctx.restore();
  }
};
