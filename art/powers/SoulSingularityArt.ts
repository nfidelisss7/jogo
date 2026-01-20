
import { ProceduralArt } from '../../types';

export const SoulSingularityArt: ProceduralArt = {
  draw(ctx, x, y, size, time) {
    ctx.save();
    ctx.translate(x, y);

    // Black Hole
    ctx.fillStyle = '#000';
    ctx.strokeStyle = '#4b0082';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(0, 0, size * 0.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Accretion Ring (Solid)
    ctx.rotate(time);
    ctx.strokeStyle = 'rgba(138, 43, 226, 0.5)';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.ellipse(0, 0, size * 1.2, size * 0.4, 0, 0, Math.PI * 2);
    ctx.stroke();

    ctx.restore();
  }
};
