
import { ProceduralArt } from '../../types';
import { drawPolygon } from '../../art/primitives/Shapes';

export const FleshHarvesterArt: ProceduralArt = {
  draw(ctx, x, y, size, time, angle, state) {
    ctx.save();
    ctx.translate(x, y);

    // Pulse Animation (Heartbeat)
    const pulse = Math.sin(time * 3) * 0.05 + 1;
    ctx.scale(pulse, pulse);

    // Main Body: Grotesque Flesh Mound
    ctx.fillStyle = '#800000'; // Dark Meat
    ctx.strokeStyle = '#220000';
    ctx.lineWidth = 3;

    // Asymmetrical blob
    drawPolygon(ctx, [
        {x: -size*0.8, y: -size},
        {x: size*0.5, y: -size*1.2},
        {x: size*0.9, y: size*0.5},
        {x: 0, y: size*1.1}, // Sagging belly
        {x: -size*0.9, y: size*0.4}
    ]);

    // Details: Muscle Strands (Bezier)
    ctx.strokeStyle = '#ff6666'; // Raw pink
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(-size*0.5, -size*0.5);
    ctx.bezierCurveTo(0, 0, size*0.2, 0, size*0.5, -size*0.4);
    ctx.stroke();
    
    ctx.beginPath();
    ctx.moveTo(-size*0.6, size*0.2);
    ctx.bezierCurveTo(0, size*0.8, 0, size*0.8, size*0.6, 0);
    ctx.stroke();

    // Bone Spikes protruding
    ctx.fillStyle = '#e3dac9'; // Bone
    drawPolygon(ctx, [{x: size*0.7, y: -size*0.8}, {x: size*1.2, y: -size*1.2}, {x: size*0.5, y: -size*0.5}]);
    drawPolygon(ctx, [{x: -size*0.7, y: size*0.2}, {x: -size*1.3, y: 0}, {x: -size*0.5, y: -size*0.2}]);

    // THE SCYTHE ARM
    ctx.save();
    ctx.translate(size*0.8, 0);
    // Rotate scythe based on attack state or idle swing
    const swing = Math.sin(time * 1.5) * 0.3;
    ctx.rotate(swing);

    // Arm
    ctx.fillStyle = '#550000';
    drawPolygon(ctx, [{x: 0, y: 0}, {x: size, y: -size}, {x: size*0.2, y: size*0.2}]);

    // Handle
    ctx.save();
    ctx.translate(size, -size);
    ctx.rotate(-0.5);
    ctx.fillStyle = '#3e2723'; // Wood/Bone handle
    ctx.fillRect(-5, -size*2, 10, size*3);

    // Blade
    ctx.translate(0, -size*2);
    ctx.fillStyle = '#aaa'; // Steel
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.quadraticCurveTo(size*1.5, -size*0.5, size*2, size); // Curved blade
    ctx.lineTo(size*1.5, size);
    ctx.quadraticCurveTo(size*1.2, 0, 0, 10);
    ctx.fill();
    ctx.restore(); // Handle

    ctx.restore(); // Arm

    ctx.restore(); // Main
  }
};
