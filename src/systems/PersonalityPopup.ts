import Phaser from 'phaser';
import { eventBus } from '../core/EventBus';

export class PersonalityPopup {
  private panel: Phaser.GameObjects.Container;
  private formDom!: Phaser.GameObjects.DOMElement;
  
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
    
    // Decorative lines
    const deco = scene.add.graphics()
      .lineStyle(1, 0xf0d89d, 0.5).lineBetween(280, 245, 680, 245)
      .fillStyle(0xf0d89d, 0.8).fillCircle(480, 245, 4);

    const formHtml = `
      <div style="display: flex; flex-direction: column; align-items: center; gap: 14px; font-family: 'Cinzel', serif;">
        <p style="color: #d5e9d5; margin: 0; font-size: 16px; text-shadow: 0 1px 2px #000; font-style: italic;">Would you like to carve your name upon the mountain for travelers to ponder upon?</p>
        <div style="display: flex; gap: 8px;">
          <input type="text" id="travelerName" maxlength="16" placeholder="Your Name" style="padding: 8px 12px; font-size: 16px; background: rgba(24,40,62,0.8); color: #fff8e6; border: 1px solid #73b89e; border-radius: 4px; outline: none; width: 180px; text-align: center; font-family: 'Cinzel', serif;" autocomplete="off" />
          <button id="carveBtn" style="padding: 8px 16px; font-size: 16px; background: #73b89e; color: #0d1521; border: none; border-radius: 4px; cursor: pointer; font-weight: bold; font-family: 'Cinzel', serif;">Carve</button>
        </div>
      </div>
    `;
    const formDom = scene.add.dom(480, 450).createFromHTML(formHtml);

    formDom.addListener('click');
    formDom.on('click', (event: any) => {
      if (event.target.id === 'carveBtn') {
        const input = formDom.getChildByID('travelerName') as HTMLInputElement;
        const name = input.value.trim() || 'Anonymous';
        const titleObj = this.panel.list[2] as Phaser.GameObjects.Text;
        
        import('../state/session').then(({ worldState }) => {
          worldState.saveToLeaderboard(name, titleObj.text);
          scene.scene.start('Leaderboard');
        });
      }
    });

    this.panel = scene.add.container(0, 0, [overlay, card, titleText, subtitle, descText, deco]).setDepth(200).setScrollFactor(0).setVisible(false);
    
    // Add the DOM element separately since DOM elements can't be added to Containers directly
    formDom.setVisible(false);
    this.formDom = formDom;

    eventBus.on('personality:show', (data: { title: string, desc: string }) => this.show(data.title, data.desc));
    eventBus.on('personality:hide', () => this.hide());
  }

  show(title: string, desc: string): void {
    this.panel.setVisible(true).setAlpha(0);
    this.formDom.setVisible(true).setAlpha(0);
    const titleObj = this.panel.list[2] as Phaser.GameObjects.Text;
    const descObj = this.panel.list[4] as Phaser.GameObjects.Text;
    
    titleObj.setText(title);
    descObj.setText(desc);
    
    this.scene.tweens.add({ targets: [this.panel, this.formDom], alpha: 1, duration: 800, ease: 'Power2' });
  }

  hide(): void {
    this.panel.setVisible(false);
    this.formDom.setVisible(false);
  }

  destroy(): void {
    this.panel.destroy();
    this.formDom.destroy();
  }
}
