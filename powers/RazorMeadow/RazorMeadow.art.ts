
import { PowerArt } from '../../types';

export const art: PowerArt = {
  drawProjectile(ctx, x, y, size, time, level, angle, life = 1) {
    ctx.save();
    ctx.translate(x, y);
    ctx.globalAlpha = Math.min(1, life / 200);

    // Zone Border
    ctx.strokeStyle = 'rgba(0, 255, 0, 0.3)';
    ctx.beginPath();
    ctx.arc(0, 0, size, 0, Math.PI*2);
    ctx.stroke();

    // Grass Blades
    const count = 20 + level * 5;
    for(let i=0; i<count; i++) {
        const r = Math.sqrt(Math.random()) * size;
        const theta = Math.random() * Math.PI * 2;
        const bx = Math.cos(theta) * r;
        const by = Math.sin(theta) * r;
        
        const sway = Math.sin(time * 3 + bx * 0.1) * 5;
        
        ctx.strokeStyle = '#00ff00';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(bx, by);
        ctx.quadraticCurveTo(bx + sway, by - 10, bx + sway*1.5, by - 15);
        ctx.stroke();
    }

    ctx.restore();
  }
};
