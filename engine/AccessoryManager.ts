
import { AccessoryInstance, AccessoryType, AccessoryStats } from '../types/accessoryTypes';
import { AccessoryRegistry } from '../accessories';
import { Entity, GameState } from '../types';
import { GAME_OPTIONS } from '../gameOptions';

export class AccessoryManager {
  
  static createDrop(x: number, y: number): Partial<Entity> {
    return {
      x, y,
      type: 'accessory_drop',
      active: true,
      size: 16
    };
  }

  // 🛠️ BUG FIX: Robust filtering of owned items
  static getAvailableAccessories(state: GameState): AccessoryType[] {
    const allTypes = Object.keys(AccessoryRegistry) as AccessoryType[];
    const owned = new Set<string>();
    
    if (state.equippedAccessories) {
        state.equippedAccessories.forEach(a => owned.add(a.type));
    }
    // Also check inventory (un-equipped but owned) if that mechanic exists, 
    // though current GameEngine puts excess in inventory.
    if (state.inventory) {
        state.inventory.forEach(a => owned.add(a.type));
    }
    
    // 🛠️ BUG FIX: Don't offer accessories if slots are full (max 4)
    // Actually, in standard survivors, you can't get new passives if slots are full.
    // We only return unowned types.
    if (owned.size >= GAME_OPTIONS.MAX_ACCESSORIES) {
        return []; 
    }
    
    return allTypes.filter(t => !owned.has(t));
  }

  static getRandomSelection(state: GameState, count: number): AccessoryType[] {
    const available = this.getAvailableAccessories(state);
    
    if (available.length === 0) return [];

    // Fisher-Yates Shuffle
    for (let i = available.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [available[i], available[j]] = [available[j], available[i]];
    }
    
    return available.slice(0, count);
  }

  // 🔄 REWORK: Stats now support dynamic values from Instance State
  static getAggregatedStats(equipped: AccessoryInstance[]): AccessoryStats {
    const total: AccessoryStats = {
      description: "",
      moveSpeedMult: 0,
      maxHpMult: 0,
      damageReduction: 0,
      powerSizeMult: 0,
      powerRangeMult: 0,
      projectileSpeedMult: 0,
      pickupRangeMult: 0,
      hpRegenPer5: 0,
      thornsReflect: 0,
      thornsMin: 0,
      amount: 0,
      damageMult: 0,
      critChance: 0,
      critDamage: 0,
      cooldownReduction: 0,
      durationMult: 0,
      summonCount: 0,
      summonHpMult: 0,
      summonDmgMult: 0,
      fearChance: 0,
      slowAura: 0
    };

    if (!equipped) return total;

    equipped.forEach(inst => {
      const mod = AccessoryRegistry[inst.type];
      if (!mod) return;
      const s = mod.definition.stats;
      
      // -- Merge Static Stats --
      if (s.moveSpeedMult) total.moveSpeedMult! += s.moveSpeedMult;
      if (s.maxHpMult) total.maxHpMult! += s.maxHpMult;
      if (s.damageReduction) total.damageReduction! += s.damageReduction;
      if (s.powerSizeMult) total.powerSizeMult! += s.powerSizeMult;
      if (s.powerRangeMult) total.powerRangeMult! += s.powerRangeMult;
      if (s.projectileSpeedMult) total.projectileSpeedMult! += s.projectileSpeedMult;
      if (s.pickupRangeMult) total.pickupRangeMult! += s.pickupRangeMult;
      if (s.hpRegenPer5) total.hpRegenPer5! += s.hpRegenPer5;
      if (s.thornsReflect) total.thornsReflect! += s.thornsReflect;
      if (s.thornsMin) total.thornsMin! = Math.max(total.thornsMin || 0, s.thornsMin);
      if (s.amount) total.amount! += s.amount;
      if (s.damageMult) total.damageMult! += s.damageMult;
      if (s.critChance) total.critChance! += s.critChance;
      if (s.critDamage) total.critDamage! += s.critDamage;
      if (s.cooldownReduction) total.cooldownReduction! += s.cooldownReduction;
      if (s.durationMult) total.durationMult! += s.durationMult;
      if (s.summonCount) total.summonCount! += s.summonCount;
      if (s.summonHpMult) total.summonHpMult! += s.summonHpMult;
      if (s.summonDmgMult) total.summonDmgMult! += s.summonDmgMult;
      if (s.fearChance) total.fearChance! += s.fearChance;
      if (s.slowAura) total.slowAura! += s.slowAura;

      // -- Merge Dynamic Stats (from customData) --
      // Example: Mirror Relic adding +2 Amount when active
      if (inst.customData?.bonusAmount) total.amount! += inst.customData.bonusAmount;
      if (inst.customData?.bonusSize) total.powerSizeMult! += inst.customData.bonusSize;
      if (inst.customData?.bonusCDR) total.cooldownReduction! += inst.customData.bonusCDR;
    });

    return total;
  }

  static onTakeDamage(damage: number, attacker: Entity | null, equipped: AccessoryInstance[]): number {
    if (!equipped) return damage;
    let finalDamage = damage;
    equipped.forEach(inst => {
      const mod = AccessoryRegistry[inst.type];
      if (mod && mod.logic.onTakeDamage) {
        finalDamage = mod.logic.onTakeDamage(finalDamage, attacker, mod.definition.stats, inst);
      }
    });
    return Math.max(0, finalDamage);
  }

  static onUpdate(
      player: Entity, 
      delta: number, 
      equipped: AccessoryInstance[], 
      time: number, 
      enemies: Entity[], 
      spawnProjectile: (data: any) => void
  ) {
    if (!equipped) return;
    equipped.forEach(inst => {
        const mod = AccessoryRegistry[inst.type];
        if (mod && mod.logic.onUpdate) {
            mod.logic.onUpdate(player, delta, mod.definition.stats, inst, time, enemies, spawnProjectile);
        }
    });
  }

  static onKill(victim: Entity, player: Entity, equipped: AccessoryInstance[]) {
      if (!equipped) return;
      equipped.forEach(inst => {
          const mod = AccessoryRegistry[inst.type];
          if (mod && mod.logic.onKill) {
              mod.logic.onKill(victim, player, mod.definition.stats, inst);
          }
      });
  }

  static equip(state: GameState, item: AccessoryInstance) {
    if (!state.equippedAccessories) state.equippedAccessories = [];
    if (!state.inventory) state.inventory = [];
    
    // Init Custom Data
    item.customData = {};

    if (state.equippedAccessories.length < GAME_OPTIONS.MAX_ACCESSORIES) {
      state.equippedAccessories.push(item);
    } else {
      // Inventory fallback logic, or auto-scrap if not implemented
      state.inventory.push(item); 
    }
  }
}
