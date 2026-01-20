
import { ProceduralArt } from '../../types';
import { DrawUtils } from '../primitives/DrawUtils';

export const WaterSlimeArt: ProceduralArt = {
  draw(ctx, x, y, size, time, angle, state) {
    ctx.save();
    ctx.translate(x, y);

    const isKing = state?.isKing;
    // More vibrant colors with transparency
    const bodyColorStart = isKing ? 'rgba(50, 100, 255, 0.85)' : 'rgba(0, 180, 255, 0.7)';
    const bodyColorEnd = isKing ? 'rgba(0, 20, 100, 0.9)' : 'rgba(0, 100, 200, 0.8)';
    
    // Slime wobble animation (Squash and Stretch)
    const squash = Math.sin(time * 5) * 0.15;
    const stretch = Math.cos(time * 5) * 0.1;
    ctx.scale(1 + stretch, 1 - squash); // Conservation of volume-ish

    // --- SHADOW / PUDDLE (Caustics) ---
    ctx.save();
    ctx.scale(1, 0.3);
    ctx.translate(0, size * 3);
    const causticGrad = ctx.createRadialGradient(0, 0, 0, 0, 0, size * 2);
    causticGrad.addColorStop(0, 'rgba(0, 255, 255, 0.3)');
    causticGrad.addColorStop(0.5, 'rgba(0, 100, 255, 0.1)');
    causticGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = causticGrad;
    ctx.beginPath();
    ctx.arc(0, 0, size * 2 + Math.sin(time * 10) * 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // --- MAIN BODY (Wobbly Blob) ---
    const blobPath = new Path2D();
    const points = 16; // Smoothness
    // Generate wobbly points
    for (let i = 0; i <= points; i++) {
        const theta = (i / points) * Math.PI * 2;
        // Complex noise for liquid surface tension feeling
        const noise = Math.sin(theta * 3 + time * 3) * (size * 0.05) + Math.cos(theta * 5 - time * 2) * (size * 0.05);
        const r = size + noise;
        const px = Math.cos(theta) * r;
        const py = Math.sin(theta) * r;
        if (i === 0) blobPath.moveTo(px, py);
        else blobPath.lineTo(px, py);
    }
    blobPath.closePath();

    // Body Gradient
    const grad = ctx.createRadialGradient(-size*0.3, -size*0.3, size*0.1, 0, 0, size);
    grad.addColorStop(0, 'rgba(255, 255, 255, 0.4)'); // Highlight
    grad.addColorStop(0.3, bodyColorStart);
    grad.addColorStop(1, bodyColorEnd);

    ctx.fillStyle = grad;
    ctx.fill(blobPath);
    
    // Rim Light
    ctx.strokeStyle = 'rgba(200, 255, 255, 0.5)';
    ctx.lineWidth = 2;
    ctx.stroke(blobPath);

    // --- INSIDES (Suspended Debris) ---
    ctx.save();
    ctx.clip(blobPath); // Clip inside body

    // 1. Core/Nucleus
    const coreY = Math.sin(time * 2) * 5;
    ctx.fillStyle = isKing ? '#ff0000' : '#004488'; // Red core for king, dark blue for normal
    ctx.beginPath();
    ctx.arc(0, coreY, size * 0.3, 0, Math.PI * 2);
    ctx.fill();

    // 2. Floating Bones/Debris
    const items = 3;
    for(let i=0; i<items; i++) {
        const t = time * 0.5 + i * (Math.PI * 2 / items);
        const floatR = size * 0.5;
        const ix = Math.cos(t) * floatR;
        const iy = Math.sin(t * 1.5) * floatR * 0.5;
        
        ctx.save();
        ctx.translate(ix, iy);
        ctx.rotate(time + i);
        // Draw small bone shape
        ctx.beginPath();
        ctx.moveTo(-3, -3); ctx.lineTo(3, 3);
        ctx.moveTo(3, -3); ctx.lineTo(-3, 3);
        ctx.lineWidth = 2;
        ctx.strokeStyle = 'rgba(200, 200, 200, 0.5)';
        ctx.stroke();
        ctx.restore();
    }

    // 3. Bubbles
    ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
    for(let i=0; i<5; i++) {
        const t = (time * (1 + i*0.2)) % 20; // Loop
        const yPos = size - (t * size * 0.2) % (size * 2); // Rise up
        const xPos = Math.sin(t + i) * size * 0.5;
        
        if (yPos > -size && yPos < size) {
            ctx.beginPath();
            ctx.arc(xPos, yPos, 2 + (i%2), 0, Math.PI*2);
            ctx.fill();
        }
    }

    ctx.restore(); // End Clip

    // --- FACE ---
    ctx.save();
    // Face floats slightly independent of squash
    ctx.translate(0, -size * 0.1); 
    
    // Eyes
    const eyeColor = isKing ? '#ffff00' : '#000000';
    ctx.fillStyle = eyeColor;
    ctx.beginPath();
    ctx.ellipse(-size*0.3, -size*0.1, 4, 6, 0, 0, Math.PI*2); // Left
    ctx.ellipse(size*0.3, -size*0.1, 4, 6, 0, 0, Math.PI*2); // Right
    ctx.fill();
    
    // Shine in eyes
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.arc(-size*0.3 - 1, -size*0.1 - 2, 2, 0, Math.PI*2);
    ctx.arc(size*0.3 - 1, -size*0.1 - 2, 2, 0, Math.PI*2);
    ctx.fill();

    // Mouth (Dripping)
    ctx.strokeStyle = eyeColor;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(0, size * 0.2, size * 0.15, 0, Math.PI); // Smile
    ctx.stroke();

    ctx.restore();

    // --- GLOSSY HIGHLIGHT (Specular) ---
    ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
    ctx.beginPath();
    ctx.ellipse(-size*0.4, -size*0.4, size*0.2, size*0.1, -Math.PI/4, 0, Math.PI*2);
    ctx.fill();

    // --- KING CROWN ---
    if (isKing) {
        ctx.save();
        ctx.translate(0, -size * 0.9);
        ctx.rotate(Math.sin(time * 3) * 0.1); // Crown wobble
        
        ctx.fillStyle = '#ffd700';
        ctx.strokeStyle = '#DAA520';
        ctx.lineWidth = 2;
        
        ctx.beginPath();
        ctx.moveTo(-12, 0);
        ctx.lineTo(-8, -12);
        ctx.lineTo(-4, -6);
        ctx.lineTo(0, -14);
        ctx.lineTo(4, -6);
        ctx.lineTo(8, -12);
        ctx.lineTo(12, 0);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        
        // Gems
        ctx.fillStyle = '#ff0000';
        ctx.beginPath(); ctx.arc(0, -8, 2, 0, Math.PI*2); ctx.fill();
        ctx.fillStyle = '#0000ff';
        ctx.beginPath(); ctx.arc(-8, -6, 2, 0, Math.PI*2); ctx.fill();
        ctx.beginPath(); ctx.arc(8, -6, 2, 0, Math.PI*2); ctx.fill();
        
        ctx.restore();
    }

    ctx.restore();
  }
};
