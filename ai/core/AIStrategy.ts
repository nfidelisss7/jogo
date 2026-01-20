
import { Entity } from '../../types';
import { SpatialHash } from '../../SpatialHash';

export interface AIContext {
  delta: number;
  time: number;
  spatialHash: SpatialHash;
  nearbyEnemies: Entity[]; // Pre-fetched neighbors for flocking/separation
}

export interface AIStrategy {
  update(entity: Entity, player: Entity, context: AIContext): void;
}
