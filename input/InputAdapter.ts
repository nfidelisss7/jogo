
export interface InputState {
  axisX: number; // -1 to 1
  axisY: number; // -1 to 1
  isFiring: boolean;
  isDash: boolean;
}

export abstract class InputAdapter {
  abstract getState(): InputState;
  abstract destroy(): void;
}
