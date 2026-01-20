
import { ProceduralArt } from '../../types';
import { DrawUtils } from '../primitives/DrawUtils';

export const AetherGolemArt: ProceduralArt = {
  draw(ctx, x, y, size, time, angle, state) {
    ctx.save();
    ctx.translate(x, y);

    // Levitation
    const hover = Math.sin(time * 2) * 3;
    ctx.translate(0, hover);

    const level = state?.powerLevel || 1;
    const isTitan = level >= 5;
    const coreColor = isTitan ? '#ffd700' : '#00ffff';
    const rockColor = '#5a4d41';

    // --- GROUND RUNE ---
    ctx.save();
    ctx.scale(1, 0.3);
    ctx.translate(0, size * 2.5);
    ctx.strokeStyle = coreColor;
    ctx.globalAlpha = 0.3 + Math.sin(time * 5) * 0.2;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(0, 0, size * 1.5, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();

    // --- FLOATING LIMBS ---
    // Shoulders
    ctx.fillStyle = rockColor;
    ctx.strokeStyle = '#3e342c';
    ctx.lineWidth = 1;

    const limbOsc = Math.sin(time * 1.5) * 2;
    
    // Left Shoulder
    ctx.beginPath();
    ctx.rect(-size*1.2, -size*0.8 + limbOsc, size*0.6, size*0.8);
    ctx.fill();
    ctx.stroke();

    // Right Shoulder
    ctx.beginPath();
    ctx.rect(size*0.6, -size*0.8 - limbOsc, size*0.6, size*0.8);
    ctx.fill();
    ctx.stroke();

    // Hands (Floating lower)
    ctx.beginPath();
    ctx.rect(-size*1.3, size*0.2 + limbOsc, size*0.5, size*0.6); // L
    ctx.fill();
    ctx.beginPath();
    ctx.rect(size*0.8, size*0.2 - limbOsc, size*0.5, size*0.6); // R
    ctx.fill();

    // --- BODY CORE ---
    // Central Stone
    ctx.beginPath();
    ctx.moveTo(0, -size);
    ctx.lineTo(size * 0.6, -size * 0.2);
    ctx.lineTo(0, size * 0.8);
    ctx.lineTo(-size * 0.6, -size * 0.2);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Arcane Binding (Energy swirling)
    DrawUtils.drawGlow(ctx, size * 0.4, coreColor, 0.6);
    
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.arc(0, -size * 0.2, size * 0.2, 0, Math.PI * 2);
    ctx.fill();

    // Rune Symbol on Chest
    ctx.strokeStyle = coreColor;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(-5, -5); ctx.lineTo(5, 5);
    ctx.moveTo(5, -5); ctx.lineTo(-5, 5);
    ctx.stroke();

    ctx.restore();
  }
};
