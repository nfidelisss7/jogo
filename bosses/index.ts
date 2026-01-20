
import { BossType, BossModule, Entity } from '../types';
import { CountDraculorLogic } from './CountDraculor/CountDraculor.logic';
import { CountDraculorArt } from './CountDraculor/CountDraculor.art';
import { AbyssSovereignLogic } from './AbyssSovereign/AbyssSovereign.logic';
import { AbyssSovereignArt } from './AbyssSovereign/AbyssSovereign.art';
import { EternalRevenantLogic } from './EternalRevenant/EternalRevenant.logic';
import { EternalRevenantArt } from './EternalRevenant/EternalRevenant.art';
import { FleshHarvesterLogic } from './FleshHarvester/FleshHarvester.logic';
import { FleshHarvesterArt } from './FleshHarvester/FleshHarvester.art';
import { FallenAngelLogic } from './FallenAngel/FallenAngel.logic';
import { FallenAngelArt } from './FallenAngel/FallenAngel.art';
import { PapamamaDragonLogic } from './PapamamaDragon/PapamamaDragon.logic';
import { PapamamaDragonArt } from './PapamamaDragon/PapamamaDragon.art';

import { DRACULOR_STATS } from './CountDraculor/CountDraculor.types';
import { SOVEREIGN_STATS } from './AbyssSovereign/AbyssSovereign.types';
import { REVENANT_STATS } from './EternalRevenant/EternalRevenant.types';
import { HARVESTER_STATS } from './FleshHarvester/FleshHarvester.types';
import { FALLEN_ANGEL_STATS } from './FallenAngel/FallenAngel.types';
import { PAPAMAMA_STATS } from './PapamamaDragon/PapamamaDragon.types';

// Boss Factory Helper
const createBoss = (type: BossType, logic: any, art: any, stats: any): BossModule => ({
  type,
  logic,
  art,
  init: (x: number, y: number): Entity => ({
    id: `boss_${Date.now()}`,
    x, y,
    size: 60, // Base size
    active: true,
    type: 'boss',
    bossType: type,
    artKey: type,
    hp: stats.HP,
    maxHp: stats.HP,
    phase: 1,
    cooldowns: {},
    state: 'idle',
    stateTimer: 0
  })
});

export const BossRegistry: Record<BossType, BossModule> = {
  [BossType.COUNT_DRACULOR]: createBoss(BossType.COUNT_DRACULOR, CountDraculorLogic, CountDraculorArt, DRACULOR_STATS),
  [BossType.ABYSS_SOVEREIGN]: createBoss(BossType.ABYSS_SOVEREIGN, AbyssSovereignLogic, AbyssSovereignArt, SOVEREIGN_STATS),
  [BossType.ETERNAL_REVENANT]: createBoss(BossType.ETERNAL_REVENANT, EternalRevenantLogic, EternalRevenantArt, REVENANT_STATS),
  [BossType.FLESH_HARVESTER]: createBoss(BossType.FLESH_HARVESTER, FleshHarvesterLogic, FleshHarvesterArt, HARVESTER_STATS),
  [BossType.FALLEN_ANGEL]: createBoss(BossType.FALLEN_ANGEL, FallenAngelLogic, FallenAngelArt, FALLEN_ANGEL_STATS),
  [BossType.PAPAMAMA_DRAGON]: createBoss(BossType.PAPAMAMA_DRAGON, PapamamaDragonLogic, PapamamaDragonArt, PAPAMAMA_STATS)
};
