
import { GameState, WeaponType, Entity, WeaponData, EnemyArchetype, FloatingText, BossType, MinionType } from '../types';
import { SpatialHash } from '../SpatialHash';
import { ExperienceManager } from './ExperienceManager';
import { WeaponSystem, TargetingStrategies } from './WeaponSystem';
import { EnemyManager } from './EnemyManager';
import { ObjectPool } from './ObjectPool';
import { ProceduralRenderer } from './ProceduralRenderer';
import { InputManager } from './InputManager';
import { GAME_OPTIONS } from '../gameOptions';
import { PowerRegistry } from '../powers/index';
import { BossController } from './BossController'; 
import { BossRegistry } from '../bosses/index'; 
import { AccessoryManager } from './AccessoryManager';
import { AccessoryRegistry } from '../accessories/index';
import { AccessoryType, AccessoryStats } from '../types/accessoryTypes';
import { SummonManager } from './summons/SummonManager';
import { InfestationSystem } from './infestation/InfestationSystem';
import { AIBrain } from '../ai/core/AIBrain';
import { TextureManager } from './TextureManager'; // Clear cache on restart

export class GameEngine {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private input: InputManager;
  private spatialHash: SpatialHash;
  
  private lastTime: number = 0;
  private frameCount: number = 0;
  private state: GameState;
  
  private player: Entity;
  private enemyPool: ObjectPool<Entity>;
  private gemPool: ObjectPool<Entity>;
  private projectilePool: ObjectPool<any>;
  private textPool: ObjectPool<FloatingText>;
  private chestPool: ObjectPool<Entity>;
  private minionPool: ObjectPool<Entity>; 
  
  private summonManager: SummonManager;
  private infestationSystem: InfestationSystem;

  private activeBosses: Entity[] = []; 
  
  private spawnTimer: number = 0;
  private regenAccumulator: number = 0;
  private chestSpawnTimer: number = 0;
  private animationId: number = 0;
  
  private collisionBuffer: Entity[] = [];
  private candidateBuffer: Entity[] = [];
  
  private wasSpaceDown: boolean = false;
  private isLevelingUp: boolean = false;
  
  // 🎥 VISUALS
  private screenShake: number = 0;
  
  private onStateChange: (state: GameState) => void;
  private onLevelUp: (options: WeaponType[]) => void;
  private onAccessorySelect: (options: AccessoryType[]) => void;

  constructor(
    canvas: HTMLCanvasElement, 
    onStateChange: (s: GameState) => void,
    onLevelUp: (options: WeaponType[]) => void,
    onAccessorySelect: (options: AccessoryType[]) => void
  ) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d', { alpha: false })!;
    this.input = new InputManager();
    this.spatialHash = new SpatialHash(GAME_OPTIONS.GRID_SIZE);
    this.onStateChange = onStateChange;
    this.onLevelUp = onLevelUp;
    this.onAccessorySelect = onAccessorySelect;

    this.player = {
      id: 'player',
      x: window.innerWidth / 2,
      y: window.innerHeight / 2,
      size: GAME_OPTIONS.PLAYER_RADIUS,
      active: true,
      type: 'player',
      hp: GAME_OPTIONS.PLAYER_BASE_HP,
      maxHp: GAME_OPTIONS.PLAYER_BASE_HP,
      velocity: { x: 0, y: 0 },
      invulnTimer: 0,
      slowTimer: 0,
      killCount: 0
    };

    this.state = {
      level: 1,
      xp: 0,
      requiredXp: ExperienceManager.getRequiredXp(1),
      hp: GAME_OPTIONS.PLAYER_BASE_HP,
      maxHp: GAME_OPTIONS.PLAYER_BASE_HP,
      isPaused: true, 
      isGameOver: false,
      activePowers: [],
      killCount: 0,
      timer: 0,
      activeBoss: undefined,
      defeatedBosses: [],
      equippedAccessories: [],
      inventory: [],
      powerRerolls: GAME_OPTIONS.STARTING_REROLLS,
      accessoryRerolls: GAME_OPTIONS.STARTING_REROLLS,
      infestationMessage: null
    };

    // Pools
    this.enemyPool = new ObjectPool(() => ({ id: '', x: 0, y: 0, size: 14, active: false, type: 'enemy', aiValues: { seed: Math.random() }, customData: {} }), 1200);
    this.gemPool = new ObjectPool(() => ({ id: '', x: 0, y: 0, size: 4, active: false, type: 'gem', value: 0, isSuper: false }), 400);
    this.projectilePool = new ObjectPool(() => ({ 
      x: 0, y: 0, vx: 0, vy: 0, size: 6, active: false, damage: 0, life: 0, maxLife: 0,
      type: WeaponType.MISSILE, range: 0, offset: 0, pierceCount: 0, onHit: undefined, level: 1,
      attachToPlayer: false, isEnemyProjectile: false, isCrit: false, acceleration: 0, ricochets: 0,
      behavior: undefined, customData: undefined
    }), 400);
    this.textPool = new ObjectPool(() => ({
      x: 0, y: 0, text: '', color: '#fff', life: 0, maxLife: 0, velocity: { x: 0, y: 0 }, active: false
    }), 50);
    this.chestPool = new ObjectPool(() => ({ 
      id: '', x: 0, y: 0, size: 16, active: false, type: 'chest'
    }), 20);
    this.minionPool = new ObjectPool(() => ({
        id: '', x: 0, y: 0, size: 10, active: false, type: 'minion'
    }), 20);

    this.summonManager = new SummonManager(this.minionPool);
    
    this.infestationSystem = new InfestationSystem((msg) => {
        this.state.infestationMessage = msg;
        this.addScreenShake(15);
        this.onStateChange({ ...this.state });
    });

    this.start();
  }

  public initSelection() {
    this.isLevelingUp = true;
    this.onLevelUp(WeaponSystem.getUpgradeChoices([]));
  }

  public rerollUpgrades(): WeaponType[] | null {
    if (this.state.powerRerolls <= 0) return null;
    this.state.powerRerolls--;
    const newOptions = WeaponSystem.getUpgradeChoices(this.state.activePowers);
    this.onStateChange({ ...this.state });
    return newOptions;
  }

  public rerollAccessories(): AccessoryType[] | null {
    if (this.state.accessoryRerolls <= 0) return null;
    this.state.accessoryRerolls--;
    const newOptions = AccessoryManager.getRandomSelection(this.state, 3);
    this.onStateChange({ ...this.state });
    return newOptions;
  }

  public resume(selectedUpgrade?: WeaponType) {
    if (selectedUpgrade) {
      if (selectedUpgrade === WeaponType.SURVIVOR_BOON) {
        this.state.hp = Math.min(this.state.maxHp, this.state.hp + 50);
        this.spawnFloatingText(this.player.x, this.player.y - 20, "+50 HP", '#00ff00');
      } else {
        this.state.activePowers = WeaponSystem.upgrade(this.state.activePowers, selectedUpgrade);
      }
    }
    this.isLevelingUp = false;
    this.state.isPaused = false;
    this.lastTime = performance.now();
  }

  public selectAccessory(type: AccessoryType) {
    const instance = {
      id: Math.random().toString(36).substr(2, 9),
      type: type,
      acquiredAt: this.state.timer,
      customData: {} 
    };
    AccessoryManager.equip(this.state, instance);
    this.state.isPaused = false;
    this.lastTime = performance.now();
  }

  public restart() {
    this.state = {
      level: 1,
      xp: 0,
      requiredXp: ExperienceManager.getRequiredXp(1),
      hp: GAME_OPTIONS.PLAYER_BASE_HP,
      maxHp: GAME_OPTIONS.PLAYER_BASE_HP,
      isPaused: false,
      isGameOver: false,
      activePowers: [],
      killCount: 0,
      timer: 0,
      activeBoss: undefined,
      defeatedBosses: [],
      equippedAccessories: [],
      inventory: [],
      powerRerolls: GAME_OPTIONS.STARTING_REROLLS,
      accessoryRerolls: GAME_OPTIONS.STARTING_REROLLS,
      infestationMessage: null
    };
    
    this.player.x = window.innerWidth / 2;
    this.player.y = window.innerHeight / 2;
    this.player.hp = this.state.maxHp;
    this.player.active = true;
    this.player.invulnTimer = 0;
    this.player.killCount = 0;
    
    this.enemyPool.releaseAll();
    this.gemPool.releaseAll();
    this.projectilePool.releaseAll();
    this.textPool.releaseAll();
    this.chestPool.releaseAll();
    this.minionPool.releaseAll();
    
    this.activeBosses = [];
    this.spawnTimer = 0;
    this.chestSpawnTimer = 0;
    this.screenShake = 0;
    
    this.spatialHash.clear();
    this.summonManager.clear();
    this.infestationSystem.reset();
    TextureManager.clear();
    
    this.initSelection();
  }

  public destroy() {
    cancelAnimationFrame(this.animationId);
    this.input.destroy();
  }

  private start() {
    const loop = (time: number) => {
      this.loop(time);
      this.animationId = requestAnimationFrame(loop);
    };
    this.animationId = requestAnimationFrame(loop);
  }

  public addScreenShake(amount: number) {
      this.screenShake = Math.min(this.screenShake + amount, 30);
  }

  private loop(time: number) {
    const delta = Math.min(time - (this.lastTime || time), 64);
    this.lastTime = time;
    this.frameCount++;

    this.handleGlobalInput();

    // Decay Shake
    if (this.screenShake > 0) {
        this.screenShake *= 0.9;
        if (this.screenShake < 0.5) this.screenShake = 0;
    }

    if (!this.state.isPaused && !this.state.isGameOver) {
      this.update(delta);
    }
    
    this.draw();
    
    if (this.activeBosses.length > 0) {
        const primary = this.activeBosses[0];
        if (primary.bossType && primary.hp !== undefined && primary.maxHp !== undefined) {
            this.state.activeBossData = {
                name: primary.bossType.replace('_', ' '),
                hp: primary.hp,
                maxHp: primary.maxHp,
                type: primary.bossType
            };
        }
    } else {
        this.state.activeBossData = undefined;
    }

    if (this.frameCount % 4 === 0 || this.state.isGameOver) {
        this.onStateChange({ ...this.state });
    }
  }

  public draw() {
    // 1. Shake Offset
    let shakeX = 0;
    let shakeY = 0;
    if (this.screenShake > 0) {
        shakeX = (Math.random() - 0.5) * this.screenShake;
        shakeY = (Math.random() - 0.5) * this.screenShake;
    }

    const camX = this.player.x - this.canvas.width / 2 + shakeX;
    const camY = this.player.y - this.canvas.height / 2 + shakeY;
    
    // 2. Render Layer
    ProceduralRenderer.drawBackground(this.ctx, this.canvas.width, this.canvas.height, camX, camY);
    
    const chests = this.chestPool.pool;
    for (let i = 0; i < chests.length; i++) {
        if(chests[i].active) {
            if(chests[i].type === 'chest') ProceduralRenderer.drawChest(this.ctx, chests[i], camX, camY);
            else if(chests[i].type === 'accessory_drop') ProceduralRenderer.drawAccessoryDrop(this.ctx, chests[i], camX, camY);
        }
    }

    const gems = this.gemPool.pool;
    for (let i = 0; i < gems.length; i++) {
        if(gems[i].active) ProceduralRenderer.drawGem(this.ctx, gems[i], camX, camY);
    }
    
    const minions = this.minionPool.pool;
    for (let i = 0; i < minions.length; i++) {
        if(minions[i].active) ProceduralRenderer.drawMinion(this.ctx, minions[i], camX, camY);
    }

    const enemies = this.enemyPool.pool;
    for (let i = 0; i < enemies.length; i++) {
        if(enemies[i].active) ProceduralRenderer.drawEnemy(this.ctx, enemies[i], camX, camY);
    }
    
    for (const boss of this.activeBosses) {
        if(boss.active) ProceduralRenderer.drawEnemy(this.ctx, boss, camX, camY);
    }

    ProceduralRenderer.drawPlayer(this.ctx, this.player.x, this.player.y, this.player.size, camX, camY);
    
    const projs = this.projectilePool.pool;
    for (let i = 0; i < projs.length; i++) {
        if(projs[i].active) ProceduralRenderer.drawProjectile(this.ctx, projs[i], camX, camY);
    }
    
    // 3. Lighting Overlay (Fog of War + Glows)
    ProceduralRenderer.drawLighting(this.ctx, this.canvas.width, this.canvas.height, this.player, projs, camX, camY);

    // 4. UI Elements (Floating Text)
    const texts = this.textPool.pool;
    for (let i = 0; i < texts.length; i++) {
        if(texts[i].active) ProceduralRenderer.drawFloatingText(this.ctx, texts[i], camX, camY);
    }
  }

  public spawnFloatingText(x: number, y: number, text: string, color: string) {
    const t = this.textPool.get();
    t.x = x;
    t.y = y;
    t.text = text;
    t.color = color;
    t.life = 1000;
    t.maxLife = 1000;
    t.velocity = { x: 0, y: -20 };
    t.active = true;
  }

  private handleGlobalInput() {
      const isSpaceNow = this.input.isKeyDown('Space');
      if (isSpaceNow && !this.wasSpaceDown) {
          if (!this.isLevelingUp && !this.state.isGameOver) {
              this.state.isPaused = !this.state.isPaused;
          }
      }
      this.wasSpaceDown = isSpaceNow;
  }

  private update(delta: number) {
    this.state.timer += delta;
    const seconds = this.state.timer / 1000;
    const minutes = seconds / 60;
    
    const accStats = AccessoryManager.getAggregatedStats(this.state.equippedAccessories);

    // Player Stats & Regen
    const bonusMaxHpMult = 1 + (accStats.maxHpMult || 0);
    this.state.maxHp = GAME_OPTIONS.PLAYER_BASE_HP * bonusMaxHpMult;
    if (this.state.hp > this.state.maxHp) this.state.hp = this.state.maxHp; 
    
    if (this.player.invulnTimer && this.player.invulnTimer > 0) this.player.invulnTimer -= delta;
    if (this.player.slowTimer && this.player.slowTimer > 0) this.player.slowTimer -= delta;

    if (!this.state.isGameOver && this.state.hp < this.state.maxHp && this.state.hp > 0) {
        this.regenAccumulator += delta;
        if (this.regenAccumulator >= 1000) {
            this.regenAccumulator = 0;
            const levelRegen = GAME_OPTIONS.PLAYER_BASE_REGEN + (this.state.level * GAME_OPTIONS.PLAYER_REGEN_PER_LEVEL);
            const accRegen = (accStats.hpRegenPer5 || 0) / 5;
            this.state.hp = Math.min(this.state.maxHp, this.state.hp + levelRegen + accRegen);
        }
    }

    // Player Movement
    const chronoPower = this.state.activePowers.find(p => p.type === WeaponType.CHRONOKINETIC_FIELD);
    const chronoSpeed = chronoPower ? (chronoPower.stats.haste || 0) : 0;
    const chronoMagnet = chronoPower ? (chronoPower.stats.magnet || 0) : 0;

    const baseSpeed = GAME_OPTIONS.PLAYER_SPEED;
    const speedMult = 1 + (accStats.moveSpeedMult || 0) + chronoSpeed;
    const slowMod = (this.player.slowTimer && this.player.slowTimer > 0) ? 0.8 : 1.0;
    const speed = baseSpeed * speedMult * slowMod * delta;
    
    const moveX = this.input.axisX;
    const moveY = this.input.axisY;
    
    if (moveX !== 0 || moveY !== 0) {
      const mag = Math.sqrt(moveX * moveX + moveY * moveY);
      const vx = (moveX / mag) * speed;
      const vy = (moveY / mag) * speed;
      this.player.x += vx;
      this.player.y += vy;
      this.player.velocity = { x: vx, y: vy };
    } else {
      this.player.velocity = { x: 0, y: 0 };
    }

    // Chest Logic
    this.chestSpawnTimer += delta;
    if (this.chestSpawnTimer > 3000) { 
        this.chestSpawnTimer = 0;
        let activeChests = 0;
        const chestPoolRaw = this.chestPool.pool;
        for(let i=0; i<chestPoolRaw.length; i++) {
            if(chestPoolRaw[i].active && chestPoolRaw[i].type === 'chest') activeChests++;
        }
        if (activeChests < GAME_OPTIONS.CHEST_LIMIT && Math.random() < 0.50) {
             const angle = Math.random() * Math.PI * 2;
             const dist = 300 + Math.random() * 300; 
             const chest = this.chestPool.get();
             chest.accessoryType = undefined;
             chest.artKey = undefined; 
             chest.x = this.player.x + Math.cos(angle) * dist;
             chest.y = this.player.y + Math.sin(angle) * dist;
             chest.active = true;
             chest.type = 'chest';
        }
    }

    // Boss Spawn Check
    const newBosses = BossController.checkSpawn(this.state, this.player);
    if (newBosses.length > 0) {
        this.activeBosses.push(...newBosses);
        this.state.activeBoss = newBosses[0].bossType; 
        this.addScreenShake(20);
        this.spawnFloatingText(this.player.x, this.player.y - 100, "BOSS APPROACHING", '#ff0000');
    }

    const spawnEnemyProjectile = (data: any) => {
        const proj = this.projectilePool.get();
        Object.assign(proj, data);
        proj.pierce = data.pierce || undefined;
        proj.onHit = data.onHit || undefined;
        proj.attachToPlayer = data.attachToPlayer || false;
        proj.isCrit = data.isCrit || false;
        proj.acceleration = data.acceleration || 0;
        proj.ricochets = data.ricochets || 0;
        proj.behavior = data.behavior || undefined;
        proj.maxLife = data.life;
        proj.active = true;
        proj.isEnemyProjectile = true; 
    };
    
    const spawnMinionEnemy = (archetype: EnemyArchetype, x: number, y: number) => {
        const minion = this.enemyPool.get();
        const data = EnemyManager.spawn(x, y, this.state.timer, this.state.level);
        Object.assign(minion, {
             ...data,
             active: true,
             type: 'enemy',
             hp: data.hp! * 0.5, 
             maxHp: data.maxHp! * 0.5,
             velocity: { x: 0, y: 0 },
             isStunned: false,
             stunTimer: 0,
             slowTimer: 0
        });
        if (minion.archetype) {
             const profile = (EnemyManager as any).ARCHETYPE_AI?.[minion.archetype] || 'BASIC_ZOMBIE';
             minion.aiBrain = new AIBrain(minion, profile);
        }
    };

    const spawnMinionProjectile = (data: any) => {
        const p = this.projectilePool.get();
        Object.assign(p, data);
        p.active = true;
        p.maxLife = data.life;
        p.isEnemyProjectile = false; 
        p.isMinionShot = true;
    };

    const rawEnemies = this.enemyPool.pool;
    const activeEnemiesList: Entity[] = []; 
    
    for(let i=0; i<rawEnemies.length; i++) {
        if(rawEnemies[i].active) activeEnemiesList.push(rawEnemies[i]);
    }

    // Boss Logic
    if (this.activeBosses.length === 0) {
        this.state.activeBoss = undefined;
    } else {
        this.player.hp = this.state.hp;
        for (const boss of this.activeBosses) {
            if (!boss.active) continue;
            const module = BossRegistry[boss.bossType!];
            module.logic.update(boss, this.player, this.state.timer, delta, spawnEnemyProjectile, spawnMinionEnemy, activeEnemiesList);
            
            if (this.player.hp !== undefined && this.player.hp < this.state.hp) {
                 const dmg = this.state.hp - this.player.hp;
                 this.takePlayerDamage(dmg, boss);
            }
            const dx = this.player.x - boss.x;
            const dy = this.player.y - boss.y;
            if (dx*dx + dy*dy < (boss.size + this.player.size)**2) {
                 if (!this.player.invulnTimer || this.player.invulnTimer <= 0) {
                     const bossDmg = 30 + (minutes * 5); 
                     this.takePlayerDamage(bossDmg, boss);
                     this.player.invulnTimer = 800; 
                 }
            }
        }
    }

    // Spawning Logic
    this.spawnTimer += delta;
    const rampProgress = Math.min(1, seconds / GAME_OPTIONS.SPAWN_RAMP_DURATION);
    const targetInterval = GAME_OPTIONS.SPAWN_RATE_START - (GAME_OPTIONS.SPAWN_RATE_START - GAME_OPTIONS.SPAWN_RATE_END) * rampProgress;
    const maxEnemies = Math.floor(GAME_OPTIONS.MAX_ENEMIES_START + (GAME_OPTIONS.MAX_ENEMIES_END - GAME_OPTIONS.MAX_ENEMIES_START) * rampProgress);
    let intervalMod = this.activeBosses.length > 0 ? 1.5 : (seconds < GAME_OPTIONS.GRACE_PERIOD ? 2.0 : 1.0);
    const finalInterval = targetInterval * intervalMod;
    
    const hordeArchetype = this.infestationSystem.update(delta, finalInterval);
    let activeEnemyCount = activeEnemiesList.length;

    const performSpawn = (forcedArchetype?: EnemyArchetype) => {
      const data = forcedArchetype 
          ? { ...EnemyManager.spawn(this.player.x, this.player.y, this.state.timer, this.state.level), archetype: forcedArchetype, artKey: forcedArchetype }
          : EnemyManager.spawn(this.player.x, this.player.y, this.state.timer, this.state.level);
          
      const enemy = this.enemyPool.get();
      enemy.velocity = { x: 0, y: 0 };
      enemy.isStunned = false;
      enemy.stunTimer = 0;
      enemy.slowTimer = 0;
      enemy.isBleeding = false;
      enemy.state = 'pursue'; 
      enemy.aiValues = { seed: Math.random() };
      Object.assign(enemy, data);
      
      if (enemy.archetype) {
          const profileName = (EnemyManager as any).ARCHETYPE_AI?.[enemy.archetype] || 'BASIC_ZOMBIE';
          enemy.aiBrain = new AIBrain(enemy, profileName);
      }
    };

    if (this.spawnTimer > finalInterval && activeEnemyCount < maxEnemies) {
      this.spawnTimer = 0;
      performSpawn();
    }
    if (hordeArchetype && activeEnemyCount < maxEnemies + 200) { 
        performSpawn(hordeArchetype);
    }

    // Spatial Hash Update
    this.spatialHash.clear();
    for (let i = 0; i < rawEnemies.length; i++) {
        if(rawEnemies[i].active) this.spatialHash.insert(rawEnemies[i]);
    }
    for (const boss of this.activeBosses) {
        if (boss.active) this.spatialHash.insert(boss);
    }
    const rawChests = this.chestPool.pool;
    for (let i = 0; i < rawChests.length; i++) {
        if(rawChests[i].active) this.spatialHash.insert(rawChests[i]);
    }

    AccessoryManager.onUpdate(this.player, delta, this.state.equippedAccessories, this.state.timer, activeEnemiesList, spawnMinionProjectile);

    const pSizeSq = (this.player.size + 14) ** 2;
    
    // ⚡ OPTIMIZATION: AI Throttling
    const aiPhase = this.frameCount % 4;

    for (let i = 0; i < rawEnemies.length; i++) {
      const e = rawEnemies[i];
      if (!e.active) continue;

      if (e.isKing) {
          EnemyManager.updateKing(e, this.player, this.state.timer, delta, spawnEnemyProjectile, spawnMinionEnemy);
      }
      
      const distSq = (this.player.x - e.x)**2 + (this.player.y - e.y)**2;
      const shouldUpdateAI = (i % 4 === aiPhase) || (distSq < 200 * 200);

      if (e.aiBrain && shouldUpdateAI) {
          e.aiBrain.update(delta * (distSq < 200*200 ? 1 : 4), this.player, this.spatialHash);
      }

      if (shouldUpdateAI) {
          this.spatialHash.queryToBuffer(e.x, e.y, 200, this.candidateBuffer);
          EnemyManager.updateEnemy(e, this.player, this.state.timer, delta, spawnEnemyProjectile, this.candidateBuffer);
      }

      this.handleEnemyMovement(e, this.player.x - e.x, this.player.y - e.y, distSq, delta);
      
      // Collision Damage
      if (distSq < pSizeSq) { 
        const baseDmg = e.customData?.collisionDamage || 5;
        const frameDmg = baseDmg * (delta / 1000); 
        this.takePlayerDamage(frameDmg, e);
      }
    }
    
    // Chest Interaction
    for (let i = 0; i < rawChests.length; i++) {
        const chest = rawChests[i];
        if(!chest.active) continue;
        const dx = this.player.x - chest.x;
        const dy = this.player.y - chest.y;
        if (dx * dx + dy * dy < 1600) { 
            this.openChest(chest);
        }
    }
    
    // Weapons Fire
    if (!this.state.isGameOver) {
      this.state.activePowers.forEach(p => {
        const isMinionPower = [WeaponType.AETHER_GOLEM, WeaponType.GRIMOIRE_FURY, WeaponType.SHADOW_SWARM, WeaponType.UMBRA_FAMILIAR, WeaponType.ABYSSAL_BOTANY].includes(p.type);
        if (isMinionPower && this.frameCount % 60 === 0) {
            this.handleMinionSpawning(p, accStats);
        }

        const cdr = accStats.cooldownReduction || 0;
        const actualCooldown = p.stats.cooldown * (1 - cdr);

        if (this.state.timer > p.lastFired + actualCooldown) {
            this.fireWeapon(p, accStats); 
            p.lastFired = this.state.timer;
        } else if (p.type === WeaponType.NIGHT_BLADE || p.type === WeaponType.BLOOD_ORB) {
            this.fireWeapon(p, accStats);
        }
      });
    }

    this.summonManager.update(this.player, activeEnemiesList, delta, this.state.timer, spawnMinionProjectile);

    // Projectile Updates
    const rawProjs = this.projectilePool.pool;
    for (let i = 0; i < rawProjs.length; i++) {
      const p = rawProjs[i];
      if (!p.active) continue;
      
      // Movement
      if (p.behavior) {
          p.behavior(p, delta, this.state.timer);
      } else {
          if (p.acceleration) {
              if (Math.abs(p.vx) < 30 && Math.abs(p.vy) < 30) {
                 p.vx *= (1 + p.acceleration);
                 p.vy *= (1 + p.acceleration);
              }
          }
          if (p.attachToPlayer) {
              p.x = this.player.x;
              p.y = this.player.y;
          } else {
              p.x += p.vx * delta; 
              p.y += p.vy * delta;
          }
      }
      
      // Collisions
      if (p.isEnemyProjectile) {
          const distSq = (p.x - this.player.x)**2 + (p.y - this.player.y)**2;
          const hitRad = (p.size + this.player.size)**2;
          if (distSq < hitRad) {
              if (!this.player.invulnTimer || this.player.invulnTimer <= 0) {
                  this.takePlayerDamage(p.damage, null);
                  this.player.invulnTimer = 250; 
                  if (p.onHit) p.onHit(this.player, p);
                  if (!p.pierce || p.pierce < 10) p.active = false;
              }
          }
      } else {
          this.spatialHash.queryToBuffer(p.x, p.y, p.size + 20, this.collisionBuffer);
          const cLen = this.collisionBuffer.length;
          
          for (let k = 0; k < cLen; k++) {
            const e = this.collisionBuffer[k];
            if (!e.active || !p.active) continue;
            if (e.type !== 'enemy' && e.type !== 'boss') continue;

            const rSum = p.size + e.size;
            if (Math.abs(p.x - e.x) > rSum || Math.abs(p.y - e.y) > rSum) continue;

            const dX = p.x - e.x;
            const dY = p.y - e.y;
            
            if (dX*dX + dY*dY < rSum * rSum) {
               if ((e.bossType === BossType.FALLEN_ANGEL && (e.state as string) === 'shielding') || (e.isKing && e.archetype === EnemyArchetype.KNIGHT)) {
                    p.vx = -p.vx; p.vy = -p.vy;
                    p.isEnemyProjectile = true; 
                    p.x += p.vx * 0.2; p.y += p.vy * 0.2;
                    this.spawnFloatingText(e.x, e.y - 20, "DEFLECTED", "#ccc");
                    continue;
               }

               if (p.damage > 0) {
                  let finalDamage = p.damage;
                  const isCrit = p.isCrit;
                  e.hp! -= finalDamage;
                  e.lastHitTime = Date.now(); 
                  
                  // Visual hit feedback
                  if (Math.random() > 0.8 || isCrit) {
                      this.spawnFloatingText(e.x, e.y - 15, Math.floor(finalDamage).toString() + (isCrit ? "!" : ""), isCrit ? '#f00' : '#fff');
                  }
               }
               if (p.onHit) p.onHit(e, p);
               
               if (p.ricochets && p.ricochets > 0) {
                   p.ricochets--;
                   p.vx = -p.vx; p.vy = -p.vy;
               } else if (p.pierce !== undefined) {
                   p.pierce--;
                   if (p.pierce <= 0) p.active = false;
               } else {
                   p.active = false;
               }
               
               if (e.hp! <= 0) this.handleEnemyDeath(e);
               if (!p.active) break;
            }
          }
      }

      p.life -= delta;
      if (p.life <= 0) p.active = false;
    }

    // Gem Magnet
    const pickupRadius = 100 * (1 + (accStats.pickupRangeMult || 0) + chronoMagnet); 
    const magnetSq = pickupRadius * pickupRadius;
    const rawGems = this.gemPool.pool;
    
    for (let i = 0; i < rawGems.length; i++) {
        const g = rawGems[i];
        if (!g.active) continue;
        const dx = this.player.x - g.x;
        const dy = this.player.y - g.y;
        const distSq = dx*dx + dy*dy;
        
        if (distSq < magnetSq) { 
            const dist = Math.sqrt(distSq);
            g.x += (dx/dist)*0.4*delta; 
            g.y += (dy/dist)*0.4*delta; 
        }
        if (distSq < 400) { 
            g.active = false; 
            const val = (g as any).value || GAME_OPTIONS.GEM_XP_VALUE;
            this.addXp(val); 
        }
    }

    const rawTexts = this.textPool.pool;
    for (let i = 0; i < rawTexts.length; i++) {
        const t = rawTexts[i];
        if (!t.active) continue;
        t.x += t.velocity.x * delta;
        t.y += t.velocity.y * delta;
        t.life -= delta;
        if (t.life <= 0) t.active = false;
    }
  }

  private handleMinionSpawning(p: WeaponData, accStats: AccessoryStats) {
      const minions = this.minionPool.pool;
      let type: MinionType = MinionType.AETHER_GOLEM;
      if(p.type === WeaponType.SHADOW_SWARM) type = MinionType.BAT_FAMILIAR;
      if(p.type === WeaponType.UMBRA_FAMILIAR) type = MinionType.UMBRA_CLONE;
      if(p.type === WeaponType.GRIMOIRE_FURY) type = MinionType.GRIMOIRE_BOOK;
      if(p.type === WeaponType.ABYSSAL_BOTANY) type = MinionType.VOID_BLOOM;

      let currentCount = 0;
      for(let m=0; m<minions.length; m++) {
          if (minions[m].active && minions[m].minionType === type) {
              currentCount++;
              minions[m].stats = p.stats;
              minions[m].powerLevel = p.level;
          }
      }

      let maxCount = p.stats.projectileCount || 1;
      if (type === MinionType.AETHER_GOLEM) maxCount = 1 + (accStats.amount || 0) + (accStats.summonCount || 0);
      else if (type === MinionType.VOID_BLOOM) maxCount = 5 + (accStats.amount || 0) + (accStats.summonCount || 0);
      else maxCount += (accStats.amount || 0) + (accStats.summonCount || 0);
      
      if (currentCount < maxCount) {
          if (type === MinionType.VOID_BLOOM && Math.random() > 0.1) return; 

          const minion = this.minionPool.get();
          let size = 15;
          let hp = 500;
          if(type === MinionType.AETHER_GOLEM) { size = 25; hp = 1000; }
          
          Object.assign(minion, {
              id: `minion_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
              x: this.player.x, y: this.player.y,
              active: true, type: 'minion', minionType: type,
              size: size, 
              hp: hp * (1 + (accStats.summonHpMult || 0)), 
              maxHp: hp,
              stats: p.stats, 
              powerLevel: p.level
          });
          if (type === MinionType.BAT_FAMILIAR) {
              minion.x += (Math.random()-0.5)*100;
              minion.y += (Math.random()-0.5)*100;
          }
      }
  }

  takePlayerDamage(amount: number, source: Entity | null) {
    if (this.state.isGameOver) return;
    if (this.player.invulnTimer && this.player.invulnTimer > 0) return;

    const accStats = AccessoryManager.getAggregatedStats(this.state.equippedAccessories);
    let damage = AccessoryManager.onTakeDamage(amount, source, this.state.equippedAccessories);
    
    if (damage <= 0) return;

    this.state.hp -= damage;
    this.addScreenShake(5); // Shake on damage
    this.spawnFloatingText(this.player.x, this.player.y - 30, `-${Math.ceil(damage)}`, '#ff0000');
    
    if (this.state.hp <= 0) {
      this.state.hp = 0;
      this.state.isGameOver = true;
      this.addScreenShake(20);
      this.onStateChange({...this.state});
    }
  }

  handleEnemyMovement(e: Entity, dx: number, dy: number, distSq: number, delta: number) {
    if (e.isStunned) {
        e.stunTimer = (e.stunTimer || 0) - delta;
        if (e.stunTimer <= 0) e.isStunned = false;
        return;
    }

    let speed = e.speed || 0.1;
    if (e.slowTimer && e.slowTimer > 0) {
        speed *= 0.5;
        e.slowTimer -= delta;
    }

    if (!e.aiBrain && distSq > 100) {
        const dist = Math.sqrt(distSq);
        e.x += (dx / dist) * speed * delta;
        e.y += (dy / dist) * speed * delta;
    } 
    else if (e.aiBrain) {
        e.x += (e.velocity?.x || 0) * delta;
        e.y += (e.velocity?.y || 0) * delta;
    }

    if (distSq < 100 * 100) {
        if (this.candidateBuffer.length > 0) {
            let sepX = 0, sepY = 0;
            const limit = Math.min(this.candidateBuffer.length, 5);
            for (let i=0; i<limit; i++) {
                const other = this.candidateBuffer[i];
                if (other === e || !other.active) continue;
                const dx2 = e.x - other.x;
                const dy2 = e.y - other.y;
                const d2 = dx2*dx2 + dy2*dy2;
                if (d2 < 225 && d2 > 0) { 
                    const d = Math.sqrt(d2);
                    sepX += (dx2/d);
                    sepY += (dy2/d);
                }
            }
            e.x += sepX * 0.1;
            e.y += sepY * 0.1;
        }
    }
  }

  openChest(chest: Entity) {
    chest.active = false;
    this.state.isPaused = true;
    const options = AccessoryManager.getRandomSelection(this.state, 3);
    if (options.length > 0) {
        this.onAccessorySelect(options);
    } else {
        this.addXp(500);
        this.state.isPaused = false;
        this.spawnFloatingText(this.player.x, this.player.y - 50, "MAX RELICS - XP BONUS", '#ffd700');
    }
  }

  fireWeapon(power: WeaponData, accStats: any) {
    const mod = PowerRegistry[power.type];
    if (!mod) return;
    
    this.spatialHash.queryToBuffer(this.player.x, this.player.y, power.stats.range * 1.5, this.candidateBuffer);
    const activeCandidates = this.candidateBuffer.filter(e => e.active && e.type === 'enemy' || e.type === 'boss');
    
    const targets = mod.definition.targeting 
        ? (TargetingStrategies[mod.definition.targeting]?.acquire({x: this.player.x, y: this.player.y}, activeCandidates) || activeCandidates)
        : activeCandidates;

    const spawnProj = (data: any) => {
        const p = this.projectilePool.get();
        Object.assign(p, data);
        p.active = true;
        p.maxLife = data.life;
        p.isEnemyProjectile = false; 
        p.isMinionShot = false;
        if(p.pierce === undefined) p.pierce = data.pierce || 0;
        if(p.ricochets === undefined) p.ricochets = data.ricochets || 0;
        
        if (accStats.damageMult) p.damage *= (1 + accStats.damageMult);
        if (accStats.projectileSpeedMult) {
            p.vx *= (1 + accStats.projectileSpeedMult);
            p.vy *= (1 + accStats.projectileSpeedMult);
        }
        if (accStats.durationMult) {
            p.life *= (1 + accStats.durationMult);
            p.maxLife *= (1 + accStats.durationMult);
        }
        if (accStats.powerSizeMult) p.size *= (1 + accStats.powerSizeMult);
        if (accStats.critChance && Math.random() < accStats.critChance) {
            p.isCrit = true;
            p.damage *= (1.5 + (accStats.critDamage || 0));
        }
    };

    mod.logic(power, this.player, targets, this.state.timer, spawnProj);
  }

  handleEnemyDeath(e: Entity) {
    e.active = false;
    this.state.killCount++;
    this.player.killCount = this.state.killCount; 
    
    const gem = this.gemPool.get();
    gem.x = e.x;
    gem.y = e.y;
    gem.active = true;
    gem.type = 'gem';
    (gem as any).value = e.isKing ? GAME_OPTIONS.GEM_XP_VALUE * GAME_OPTIONS.GEM_KING_MULTIPER : GAME_OPTIONS.GEM_XP_VALUE;
    (gem as any).isSuper = e.isKing;

    AccessoryManager.onKill(e, this.player, this.state.equippedAccessories);
    
    if (e.isKing || e.type === 'boss') {
        this.addScreenShake(10);
        const chest = this.chestPool.get();
        chest.x = e.x;
        chest.y = e.y;
        chest.active = true;
        chest.type = 'chest';
    }
    
    if (e.type === 'boss' && e.bossType) {
        this.state.defeatedBosses.push(e.bossType);
        const idx = this.activeBosses.indexOf(e);
        if (idx !== -1) this.activeBosses.splice(idx, 1);
        this.addXp(1000); 
    }
  }

  addXp(amount: number) {
    this.state.xp += amount;
    if (this.state.xp >= this.state.requiredXp) {
        this.state.xp -= this.state.requiredXp;
        this.state.level++;
        this.state.requiredXp = ExperienceManager.getRequiredXp(this.state.level);
        
        this.state.isPaused = true;
        this.isLevelingUp = true;
        const choices = WeaponSystem.getUpgradeChoices(this.state.activePowers);
        this.onLevelUp(choices);
        this.state.hp = Math.min(this.state.maxHp, this.state.hp + 20);
    }
  }
}
