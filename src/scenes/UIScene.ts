import Phaser from 'phaser';
import { eventBus } from '../core/EventBus';
import { DialogueSystem } from '../systems/DialogueSystem';
import { PersonalityPopup } from '../systems/PersonalityPopup';
import { AudioDirector } from '../systems/AudioDirector';
import { worldState } from '../state/session';
import { stageFor } from '../config/stages';

export class UIScene extends Phaser.Scene {
  private stageText!: Phaser.GameObjects.Text;
  private historyText!: Phaser.GameObjects.Text;
  private hintText!: Phaser.GameObjects.Text;
  private dialogue!: DialogueSystem;
  private personalityPopup!: PersonalityPopup;
  private settingsOpen = false;
  private settingsPanel!: Phaser.GameObjects.Container;
  private audio = new AudioDirector();

  constructor() { super('UI'); }

  create(): void {
    const top = this.add.graphics()
      .fillGradientStyle(0x1a2a40, 0x1a2a40, 0x0f1926, 0x0f1926, 0.85, 0.85, 0.85, 0.85).fillRoundedRect(18, 16, 346, 76, 18)
      .lineStyle(2, 0xe9d49b, 0.6).strokeRoundedRect(18, 16, 346, 76, 18)
      .lineStyle(1, 0x95c9b3, 0.3).strokeRoundedRect(24, 22, 334, 64, 14)
      .fillGradientStyle(0xf5d98d, 0xe9c158, 0xd4a037, 0xf5d98d, 1, 1, 1, 1).fillCircle(43, 42, 10);
    top.setScrollFactor(0).setDepth(90);
    this.stageText = this.add.text(61, 28, '', { fontFamily: '"Cinzel", Georgia, serif', fontSize: '18px', color: '#fff0ba', fontStyle: 'bold', shadow: { offsetX: 0, offsetY: 2, color: '#000', blur: 4, fill: true } }).setScrollFactor(0).setDepth(91);
    this.historyText = this.add.text(61, 57, '', { fontFamily: '"Lora", Georgia, serif', fontSize: '14px', color: '#d5e9d5', shadow: { offsetX: 0, offsetY: 1, color: '#000', blur: 2, fill: true } }).setScrollFactor(0).setDepth(91);
    this.hintText = this.add.text(940, 28, '', { fontFamily: '"Lora", Georgia, serif', fontSize: '14px', color: '#f7f1d6', shadow: { offsetX: 0, offsetY: 2, color: '#000', blur: 4, fill: true }, backgroundColor: 'rgba(20, 32, 52, 0.8)', padding: { x: 14, y: 8 } }).setOrigin(1, 0).setScrollFactor(0).setDepth(91);
    this.dialogue = new DialogueSystem(this);
    this.personalityPopup = new PersonalityPopup(this);

    // Settings cog button
    this.createSettingsButton();
    this.createSettingsPanel();
    
    eventBus.on('hud:refresh', this.refresh, this);
    eventBus.on('world:changed', this.refresh, this);
    this.refresh();
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => { 
      eventBus.off('hud:refresh', this.refresh, this); 
      eventBus.off('world:changed', this.refresh, this); 
      this.dialogue.destroy(); 
      this.personalityPopup.destroy(); 
    });
  }

  private createSettingsButton(): void {
    // Draw a gear/cog icon
    const cogGfx = this.add.graphics().setScrollFactor(0).setDepth(92);
    const cx = 920, cy = 70;
    
    const drawCog = (hover: boolean) => {
      cogGfx.clear();
      // Background circle
      cogGfx.fillGradientStyle(
        hover ? 0x2a4a50 : 0x1a2a40, hover ? 0x2a4a50 : 0x1a2a40,
        hover ? 0x1a3a40 : 0x0f1926, hover ? 0x1a3a40 : 0x0f1926,
        0.85, 0.85, 0.85, 0.85
      );
      cogGfx.fillCircle(cx, cy, 18);
      cogGfx.lineStyle(1.5, hover ? 0xfff4d5 : 0xe9d49b, hover ? 0.8 : 0.5);
      cogGfx.strokeCircle(cx, cy, 18);
      
      // Inner gear teeth
      cogGfx.fillStyle(hover ? 0xfff4d5 : 0xe9d49b, hover ? 0.9 : 0.7);
      cogGfx.fillCircle(cx, cy, 5);
      cogGfx.lineStyle(2.5, hover ? 0xfff4d5 : 0xe9d49b, hover ? 0.9 : 0.7);
      for (let i = 0; i < 6; i++) {
        const angle = (i / 6) * Math.PI * 2;
        const innerR = 8, outerR = 14;
        cogGfx.lineBetween(
          cx + Math.cos(angle) * innerR, cy + Math.sin(angle) * innerR,
          cx + Math.cos(angle) * outerR, cy + Math.sin(angle) * outerR
        );
      }
    };
    
    drawCog(false);
    
    const cogZone = this.add.zone(cx, cy, 40, 40).setOrigin(0.5).setScrollFactor(0).setInteractive({ useHandCursor: true }).setDepth(93);
    cogZone.on('pointerover', () => drawCog(true));
    cogZone.on('pointerout', () => drawCog(false));
    cogZone.on('pointerdown', () => {
      this.audio.playSfx('click');
      this.toggleSettings();
    });
  }

  private createSettingsPanel(): void {
    this.settingsPanel = this.add.container(0, 0).setScrollFactor(0).setDepth(95).setVisible(false);

    const panelX = 770, panelY = 95;
    const panelW = 170, panelH = 130;

    // Panel background
    const bg = this.add.graphics();
    bg.fillGradientStyle(0x1a2a40, 0x1a2a40, 0x0f1926, 0x0f1926, 0.94, 0.94, 0.94, 0.94);
    bg.fillRoundedRect(panelX, panelY, panelW, panelH, 14);
    bg.lineStyle(2, 0xe9d49b, 0.5);
    bg.strokeRoundedRect(panelX, panelY, panelW, panelH, 14);
    bg.lineStyle(1, 0x95c9b3, 0.2);
    bg.strokeRoundedRect(panelX + 4, panelY + 4, panelW - 8, panelH - 8, 10);
    this.settingsPanel.add(bg);

    // Title
    const title = this.add.text(panelX + panelW / 2, panelY + 18, '✦ Settings', {
      fontFamily: '"Cinzel", Georgia, serif', fontSize: '14px', color: '#fff0ba',
      shadow: { offsetX: 0, offsetY: 1, color: '#000', blur: 3, fill: true }
    }).setOrigin(0.5);
    this.settingsPanel.add(title);

    // Music toggle
    this.createSettingsToggle(panelX + 15, panelY + 42, '♫ Music', worldState.musicEnabled, (on) => {
      worldState.toggleMusic();
      this.audio.setMusicEnabled(on);
    });

    // SFX toggle
    this.createSettingsToggle(panelX + 15, panelY + 78, '◈ Sound FX', worldState.sfxEnabled, () => {
      worldState.toggleSfx();
    });
  }

  private createSettingsToggle(x: number, y: number, label: string, initial: boolean, onChange: (on: boolean) => void): void {
    let isOn = initial;

    const labelText = this.add.text(x, y + 8, label, {
      fontFamily: '"Lora", Georgia, serif', fontSize: '13px',
      color: '#b8d4c8',
      shadow: { offsetX: 0, offsetY: 1, color: '#000', blur: 3, fill: true }
    });
    this.settingsPanel.add(labelText);

    // Toggle pill
    const pillGfx = this.add.graphics();
    const pillX = x + 110, pillY = y + 4;
    const pillW = 40, pillH = 20;

    const drawPill = () => {
      pillGfx.clear();
      pillGfx.fillStyle(isOn ? 0x4a8a6a : 0x2a3a44, 0.9);
      pillGfx.fillRoundedRect(pillX, pillY, pillW, pillH, 10);
      pillGfx.lineStyle(1, isOn ? 0x7ac8a0 : 0x4a5a5e, 0.6);
      pillGfx.strokeRoundedRect(pillX, pillY, pillW, pillH, 10);
      // Knob
      const knobX = isOn ? pillX + pillW - 12 : pillX + 12;
      pillGfx.fillStyle(isOn ? 0xfff4d5 : 0x6a7a7e, 1);
      pillGfx.fillCircle(knobX, pillY + pillH / 2, 7);
    };
    drawPill();
    this.settingsPanel.add(pillGfx);

    const zone = this.add.zone(pillX + pillW / 2, pillY + pillH / 2, pillW + 10, pillH + 10).setOrigin(0.5).setInteractive({ useHandCursor: true });
    this.settingsPanel.add(zone);

    zone.on('pointerdown', () => {
      this.audio.playSfx('click');
      isOn = !isOn;
      onChange(isOn);
      drawPill();
      labelText.setColor(isOn ? '#b8d4c8' : '#5a6a6e');
    });
  }

  private toggleSettings(): void {
    this.settingsOpen = !this.settingsOpen;
    if (this.settingsOpen) {
      this.settingsPanel.setVisible(true).setAlpha(0);
      this.tweens.add({ targets: this.settingsPanel, alpha: 1, duration: 200, ease: 'Sine.easeOut' });
    } else {
      this.tweens.add({ targets: this.settingsPanel, alpha: 0, duration: 150, ease: 'Sine.easeIn', onComplete: () => this.settingsPanel.setVisible(false) });
    }
  }

  private refresh(): void {
    const stage = stageFor(worldState.stage);
    const choices = worldState.choices.map((item) => item.value === 'YES' ? '✦' : '◌').join(' ') || '—';
    this.stageText.setText(worldState.complete ? 'Summit reached' : `Stage ${worldState.stage}/10  ·  ${stage.title}`);
    this.historyText.setText(`Your trail: ${choices}`);
    this.hintText.setText(this.registry.get('hint') as string ?? 'WASD / arrows  •  E to commune');
  }
}
