
import { PowerArt } from '../../types';
import { VFX } from '../../art/vfx/VFX';

export const art: PowerArt = {
  drawProjectile(ctx, x, y, size, time, level, angle, life, maxLife, entity, camX, camY) {
    if (entity && camX !== undefined && camY !== undefined) {
        VFX.drawTrail(ctx, entity, camX, camY, '#000', size * 0.8, 10);
    }

    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle + time * 3);

    // Core
    ctx.fillStyle = '#000';
    ctx.beginPath();
    ctx.arc(0, 0, size * 0.6, 0, Math.PI*2);
    ctx.fill();

    // Purple Aura
    ctx.strokeStyle = '#8a2be2';
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.arc(0, 0, size, 0, Math.PI*2);
    ctx.stroke();

    // Particles
    ctx.fillStyle = '#4b0082';
    for(let i=0; i<3; i++) {
        const a = time * 5 + i;
        const r = size * 1.2;
        ctx.fillRect(Math.cos(a)*r, Math.sin(a)*r, 3, 3);
    }

    ctx.restore();
  }
};
