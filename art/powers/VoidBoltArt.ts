
import { PowerArt } from '../../types';
import { VFX } from '../../art/vfx/VFX';

export const VoidBoltArt: PowerArt = {
  drawProjectile(ctx, x, y, size, time, level, angle, life, maxLife, entity, camX, camY) {
    // Simple Trail
    if (entity && camX !== undefined && camY !== undefined) {
        VFX.drawTrail(ctx, entity, camX, camY, '#00ffff', size * 0.5, 8);
    }

    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle);

    // Clean Arrowhead
    ctx.fillStyle = '#000';
    ctx.strokeStyle = '#00ffff';
    ctx.lineWidth = 2;

    ctx.beginPath();
    ctx.moveTo(size, 0);
    ctx.lineTo(-size, size * 0.5);
    ctx.lineTo(-size * 0.5, 0);
    ctx.lineTo(-size, -size * 0.5);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    ctx.restore();
  }
};
