
import { ProceduralArt } from '../../types';
import { DrawUtils } from '../primitives/DrawUtils';

export const CrimsonGhoulArt: ProceduralArt = {
  draw(ctx, x, y, size, time) {
    ctx.save();
    ctx.translate(x, y);

    // Heavy Lumber Animation
    // Rotates body side to side, dips down on the heavy side step
    const lumberSpeed = time * 4;
    const lumberAngle = Math.sin(lumberSpeed) * 0.15;
    const bounce = Math.abs(Math.sin(lumberSpeed)) * 5;

    ctx.rotate(lumberAngle);
    ctx.translate(0, bounce);

    const primaryColor = '#800000'; // Deep Blood Red
    const secondaryColor = '#4a0505'; // Shadow
    const boneColor = '#dcd0c0'; // Old Bone

    // --- LEGS ---
    // Short, sturdy legs
    ctx.fillStyle = secondaryColor;
    ctx.beginPath();
    // Left Leg
    ctx.moveTo(-size * 0.4, size * 0.5);
    ctx.lineTo(-size * 0.5, size * 1.2);
    ctx.lineTo(-size * 0.2, size * 1.2);
    ctx.lineTo(0, size * 0.8);
    // Right Leg
    ctx.lineTo(size * 0.2, size * 1.2);
    ctx.lineTo(size * 0.5, size * 1.2);
    ctx.lineTo(size * 0.4, size * 0.5);
    ctx.fill();

    // --- SMALL LEFT ARM (Background) ---
    ctx.save();
    ctx.translate(size * 0.6, -size * 0.4);
    ctx.rotate(-Math.sin(lumberSpeed) * 0.5); // Counter swing
    ctx.strokeStyle = secondaryColor;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(5, size * 0.6); // Elbow
    ctx.lineTo(15, size * 0.4); // Hand
    ctx.stroke();
    // Claw
    ctx.fillStyle = boneColor;
    ctx.beginPath();
    ctx.moveTo(15, size*0.4);
    ctx.lineTo(20, size*0.5);
    ctx.lineTo(12, size*0.5);
    ctx.fill();
    ctx.restore();

    // --- TORSO ---
    // Massive hunched back shape
    ctx.fillStyle = primaryColor;
    ctx.beginPath();
    ctx.moveTo(-size * 0.8, -size * 0.5); // Big Shoulder
    ctx.bezierCurveTo(-size * 0.5, -size * 1.2, size * 0.5, -size * 1.0, size * 0.6, -size * 0.4); // Neck/Hump
    ctx.lineTo(size * 0.5, size * 0.6); // Hip
    ctx.quadraticCurveTo(0, size * 0.8, -size * 0.6, size * 0.5); // Belly
    ctx.closePath();
    ctx.fill();

    // Muscle Definition (Subtle shadow)
    ctx.fillStyle = secondaryColor;
    ctx.beginPath();
    ctx.moveTo(-size*0.2, -size*0.2);
    ctx.quadraticCurveTo(0, size*0.2, -size*0.3, size*0.4);
    ctx.lineTo(-size*0.5, 0);
    ctx.fill();

    // --- HEAD ---
    // Low, sunk into shoulders
    ctx.save();
    ctx.translate(size * 0.1, -size * 0.7);
    ctx.rotate(Math.sin(time * 2) * 0.1);
    
    ctx.fillStyle = primaryColor;
    ctx.beginPath();
    ctx.arc(0, 0, size * 0.35, 0, Math.PI*2);
    ctx.fill();
    
    // Jaw (Bone)
    ctx.fillStyle = boneColor;
    ctx.beginPath();
    ctx.moveTo(-size*0.2, 0);
    ctx.lineTo(-size*0.1, size*0.25);
    ctx.lineTo(size*0.2, size*0.25);
    ctx.lineTo(size*0.25, 0);
    ctx.fill();

    // Eyes (Glowing small dots)
    ctx.fillStyle = '#ffaa00';
    ctx.beginPath();
    ctx.arc(-size*0.1, -size*0.05, 2, 0, Math.PI*2);
    ctx.arc(size*0.1, -size*0.05, 2, 0, Math.PI*2);
    ctx.fill();
    ctx.restore();

    // --- HUGE RIGHT ARM (Foreground) ---
    ctx.save();
    ctx.translate(-size * 0.7, -size * 0.4); // Shoulder socket
    
    // Heavy swing
    const armSwing = Math.sin(lumberSpeed) * 0.2;
    ctx.rotate(armSwing);

    // Shoulder Plate (Bone)
    ctx.fillStyle = boneColor;
    ctx.beginPath();
    ctx.arc(0, 0, size * 0.5, Math.PI, 0);
    ctx.fill();
    
    // Spikes on shoulder
    ctx.fillStyle = '#eee';
    ctx.beginPath(); 
    ctx.moveTo(0, -size*0.5); ctx.lineTo(-5, -size*0.8); ctx.lineTo(5, -size*0.5); 
    ctx.fill();

    // Upper Arm
    ctx.fillStyle = primaryColor;
    ctx.beginPath();
    ctx.moveTo(-size*0.4, 0);
    ctx.lineTo(size*0.4, 0);
    ctx.lineTo(size*0.3, size); // Elbow width
    ctx.lineTo(-size*0.3, size);
    ctx.fill();

    // Forearm (Massive)
    ctx.translate(0, size);
    ctx.rotate(-0.2); // Slightly bent in
    ctx.fillStyle = primaryColor;
    ctx.beginPath();
    ctx.arc(0, size * 0.6, size * 0.6, 0, Math.PI*2); // Fist/Club
    ctx.fill();
    
    // Veins/Detail on fist
    ctx.strokeStyle = secondaryColor;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(0, size * 0.6, size * 0.4, 0, Math.PI);
    ctx.stroke();

    ctx.restore();

    ctx.restore();
  }
};
