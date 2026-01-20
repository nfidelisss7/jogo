
import { DrawUtils } from '../primitives/DrawUtils';

export const PlayerArt = {
  draw(ctx: CanvasRenderingContext2D, x: number, y: number, size: number, time: number) {
    ctx.save();
    ctx.translate(x, y);

    // --- ANIMATION STATE ---
    // Floating Mage Levitation (Slow, controlled bob)
    // This communicates magical flight rather than physical walking.
    const hover = Math.sin(time * 2) * 3;
    const breathe = 1 + Math.sin(time * 3) * 0.02; // Very subtle breath scale
    
    ctx.translate(0, hover);
    ctx.scale(breathe, 1 / breathe);

    // --- 1. ARCANE SHADOW (Grounding) ---
    // Ink-blot shadow that reacts to hover height
    ctx.save();
    ctx.translate(0, -hover + size * 2.2);
    ctx.scale(1.0 - (hover / 30), 0.3);
    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    ctx.beginPath();
    ctx.arc(0, 0, size * 0.8, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // --- COLOR PALETTE (Arcane Identity) ---
    const colorRobeDark = '#0b0b12';   // Deep Void Black
    const colorRobeMid  = '#1a1a2e';   // Midnight Blue
    const colorTrim     = '#303050';   // Faded Indigo Trim
    const colorArcane   = '#00ffff';   // Cyan Energy Highlight

    // --- 2. BACK ROBE (Trailing Cloth) ---
    // Flows behind the character, reacting to "wind" (time) to simulate motion
    const wind = Math.sin(time * 2.5) * 4;
    
    ctx.save();
    ctx.fillStyle = colorRobeDark;
    ctx.beginPath();
    ctx.moveTo(-size * 0.6, 0); 
    // Left trailing edge (curved)
    ctx.quadraticCurveTo(-size * 0.8 + wind, size * 1.5, -size * 0.9 + wind, size * 2.2);
    // Bottom hem
    ctx.lineTo(size * 0.9 + wind, size * 2.2);
    // Right trailing edge
    ctx.quadraticCurveTo(size * 0.8 + wind, size * 1.5, size * 0.6, 0);
    ctx.fill();
    ctx.restore();

    // --- 3. MAIN BODY (Tunic/Vestments) ---
    // Slender, elegant silhouette. Tapered waist, flared bottom.
    const bodyGrad = ctx.createLinearGradient(-size, -size, size, size * 2);
    bodyGrad.addColorStop(0, '#252540');
    bodyGrad.addColorStop(1, '#101018');
    
    ctx.fillStyle = bodyGrad;
    ctx.beginPath();
    // Neck
    ctx.moveTo(-size * 0.4, -size * 0.8);
    ctx.lineTo(size * 0.4, -size * 0.8);
    // Shoulders (Sloped, cloth-like)
    ctx.lineTo(size * 0.6, -size * 0.4); 
    // Waist (Cinched)
    ctx.lineTo(size * 0.4, size * 0.8);
    // Robe bottom (Flared)
    ctx.lineTo(size * 0.5, size * 1.8);
    ctx.lineTo(-size * 0.5, size * 1.8);
    ctx.lineTo(-size * 0.4, size * 0.8);
    ctx.lineTo(-size * 0.6, -size * 0.4);
    ctx.closePath();
    ctx.fill();

    // Sash / Belt (Visual separation of torso and legs)
    ctx.fillStyle = '#101015';
    ctx.fillRect(-size*0.4, size*0.6, size*0.8, size*0.2);
    
    // Vertical Trim (The "Vestment" look)
    ctx.strokeStyle = colorTrim;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, -size * 0.8);
    ctx.lineTo(0, size * 1.8);
    ctx.stroke();

    // --- 4. MANTLE / COWL (Shoulders) ---
    // High collar silhouette implies "Mage" over "Warrior"
    ctx.fillStyle = colorRobeMid;
    ctx.beginPath();
    ctx.moveTo(-size * 0.6, -size * 0.4);
    ctx.quadraticCurveTo(0, -size * 1.0, size * 0.6, -size * 0.4); // High collar back curve
    ctx.lineTo(size * 0.5, 0); // Front drape
    ctx.lineTo(0, size * 0.4); // Center clasp
    ctx.lineTo(-size * 0.5, 0);
    ctx.closePath();
    ctx.fill();
    
    // Trim on Mantle
    ctx.strokeStyle = '#404060';
    ctx.lineWidth = 1;
    ctx.stroke();

    // --- 5. HANDS (Arcane Focus) ---
    // Floating hands casting spells, reinforcing magic usage
    const handBob = Math.sin(time * 4) * 2;
    
    const drawHand = (hx: number, hy: number) => {
        ctx.save();
        ctx.translate(hx, hy + handBob);
        
        // Glove/Sleeve
        ctx.fillStyle = colorRobeDark;
        ctx.beginPath();
        ctx.arc(0, 0, 4, 0, Math.PI*2);
        ctx.fill();
        
        // Magic Glow (The source of power)
        DrawUtils.drawGlow(ctx, 8, colorArcane, 0.4);
        ctx.fillStyle = '#fff';
        ctx.globalAlpha = 0.8;
        ctx.beginPath();
        ctx.arc(0, 0, 2, 0, Math.PI*2);
        ctx.fill();
        
        ctx.restore();
    };
    
    drawHand(-size * 0.7, 0);
    drawHand(size * 0.7, 0);

    // --- 6. HEAD (Hooded Visage) ---
    ctx.save();
    ctx.translate(0, -size * 0.9);

    // Hood Shape (Deep cowl)
    ctx.fillStyle = '#151520';
    ctx.beginPath();
    ctx.arc(0, -2, size * 0.45, Math.PI, 0); // Top dome
    ctx.lineTo(size * 0.45, size * 0.3);     // Sides down
    ctx.lineTo(0, size * 0.5);               // Chin point
    ctx.lineTo(-size * 0.45, size * 0.3);
    ctx.closePath();
    ctx.fill();

    // Inner Shadow (The Face of the Void)
    ctx.fillStyle = '#000';
    ctx.beginPath();
    ctx.ellipse(0, 0, size * 0.35, size * 0.4, 0, 0, Math.PI * 2);
    ctx.fill();

    // Glowing Eyes (Intelligence / Magic)
    ctx.shadowBlur = 10;
    ctx.shadowColor = colorArcane;
    ctx.fillStyle = '#ccffff';
    
    // Left Eye
    ctx.beginPath();
    ctx.arc(-4, 2, 2, 0, Math.PI * 2);
    ctx.fill();
    
    // Right Eye
    ctx.beginPath();
    ctx.arc(4, 2, 2, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.shadowBlur = 0;
    ctx.restore();

    // --- 7. RUNIC SIGIL (Subtle Halo) ---
    // Slowly rotating ring behind/around head to signify magical attunement
    ctx.save();
    ctx.translate(0, -size * 1.0); // Position behind head
    ctx.rotate(time * 0.5); // Slow rotation
    ctx.scale(1, 0.3); // Flatten perspective into a ring
    
    ctx.strokeStyle = `rgba(0, 255, 255, 0.3)`;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(0, 0, size * 1.2, 0, Math.PI * 2);
    ctx.stroke();
    
    // Runes on ring (Orbiting dots)
    const runes = 3;
    for(let i=0; i<runes; i++) {
        const ang = (i / runes) * Math.PI * 2;
        const rx = Math.cos(ang) * size * 1.2;
        const ry = Math.sin(ang) * size * 1.2;
        ctx.fillStyle = colorArcane;
        ctx.beginPath();
        ctx.arc(rx, ry, 1.5, 0, Math.PI*2);
        ctx.fill();
    }
    
    ctx.restore();

    ctx.restore();
  }
};
