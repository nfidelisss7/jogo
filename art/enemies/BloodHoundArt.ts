
import { ProceduralArt } from '../../types';
import { DrawUtils } from '../primitives/DrawUtils';

export const BloodHoundArt: ProceduralArt = {
  draw(ctx, x, y, size, time) {
    ctx.save();
    ctx.translate(x, y);
    
    // Animation: Slow, heavy breathing instead of frantic lunging
    const breath = 1 + Math.sin(time * 3) * 0.03;
    ctx.scale(breath, 1/breath);

    // Palette: Deep Crimson + Bone
    const bodyColor = '#4a0505';
    const accentColor = '#7a1a1a';

    // Body: Smooth arch, no internal gradients or noise
    ctx.fillStyle = bodyColor;
    ctx.beginPath();
    ctx.moveTo(size * 0.8, -size * 0.2); // Neck
    ctx.quadraticCurveTo(0, -size * 0.9, -size * 0.8, 0); // Spine
    ctx.quadraticCurveTo(-size * 1.2, size * 0.5, -size * 0.5, size * 0.5); // Rear
    ctx.quadraticCurveTo(0, size * 0.2, size * 0.6, size * 0.3); // Belly
    ctx.closePath();
    ctx.fill();

    // Accent: Simple Rim Light on back
    ctx.strokeStyle = accentColor;
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(size * 0.6, -size * 0.3);
    ctx.quadraticCurveTo(0, -size * 0.8, -size * 0.6, -size * 0.1);
    ctx.stroke();

    // Head: Bone Mask (Readable contrast)
    ctx.save();
    ctx.translate(size * 0.7, -size * 0.2);
    ctx.fillStyle = '#e0e0d0'; 
    ctx.beginPath();
    ctx.moveTo(0, -4); 
    ctx.lineTo(10, 2); // Snout
    ctx.lineTo(0, 5); // Jaw
    ctx.lineTo(-3, 0); 
    ctx.fill();

    // Eye: Single Red Dot (No glow blur)
    ctx.fillStyle = '#ff0000';
    ctx.beginPath(); 
    ctx.arc(2, -1, 1.5, 0, Math.PI*2); 
    ctx.fill();
    ctx.restore();

    // Legs: Abstract shapes implying motion
    ctx.fillStyle = bodyColor;
    // Front
    ctx.beginPath();
    ctx.moveTo(size*0.5, size*0.2);
    ctx.lineTo(size*0.5, size*0.8);
    ctx.lineTo(size*0.7, size*0.8);
    ctx.fill();
    // Back
    ctx.beginPath();
    ctx.moveTo(-size*0.6, size*0.1);
    ctx.lineTo(-size*0.7, size*0.7);
    ctx.lineTo(-size*0.5, size*0.7);
    ctx.fill();

    ctx.restore();
  }
};
