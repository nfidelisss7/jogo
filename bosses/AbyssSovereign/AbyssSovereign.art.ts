
import { ProceduralArt } from '../../types';
import { drawPolygon, getJaggedVertices } from '../../art/primitives/Shapes';

export const AbyssSovereignArt: ProceduralArt = {
  draw(ctx, x, y, size, time, angle, state) {
    ctx.save();
    ctx.translate(x, y);

    // --- UNSTABLE REALITY DISTORTION ---
    // Slight random jitter to whole boss
    if (Math.random() > 0.8) {
        ctx.translate((Math.random()-0.5)*4, (Math.random()-0.5)*4);
    }

    // --- 1. THE VOID CLOUD (Body) ---
    // Three layers of jagged polygons rotating against each other
    const layers = 3;
    for(let i=0; i<layers; i++) {
        ctx.save();
        const layerScale = 1 - (i * 0.2);
        const rotationSpeed = (i % 2 === 0 ? 1 : -1) * (0.5 + i * 0.2);
        
        ctx.rotate(time * rotationSpeed);
        ctx.scale(layerScale, layerScale);
        
        ctx.fillStyle = i === 0 ? '#000' : `rgba(30, 0, 60, ${0.6 - i * 0.1})`;
        ctx.strokeStyle = i === 0 ? '#4b0082' : '#8a2be2';
        ctx.lineWidth = 2;
        
        // Dynamic jagged vertices (noise based on time)
        const points = 12;
        const verts = [];
        for(let j=0; j<points; j++) {
            const a = (j/points) * Math.PI * 2;
            const noise = Math.sin(time * 4 + j + i) * (size * 0.2);
            const r = (size * 1.5) + noise;
            verts.push({
                x: Math.cos(a) * r,
                y: Math.sin(a) * r
            });
        }
        drawPolygon(ctx, verts);
        ctx.restore();
    }

    // --- 2. UNDULATING TENTACLES ---
    const tentacleCount = 8;
    ctx.strokeStyle = '#9400d3';
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    
    for(let i=0; i<tentacleCount; i++) {
        const baseAngle = (i / tentacleCount) * Math.PI * 2 + time * 0.2;
        
        ctx.beginPath();
        let px = Math.cos(baseAngle) * size * 0.5;
        let py = Math.sin(baseAngle) * size * 0.5;
        ctx.moveTo(px, py);
        
        // Inverse Kinematics-ish Sine Chain
        const segments = 10;
        const segLen = size * 0.3;
        
        for(let j=0; j<segments; j++) {
            // Wave propagates down the tentacle
            const wave = Math.sin(time * 5 + j * 0.5 + i) * 0.5;
            const a = baseAngle + wave;
            
            px += Math.cos(a) * segLen;
            py += Math.sin(a) * segLen;
            ctx.lineTo(px, py);
        }
        ctx.stroke();
    }

    // --- 3. THE CROWN (Floating) ---
    ctx.save();
    const floatY = Math.sin(time * 2) * 10;
    ctx.translate(0, floatY);
    ctx.rotate(time * 0.5); // Slow rotation independent of body
    
    ctx.fillStyle = '#00ffff';
    ctx.shadowColor = '#00ffff';
    ctx.shadowBlur = 15;
    
    // Draw 3 orbiting shards
    for(let i=0; i<3; i++) {
        const a = (i/3) * Math.PI * 2;
        const r = size * 0.8;
        const sx = Math.cos(a) * r;
        const sy = Math.sin(a) * r;
        
        ctx.beginPath();
        ctx.moveTo(sx, sy - 15);
        ctx.lineTo(sx + 10, sy);
        ctx.lineTo(sx, sy + 15);
        ctx.lineTo(sx - 10, sy);
        ctx.fill();
    }
    ctx.shadowBlur = 0;
    ctx.restore();

    // --- 4. VOID EYES (Opening/Closing) ---
    // Scattered randomly across the body surface space
    const eyes = [
        {x: 0, y: 0, s: 1.0},
        {x: size*0.5, y: -size*0.5, s: 2.3},
        {x: -size*0.6, y: size*0.4, s: 4.1},
        {x: size*0.7, y: size*0.2, s: 1.5},
        {x: -size*0.3, y: -size*0.8, s: 5.0}
    ];

    ctx.fillStyle = '#fff';
    
    eyes.forEach(eye => {
        // Open/Close cycle based on distinct speeds (s)
        const cycle = Math.sin(time * eye.s);
        // Clamp to 0-1 for "openness"
        const open = Math.max(0, cycle); 
        
        if (open > 0.1) {
            ctx.save();
            ctx.translate(eye.x, eye.y);
            // Eye shape
            ctx.beginPath();
            ctx.ellipse(0, 0, 10, 10 * open, 0, 0, Math.PI*2);
            ctx.fill();
            
            // Pupil
            ctx.fillStyle = '#000';
            ctx.beginPath();
            ctx.arc(0, 0, 3 * open, 0, Math.PI*2);
            ctx.fill();
            ctx.fillStyle = '#fff'; // Reset for next eye
            ctx.restore();
        }
    });

    ctx.restore();
  }
};
