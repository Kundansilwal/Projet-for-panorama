import Phaser from 'phaser';

export class Player extends Phaser.Physics.Arcade.Sprite {
  private readonly speed = 140;
  private controllable = true;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, 'hero-idle');
    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.setDepth(20).setCollideWorldBounds(true);
    this.body!.setSize(24, 19).setOffset(15, 43);
    this.play('hero-idle');
  }

  setControl(enabled: boolean): void {
    this.controllable = enabled;
    if (!enabled) this.setVelocity(0, 0);
  }

  move(cursors: Phaser.Types.Input.Keyboard.CursorKeys, keys: Record<'up' | 'down' | 'left' | 'right', Phaser.Input.Keyboard.Key>): void {
    if (!this.controllable) return;
    let x = (cursors.left.isDown || keys.left.isDown ? -1 : 0) + (cursors.right.isDown || keys.right.isDown ? 1 : 0);
    let y = (cursors.up.isDown || keys.up.isDown ? -1 : 0) + (cursors.down.isDown || keys.down.isDown ? 1 : 0);
    if (x !== 0 && y !== 0) { x *= Math.SQRT1_2; y *= Math.SQRT1_2; }
    this.setVelocity(x * this.speed, y * this.speed);
    if (x !== 0) this.setFlipX(x < 0);
    if (x || y) { if (this.anims.currentAnim?.key !== 'hero-run') this.play('hero-run'); }
    else if (this.anims.currentAnim?.key !== 'hero-idle') this.play('hero-idle');
  }
}
