
import { PowerArt } from '../../types';

export const art: PowerArt = {
  drawProjectile(ctx, x, y, size, time, level, angle, life = 1, maxLife = 1) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle);

    const progress = 1 - (life / (maxLife || 200));
    
    // Gradient Whip
    const grad = ctx.createLinearGradient(0, 0, size, 0);
    grad.addColorStop(0, '#400');
    grad.addColorStop(0.5, '#f00');
    grad.addColorStop(1, '#fff');

    ctx.strokeStyle = grad;
    ctx.lineWidth = 4 * (1 - progress);
    ctx.lineCap = 'round';
    
    // Snap animation
    ctx.beginPath();
    ctx.moveTo(0,0);
    
    const snap = Math.sin(progress * Math.PI * 2);
    const cp1y = snap * 80;
    const cp2y = -snap * 80;
    
    ctx.bezierCurveTo(size*0.3, cp1y, size*0.7, cp2y, size, 0);
    ctx.stroke();

    // Blood Spray at tip
    if (progress > 0.5 && progress < 0.7) {
        ctx.fillStyle = '#f00';
        for(let i=0; i<5; i++) {
            const rx = size + (Math.random()-0.5)*20;
            const ry = (Math.random()-0.5)*20;
            ctx.fillRect(rx, ry, 3, 3);
        }
    }

    ctx.restore();
  }
};
