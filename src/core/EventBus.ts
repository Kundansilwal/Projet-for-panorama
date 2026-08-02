import Phaser from 'phaser';
import type { GameEvents } from './types';

/** A tiny typed boundary between scenes, entities, and systems. */
export class EventBus {
  private readonly emitter = new Phaser.Events.EventEmitter();

  emit<K extends keyof GameEvents>(event: K, ...args: GameEvents[K]): void {
    this.emitter.emit(event, ...args);
  }

  on<K extends keyof GameEvents>(event: K, listener: (...args: GameEvents[K]) => void, context?: unknown): void {
    this.emitter.on(event, listener, context);
  }

  off<K extends keyof GameEvents>(event: K, listener?: (...args: GameEvents[K]) => void, context?: unknown): void {
    this.emitter.off(event, listener, context);
  }

  destroy(): void { this.emitter.removeAllListeners(); }
}

export const eventBus = new EventBus();
