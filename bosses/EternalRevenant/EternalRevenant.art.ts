
import { ProceduralArt } from '../../types';
import { drawPolygon } from '../../art/primitives/Shapes';

export const EternalRevenantArt: ProceduralArt = {
  draw(ctx, x, y, size, time, angle, state) {
    ctx.save();
    ctx.translate(x, y);

    // --- HEAVY BREATHING ---
    // Squashes horizontally, stretches vertically (labored breathing)
    const breath = Math.sin(time * 1.5); 
    const scaleX = 1 + breath * 0.05;
    const scaleY = 1 - breath * 0.05;
    ctx.scale(scaleX, scaleY);

    // Lumbering rotation
    const lumber = Math.sin(time * 0.8) * 0.08;
    ctx.rotate(lumber);

    // --- 1. MAIN BODY (Pile of Flesh) ---
    // Using bezier curves to simulate sagging weight
    ctx.fillStyle = '#3a443a'; // Dead necrotic green/grey
    ctx.strokeStyle = '#1a221a';
    ctx.lineWidth = 3;

    ctx.beginPath();
    ctx.moveTo(-size, -size); // Top Left
    // Sagging top
    ctx.bezierCurveTo(-size*0.5, -size*0.8, size*0.5, -size*0.8, size, -size); 
    // Right side bulging
    ctx.bezierCurveTo(size*1.3, -size*0.5, size*1.5, size*0.5, size*0.8, size);
    // Bottom sagging heavy
    ctx.bezierCurveTo(size*0.4, size*1.4, -size*0.4, size*1.4, -size*0.8, size);
    // Left side
    ctx.bezierCurveTo(-size*1.3, size*0.5, -size*1.2, -size*0.5, -size, -size);
    
    ctx.fill();
    ctx.stroke();

    // --- 2. STITCHES & SCARS (Detail) ---
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 1;
    const scars = 5;
    for(let i=0; i<scars; i++) {
        const sx = (Math.random()-0.5) * size * 1.5;
        const sy = (Math.random()-0.5) * size * 1.5;
        
        ctx.beginPath();
        ctx.moveTo(sx - 10, sy - 5);
        ctx.lineTo(sx + 10, sy + 5);
        ctx.stroke();
        
        // Cross stitches
        for(let j=0; j<3; j++) {
            const tx = (j/2); // 0 to 1
            const stitchX = (sx - 10) + tx * 20;
            const stitchY = (sy - 5) + tx * 10;
            ctx.beginPath();
            ctx.moveTo(stitchX - 3, stitchY + 3);
            ctx.lineTo(stitchX + 3, stitchY - 3);
            ctx.stroke();
        }
    }

    // --- 3. EMBEDDED GHOST FACES ---
    // Souls trapped in the flesh
    ctx.save();
    ctx.globalAlpha = 0.3; // Faint
    ctx.fillStyle = '#aaffaa';
    
    const faces = 3;
    for(let i=0; i<faces; i++) {
        const fx = Math.sin(time + i * 2) * size * 0.4;
        const fy = Math.cos(time + i * 2) * size * 0.4;
        
        // Face pulse
        const fScale = 1 + Math.sin(time * 5 + i) * 0.2;
        
        ctx.save();
        ctx.translate(fx, fy);
        ctx.scale(fScale, fScale);
        
        // Scream shape
        ctx.beginPath();
        ctx.arc(0, 0, 8, 0, Math.PI*2); // Mouth
        ctx.arc(-6, -8, 3, 0, Math.PI*2); // Eye L
        ctx.arc(6, -8, 3, 0, Math.PI*2); // Eye R
        ctx.fill();
        
        ctx.restore();
    }
    ctx.restore();

    // --- 4. ASYMMETRIC LIMBS ---
    // Right Arm (Huge Club)
    ctx.fillStyle = '#4d3a3a'; // Reddish swollen
    ctx.beginPath();
    ctx.moveTo(size * 0.8, -size * 0.5);
    ctx.bezierCurveTo(size*2, -size*0.2, size*2.5, size*0.8, size, size*0.8);
    ctx.fill();
    ctx.stroke();

    // Left Arm (Atrophied)
    ctx.fillStyle = '#2d332d';
    drawPolygon(ctx, [{x: -size*0.8, y: -size*0.5}, {x: -size*1.6, y: -size*0.2}, {x: -size*0.9, y: 0}]);

    // --- 5. NECROTIC DRIPS ---
    ctx.fillStyle = '#77ff77'; // Slime green
    const drips = 4;
    for(let i=0; i<drips; i++) {
        const offsetX = (i - drips/2) * size * 0.5;
        const offsetY = size;
        
        // Elastic drip logic
        const dripLen = (time * (2 + i) * 50) % 40;
        const dripRad = 2 + (dripLen / 10);
        
        if (dripLen < 35) {
            // Line
            ctx.beginPath();
            ctx.moveTo(offsetX, offsetY);
            ctx.lineTo(offsetX, offsetY + dripLen);
            ctx.strokeStyle = '#77ff77';
            ctx.lineWidth = 2;
            ctx.stroke();
            
            // Drop
            ctx.beginPath();
            ctx.arc(offsetX, offsetY + dripLen, dripRad, 0, Math.PI*2);
            ctx.fill();
        }
    }

    // --- 6. HEAD (Tiny) ---
    ctx.fillStyle = '#666';
    ctx.beginPath();
    ctx.arc(0, -size * 1.1, size * 0.25, 0, Math.PI * 2);
    ctx.fill();
    
    // Glowing Green Eyes
    ctx.fillStyle = '#00ff00';
    ctx.shadowBlur = 10;
    ctx.shadowColor = '#00ff00';
    const blink = Math.sin(time * 4) > 0.9;
    if (!blink) {
        ctx.fillRect(-5, -size*1.15, 4, 4);
        ctx.fillRect(1, -size*1.15, 4, 4);
    }
    ctx.shadowBlur = 0;

    ctx.restore();
  }
};
