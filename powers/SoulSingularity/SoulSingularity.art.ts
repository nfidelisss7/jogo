
import { PowerArt } from '../../types';
import { VFX } from '../../art/vfx/VFX';

export const art: PowerArt = {
  drawProjectile(ctx, x, y, size, time, level, angle, life, maxLife, entity, camX, camY) {
    ctx.save();
    ctx.translate(x, y);

    // Event Horizon
    const pulse = 1 + Math.sin(time * 5) * 0.05;
    ctx.scale(pulse, pulse);

    // Accretion Disk (Back)
    ctx.save();
    ctx.scale(1, 0.3);
    ctx.rotate(time * 2);
    VFX.drawGlow(ctx, 0, 0, size * 1.5, '#4b0082', 0.5);
    ctx.strokeStyle = '#8a2be2';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(0, 0, size * 1.5, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();

    // Black Hole
    ctx.fillStyle = '#000';
    ctx.shadowBlur = 20;
    ctx.shadowColor = '#4b0082';
    ctx.beginPath();
    ctx.arc(0, 0, size * 0.6, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;

    // Photon Ring
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(0, 0, size * 0.65, 0, Math.PI * 2);
    ctx.stroke();

    // In-falling matter particles
    if (entity && camX !== undefined && camY !== undefined) {
        if (Math.random() > 0.5) {
            const theta = Math.random() * Math.PI * 2;
            const dist = size * 2;
            VFX.emitParticle(entity, entity.x + Math.cos(theta)*dist, entity.y + Math.sin(theta)*dist, {
                color: '#d8bfd8', speed: 1, life: 20, size: 2
            });
        }
        // Custom logic to suck particles in? Simple draw for now
        VFX.updateAndDrawParticles(ctx, entity, camX, camY);
    }

    ctx.restore();
  }
};
