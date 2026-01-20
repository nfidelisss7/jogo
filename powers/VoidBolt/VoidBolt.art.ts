
import { PowerArt } from '../../types';
import { VFX } from '../../art/vfx/VFX';

export const art: PowerArt = {
  drawProjectile(ctx, x, y, size, time, level, angle, life, maxLife, entity, camX, camY) {
    if (entity && camX !== undefined && camY !== undefined) {
        VFX.drawTrail(ctx, entity, camX, camY, '#00ffff', size * 0.8, 15);
    }

    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle);

    // Glitch offsets
    const gx = (Math.random() - 0.5) * 4;
    const gy = (Math.random() - 0.5) * 4;

    // Core
    ctx.shadowBlur = 15;
    ctx.shadowColor = '#00ffff';
    ctx.fillStyle = '#000';
    ctx.strokeStyle = '#00ffff';
    ctx.lineWidth = 2;

    ctx.beginPath();
    ctx.moveTo(size + gx, 0 + gy);
    ctx.lineTo(-size, size * 0.5);
    ctx.lineTo(-size * 0.5, 0); // Notch
    ctx.lineTo(-size, -size * 0.5);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Data particles
    if (Math.random() > 0.5) {
        ctx.fillStyle = '#fff';
        ctx.fillRect(-size * 2, (Math.random()-0.5)*10, 2, 2);
    }

    ctx.restore();
  }
};
