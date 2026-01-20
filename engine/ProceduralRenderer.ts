
import { Entity, WeaponType, EnemyArchetype, BossType, FloatingText, MinionType } from '../types';
import { drawPolygon } from '../art/primitives/Shapes';
import { PowerRegistry } from '../powers/index'; 
import { EnemyArtRegistry } from '../art/enemies/EnemyArtRegistry';
import { BossRegistry } from '../bosses/index';
import { GAME_OPTIONS } from '../gameOptions';
import { PlayerArt } from '../art/player';
import { AccessoryRegistry } from '../accessories/index';
import { DrawUtils } from '../art/primitives/DrawUtils';
import { TextureManager } from './TextureManager';
import { MinionArtRegistry } from '../art/minions/MinionArtRegistry'; 

export class ProceduralRenderer {
  
  static drawBackground(ctx: CanvasRenderingContext2D, width: number, height: number, camX: number, camY: number) {
    // 1. Dark Void Base
    ctx.fillStyle = GAME_OPTIONS.COLORS.BACKGROUND;
    ctx.fillRect(0, 0, width, height);

    const gridSize = GAME_OPTIONS.GRID_SIZE;
    
    // 2. Procedural Dungeon Floor (Tiled)
    ctx.strokeStyle = '#151520';
    ctx.lineWidth = 2;
    
    const startX = Math.floor(camX / gridSize) * gridSize;
    const startY = Math.floor(camY / gridSize) * gridSize;
    const endX = camX + width + gridSize;
    const endY = camY + height + gridSize;

    for (let x = startX; x < endX; x += gridSize) {
        for (let y = startY; y < endY; y += gridSize) {
            const screenX = x - camX;
            const screenY = y - camY;
            
            // Draw Tile Border
            ctx.strokeRect(screenX, screenY, gridSize, gridSize);

            // Deterministic Noise for Detail
            // We use the world coordinates to seed the random so tiles stay consistent
            const seed = Math.sin(x * 12.9898 + y * 78.233) * 43758.5453;
            const rand = seed - Math.floor(seed);

            // Draw Cracks or Runes randomly
            if (rand > 0.8) {
                ctx.fillStyle = '#1a1a25';
                ctx.fillRect(screenX + 10, screenY + 10, 20, 20); // Placeholder for rubble
            } else if (rand < 0.1) {
                // Faint Rune
                ctx.fillStyle = '#181822';
                ctx.font = '20px serif';
                ctx.fillText('†', screenX + gridSize/2, screenY + gridSize/2);
            }
        }
    }
  }

  // New Lighting System (Fake deferred rendering)
  static drawLighting(ctx: CanvasRenderingContext2D, width: number, height: number, player: Entity, projectiles: Entity[], camX: number, camY: number) {
      // Create darkness layer
      ctx.globalCompositeOperation = 'multiply';
      
      // Vignette Gradient (Focus on center)
      const grad = ctx.createRadialGradient(width/2, height/2, height * 0.4, width/2, height/2, height);
      grad.addColorStop(0, 'rgba(0,0,0,0)');
      grad.addColorStop(1, 'rgba(0,0,0,0.85)'); // Strong darkness at edges
      
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);

      // Light Sources (Additive)
      ctx.globalCompositeOperation = 'screen'; // Additive blending for lights
      
      // Player Light
      const pScreenX = player.x - camX;
      const pScreenY = player.y - camY;
      
      const lightGrad = ctx.createRadialGradient(pScreenX, pScreenY, 20, pScreenX, pScreenY, 300);
      lightGrad.addColorStop(0, 'rgba(100, 200, 255, 0.3)');
      lightGrad.addColorStop(1, 'rgba(0,0,0,0)');
      
      ctx.fillStyle = lightGrad;
      ctx.fillRect(0, 0, width, height);

      // Projectile Lights (Batch draw simple glow)
      for (const p of projectiles) {
          if (!p.active) continue;
          const px = p.x - camX;
          const py = p.y - camY;
          if (px < 0 || px > width || py < 0 || py > height) continue;

          // Simple small glow
          ctx.fillStyle = 'rgba(100, 255, 255, 0.1)';
          ctx.beginPath();
          ctx.arc(px, py, p.size * 3, 0, Math.PI * 2);
          ctx.fill();
      }

      // Reset
      ctx.globalCompositeOperation = 'source-over';
  }

  static drawPlayer(ctx: CanvasRenderingContext2D, x: number, y: number, size: number, camX: number, camY: number) {
    const time = Date.now() * 0.001;
    const px = x - camX;
    const py = y - camY;
    PlayerArt.draw(ctx, px, py, size, time);
  }

  static drawEnemy(ctx: CanvasRenderingContext2D, e: Entity, camX: number, camY: number) {
    if (!e.active || e.state === 'invisible') return;
    
    const px = e.x - camX;
    const py = e.y - camY;
    
    const margin = e.size * 3;
    if (px < -margin || px > ctx.canvas.width + margin || py < -margin || py > ctx.canvas.height + margin) return;

    const time = Date.now() * 0.001;
    
    if ((e.type === 'boss' && e.bossType) || e.isKing) {
        DrawUtils.drawShadow(ctx, e.size * 0.8);
        ctx.save();
        ctx.translate(px, py);
        
        // Boss/King Scale Pulse
        if (e.isKing) ctx.scale(1.2, 1.2);

        if (e.type === 'boss' && e.bossType) {
            const bossMod = BossRegistry[e.bossType];
            if (bossMod && bossMod.art) {
                bossMod.art.draw(ctx, 0, 0, e.size, time, 0, e.state);
            }
        } else if (e.artKey) {
            EnemyArtRegistry[e.artKey as EnemyArchetype].draw(ctx, 0, 0, e.size, time, 0, { isKing: e.isKing });
        }
        ctx.restore();
        return;
    }

    if (e.artKey) {
        const cachedCanvas = TextureManager.getEnemyTexture(e.artKey as EnemyArchetype, e.size);
        const halfSize = cachedCanvas.width / 2;

        DrawUtils.drawShadow(ctx, e.size * 0.8);

        ctx.save();
        ctx.translate(px, py);

        // Movement bob
        const breathe = 1 + Math.sin(time * 5 + e.id.charCodeAt(0)) * 0.05;
        const wobble = Math.cos(time * 3 + e.id.charCodeAt(0)) * 0.1;
        
        ctx.scale(breathe, breathe);
        ctx.rotate(wobble);

        // Draw Cached Art
        ctx.drawImage(cachedCanvas, -halfSize, -halfSize);

        // Hit Flash (Additive)
        if (e.lastHitTime && Date.now() - e.lastHitTime < 100) {
            ctx.globalCompositeOperation = 'screen';
            ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
            ctx.beginPath();
            ctx.arc(0, 0, e.size, 0, Math.PI*2);
            ctx.fill();
            ctx.globalCompositeOperation = 'source-over';
        }

        ctx.restore();
    } 
    else {
      ctx.fillStyle = '#ff00ff';
      ctx.beginPath();
      ctx.arc(px, py, e.size, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  static drawProjectile(ctx: CanvasRenderingContext2D, p: any, camX: number, camY: number) {
    const px = p.x - camX;
    const py = p.y - camY;
    
    if (px < -150 || px > ctx.canvas.width + 150 || py < -150 || py > ctx.canvas.height + 150) return;

    const time = Date.now() * 0.001;
    const mod = PowerRegistry[p.type as WeaponType];
    
    let angle = 0;
    if (p.vx !== 0 || p.vy !== 0) {
      angle = Math.atan2(p.vy, p.vx);
    }

    if (mod && mod.art) {
      mod.art.drawProjectile(ctx, px, py, p.size, time, p.level || 1, angle, p.life, p.maxLife, p, camX, camY);
    } else {
      // Fallback glow
      ctx.shadowColor = '#fff';
      ctx.shadowBlur = 10;
      ctx.fillStyle = '#fff';
      ctx.beginPath(); 
      ctx.arc(px, py, p.size, 0, Math.PI * 2); 
      ctx.fill();
      ctx.shadowBlur = 0;
    }
  }

  static drawGem(ctx: CanvasRenderingContext2D, g: any, camX: number, camY: number) {
    const px = g.x - camX;
    const py = g.y - camY;
    if (px < -20 || px > ctx.canvas.width + 20 || py < -20 || py > ctx.canvas.height + 20) return;

    const time = Date.now() * 0.001;
    const bob = Math.sin(time * 6 + g.x) * 3;
    const isSuper = !!g.isSuper;

    const drawY = py + bob;
    
    // Glow behind gem
    DrawUtils.drawGlow(ctx, px, drawY, g.size * 2, isSuper ? '#ffaa00' : '#00bfff', 0.6);

    const color = isSuper ? GAME_OPTIONS.COLORS.GEM_SUPER : GAME_OPTIONS.COLORS.GEM;
    ctx.fillStyle = color;
    
    // Rotating Gem Shape
    ctx.save();
    ctx.translate(px, drawY);
    ctx.rotate(time);
    if (isSuper) {
       drawPolygon(ctx, [
        {x: 0, y: -g.size}, {x: g.size, y: -g.size/2}, {x: g.size, y: g.size/2},
        {x: 0, y: g.size}, {x: -g.size, y: g.size/2}, {x: -g.size, y: -g.size/2}
      ]);
    } else {
       // Diamond
       ctx.beginPath();
       ctx.moveTo(0, -g.size); 
       ctx.lineTo(g.size, 0); 
       ctx.lineTo(0, g.size); 
       ctx.lineTo(-g.size, 0); 
       ctx.closePath();
       ctx.fill();
    }
    // Shine Specular
    ctx.fillStyle = 'rgba(255,255,255,0.8)';
    ctx.beginPath();
    ctx.arc(-2, -2, 1, 0, Math.PI*2);
    ctx.fill();
    
    ctx.restore();
  }

  static drawChest(ctx: CanvasRenderingContext2D, e: Entity, camX: number, camY: number) {
      const px = e.x - camX;
      const py = e.y - camY;
      if (px < -50 || px > ctx.canvas.width + 50 || py < -50 || py > ctx.canvas.height + 50) return;

      const time = Date.now() * 0.001;
      const bounce = Math.sin(time * 3) * 3;

      ctx.save();
      ctx.translate(px, py + bounce);
      
      DrawUtils.drawShadow(ctx, 12);
      
      // Holy Light Beam
      const grad = ctx.createLinearGradient(0, -50, 0, 0);
      grad.addColorStop(0, 'rgba(255, 215, 0, 0)');
      grad.addColorStop(1, 'rgba(255, 215, 0, 0.2)');
      ctx.fillStyle = grad;
      ctx.fillRect(-15, -60, 30, 60);

      ctx.fillStyle = GAME_OPTIONS.COLORS.CHEST;
      ctx.strokeStyle = '#DAA520';
      ctx.lineWidth = 2;
      
      ctx.beginPath();
      ctx.rect(-12, -10, 24, 20);
      ctx.fill();
      ctx.stroke();
      
      ctx.fillStyle = '#FFD700';
      ctx.fillRect(-3, -4, 6, 8);
      
      ctx.restore();
  }

  static drawAccessoryDrop(ctx: CanvasRenderingContext2D, e: Entity, camX: number, camY: number) {
      const px = e.x - camX;
      const py = e.y - camY;
      if (px < -50 || px > ctx.canvas.width + 50 || py < -50 || py > ctx.canvas.height + 50) return;

      const time = Date.now() * 0.001;
      if (e.accessoryType && AccessoryRegistry[e.accessoryType]) {
          const mod = AccessoryRegistry[e.accessoryType];
          mod.art.drawWorld(ctx, px, py, 24, time);
      }
  }

  static drawMinion(ctx: CanvasRenderingContext2D, m: Entity, camX: number, camY: number) {
      const px = m.x - camX;
      const py = m.y - camY;
      if (px < -100 || px > ctx.canvas.width + 100 || py < -100 || py > ctx.canvas.height + 100) return;
      
      const time = Date.now() * 0.001;
      
      DrawUtils.drawShadow(ctx, m.size * 0.8);

      if (m.minionType && MinionArtRegistry[m.minionType]) {
          const art = MinionArtRegistry[m.minionType];
          art.draw(ctx, px, py, m.size, time, 0, m);
      } else {
          ctx.fillStyle = '#00ffff';
          ctx.beginPath();
          ctx.arc(px, py, m.size, 0, Math.PI*2);
          ctx.fill();
      }
  }

  static drawFloatingText(ctx: CanvasRenderingContext2D, t: FloatingText, camX: number, camY: number) {
    if (!t.active) return;
    const px = t.x - camX;
    const py = t.y - camY;
    if (px < -50 || px > ctx.canvas.width + 50 || py < -50 || py > ctx.canvas.height + 50) return;

    const lifeRatio = t.life / t.maxLife;
    ctx.globalAlpha = lifeRatio;
    
    // Shadow for readability
    ctx.font = 'bold 16px "Press Start 2P", sans-serif'; // Bigger font
    ctx.textAlign = 'center';
    
    ctx.fillStyle = '#000';
    ctx.fillText(t.text, px + 2, py + 2);
    
    ctx.fillStyle = t.color;
    ctx.fillText(t.text, px, py);
    ctx.globalAlpha = 1.0; 
  }
}
