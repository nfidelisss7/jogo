
import { PowerArt } from '../../types';
import { VFX } from '../../art/vfx/VFX';

export const art: PowerArt = {
  drawProjectile(ctx, x, y, size, time, level, angle, life, maxLife, entity, camX, camY) {
    if (entity && camX !== undefined && camY !== undefined) {
        // Spark particles
        if (Math.random() > 0.5) {
            VFX.emitParticle(entity, entity.x, entity.y, {
                color: '#fff', speed: 3, life: 10, size: 2
            });
        }
        VFX.updateAndDrawParticles(ctx, entity, camX, camY);
    }

    ctx.save();
    ctx.translate(x, y);
    
    // Core Glow
    VFX.drawGlow(ctx, 0, 0, size, '#00ffff', 0.8);
    
    // Ball
    ctx.fillStyle = '#e0ffff';
    ctx.beginPath();
    ctx.arc(0, 0, size * 0.4, 0, Math.PI*2);
    ctx.fill();

    // Arcs
    ctx.rotate(time * 5);
    const arcs = 6;
    for(let i=0; i<arcs; i++) {
        ctx.save();
        ctx.rotate((i/arcs)*Math.PI*2);
        VFX.drawLightning(ctx, 0, 0, size, 0, '#00bfff', 1, 5);
        ctx.restore();
    }

    ctx.restore();
  }
};
