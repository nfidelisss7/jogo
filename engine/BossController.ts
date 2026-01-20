
import { GameState, Entity, BossType } from '../types';
import { BossRegistry } from '../bosses/index';
import { GAME_OPTIONS } from '../gameOptions';

export class BossController {
  
  static checkSpawn(state: GameState, player: Entity): Entity[] {
    const spawned: Entity[] = [];
    const seconds = state.timer / 1000;
    
    // --- MAIN PROGRESSION BOSSES ---
    // Strict order: Draculor -> Sovereign -> Revenant -> Harvester -> Fallen Angel -> PAPAMAMA DRAGON
    
    // 3 Minutes: Count Draculor
    if (seconds >= 180 && !state.defeatedBosses.includes(BossType.COUNT_DRACULOR) && !this.isBossActive(state, BossType.COUNT_DRACULOR)) {
        spawned.push(this.spawnBoss(BossType.COUNT_DRACULOR, player, 1.0));
    }
    
    // 6 Minutes: Abyss Sovereign
    else if (seconds >= 360 && !state.defeatedBosses.includes(BossType.ABYSS_SOVEREIGN) && !this.isBossActive(state, BossType.ABYSS_SOVEREIGN)) {
        spawned.push(this.spawnBoss(BossType.ABYSS_SOVEREIGN, player, 1.0));
    }
    
    // 9 Minutes: Eternal Revenant
    else if (seconds >= 540 && !state.defeatedBosses.includes(BossType.ETERNAL_REVENANT) && !this.isBossActive(state, BossType.ETERNAL_REVENANT)) {
        spawned.push(this.spawnBoss(BossType.ETERNAL_REVENANT, player, 1.0));
    }
    
    // 12 Minutes: Flesh Harvester
    else if (seconds >= 720 && !state.defeatedBosses.includes(BossType.FLESH_HARVESTER) && !this.isBossActive(state, BossType.FLESH_HARVESTER)) {
        spawned.push(this.spawnBoss(BossType.FLESH_HARVESTER, player, 1.0));
    }

    // 15 Minutes: Fallen Angel (The Corrupted Healer)
    else if (seconds >= 900 && !state.defeatedBosses.includes(BossType.FALLEN_ANGEL) && !this.isBossActive(state, BossType.FALLEN_ANGEL)) {
        spawned.push(this.spawnBoss(BossType.FALLEN_ANGEL, player, 1.2)); // Slightly tougher
    }

    // 👑 18 Minutes: PAPAMAMA DRAGON (The Ultimate Threat)
    else if (seconds >= 1080 && !state.defeatedBosses.includes(BossType.PAPAMAMA_DRAGON) && !this.isBossActive(state, BossType.PAPAMAMA_DRAGON)) {
        spawned.push(this.spawnBoss(BossType.PAPAMAMA_DRAGON, player, 1.5));
    }

    // --- ENDLESS CYCLE (POST-GAME WAVES) ---
    // Activates if all main bosses are dead (including Dragon). Spawns loops every 2 minutes.
    else if (state.defeatedBosses.length >= 6 && !state.activeBoss) {
        // Simple cycle logic based on time blocks of 120 seconds
        const loopTime = seconds - 1100; // Offset from last boss
        if (loopTime > 0) {
            const wave = Math.floor(loopTime / 120);
            const waveTime = loopTime % 120;
            
            // Spawn trigger at start of wave cycle
            if (waveTime < 5) {
                // Determine wave composition based on loop count
                const hpMult = 1.5 + (wave * 0.5); // +50% HP per loop
                const waveIndex = wave % 5; // Updated for 5 waves
                
                if (waveIndex === 0) {
                    spawned.push(this.spawnBoss(BossType.COUNT_DRACULOR, player, hpMult, 100));
                    spawned.push(this.spawnBoss(BossType.COUNT_DRACULOR, player, hpMult, -100));
                } 
                else if (waveIndex === 1) {
                    spawned.push(this.spawnBoss(BossType.ABYSS_SOVEREIGN, player, hpMult, 150));
                    spawned.push(this.spawnBoss(BossType.ETERNAL_REVENANT, player, hpMult, -150));
                } 
                else if (waveIndex === 2) {
                    spawned.push(this.spawnBoss(BossType.FALLEN_ANGEL, player, hpMult, 0));
                    spawned.push(this.spawnBoss(BossType.FLESH_HARVESTER, player, hpMult, 200));
                }
                else if (waveIndex === 3) {
                    // Double Dragon
                    spawned.push(this.spawnBoss(BossType.PAPAMAMA_DRAGON, player, hpMult, 0));
                }
                else if (waveIndex === 4) {
                    // The Triad
                    spawned.push(this.spawnBoss(BossType.COUNT_DRACULOR, player, hpMult, 0));
                    spawned.push(this.spawnBoss(BossType.FALLEN_ANGEL, player, hpMult, 200));
                    spawned.push(this.spawnBoss(BossType.ETERNAL_REVENANT, player, hpMult, -200));
                }
            }
        }
    }

    return spawned;
  }

  private static isBossActive(state: GameState, type: BossType): boolean {
      return state.activeBoss === type;
  }

  static spawnBoss(type: BossType, player: Entity, hpMult: number = 1.0, offsetX: number = 0): Entity {
    const module = BossRegistry[type];
    
    // Safe spawn distance with angular variation
    const angle = Math.random() * Math.PI * 2;
    const dist = 600;
    
    const x = player.x + Math.cos(angle) * dist + offsetX;
    const y = player.y + Math.sin(angle) * dist + offsetX; // Simple offset for stacking

    const boss = module.init(x, y);
    
    // Apply difficulty scaling
    if (boss.hp) boss.hp *= hpMult;
    if (boss.maxHp) boss.maxHp *= hpMult;
    
    console.log(`SPAWNING BOSS: ${type} (HP x${hpMult.toFixed(1)})`);
    return boss;
  }
}
