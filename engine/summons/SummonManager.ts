
import { Entity, MinionType, WeaponType, WeaponData } from '../../types';
import { ObjectPool } from '../ObjectPool';
import { SummonBase } from './SummonBase';
import { UmbraSummon, BatSummon, GolemSummon, PlantSummon, GrimoireSummon } from './SummonDefinitions';

export class SummonManager {
  private controllers: Map<string, SummonBase> = new Map();
  private pool: ObjectPool<Entity>;

  constructor(pool: ObjectPool<Entity>) {
    this.pool = pool;
  }

  public update(player: Entity, enemies: Entity[], delta: number, time: number, spawnProjectile: (data: any) => void) {
    const rawMinions = this.pool.pool;
    
    for (const minion of rawMinions) {
      if (!minion.active) {
        if (this.controllers.has(minion.id)) this.controllers.delete(minion.id);
        continue;
      }

      // Initialize controller if missing
      if (!this.controllers.has(minion.id)) {
        this.createController(minion);
      }

      const controller = this.controllers.get(minion.id);
      if (controller) {
        // Sync Level/Stats if they changed dynamic (e.g. upgrades)
        controller.update(player, enemies, delta, time, spawnProjectile);
        
        // Write animation state back to entity for Renderer
        minion.velocity = { x: 0, y: 0 }; // Used for rotation in some renderers
        (minion as any).animState = {
            scaleX: controller.animScaleX,
            scaleY: controller.animScaleY,
            rotation: controller.animRotation,
            alpha: controller.animAlpha
        };
      }
    }
  }

  private createController(entity: Entity) {
    const stats = entity.stats || { damage: 10, cooldown: 1000, range: 100, description: "" };
    const level = entity.powerLevel || 1;

    switch (entity.minionType) {
      case MinionType.UMBRA_CLONE:
        this.controllers.set(entity.id, new UmbraSummon(entity, stats, level));
        break;
      case MinionType.BAT_FAMILIAR:
        this.controllers.set(entity.id, new BatSummon(entity, stats, level));
        break;
      case MinionType.AETHER_GOLEM:
        this.controllers.set(entity.id, new GolemSummon(entity, stats, level));
        break;
      case MinionType.VOID_BLOOM:
        this.controllers.set(entity.id, new PlantSummon(entity, stats, level));
        break;
      case MinionType.GRIMOIRE_BOOK:
        this.controllers.set(entity.id, new GrimoireSummon(entity, stats, level)); 
        break;
    }
  }

  public clear() {
    this.controllers.clear();
  }
}
