
import { ProceduralArt } from '../../types';
import { DrawUtils } from '../primitives/DrawUtils';

export const SanctifiedHeraldArt: ProceduralArt = {
  draw(ctx, x, y, size, time, angle, state) {
    ctx.save();
    ctx.translate(x, y);

    // Levitation
    const hover = Math.sin(time * 2) * 5;
    ctx.translate(0, hover);

    // --- AURA (Ground) ---
    ctx.save();
    ctx.scale(1, 0.3);
    ctx.translate(0, size * 3);
    const auraPulse = 1 + Math.sin(time * 4) * 0.1;
    ctx.fillStyle = `rgba(255, 215, 0, ${0.2 * auraPulse})`; // Gold Aura
    ctx.beginPath();
    ctx.arc(0, 0, size * 2.5 * auraPulse, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // --- ROBES (Body) ---
    const robeGrad = ctx.createLinearGradient(-size, -size, size, size);
    robeGrad.addColorStop(0, '#fdfbf7'); // Off-white
    robeGrad.addColorStop(0.5, '#e6d8ad'); // Parchment gold
    robeGrad.addColorStop(1, '#8a7039'); // Shadow gold

    ctx.fillStyle = robeGrad;
    ctx.strokeStyle = '#daa520';
    ctx.lineWidth = 2;

    ctx.beginPath();
    // Hood peak
    ctx.moveTo(0, -size * 1.2);
    // Shoulders
    ctx.bezierCurveTo(size, -size, size * 0.8, size, size * 0.6, size * 1.5);
    // Hem (Cloth Wave)
    const wave = Math.sin(time * 3) * 5;
    ctx.lineTo(wave, size * 1.8);
    ctx.lineTo(-size * 0.6, size * 1.5);
    // Left Shoulder
    ctx.bezierCurveTo(-size * 0.8, size, -size, -size, 0, -size * 1.2);
    ctx.fill();
    ctx.stroke();

    // --- INNER HOOD (The Void) ---
    ctx.fillStyle = '#110022';
    ctx.beginPath();
    ctx.ellipse(0, -size * 0.5, size * 0.3, size * 0.4, 0, 0, Math.PI * 2);
    ctx.fill();

    // Glowing Eyes (Vertical arrangement)
    DrawUtils.drawGlow(ctx, 2, '#00ffff');
    ctx.fillStyle = '#00ffff';
    ctx.beginPath();
    ctx.arc(0, -size * 0.6, 2, 0, Math.PI * 2); // Top eye
    ctx.fill();
    ctx.beginPath();
    ctx.arc(-4, -size * 0.5, 1.5, 0, Math.PI * 2); // Left
    ctx.fill();
    ctx.beginPath();
    ctx.arc(4, -size * 0.5, 1.5, 0, Math.PI * 2); // Right
    ctx.fill();

    // --- STAFF (Weapon) ---
    ctx.save();
    ctx.translate(size * 0.8, -size * 0.2);
    const sway = Math.sin(time * 1.5) * 0.1;
    ctx.rotate(sway);

    // Shaft
    ctx.strokeStyle = '#5a4a30'; // Dark Wood
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(0, -size);
    ctx.lineTo(0, size * 2);
    ctx.stroke();

    // Headpiece
    ctx.translate(0, -size);
    ctx.fillStyle = '#ffd700';
    ctx.beginPath();
    ctx.arc(0, 0, 6, 0, Math.PI * 2);
    ctx.fill();
    
    // Halo around staff
    ctx.strokeStyle = '#00ffff';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(0, 0, 10 + Math.sin(time * 10) * 2, 0, Math.PI * 2);
    ctx.stroke();

    ctx.restore(); // End Staff

    // --- CASTING RUNES ---
    if (state === 'attack') {
        const runeScale = Math.sin(time * 20) * 0.2 + 1;
        ctx.strokeStyle = '#00ffff';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(0, -size, size * runeScale, 0, Math.PI * 2);
        ctx.stroke();
    }

    ctx.restore();
  }
};
