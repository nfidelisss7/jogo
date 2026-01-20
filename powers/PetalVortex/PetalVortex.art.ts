
import { PowerArt } from '../../types';

export const art: PowerArt = {
  drawProjectile(ctx, x, y, size, time, level, angle, life = 1) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(time * 2);

    const petals = 20 + level * 5;
    for(let i=0; i<petals; i++) {
        const t = i / petals;
        const r = Math.random() * size;
        const a = t * Math.PI * 2 + time * (1 + Math.random());
        
        const px = Math.cos(a) * r;
        const py = Math.sin(a) * r;
        
        ctx.save();
        ctx.translate(px, py);
        ctx.rotate(a + Math.PI/2);
        
        ctx.fillStyle = i % 2 === 0 ? '#ffb7c5' : '#ff69b4';
        ctx.beginPath();
        ctx.ellipse(0, 0, 4, 2, 0, 0, Math.PI*2);
        ctx.fill();
        
        ctx.restore();
    }

    ctx.restore();
  }
};
