import Phaser from 'phaser';
import { TextureFactory } from '../assets/TextureFactory';
import { worldState } from '../state/session';

export class BootScene extends Phaser.Scene {
  constructor() { super('Boot'); }

  create(): void {
    TextureFactory.create(this);
    worldState.load();
    this.scene.start('Title');
  }
}
