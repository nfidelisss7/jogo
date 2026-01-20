
import { ProceduralArt } from '../../types';

export const ShadowWraithArt: ProceduralArt = {
  draw(ctx, x, y, size, time) {
    ctx.save();
    ctx.translate(x, y);
    
    // Float: Slow and vertical
    ctx.translate(0, Math.sin(time * 2) * 4);

    // Palette: Void Purple + Black
    // Simple Gradient for volume
    const grad = ctx.createLinearGradient(0, -size, 0, size);
    grad.addColorStop(0, '#2a0535'); 
    grad.addColorStop(1, '#000000'); 

    ctx.fillStyle = grad;
    
    // Silhouette: Clean Cowl
    ctx.beginPath();
    ctx.moveTo(0, -size * 1.2); // Peak
    // Shoulders
    ctx.bezierCurveTo(size * 0.9, -size * 0.5, size * 0.5, size * 0.2, size * 0.2, size * 0.8);
    // Bottom (Simple curve, no tattered noise)
    ctx.quadraticCurveTo(0, size * 1.0, -size * 0.2, size * 0.8);
    // Left side
    ctx.bezierCurveTo(-size * 0.5, size * 0.2, -size * 0.9, -size * 0.5, 0, -size * 1.2);
    ctx.fill();

    // Face: Infinite Black
    ctx.fillStyle = '#000';
    ctx.beginPath();
    ctx.ellipse(0, -size * 0.5, size * 0.25, size * 0.35, 0, 0, Math.PI*2);
    ctx.fill();

    // Eyes: Sharp Vertical Slits (No Blur)
    ctx.fillStyle = '#b080ff';
    ctx.beginPath();
    ctx.ellipse(-3, -size*0.5, 1, 3, 0, 0, Math.PI*2);
    ctx.ellipse(3, -size*0.5, 1, 3, 0, 0, Math.PI*2);
    ctx.fill();

    // Hand: Simple shape
    ctx.strokeStyle = '#444';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(size * 0.3, -size * 0.1);
    ctx.lineTo(size * 0.6, 0); // Pointing
    ctx.stroke();

    ctx.restore();
  }
};
