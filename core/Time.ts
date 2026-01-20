
export class Time {
  public static delta: number = 0;
  public static time: number = 0;
  public static scale: number = 1.0;
  
  private static lastTime: number = 0;
  private static readonly MAX_DELTA: number = 64; // Cap at ~15 FPS to prevent tunneling

  static update(currentTime: number) {
    let dt = currentTime - this.lastTime;
    
    // Clamp delta to prevent physics explosions during lag spikes
    if (dt > this.MAX_DELTA) {
      dt = this.MAX_DELTA;
    }

    this.delta = dt * this.scale;
    this.time += this.delta;
    this.lastTime = currentTime;
  }

  static reset() {
    this.lastTime = performance.now();
    this.time = 0;
    this.scale = 1.0;
  }
}
