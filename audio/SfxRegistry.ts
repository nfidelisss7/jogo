
import { AudioManager } from './AudioManager';

export const SfxRegistry = {
  playShoot: () => {
    AudioManager.playTone(400 + Math.random() * 200, 'sawtooth', 0.1, 0.2);
  },
  
  playHit: () => {
    AudioManager.playTone(100, 'square', 0.1, 0.3);
    AudioManager.playNoise(0.1);
  },
  
  playLevelUp: () => {
    setTimeout(() => AudioManager.playTone(440, 'sine', 0.2), 0);
    setTimeout(() => AudioManager.playTone(554, 'sine', 0.2), 100);
    setTimeout(() => AudioManager.playTone(659, 'sine', 0.4), 200);
  },
  
  playPowerUp: () => {
    AudioManager.playTone(200, 'triangle', 0.5, 0.3);
  }
};
