
import { PowerArt } from '../../types';
import { VFX } from '../../art/vfx/VFX';

export const art: PowerArt = {
  drawProjectile(ctx, x, y, size, time, level, angle, life, maxLife, entity, camX, camY) {
    if (entity && camX !== undefined && camY !== undefined) {
        if (Math.random() > 0.8) {
            VFX.emitParticle(entity, entity.x, entity.y, {
                color: '#0f0', speed: 1, life: 20, size: 2
            });
        }
        VFX.updateAndDrawParticles(ctx, entity, camX, camY);
    }

    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle);

    // Spore
    ctx.fillStyle = '#8a2be2';
    ctx.beginPath();
    ctx.arc(0, 0, size, 0, Math.PI*2);
    ctx.fill();

    // Spikes
    ctx.strokeStyle = '#00ff00';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(size, 0); ctx.lineTo(-size, -size);
    ctx.moveTo(size, 0); ctx.lineTo(-size, size);
    ctx.stroke();

    ctx.restore();
  }
};
