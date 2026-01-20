
import { PowerArt } from '../../types';
import { VFX } from '../../art/vfx/VFX';

export const art: PowerArt = {
  drawProjectile(ctx, x, y, size, time, level, angle, life, maxLife, entity, camX, camY) {
    // Blood Trail
    if (entity && camX !== undefined && camY !== undefined) {
        VFX.drawTrail(ctx, entity, camX, camY, '#8a0b0b', size * 0.6, 20);
        
        // Drips
        if (Math.random() > 0.7) {
            VFX.emitParticle(entity, entity.x, entity.y, {
                color: '#ff0000', speed: 2, life: 40, size: 3
            });
        }
        VFX.updateAndDrawParticles(ctx, entity, camX, camY);
    }

    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle);

    // Spear Head
    const grad = ctx.createLinearGradient(0, 0, size*2, 0);
    grad.addColorStop(0, '#8a0b0b');
    grad.addColorStop(0.5, '#ff0000');
    grad.addColorStop(1, '#8a0b0b');
    
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.moveTo(size * 2.5, 0);
    ctx.lineTo(-size, -size * 0.6);
    ctx.lineTo(-size * 0.5, 0);
    ctx.lineTo(-size, size * 0.6);
    ctx.closePath();
    ctx.fill();
    
    // Core Vein
    ctx.strokeStyle = '#ffaaaa';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(-size, 0);
    ctx.lineTo(size * 2, 0);
    ctx.stroke();

    ctx.restore();
  }
};
