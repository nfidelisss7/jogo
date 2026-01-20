
import { ProceduralArt } from '../../types';
import { DrawUtils } from '../primitives/DrawUtils';

export const SantaClausArt: ProceduralArt = {
  draw(ctx, x, y, size, time, angle, state) {
    ctx.save();
    
    // Jolly bounce
    const bounce = Math.abs(Math.sin(time * 4)) * 3;
    ctx.translate(0, -bounce);

    const isKing = state?.isKing;
    const suitColor = isKing ? '#800000' : '#d40000'; // Darker red for Evil Santa King

    // Sack (Behind)
    ctx.save();
    ctx.translate(-size*0.8, -size*0.5);
    ctx.rotate(-0.2);
    ctx.fillStyle = '#8b4513'; // Brown sack
    ctx.beginPath();
    ctx.arc(0, 0, size*0.7, 0, Math.PI*2);
    ctx.fill();
    ctx.restore();

    // Body (Fat)
    ctx.fillStyle = suitColor;
    ctx.beginPath();
    ctx.arc(0, size*0.2, size*0.8, 0, Math.PI*2);
    ctx.fill();

    // Belt
    ctx.fillStyle = '#000';
    ctx.fillRect(-size*0.8, size*0.2, size*1.6, 6);
    ctx.fillStyle = '#ffd700'; // Buckle
    ctx.fillRect(-4, size*0.2 - 1, 8, 8);

    // White trim vertical
    ctx.fillStyle = '#fff';
    ctx.fillRect(-3, -size*0.6, 6, size*0.8);

    // Head
    ctx.save();
    ctx.translate(0, -size * 0.8);
    ctx.fillStyle = '#ffe0bd'; // Skin
    ctx.beginPath();
    ctx.arc(0, 0, size * 0.4, 0, Math.PI*2);
    ctx.fill();

    // Beard
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.arc(0, 2, size * 0.4, 0, Math.PI); // Chin
    ctx.lineTo(size*0.4, 0);
    ctx.quadraticCurveTo(0, -5, -size*0.4, 0);
    ctx.fill();

    // Hat
    ctx.fillStyle = suitColor;
    ctx.beginPath();
    ctx.moveTo(-size*0.45, -2);
    ctx.quadraticCurveTo(0, -size, size*0.45, -2);
    ctx.fill();
    // Pom pom
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.arc(size*0.45, -5, 4, 0, Math.PI*2);
    ctx.fill();

    // Eyes (Evil?)
    if (isKing) {
        DrawUtils.drawGlow(ctx, 2, '#00ffff'); // Frost eyes
        ctx.fillStyle = '#00ffff';
    } else {
        ctx.fillStyle = '#000';
    }
    ctx.beginPath();
    ctx.arc(-4, -2, 2, 0, Math.PI*2);
    ctx.arc(4, -2, 2, 0, Math.PI*2);
    ctx.fill();

    ctx.restore();

    // Boots
    ctx.fillStyle = '#111';
    ctx.fillRect(-8, size*0.8, 6, 6);
    ctx.fillRect(2, size*0.8, 6, 6);

    ctx.restore();
  }
};
