
import { ProceduralArt } from '../../types';
import { DrawUtils } from '../primitives/DrawUtils';

export const AngelArt: ProceduralArt = {
  draw(ctx, x, y, size, time, angle, state) {
    ctx.save();
    ctx.translate(x, y);
    
    // Ethereal Float
    ctx.translate(0, Math.sin(time * 2.5) * 8);

    const isKing = state?.isKing;
    const coreColor = isKing ? '#ffd700' : '#e0e0e0';
    const wingColor = isKing ? 'rgba(255, 220, 150, 0.8)' : 'rgba(200, 240, 255, 0.8)';

    // --- WINGS (Multi-Set) ---
    // We draw 3 sets of wings for a biblical accurate feel
    const sets = 3;
    for (let i = 0; i < sets; i++) {
        const wingScale = 1 - (i * 0.2);
        const flapSpeed = 4 + i;
        const flap = Math.sin(time * flapSpeed) * 0.2;
        
        ctx.save();
        ctx.scale(wingScale, wingScale);
        ctx.rotate(flap * (i % 2 === 0 ? 1 : -1)); // Alternating flap direction

        ctx.fillStyle = wingColor;
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 1;

        // Left Wing
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.quadraticCurveTo(-size * 2.5, -size * 2, -size * 3, 0); // Tip
        ctx.quadraticCurveTo(-size * 1.5, size * 1.5, 0, size * 0.5); // Return
        ctx.fill();
        ctx.stroke();

        // Right Wing
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.quadraticCurveTo(size * 2.5, -size * 2, size * 3, 0);
        ctx.quadraticCurveTo(size * 1.5, size * 1.5, 0, size * 0.5);
        ctx.fill();
        ctx.stroke();

        ctx.restore();
    }

    // --- CORE BODY (Abstract Construct) ---
    // Angels in this lore are constructs of light/metal
    const grad = ctx.createRadialGradient(0, 0, size * 0.2, 0, 0, size * 0.8);
    grad.addColorStop(0, '#fff');
    grad.addColorStop(0.5, coreColor);
    grad.addColorStop(1, '#909090');

    ctx.fillStyle = grad;
    ctx.beginPath();
    // Diamond shape
    ctx.moveTo(0, -size);
    ctx.lineTo(size * 0.6, 0);
    ctx.lineTo(0, size * 1.2);
    ctx.lineTo(-size * 0.6, 0);
    ctx.closePath();
    ctx.fill();

    // --- THE EYE (Central Processor) ---
    DrawUtils.drawGlow(ctx, size * 0.4, isKing ? '#ff0000' : '#00aaff');
    ctx.fillStyle = isKing ? '#500' : '#003366';
    ctx.beginPath();
    ctx.arc(0, -size * 0.2, size * 0.3, 0, Math.PI * 2);
    ctx.fill();

    // Pupil
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.arc(0, -size * 0.2, size * 0.1, 0, Math.PI * 2);
    ctx.fill();

    // --- HALO RINGS ---
    ctx.strokeStyle = '#ffd700';
    ctx.lineWidth = 2;
    ctx.save();
    ctx.rotate(time);
    ctx.beginPath();
    ctx.arc(0, 0, size * 1.1, 0, Math.PI * 2); // Ring 1
    ctx.stroke();
    
    ctx.rotate(time * 1.5); // Spin faster
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.arc(0, 0, size * 1.4, 0, Math.PI * 2); // Ring 2
    ctx.stroke();
    ctx.restore();

    ctx.restore();
  }
};
