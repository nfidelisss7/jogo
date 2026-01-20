
import { PowerArt } from '../../types';
import { VFX } from '../../art/vfx/VFX';

export const art: PowerArt = {
  drawProjectile(ctx, x, y, size, time, level, angle, life, maxLife, entity, camX, camY) {
    if (entity && camX !== undefined && camY !== undefined) {
        VFX.drawTrail(ctx, entity, camX, camY, 'rgba(100, 0, 200, 0.5)', size, 10);
    }

    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle);

    const links = 5;
    const linkLen = size * 1.2;
    
    ctx.strokeStyle = '#9370db'; // Medium Purple
    ctx.lineWidth = 3;
    ctx.shadowColor = '#4b0082';
    ctx.shadowBlur = 5;

    for(let i=0; i<links; i++) {
        ctx.save();
        ctx.translate(-i * linkLen * 0.8, 0);
        if (i % 2 === 0) {
            ctx.strokeRect(-linkLen/2, -4, linkLen, 8);
        } else {
            ctx.beginPath();
            ctx.ellipse(0, 0, linkLen/2, 4, 0, 0, Math.PI*2);
            ctx.stroke();
        }
        ctx.restore();
    }

    // Hook Head
    ctx.fillStyle = '#4b0082';
    ctx.beginPath();
    ctx.moveTo(size, 0);
    ctx.lineTo(0, -size * 0.6);
    ctx.lineTo(-size * 0.2, 0);
    ctx.lineTo(0, size * 0.6);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    ctx.restore();
  }
};
