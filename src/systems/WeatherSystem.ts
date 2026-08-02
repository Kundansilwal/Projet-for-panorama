import Phaser from 'phaser';

export class WeatherSystem {
  private mist: Phaser.GameObjects.Particles.ParticleEmitter;
  private overlay: Phaser.GameObjects.Rectangle;

  constructor(scene: Phaser.Scene) {
    this.mist = scene.add.particles(0, 0, 'cloud', {
      x: { min: 0, max: 960 }, y: { min: 0, max: 640 }, quantity: 1, frequency: 800,
      lifespan: 6000, speedX: { min: -10, max: 10 }, speedY: { min: -7, max: -2 }, scale: { start: 0.16, end: 0.36 }, alpha: { start: 0, end: 0.18 }, blendMode: 'SCREEN'
    }).setDepth(75).setScrollFactor(0);
    this.overlay = scene.add.rectangle(480, 320, 960, 640, 0x17203d, 0).setDepth(74).setScrollFactor(0);
  }

  setStage(stage: number): void {
    this.overlay.setFillStyle(0x17203d, Phaser.Math.Linear(0.02, 0.42, (stage - 1) / 9));
    this.mist.setFrequency(Math.max(250, 1000 - stage * 60));
  }

  destroy(): void { this.mist.destroy(); this.overlay.destroy(); }
}
