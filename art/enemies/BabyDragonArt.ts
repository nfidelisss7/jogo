
import { ProceduralArt } from '../../types';
import { DrawUtils } from '../primitives/DrawUtils';

export const BabyDragonArt: ProceduralArt = {
  draw(ctx, x, y, size, time, angle, state) {
    ctx.save();
    ctx.translate(x, y);
    
    // Flight bob
    ctx.translate(0, Math.sin(time * 8) * 3);

    const skinColor = '#800000';
    const wingColor = '#400';

    // Far Wing (Simple Triangle)
    ctx.save();
    const flap = Math.sin(time * 15) * size * 0.5;
    ctx.translate(0, -size * 0.3);
    ctx.fillStyle = wingColor;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(-size, -size * 0.5 - flap);
    ctx.lineTo(-size * 0.5, size * 0.5 - flap);
    ctx.fill();
    ctx.restore();

    // Body (Solid)
    ctx.fillStyle = skinColor;
    ctx.beginPath();
    ctx.ellipse(0, 0, size, size * 0.5, 0, 0, Math.PI * 2);
    ctx.fill();

    // Head (Round)
    ctx.beginPath();
    ctx.arc(size * 0.6, -size * 0.2, size * 0.4, 0, Math.PI * 2);
    ctx.fill();

    // Eye (Yellow, simple)
    ctx.fillStyle = '#ffff00';
    ctx.beginPath();
    ctx.arc(size * 0.7, -size * 0.3, 3, 0, Math.PI * 2);
    ctx.fill();

    // Near Wing
    ctx.save();
    ctx.translate(0, -size * 0.3);
    ctx.fillStyle = wingColor;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(-size, -size * 0.5 + flap);
    ctx.lineTo(-size * 0.5, size * 0.5 + flap);
    ctx.fill();
    ctx.restore();

    ctx.restore();
  }
};
