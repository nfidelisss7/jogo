
export class AudioManager {
  private static ctx: AudioContext;
  private static gainNode: GainNode;
  private static enabled: boolean = false;

  static init() {
    if (this.ctx) return;
    const AudioContextClass = (window.AudioContext || (window as any).webkitAudioContext);
    this.ctx = new AudioContextClass();
    this.gainNode = this.ctx.createGain();
    this.gainNode.gain.value = 0.3; // Master volume
    this.gainNode.connect(this.ctx.destination);
    this.enabled = true;
  }

  static playTone(freq: number, type: OscillatorType, duration: number, vol: number = 1) {
    if (!this.enabled) return;
    
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    
    osc.type = type;
    osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
    
    gain.gain.setValueAtTime(vol, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + duration);
    
    osc.connect(gain);
    gain.connect(this.gainNode);
    
    osc.start();
    osc.stop(this.ctx.currentTime + duration);
  }

  static playNoise(duration: number) {
    if (!this.enabled) return;
    const bufferSize = this.ctx.sampleRate * duration;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;
    
    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.5, this.ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0, this.ctx.currentTime + duration);
    
    noise.connect(gain);
    gain.connect(this.gainNode);
    noise.start();
  }
}
