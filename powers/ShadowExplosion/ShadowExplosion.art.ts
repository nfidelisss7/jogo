
import { PowerArt } from '../../types';
import { VFX } from '../../art/vfx/VFX';

export const art: PowerArt = {
  drawProjectile(ctx, x, y, size, time, level, angle, life = 1, maxLife = 1) {
    ctx.save();
    ctx.translate(x, y);

    const isMissile = (maxLife || 0) > 1000;

    if (isMissile) {
        VFX.drawGlow(ctx, 0, 0, size, '#8a2be2', 0.5);
        ctx.fillStyle = '#000';
        ctx.beginPath();
        ctx.arc(0, 0, size * 0.5, 0, Math.PI*2);
        ctx.fill();
    } else {
        // Explosion
        const progress = 1 - (life / (maxLife || 300));
        const radius = size * Math.sin(progress * Math.PI / 2);
        const alpha = 1 - progress;

        // Shockwave
        ctx.strokeStyle = `rgba(138, 43, 226, ${alpha})`;
        ctx.lineWidth = 10 * alpha;
        ctx.beginPath();
        ctx.arc(0, 0, radius, 0, Math.PI*2);
        ctx.stroke();

        // Inner Void
        ctx.fillStyle = `rgba(0, 0, 0, ${alpha})`;
        ctx.beginPath();
        ctx.arc(0, 0, radius * 0.8, 0, Math.PI*2);
        ctx.fill();
    }

    ctx.restore();
  }
};
