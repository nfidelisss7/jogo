
import { ProceduralArt } from '../../types';
import { DrawUtils } from '../primitives/DrawUtils';

export const GrimoireBookArt: ProceduralArt = {
  draw(ctx, x, y, size, time, angle, state) {
    ctx.save();
    ctx.translate(x, y);
    
    // Bob
    ctx.translate(0, Math.sin(time * 3) * 5);

    const coverColor = '#4b0082'; // Indigo
    const pageColor = '#f5deb3'; // Wheat
    const goldColor = '#ffd700';

    // --- BACK COVER ---
    ctx.fillStyle = coverColor;
    ctx.beginPath();
    ctx.moveTo(-size, -size * 1.2);
    ctx.lineTo(size, -size * 1.2);
    ctx.lineTo(size * 0.8, size * 1.2);
    ctx.lineTo(-size * 0.8, size * 1.2);
    ctx.fill();

    // --- PAGES (Fan effect) ---
    ctx.fillStyle = pageColor;
    for(let i=0; i<5; i++) {
        const offset = Math.sin(time * 5 + i) * 2;
        ctx.fillRect(-size*0.7 + i*2, -size + offset, size*1.4, size*1.8);
    }

    // --- FRONT COVER (Open Angled) ---
    ctx.fillStyle = coverColor;
    ctx.strokeStyle = goldColor;
    ctx.lineWidth = 2;
    
    // Left side open
    ctx.beginPath();
    ctx.moveTo(0, -size * 1.2);
    ctx.lineTo(-size * 1.2, -size); 
    ctx.lineTo(-size, size * 1.2);
    ctx.lineTo(0, size * 1.2);
    ctx.fill();
    ctx.stroke();

    // Right side open
    ctx.beginPath();
    ctx.moveTo(0, -size * 1.2);
    ctx.lineTo(size * 1.2, -size); 
    ctx.lineTo(size, size * 1.2);
    ctx.lineTo(0, size * 1.2);
    ctx.fill();
    ctx.stroke();

    // --- SPINE ---
    ctx.fillStyle = goldColor;
    ctx.fillRect(-2, -size * 1.25, 4, size * 2.5);

    // --- MAGIC GLYPHS ---
    DrawUtils.drawGlow(ctx, size, '#00ffff', 0.3);
    
    // Floating Runes
    ctx.fillStyle = '#00ffff';
    ctx.font = '12px serif';
    const runeY = -size * 1.5 + Math.sin(time * 4) * 5;
    ctx.fillText('⚡', -5, runeY);

    ctx.restore();
  }
};
