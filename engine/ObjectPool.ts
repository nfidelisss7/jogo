
export class ObjectPool<T extends { active: boolean }> {
  public pool: T[] = []; // Made public for zero-alloc iteration
  private factory: () => T;

  constructor(factory: () => T, initialSize: number = 50) {
    this.factory = factory;
    for (let i = 0; i < initialSize; i++) {
      const item = this.factory();
      item.active = false;
      this.pool.push(item);
    }
  }

  get(): T {
    let item = this.pool.find(i => !i.active);
    if (!item) {
      item = this.factory();
      this.pool.push(item);
    }
    item.active = true;
    return item;
  }

  releaseAll() {
    for (let i = 0; i < this.pool.length; i++) {
      this.pool[i].active = false;
    }
  }

  // Legacy support if needed, but prefer accessing pool directly
  getActiveItems(): T[] {
    return this.pool.filter(i => i.active);
  }
}
