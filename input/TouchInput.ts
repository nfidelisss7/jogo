
import { InputAdapter, InputState } from './InputAdapter';

export class TouchInput implements InputAdapter {
  private startX: number = 0;
  private startY: number = 0;
  private currentX: number = 0;
  private currentY: number = 0;
  private active: boolean = false;
  private touchId: number | null = null;

  private readonly DEADZONE = 10;
  private readonly MAX_RANGE = 50;

  constructor() {
    this.handleStart = this.handleStart.bind(this);
    this.handleMove = this.handleMove.bind(this);
    this.handleEnd = this.handleEnd.bind(this);

    window.addEventListener('touchstart', this.handleStart, { passive: false });
    window.addEventListener('touchmove', this.handleMove, { passive: false });
    window.addEventListener('touchend', this.handleEnd);
  }

  private handleStart(e: TouchEvent) {
    e.preventDefault();
    if (this.active) return;
    
    const touch = e.changedTouches[0];
    this.touchId = touch.identifier;
    this.startX = touch.clientX;
    this.startY = touch.clientY;
    this.currentX = touch.clientX;
    this.currentY = touch.clientY;
    this.active = true;
  }

  private handleMove(e: TouchEvent) {
    e.preventDefault();
    if (!this.active) return;

    for (let i = 0; i < e.changedTouches.length; i++) {
      if (e.changedTouches[i].identifier === this.touchId) {
        this.currentX = e.changedTouches[i].clientX;
        this.currentY = e.changedTouches[i].clientY;
        break;
      }
    }
  }

  private handleEnd(e: TouchEvent) {
    for (let i = 0; i < e.changedTouches.length; i++) {
      if (e.changedTouches[i].identifier === this.touchId) {
        this.active = false;
        this.touchId = null;
        this.currentX = 0;
        this.currentY = 0;
        this.startX = 0;
        this.startY = 0;
        break;
      }
    }
  }

  getState(): InputState {
    if (!this.active) return { axisX: 0, axisY: 0, isFiring: false, isDash: false };

    const dx = this.currentX - this.startX;
    const dy = this.currentY - this.startY;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist < this.DEADZONE) return { axisX: 0, axisY: 0, isFiring: false, isDash: false };

    const norm = Math.min(dist, this.MAX_RANGE) / this.MAX_RANGE;
    const angle = Math.atan2(dy, dx);

    return {
      axisX: Math.cos(angle) * norm,
      axisY: Math.sin(angle) * norm,
      isFiring: true, // Auto-fire logic usually
      isDash: false
    };
  }

  destroy() {
    window.removeEventListener('touchstart', this.handleStart);
    window.removeEventListener('touchmove', this.handleMove);
    window.removeEventListener('touchend', this.handleEnd);
  }
}
