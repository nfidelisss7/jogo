
import { EnemyArchetype } from '../types';
import { AIStrategy } from './core/AIStrategy';
import { BasicChaserAI } from './enemies/common/BasicChaserAI';
import { BloodHoundAI } from './enemies/blood_hound/BloodHoundAI';
import { VoidImpAI } from './enemies/void_imp/VoidImpAI';
import { BatSwarmAI } from './enemies/bat_swarm/BatSwarmAI';
import { RangedAI } from './enemies/ranged/RangedAI';
import { SkeletonAI } from './enemies/skeleton/SkeletonAI';
import { ZombieAI } from './enemies/zombie/ZombieAI';
import { ChargerAI } from './enemies/charger/ChargerAI';
import { SpiderAI } from './enemies/spider/SpiderAI';

export class AIFactory {
  private static strategies: Map<EnemyArchetype, AIStrategy> = new Map();
  private static defaultStrategy = new BasicChaserAI();

  static init() {
    // 1. Complex/Unique AIs
    this.strategies.set(EnemyArchetype.BLOOD_HOUND, new BloodHoundAI());
    this.strategies.set(EnemyArchetype.VOID_IMP, new VoidImpAI());
    this.strategies.set(EnemyArchetype.BAT_SWARM, new BatSwarmAI());
    this.strategies.set(EnemyArchetype.BABY_DRAGON, new BatSwarmAI()); // Reuse swarm logic for small fliers

    // 2. Ranged Enemies (Kiting)
    const ranged = new RangedAI(350, 200); // Standard Ranged
    const farRanged = new RangedAI(450, 250); // Snipers
    this.strategies.set(EnemyArchetype.COWBOY, ranged);
    this.strategies.set(EnemyArchetype.SANTA_CLAUS, ranged);
    this.strategies.set(EnemyArchetype.ROBO_FAIRY, farRanged);

    // 3. Tacticians
    this.strategies.set(EnemyArchetype.SKELETON, new SkeletonAI());

    // 4. Horde/Swarmers
    const zombieAI = new ZombieAI();
    this.strategies.set(EnemyArchetype.ZOMBIE, zombieAI);
    this.strategies.set(EnemyArchetype.DESERT_ZOMBIE, zombieAI);
    this.strategies.set(EnemyArchetype.WATER_SLIME, zombieAI); // Slimes act like sticky zombies

    // 5. Chargers (Heavy)
    const charger = new ChargerAI();
    this.strategies.set(EnemyArchetype.KNIGHT, charger);
    this.strategies.set(EnemyArchetype.CRIMSON_GHOUL, charger);
    this.strategies.set(EnemyArchetype.DEMON, charger); // Demons also charge now

    // 6. Erratic/Fast
    const spiderAI = new SpiderAI();
    this.strategies.set(EnemyArchetype.NECRO_SPIDER, spiderAI);
    this.strategies.set(EnemyArchetype.SHADOW_WRAITH, spiderAI);
    this.strategies.set(EnemyArchetype.HORROR_STALKER, spiderAI);

    // 7. Healers/Special (Using specialized Logic classes primarily, but need movement)
    // Angels/Heralds use custom Logic in EnemyManager, but we can assign a basic avoidance AI for movement fallback
    this.strategies.set(EnemyArchetype.ANGEL, new RangedAI(400, 300));
    this.strategies.set(EnemyArchetype.SANCTIFIED_HERALD, new RangedAI(300, 150));
  }

  static getStrategy(archetype: EnemyArchetype): AIStrategy {
    // Lazy init
    if (this.strategies.size === 0) this.init();
    
    return this.strategies.get(archetype) || this.defaultStrategy;
  }
}
