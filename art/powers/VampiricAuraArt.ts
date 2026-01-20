
import { ProceduralArt } from '../../types';

export const VampiricAuraArt: ProceduralArt = {
  draw(ctx, x, y, size, time) {
    ctx.save();
    ctx.translate(x, y);

    // Pulse
    const pulse = 1 + Math.sin(time * 3) * 0.05;
    ctx.scale(pulse, pulse);

    // Red Field (Gradient)
    const grad = ctx.createRadialGradient(0, 0, size * 0.5, 0, 0, size);
    grad.addColorStop(0, 'rgba(100, 0, 0, 0.0)');
    grad.addColorStop(1, 'rgba(255, 0, 0, 0.2)');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(0, 0, size, 0, Math.PI*2);
    ctx.fill();

    // Border
    ctx.strokeStyle = 'rgba(255, 0, 0, 0.4)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(0, 0, size, 0, Math.PI * 2);
    ctx.stroke();

    ctx.restore();
  }
};
