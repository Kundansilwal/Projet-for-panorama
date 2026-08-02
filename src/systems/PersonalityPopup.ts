import Phaser from 'phaser';
import { eventBus } from '../core/EventBus';

export class PersonalityPopup {
  private panel: Phaser.GameObjects.Container;
  
  constructor(private readonly scene: Phaser.Scene) {
    const overlay = scene.add.graphics()
      .fillStyle(0x060b11, 0.85).fillRect(0, 0, 960, 640);

    const card = scene.add.graphics()
      .fillGradientStyle(0x18283e, 0x18283e, 0x0d1521, 0x0d1521, 0.98, 0.98, 0.98, 0.98).fillRoundedRect(180, 120, 600, 400, 24)
      .lineStyle(2, 0xf0d89d, 0.8).strokeRoundedRect(180, 120, 600, 400, 24)
      .lineStyle(1, 0x73b89e, 0.4).strokeRoundedRect(186, 126, 588, 388, 18);

    const titleText = scene.add.text(480, 180, '', { fontFamily: '"Cinzel", Georgia, serif', fontSize: '32px', color: '#ffe4a3', fontStyle: 'bold', shadow: { offsetX: 0, offsetY: 2, color: '#000', blur: 4, fill: true } }).setOrigin(0.5, 0.5);
    const subtitle = scene.add.text(480, 220, 'YOUR TRUE ARCHETYPE', { fontFamily: '"Lora", Georgia, serif', fontSize: '14px', color: '#73b89e', letterSpacing: 3, fontStyle: 'bold' }).setOrigin(0.5, 0.5);
    const descText = scene.add.text(480, 320, '', { fontFamily: '"Lora", Georgia, serif', fontSize: '20px', color: '#fff8e6', wordWrap: { width: 500 }, lineSpacing: 9, align: 'center', shadow: { offsetX: 0, offsetY: 1, color: '#000', blur: 2, fill: true } }).setOrigin(0.5, 0.5);
    
    const restartPrompt = scene.add.text(480, 470, 'Press R to begin another climb', { fontFamily: '"Cinzel", Georgia, serif', fontSize: '16px', color: '#d5e9d5', fontStyle: 'italic', shadow: { offsetX: 0, offsetY: 1, color: '#000', blur: 2, fill: true } }).setOrigin(0.5, 0.5);

    // Decorative lines
    const deco = scene.add.graphics()
      .lineStyle(1, 0xf0d89d, 0.5).lineBetween(280, 245, 680, 245)
      .fillStyle(0xf0d89d, 0.8).fillCircle(480, 245, 4);

    this.panel = scene.add.container(0, 0, [overlay, card, titleText, subtitle, descText, restartPrompt, deco]).setDepth(200).setScrollFactor(0).setVisible(false);
    
    eventBus.on('personality:show', (data: { title: string, desc: string }) => this.show(data.title, data.desc));
    eventBus.on('personality:hide', () => this.hide());
  }

  show(title: string, desc: string): void {
    this.panel.setVisible(true).setAlpha(0);
    const titleObj = this.panel.list[2] as Phaser.GameObjects.Text;
    const descObj = this.panel.list[4] as Phaser.GameObjects.Text;
    
    titleObj.setText(title);
    descObj.setText(desc);
    
    this.scene.tweens.add({ targets: this.panel, alpha: 1, duration: 800, ease: 'Power2' });
  }

  hide(): void {
    this.panel.setVisible(false);
  }

  destroy(): void {
    this.panel.destroy();
  }
}
