
import { PowerArt } from '../../types';
import { VFX } from '../../art/vfx/VFX';

export const art: PowerArt = {
  drawProjectile(ctx, x, y, size, time, level, angle, life, maxLife, entity, camX, camY) {
    if (entity && camX !== undefined && camY !== undefined) {
        VFX.drawTrail(ctx, entity, camX, camY, '#aa00ff', size * 0.5, 10);
    }

    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(time * 15); // Spin

    // Glow
    VFX.drawGlow(ctx, 0, 0, size, '#8a2be2', 0.6);

    // Blade
    ctx.fillStyle = '#220033';
    ctx.strokeStyle = '#e0b0ff';
    ctx.lineWidth = 2;
    
    ctx.beginPath();
    ctx.arc(0, 0, size, 0, Math.PI * 1.5);
    ctx.bezierCurveTo(size*0.5, size*0.5, size*0.2, -size*0.2, size, 0);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    ctx.restore();
  }
};
