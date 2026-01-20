
import { ProceduralArt } from '../../types';

export const VoidImpArt: ProceduralArt = {
  draw(ctx, x, y, size, time) {
    ctx.save();
    ctx.translate(x, y);
    
    // Idle: Slow bob, no tumbling
    ctx.translate(0, Math.sin(time * 3) * 2);

    // Shape: Floating Crystal Monolith
    ctx.fillStyle = '#2a0033';
    ctx.strokeStyle = '#8a2be2';
    ctx.lineWidth = 1.5;

    ctx.beginPath();
    ctx.moveTo(0, -size);       // Top
    ctx.lineTo(size * 0.5, 0);  // Right
    ctx.lineTo(0, size * 0.8);  // Bottom
    ctx.lineTo(-size * 0.5, 0); // Left
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Inner Facet (Depth)
    ctx.fillStyle = '#4b0082';
    ctx.beginPath();
    ctx.moveTo(0, -size * 0.5);
    ctx.lineTo(size * 0.25, 0);
    ctx.lineTo(0, size * 0.4);
    ctx.lineTo(-size * 0.25, 0);
    ctx.closePath();
    ctx.fill();

    // Eye: Central Focus
    ctx.fillStyle = '#ffff00';
    ctx.beginPath();
    ctx.arc(0, 0, 3, 0, Math.PI*2);
    ctx.fill();

    ctx.restore();
  }
};
