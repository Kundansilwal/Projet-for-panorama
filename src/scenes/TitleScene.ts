import Phaser from 'phaser';
import { worldState } from '../state/session';
import { AudioDirector } from '../systems/AudioDirector';

export class TitleScene extends Phaser.Scene {
  private audio = new AudioDirector();
  private particles: { x: number; y: number; vx: number; vy: number; size: number; alpha: number; speed: number }[] = [];
  private gfx!: Phaser.GameObjects.Graphics;

  constructor() { super('Title'); }

  create(): void {
    this.gfx = this.add.graphics();

    // Generate floating particles
    for (let i = 0; i < 60; i++) {
      this.particles.push({
        x: Math.random() * 960,
        y: Math.random() * 640,
        vx: (Math.random() - 0.5) * 0.3,
        vy: -0.15 - Math.random() * 0.4,
        size: 1 + Math.random() * 2.5,
        alpha: 0.15 + Math.random() * 0.45,
        speed: 0.5 + Math.random() * 0.5
      });
    }

    // Background
    this.drawBackground();

    // Title text
    const titleShadow = this.add.text(482, 142, 'The Mountain\nWithin', {
      fontFamily: '"Cinzel", Georgia, serif', fontSize: '52px', color: '#000000',
      align: 'center', lineSpacing: 8
    }).setOrigin(0.5).setAlpha(0.35).setDepth(5);

    const title = this.add.text(480, 140, 'The Mountain\nWithin', {
      fontFamily: '"Cinzel", Georgia, serif', fontSize: '52px', color: '#fffbe8',
      align: 'center', lineSpacing: 8,
      stroke: '#38566b', strokeThickness: 3,
      shadow: { offsetX: 0, offsetY: 4, color: '#294558', blur: 10, fill: true }
    }).setOrigin(0.5).setDepth(6);

    // Subtitle
    const subtitle = this.add.text(480, 225, 'A journey of ten choices', {
      fontFamily: '"Lora", Georgia, serif', fontSize: '18px', color: '#e7f4dc',
      fontStyle: 'italic',
      shadow: { offsetX: 0, offsetY: 2, color: '#000', blur: 6, fill: true }
    }).setOrigin(0.5).setDepth(6).setAlpha(0);

    // Decorative line
    const line = this.add.graphics().setDepth(6);
    line.lineStyle(1, 0xffe8af, 0.6);
    line.lineBetween(340, 250, 620, 250);
    line.fillStyle(0xffe8af, 0.8);
    line.fillCircle(480, 250, 3);
    line.fillCircle(340, 250, 2);
    line.fillCircle(620, 250, 2);
    line.setAlpha(0);

    // Play button background
    const btnGfx = this.add.graphics().setDepth(8);
    this.drawButton(btnGfx, 380, 310, 200, 60, false);
    const btnText = this.add.text(480, 340, '▶  BEGIN', {
      fontFamily: '"Cinzel", Georgia, serif', fontSize: '22px', color: '#fff4d5',
      shadow: { offsetX: 0, offsetY: 2, color: '#000', blur: 6, fill: true }
    }).setOrigin(0.5).setDepth(9).setAlpha(0);

    const btnZone = this.add.zone(480, 340, 200, 60).setOrigin(0.5).setInteractive({ useHandCursor: true }).setDepth(10);
    btnZone.on('pointerover', () => { this.drawButton(btnGfx, 380, 310, 200, 60, true); });
    btnZone.on('pointerout', () => { this.drawButton(btnGfx, 380, 310, 200, 60, false); });
    btnZone.on('pointerdown', () => {
      this.audio.playSfx('click');
      btnZone.disableInteractive();
      this.cameras.main.fadeOut(600, 12, 19, 30);
      this.time.delayedCall(620, () => {
        this.scene.start('Journey');
        this.scene.launch('UI');
      });
    });

    // Audio toggle buttons
    this.createAudioToggle(380, 420, 'music', '♫ Music', worldState.musicEnabled);
    this.createAudioToggle(520, 420, 'sfx', '◈ SFX', worldState.sfxEnabled);

    // Controls hint
    const controls = this.add.text(480, 510, 'WASD / Arrows / Tap to move  ·  E / Tap to interact  ·  R to reset', {
      fontFamily: 'Helvetica, Arial, sans-serif', fontSize: '11px', color: '#9bbdb0',
      letterSpacing: 2, shadow: { offsetX: 0, offsetY: 1, color: '#1a2a24', blur: 2, fill: true }
    }).setOrigin(0.5).setDepth(6).setAlpha(0);

    // Entrance animations
    this.tweens.add({ targets: title, y: 140, alpha: { from: 0, to: 1 }, duration: 1200, ease: 'Sine.easeOut' });
    this.tweens.add({ targets: titleShadow, y: 142, alpha: { from: 0, to: 0.35 }, duration: 1200, ease: 'Sine.easeOut' });
    this.tweens.add({ targets: subtitle, alpha: 1, duration: 800, delay: 600, ease: 'Sine.easeOut' });
    this.tweens.add({ targets: line, alpha: 1, duration: 800, delay: 800, ease: 'Sine.easeOut' });
    this.tweens.add({ targets: [btnText, btnGfx], alpha: { from: 0, to: 1 }, duration: 800, delay: 1000, ease: 'Sine.easeOut' });
    this.tweens.add({ targets: controls, alpha: 0.7, duration: 800, delay: 1400, ease: 'Sine.easeOut' });

    // Title float
    this.tweens.add({ targets: [title, titleShadow], y: '+=6', duration: 3000, yoyo: true, repeat: -1, ease: 'Sine.easeInOut', delay: 1500 });

    this.cameras.main.fadeIn(800, 12, 19, 30);
  }

  update(): void {
    this.gfx.clear();
    this.drawBackground();

    // Animate particles
    for (const p of this.particles) {
      p.x += p.vx * p.speed;
      p.y += p.vy * p.speed;
      p.alpha += Math.sin(Date.now() * 0.002 + p.x) * 0.003;
      p.alpha = Phaser.Math.Clamp(p.alpha, 0.05, 0.55);
      if (p.y < -10) { p.y = 650; p.x = Math.random() * 960; }
      if (p.x < -10) p.x = 970;
      if (p.x > 970) p.x = -10;
      this.gfx.fillStyle(0xffe8c8, p.alpha);
      this.gfx.fillCircle(p.x, p.y, p.size);
    }
  }

  private drawBackground(): void {
    // Bright twilight sky gradient
    const top = Phaser.Display.Color.IntegerToColor(0x4d83aa);
    const mid = Phaser.Display.Color.IntegerToColor(0x8fc6ce);
    const bottom = Phaser.Display.Color.IntegerToColor(0xf0ce9b);
    for (let i = 0; i < 32; i++) {
      const color = i < 16
        ? Phaser.Display.Color.Interpolate.ColorWithColor(top, mid, 15, i)
        : Phaser.Display.Color.Interpolate.ColorWithColor(mid, bottom, 15, i - 16);
      this.gfx.fillStyle(Phaser.Display.Color.GetColor(color.r, color.g, color.b));
      this.gfx.fillRect(0, i * 20, 960, 21);
    }

    // Warm horizon glow
    this.gfx.fillGradientStyle(0xffe39f, 0xffc978, 0xf0ce9b, 0xf0ce9b, 0.7, 0.7, 0, 0);
    this.gfx.fillRect(0, 350, 960, 200);

    // Stars — brighter
    const starPositions = [[120, 45], [290, 80], [440, 30], [600, 65], [750, 40], [850, 90], [50, 100], [200, 25], [520, 55], [680, 20], [380, 95], [810, 55], [160, 70], [560, 42], [730, 85]];
    for (const [sx, sy] of starPositions) {
      const twinkle = 0.5 + Math.sin(Date.now() * 0.001 + sx * 0.1) * 0.4;
      this.gfx.fillStyle(0xfff8d3, twinkle * 0.75);
      this.gfx.fillCircle(sx, sy, 1.5 + Math.sin(Date.now() * 0.002 + sy) * 0.7);
    }

    // Large bright moon with halo
    this.gfx.fillStyle(0xffeaa8, 0.16);
    this.gfx.fillCircle(780, 100, 128);
    this.gfx.fillStyle(0xffeeb4, 0.31);
    this.gfx.fillCircle(780, 100, 76);
    this.gfx.fillStyle(0xfff5cd, 0.68);
    this.gfx.fillCircle(780, 100, 45);
    this.gfx.fillStyle(0xfffbe8, 0.96);
    this.gfx.fillCircle(780, 100, 27);

    // Distant mountains — lighter
    this.gfx.fillStyle(0x527e94, 0.54);
    this.gfx.fillTriangle(-80, 500, 200, 280, 530, 500);
    this.gfx.fillTriangle(300, 500, 600, 250, 1040, 500);
    this.gfx.fillTriangle(650, 500, 850, 300, 1050, 500);

    // Mid mountains — lighter
    this.gfx.fillStyle(0x436d70, 0.72);
    this.gfx.fillTriangle(-60, 540, 180, 340, 450, 540);
    this.gfx.fillTriangle(280, 540, 520, 310, 780, 540);
    this.gfx.fillTriangle(550, 540, 780, 330, 1020, 540);

    // Snow caps — brighter
    this.gfx.fillStyle(0xfffbec, 0.58);
    this.gfx.fillTriangle(165, 355, 200, 280, 235, 350);
    this.gfx.fillTriangle(567, 270, 600, 250, 640, 275);

    // Foreground ground — warmer
    this.gfx.fillStyle(0x3e6c62);
    this.gfx.fillRect(0, 540, 960, 100);

    // Mist — warm golden
    this.gfx.fillGradientStyle(0xc5e0ca, 0xc5e0ca, 0x3e6c62, 0x3e6c62, 0.58, 0.58, 1, 1);
    this.gfx.fillRect(0, 500, 960, 50);
  }

  private drawButton(gfx: Phaser.GameObjects.Graphics, x: number, y: number, w: number, h: number, hover: boolean): void {
    gfx.clear();
    if (hover) {
      gfx.fillGradientStyle(0x5e9c86, 0x5e9c86, 0x3c7667, 0x3c7667, 0.98, 0.98, 0.98, 0.98);
    } else {
      gfx.fillGradientStyle(0x3d786f, 0x3d786f, 0x285c58, 0x285c58, 0.94, 0.94, 0.94, 0.94);
    }
    gfx.fillRoundedRect(x, y, w, h, 14);
    gfx.lineStyle(2, hover ? 0xfff4d5 : 0xe9d49b, hover ? 0.9 : 0.5);
    gfx.strokeRoundedRect(x, y, w, h, 14);
    gfx.lineStyle(1, 0x95c9b3, 0.2);
    gfx.strokeRoundedRect(x + 3, y + 3, w - 6, h - 6, 11);
  }

  private createAudioToggle(x: number, y: number, kind: 'music' | 'sfx', label: string, enabled: boolean): void {
    const gfx = this.add.graphics().setDepth(8);
    const text = this.add.text(x + 30, y + 14, `${label}: ${enabled ? 'ON' : 'OFF'}`, {
      fontFamily: '"Lora", Georgia, serif', fontSize: '13px',
      color: enabled ? '#b8d4c8' : '#5a6a6e',
      shadow: { offsetX: 0, offsetY: 1, color: '#000', blur: 4, fill: true }
    }).setOrigin(0.5).setDepth(9).setAlpha(0);

    const drawToggleBg = (on: boolean, hovered: boolean) => {
      gfx.clear();
      gfx.fillGradientStyle(
        on ? 0x1a3a40 : 0x151e28, on ? 0x1a3a40 : 0x151e28,
        on ? 0x0f2a30 : 0x101820, on ? 0x0f2a30 : 0x101820,
        0.7, 0.7, 0.7, 0.7
      );
      gfx.fillRoundedRect(x - 30, y, 120, 28, 8);
      gfx.lineStyle(1, hovered ? 0xe9d49b : 0x4a5a5e, hovered ? 0.6 : 0.35);
      gfx.strokeRoundedRect(x - 30, y, 120, 28, 8);
    };

    drawToggleBg(enabled, false);

    const zone = this.add.zone(x + 30, y + 14, 120, 28).setOrigin(0.5).setInteractive({ useHandCursor: true }).setDepth(10);
    let currentState = enabled;

    zone.on('pointerover', () => drawToggleBg(currentState, true));
    zone.on('pointerout', () => drawToggleBg(currentState, false));
    zone.on('pointerdown', () => {
      this.audio.playSfx('click');
      if (kind === 'music') {
        currentState = worldState.toggleMusic();
        this.audio.setMusicEnabled(currentState);
      } else {
        currentState = worldState.toggleSfx();
      }
      text.setText(`${label}: ${currentState ? 'ON' : 'OFF'}`);
      text.setColor(currentState ? '#b8d4c8' : '#5a6a6e');
      drawToggleBg(currentState, true);
    });

    this.tweens.add({ targets: [text, gfx], alpha: { from: 0, to: 1 }, duration: 800, delay: 1200, ease: 'Sine.easeOut' });
  }
}
