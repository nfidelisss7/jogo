
import { PowerArt } from '../../types';
import { VFX } from '../../art/vfx/VFX';

export const art: PowerArt = {
  drawProjectile(ctx, x, y, size, time, level, angle, life, maxLife, entity, camX, camY) {
    if (entity && camX !== undefined && camY !== undefined && size > 10) {
        VFX.drawTrail(ctx, entity, camX, camY, 'rgba(255, 255, 255, 0.5)', size * 0.5, 8);
    }

    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle);

    const hue = (time * 100) % 360;
    ctx.fillStyle = `hsla(${hue}, 80%, 80%, 0.9)`;
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 1;

    ctx.beginPath();
    ctx.moveTo(size, 0);
    ctx.lineTo(-size * 0.5, size * 0.5);
    ctx.lineTo(-size, 0);
    ctx.lineTo(-size * 0.5, -size * 0.5);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    ctx.restore();
  }
};
