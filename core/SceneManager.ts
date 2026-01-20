
import { EventBus, Events } from './EventBus';

export enum SceneType {
  MENU = 'MENU',
  GAME = 'GAME',
  PAUSE = 'PAUSE',
  GAMEOVER = 'GAMEOVER'
}

export class SceneManager {
  private static currentScene: SceneType = SceneType.MENU;

  static init() {
    this.switchTo(SceneType.MENU);
  }

  static switchTo(scene: SceneType) {
    console.log(`Switching Scene: ${this.currentScene} -> ${scene}`);
    this.currentScene = scene;
    EventBus.emit('SCENE_CHANGED', scene);

    if (scene === SceneType.GAME) {
      EventBus.emit(Events.GAME_START);
    }
  }

  static is(scene: SceneType): boolean {
    return this.currentScene === scene;
  }

  static get current() {
    return this.currentScene;
  }
}
