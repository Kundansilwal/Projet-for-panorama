import Phaser from 'phaser';
import { eventBus } from '../core/EventBus';

export class DialogueSystem {
  private panel: Phaser.GameObjects.Container;
  private line: Phaser.GameObjects.Text;
  private speaker: Phaser.GameObjects.Text;
  private portrait: Phaser.GameObjects.Image;
  private timer?: Phaser.Time.TimerEvent;
  private active = '';

  constructor(private readonly scene: Phaser.Scene) {
    const card = scene.add.graphics()
      .fillGradientStyle(0x18283e, 0x18283e, 0x0d1521, 0x0d1521, 0.95, 0.95, 0.95, 0.95).fillRoundedRect(108, 470, 744, 148, 24)
      .lineStyle(2, 0xf0d89d, 0.8).strokeRoundedRect(108, 470, 744, 148, 24)
      .lineStyle(1, 0x73b89e, 0.4).strokeRoundedRect(114, 476, 732, 136, 18)
      .fillGradientStyle(0xffe99e, 0xe0b94c, 0xc19220, 0xffe99e, 0.25, 0.25, 0.25, 0.25).fillCircle(162, 544, 54);
    this.portrait = scene.add.image(162, 544, 'portrait-elder').setScale(0.97);
    this.speaker = scene.add.text(236, 486, '', { fontFamily: '"Cinzel", Georgia, serif', fontSize: '22px', color: '#ffe4a3', fontStyle: 'bold', shadow: { offsetX: 0, offsetY: 2, color: '#000', blur: 4, fill: true } });
    this.line = scene.add.text(236, 526, '', { fontFamily: '"Lora", Georgia, serif', fontSize: '18px', color: '#fff8e6', wordWrap: { width: 580 }, lineSpacing: 7, shadow: { offsetX: 0, offsetY: 1, color: '#000', blur: 2, fill: true } });
    this.panel = scene.add.container(0, 0, [card, this.portrait, this.speaker, this.line]).setDepth(100).setScrollFactor(0).setVisible(false);
    eventBus.on('dialogue:show', (data) => this.show(data.speaker, data.portrait, data.text, data.persistent));
    eventBus.on('dialogue:hide', () => this.hide());
  }

  show(speaker: string, portrait: string, message: string, persistent = false): void {
    this.timer?.remove(false); this.active = message; this.panel.setVisible(true).setAlpha(0);
    this.portrait.setTexture(`portrait-${portrait}`); this.speaker.setText(speaker); this.line.setText('');
    this.scene.tweens.add({ targets: this.panel, alpha: 1, duration: 180 });
    let index = 0;
    this.timer = this.scene.time.addEvent({ delay: 16, repeat: message.length - 1, callback: () => { this.line.setText(message.slice(0, ++index)); } });
    if (!persistent) this.scene.time.delayedCall(Math.max(2600, message.length * 36), () => this.hide());
  }

  reveal(): void { if (this.active) { this.timer?.remove(false); this.line.setText(this.active); } }
  hide(): void { this.timer?.remove(false); this.panel.setVisible(false); }
  destroy(): void { this.timer?.remove(false); this.panel.destroy(); }
}
