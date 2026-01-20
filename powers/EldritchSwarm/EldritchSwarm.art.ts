
import { PowerArt } from '../../types';

export const art: PowerArt = {
  drawProjectile(ctx, x, y, size, time, level, angle) {
    ctx.save();
    ctx.translate(x, y);

    ctx.fillStyle = '#000';
    const batCount = 3;
    for(let i=0; i<batCount; i++) {
        const t = time * 5 + i;
        const bx = Math.cos(t) * size * 0.5;
        const by = Math.sin(t) * size * 0.5;
        
        ctx.save();
        ctx.translate(bx, by);
        ctx.beginPath();
        ctx.arc(0, 0, 3, 0, Math.PI*2);
        ctx.fill();
        ctx.beginPath(); // Wings
        ctx.moveTo(0,0); ctx.lineTo(-5, -2); ctx.lineTo(0, 2); ctx.lineTo(5, -2);
        ctx.fill();
        ctx.restore();
    }

    ctx.restore();
  }
};
