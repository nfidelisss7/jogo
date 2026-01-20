
export class InputManager {
  private keys: Record<string, boolean> = {};
  private handlers: { type: string, listener: (e: any) => void }[] = [];

  // Touch State
  private touchActive = false;
  private touchStartX = 0;
  private touchStartY = 0;
  private touchX = 0;
  private touchY = 0;
  private touchId: number | null = null;
  private readonly JOYSTICK_RADIUS = 50;
  private readonly DEADZONE = 5;

  constructor() {
    // Keyboard Handlers
    const down = (e: KeyboardEvent) => this.keys[e.code] = true;
    const up = (e: KeyboardEvent) => this.keys[e.code] = false;
    
    window.addEventListener('keydown', down);
    window.addEventListener('keyup', up);

    this.handlers.push({ type: 'keydown', listener: down });
    this.handlers.push({ type: 'keyup', listener: up });

    // Touch Handlers
    const touchStart = (e: TouchEvent) => {
        if (this.touchActive) return; // Ignore multitouch for movement
        
        const t = e.changedTouches[0];
        this.touchId = t.identifier;
        this.touchActive = true;
        this.touchStartX = t.clientX;
        this.touchStartY = t.clientY;
        this.touchX = t.clientX;
        this.touchY = t.clientY;
    };

    const touchMove = (e: TouchEvent) => {
        if (!this.touchActive) return;
        
        // Prevent default only if we are actively controlling the game
        // This stops scrolling/pull-to-refresh
        if (e.cancelable) e.preventDefault();

        for (let i = 0; i < e.changedTouches.length; i++) {
            const t = e.changedTouches[i];
            if (t.identifier === this.touchId) {
                this.touchX = t.clientX;
                this.touchY = t.clientY;
                break;
            }
        }
    };

    const touchEnd = (e: TouchEvent) => {
        if (!this.touchActive) return;
        for (let i = 0; i < e.changedTouches.length; i++) {
            if (e.changedTouches[i].identifier === this.touchId) {
                this.touchActive = false;
                this.touchId = null;
                // Reset to center
                this.touchX = this.touchStartX;
                this.touchY = this.touchStartY;
                break;
            }
        }
    };

    // Use passive: false to allow preventDefault
    window.addEventListener('touchstart', touchStart, { passive: false });
    window.addEventListener('touchmove', touchMove, { passive: false });
    window.addEventListener('touchend', touchEnd);
    window.addEventListener('touchcancel', touchEnd);

    this.handlers.push({ type: 'touchstart', listener: touchStart });
    this.handlers.push({ type: 'touchmove', listener: touchMove });
    this.handlers.push({ type: 'touchend', listener: touchEnd });
    this.handlers.push({ type: 'touchcancel', listener: touchEnd });
  }

  public isKeyDown(code: string): boolean {
    return !!this.keys[code];
  }

  get axisX(): number {
    let val = 0;
    
    // Keyboard Input
    if (this.keys['KeyA'] || this.keys['ArrowLeft']) val -= 1;
    if (this.keys['KeyD'] || this.keys['ArrowRight']) val += 1;

    // Touch Input
    if (this.touchActive) {
        const dx = this.touchX - this.touchStartX;
        const dy = this.touchY - this.touchStartY;
        const dist = Math.sqrt(dx*dx + dy*dy);
        
        if (dist > this.DEADZONE) {
            // Normalized direction * magnitude (capped at 1)
            const magnitude = Math.min(1, dist / this.JOYSTICK_RADIUS);
            val += (dx / dist) * magnitude;
        }
    }

    return Math.max(-1, Math.min(1, val));
  }

  get axisY(): number {
    let val = 0;

    // Keyboard Input
    if (this.keys['KeyW'] || this.keys['ArrowUp']) val -= 1;
    if (this.keys['KeyS'] || this.keys['ArrowDown']) val += 1;

    // Touch Input
    if (this.touchActive) {
        const dx = this.touchX - this.touchStartX;
        const dy = this.touchY - this.touchStartY;
        const dist = Math.sqrt(dx*dx + dy*dy);
        
        if (dist > this.DEADZONE) {
            const magnitude = Math.min(1, dist / this.JOYSTICK_RADIUS);
            val += (dy / dist) * magnitude;
        }
    }

    return Math.max(-1, Math.min(1, val));
  }

  reset() {
    this.keys = {};
    this.touchActive = false;
    this.touchId = null;
  }

  destroy() {
    this.handlers.forEach(h => window.removeEventListener(h.type, h.listener));
    this.handlers = [];
  }
}
