
import { GAME_OPTIONS } from '../gameOptions';

export class ExperienceManager {
  static getRequiredXp(level: number): number {
    return Math.floor(
      Math.pow(level, GAME_OPTIONS.XP_CURVE_EXPONENT) * GAME_OPTIONS.XP_CURVE_BASE
    ) + (level * GAME_OPTIONS.XP_CURVE_LINEAR);
  }
}
