
import { ProceduralArt } from '../../types';
import { DrawUtils } from '../primitives/DrawUtils';

export const BatFamiliarArt: ProceduralArt = {
  draw(ctx, x, y, size, time, angle, state) {
    ctx.save();
    ctx.translate(x, y);
    
    // Face velocity direction
    if (state && state.velocity) {
        const vAngle = Math.atan2(state.velocity.y, state.velocity.x);
        ctx.rotate(vAngle + Math.PI/2);
    } else {
        ctx.rotate(angle);
    }

    const wingColor = '#00bfff'; // Deep Sky Blue
    const bodyColor = '#000';

    // --- WINGS ---
    const flap = Math.sin(time * 20) * size * 0.8;
    ctx.fillStyle = wingColor;
    ctx.globalAlpha = 0.8;
    
    ctx.beginPath();
    ctx.moveTo(0, 0);
    // Left Wing
    ctx.lineTo(-size * 1.5, -size * 0.5 - flap); 
    ctx.lineTo(-size * 0.8, size * 0.5 - flap);
    ctx.lineTo(0, size * 0.2);
    // Right Wing
    ctx.lineTo(size * 0.8, size * 0.5 - flap);
    ctx.lineTo(size * 1.5, -size * 0.5 - flap);
    ctx.closePath();
    ctx.fill();
    ctx.globalAlpha = 1.0;

    // --- BODY ---
    ctx.fillStyle = bodyColor;
    ctx.beginPath();
    ctx.ellipse(0, 0, size * 0.3, size * 0.5, 0, 0, Math.PI * 2);
    ctx.fill();

    // --- EARS ---
    ctx.beginPath();
    ctx.moveTo(-3, -size*0.4); ctx.lineTo(-6, -size*0.8); ctx.lineTo(-1, -size*0.5);
    ctx.moveTo(3, -size*0.4); ctx.lineTo(6, -size*0.8); ctx.lineTo(1, -size*0.5);
    ctx.fill();

    // --- EYES ---
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.arc(-2, -size*0.3, 1.5, 0, Math.PI*2);
    ctx.arc(2, -size*0.3, 1.5, 0, Math.PI*2);
    ctx.fill();

    // --- TRAIL (Magic Dust) ---
    DrawUtils.drawGlow(ctx, size * 0.5, '#00ffff', 0.4);

    ctx.restore();
  }
};
