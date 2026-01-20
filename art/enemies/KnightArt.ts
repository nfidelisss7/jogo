
import { ProceduralArt } from '../../types';
import { DrawUtils } from '../primitives/DrawUtils';

export const KnightArt: ProceduralArt = {
  draw(ctx, x, y, size, time, angle, state) {
    ctx.save();
    
    // Heavy Step
    const bounce = Math.abs(Math.sin(time * 5)) * 3;
    ctx.translate(0, -bounce);

    const isKing = state?.isKing;
    const metalColor = isKing ? '#444' : '#888';
    const highlight = isKing ? '#ffd700' : '#ddd'; // Gold trim for King

    // Legs
    ctx.fillStyle = metalColor;
    ctx.fillRect(-6, 5, 5, 10);
    ctx.fillRect(1, 5, 5, 10);

    // Torso Armor
    const armorGrad = DrawUtils.createMetallicGradient(ctx, size, metalColor, highlight);
    ctx.fillStyle = armorGrad;
    ctx.beginPath();
    ctx.rect(-size*0.6, -size*0.8, size*1.2, size*1.4);
    ctx.fill();
    ctx.stroke();

    // Chest Emblem
    ctx.fillStyle = isKing ? '#a00' : '#333';
    ctx.beginPath();
    ctx.moveTo(-5, -5); ctx.lineTo(5, -5); ctx.lineTo(0, 5);
    ctx.fill();

    // Head (Helmet)
    ctx.save();
    ctx.translate(0, -size * 0.9);
    ctx.fillStyle = metalColor;
    ctx.beginPath();
    ctx.arc(0, 0, size * 0.4, Math.PI, 0); // Dome
    ctx.lineTo(size*0.4, size*0.4);
    ctx.lineTo(-size*0.4, size*0.4);
    ctx.fill();
    
    // Visor
    ctx.fillStyle = '#000';
    ctx.fillRect(-6, -2, 12, 3);
    
    // Plume
    if (isKing) {
        ctx.fillStyle = '#f00';
        ctx.beginPath();
        ctx.moveTo(0, -size*0.4);
        ctx.quadraticCurveTo(10, -size, 0, -size*0.8);
        ctx.fill();
    }
    ctx.restore();

    // Shield (Left)
    ctx.save();
    ctx.translate(-size*0.8, 0);
    ctx.rotate(Math.sin(time * 4) * 0.1);
    ctx.fillStyle = isKing ? '#222' : '#555';
    ctx.strokeStyle = highlight;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(-5, -10);
    ctx.lineTo(5, -10);
    ctx.lineTo(5, 5);
    ctx.lineTo(0, 12);
    ctx.lineTo(-5, 5);
    ctx.fill();
    ctx.stroke();
    ctx.restore();

    // Sword (Right)
    ctx.save();
    ctx.translate(size*0.8, 0);
    ctx.rotate(-Math.PI/2 + Math.sin(time * 4) * 0.2); // Pointing forward
    ctx.fillStyle = '#ccc';
    ctx.fillRect(-2, 0, 4, 20); // Blade
    ctx.fillStyle = '#432';
    ctx.fillRect(-4, -5, 8, 5); // Guard
    ctx.restore();

    ctx.restore();
  }
};
