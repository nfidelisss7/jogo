import { ProceduralArt } from '../../types';

export const EldritchSwarmArt: ProceduralArt = {
  draw(ctx, x, y, size, time) {
    ctx.save();
    ctx.translate(x, y);

    // Swarm Center
    ctx.fillStyle = '#000';
    ctx.strokeStyle = '#333';
    ctx.beginPath();
    ctx.arc(0, 0, size * 0.5, 0, Math.PI * 2);
    ctx.fill();

    // Boids
    ctx.fillStyle = '#111';
    for(let i=0; i<5; i++) {
        const t = time * 2 + i;
        const orbitR = size + Math.sin(t * 3) * size * 0.5;
        const ox = Math.cos(t) * orbitR;
        const oy = Math.sin(t) * orbitR;
        
        ctx.save();
        ctx.translate(ox, oy);
        ctx.rotate(t + Math.PI/2);
        
        // Bat/Boid shape
        ctx.beginPath();
        ctx.moveTo(0, -size*0.3);
        ctx.lineTo(size*0.3, size*0.3);
        ctx.lineTo(0, size*0.1);
        ctx.lineTo(-size*0.3, size*0.3);
        ctx.closePath();
        ctx.fill();
        
        ctx.restore();
    }

    ctx.restore();
  }
};