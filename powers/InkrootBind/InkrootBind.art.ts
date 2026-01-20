
import { PowerArt } from '../../types';

export const art: PowerArt = {
  drawProjectile(ctx, x, y, size, time, level, angle, life = 1) {
    ctx.save();
    ctx.translate(x, y);
    
    // Grow in
    const scale = Math.min(1, (3000 - life) / 200);
    ctx.scale(scale, scale);

    const roots = 4 + level;
    ctx.fillStyle = '#000';
    
    for(let i=0; i<roots; i++) {
        ctx.save();
        ctx.rotate((i/roots) * Math.PI * 2);
        
        // Splatter arm
        ctx.beginPath();
        ctx.moveTo(0, 0);
        const len = size + Math.sin(time + i)*5;
        ctx.bezierCurveTo(10, len*0.3, -10, len*0.6, 0, len);
        ctx.lineTo(2, len);
        ctx.lineTo(5, 0);
        ctx.fill();
        
        // Drops
        ctx.beginPath();
        ctx.arc(0, len + 5, 2, 0, Math.PI*2);
        ctx.fill();
        
        ctx.restore();
    }

    ctx.restore();
  }
};
