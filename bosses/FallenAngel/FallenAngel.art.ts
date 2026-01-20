
import { ProceduralArt } from '../../types';
import { DrawUtils } from '../../art/primitives/DrawUtils';

export const FallenAngelArt: ProceduralArt = {
  draw(ctx, x, y, size, time, angle, state) {
    ctx.save();
    ctx.translate(x, y);

    // Floating motion
    const hover = Math.sin(time * 1.5) * 8;
    ctx.translate(0, hover);

    const isPhase2 = (state?.phase || 1) > 1;
    const isShielding = state === 'shielding';

    // --- 1. BROKEN HALO (Rotates & Glitches) ---
    ctx.save();
    ctx.translate(0, -size * 1.2);
    ctx.rotate(time * 0.5);
    
    // Halo fragments
    ctx.strokeStyle = '#ffd700'; // Gold
    ctx.lineWidth = 3;
    ctx.shadowBlur = 10;
    ctx.shadowColor = '#ffd700';
    
    ctx.beginPath();
    ctx.arc(0, 0, size * 0.8, 0, Math.PI * 1.2); // Broken part
    ctx.stroke();
    
    ctx.beginPath();
    ctx.arc(0, 0, size * 0.8, Math.PI * 1.5, Math.PI * 1.8); // Fragment
    ctx.stroke();

    // Dark corruption bleeding from halo
    if (isPhase2 || Math.random() > 0.9) {
        ctx.fillStyle = '#4b0082';
        ctx.globalAlpha = 0.6;
        const drip = Math.sin(time * 10) * 10;
        ctx.fillRect(-2, size * 0.8, 4, drip + 5);
    }
    ctx.restore();

    // --- 2. WINGS (Asymmetric) ---
    
    // Right Wing: Pristine (Feathery)
    ctx.save();
    ctx.rotate(Math.sin(time * 2) * 0.1); // Flap
    ctx.fillStyle = 'rgba(240, 240, 255, 0.9)';
    ctx.strokeStyle = '#ccc';
    ctx.lineWidth = 1;
    
    ctx.beginPath();
    ctx.moveTo(0, -size * 0.5);
    ctx.quadraticCurveTo(size * 2, -size * 1.5, size * 3, -size * 0.5); // Tip
    ctx.quadraticCurveTo(size * 1.5, size * 1.5, 0, size * 0.5); // Base
    ctx.fill();
    ctx.stroke();
    ctx.restore();

    // Left Wing: Corrupted (Skeletal/Torn)
    ctx.save();
    ctx.scale(-1, 1); // Mirror X
    ctx.rotate(Math.sin(time * 2 + 1) * 0.1); // Flap slightly off-sync
    
    ctx.fillStyle = isPhase2 ? 'rgba(20, 0, 40, 0.8)' : 'rgba(50, 50, 60, 0.8)';
    ctx.strokeStyle = '#4b0082'; // Indigo outline
    
    ctx.beginPath();
    ctx.moveTo(0, -size * 0.5);
    ctx.lineTo(size * 2.5, -size); // Bony finger
    ctx.lineTo(size * 1.5, size * 0.5); // Tattered membrane
    ctx.lineTo(size * 0.5, size * 0.8);
    ctx.lineTo(0, size * 0.5);
    ctx.fill();
    ctx.stroke();
    
    // Particles dripping from corrupted wing
    if (Math.random() > 0.5) {
        ctx.fillStyle = '#4b0082';
        ctx.fillRect(size * 1.5, size * 0.5, 2, 4);
    }
    ctx.restore();

    // --- 3. BODY (Hooded Figure) ---
    const robeColor = '#e0e0e0'; // Off-white
    const corruptColor = '#220033'; // Dark purple

    // Robe Gradient (Corruption rising from bottom)
    const robeGrad = ctx.createLinearGradient(0, -size, 0, size * 1.5);
    robeGrad.addColorStop(0, robeColor);
    robeGrad.addColorStop(0.6, robeColor);
    robeGrad.addColorStop(1, corruptColor);

    ctx.fillStyle = robeGrad;
    ctx.beginPath();
    // Hood/Head
    ctx.moveTo(0, -size * 0.8);
    ctx.lineTo(size * 0.5, -size * 0.3);
    // Shoulders
    ctx.quadraticCurveTo(size * 0.8, -size * 0.2, size * 0.6, size * 1.5); // Right side
    ctx.lineTo(-size * 0.6, size * 1.5); // Bottom hem
    ctx.quadraticCurveTo(-size * 0.8, -size * 0.2, -size * 0.5, -size * 0.3); // Left side
    ctx.closePath();
    ctx.fill();

    // --- 4. RUNE TATTOOS ---
    ctx.strokeStyle = '#8a2be2'; // Blue-Violet
    ctx.lineWidth = 2;
    ctx.beginPath();
    // Chest Rune
    ctx.moveTo(0, -size * 0.2);
    ctx.lineTo(0, size * 0.4);
    ctx.moveTo(-size * 0.2, 0);
    ctx.lineTo(size * 0.2, 0);
    ctx.stroke();

    // --- 5. FACE (Void) ---
    ctx.fillStyle = '#000';
    ctx.beginPath();
    ctx.ellipse(0, -size * 0.4, size * 0.25, size * 0.35, 0, 0, Math.PI * 2);
    ctx.fill();

    // Eyes (Bleeding light)
    DrawUtils.drawGlow(ctx, 2, '#ff00ff');
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.arc(-4, -size * 0.4, 2, 0, Math.PI * 2);
    ctx.arc(4, -size * 0.4, 2, 0, Math.PI * 2);
    ctx.fill();

    // --- 6. SHIELD VISUAL (If Active) ---
    if (isShielding) {
        ctx.save();
        ctx.globalAlpha = 0.4;
        ctx.fillStyle = '#ffd700'; // Holy Shield
        ctx.beginPath();
        // Cone/Arc in front
        ctx.arc(0, 0, size * 2.5, 0, Math.PI, false); // Bottom half arc
        ctx.lineTo(0, 0);
        ctx.fill();
        
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.restore();
    }

    ctx.restore();
  }
};
