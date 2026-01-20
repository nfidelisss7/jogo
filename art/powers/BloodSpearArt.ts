
import { PowerArt } from '../../types';
import { VFX } from '../../art/vfx/VFX';

export const BloodSpearArt: PowerArt = {
  drawProjectile(ctx, x, y, size, time, level, angle, life, maxLife, entity, camX, camY) {
    if (entity && camX !== undefined && camY !== undefined) {
        VFX.drawTrail(ctx, entity, camX, camY, '#8a0b0b', size * 0.6, 15);
    }

    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle);

    // Spear Shaft
    ctx.fillStyle = '#8a0b0b';
    ctx.fillRect(-size * 2, -2, size * 4, 4);

    // Spear Head
    ctx.fillStyle = '#ff0000';
    ctx.beginPath();
    ctx.moveTo(size * 2.5, 0);
    ctx.lineTo(size, -size * 0.6);
    ctx.lineTo(size, size * 0.6);
    ctx.closePath();
    ctx.fill();

    ctx.restore();
  }
};
