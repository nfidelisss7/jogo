
type Handler = (data?: any) => void;

export class EventBus {
  private static events: Record<string, Handler[]> = {};

  static on(event: string, handler: Handler) {
    if (!this.events[event]) {
      this.events[event] = [];
    }
    this.events[event].push(handler);
  }

  static off(event: string, handler: Handler) {
    if (!this.events[event]) return;
    this.events[event] = this.events[event].filter(h => h !== handler);
  }

  static emit(event: string, data?: any) {
    if (!this.events[event]) return;
    this.events[event].forEach(handler => handler(data));
  }

  static clear() {
    this.events = {};
  }
}

// Typed Event Constants
export const Events = {
  GAME_START: 'GAME_START',
  GAME_OVER: 'GAME_OVER',
  LEVEL_UP: 'LEVEL_UP',
  BOSS_SPAWN: 'BOSS_SPAWN',
  PLAYER_HIT: 'PLAYER_HIT',
  ENEMY_KILLED: 'ENEMY_KILLED',
  ITEM_PICKUP: 'ITEM_PICKUP'
};
