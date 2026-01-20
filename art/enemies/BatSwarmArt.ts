
import { ProceduralArt } from '../../types';

export const BatSwarmArt: ProceduralArt = {
  draw(ctx, x, y, size, time) {
    ctx.save();
    // Swarm container rotation
    ctx.rotate(time * 0.2);

    const batCount = 6;
    for (let i = 0; i < batCount; i++) {
        const t = time * (2 + (i%2)) + i;
        const r = size * 0.8 + Math.sin(t * 0.5) * size * 0.3;
        
        const bx = Math.cos(t) * r;
        const by = Math.sin(t) * r;

        ctx.save();
        ctx.translate(bx, by);
        // Face movement direction
        ctx.rotate(t + Math.PI/2);

        // Flap
        const flap = Math.sin(time * 15 + i) * 5;

        // Shadow Trail (Motion Blur)
        ctx.fillStyle = 'rgba(0,0,0,0.3)';
        ctx.beginPath();
        ctx.arc(0, 5, 4, 0, Math.PI*2);
        ctx.fill();

        // Body
        ctx.fillStyle = '#222';
        ctx.beginPath();
        ctx.ellipse(0, 0, 3, 5, 0, 0, Math.PI*2);
        ctx.fill();

        // Wings
        ctx.fillStyle = '#333';
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(-10, -2 + flap); // Wing tip L
        ctx.lineTo(-4, 4); // Membrane
        ctx.lineTo(0, 2);
        ctx.lineTo(4, 4);
        ctx.lineTo(10, -2 + flap); // Wing tip R
        ctx.closePath();
        ctx.fill();

        // Eyes
        if (Math.random() > 0.2) {
            ctx.fillStyle = '#ff0000';
            ctx.fillRect(-1, -3, 1, 1);
            ctx.fillRect(1, -3, 1, 1);
        }

        ctx.restore();
    }

    ctx.restore();
  }
};
