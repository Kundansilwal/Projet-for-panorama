import Phaser from 'phaser';
import { worldState } from '../state/session';

export class LeaderboardScene extends Phaser.Scene {
  constructor() { super('Leaderboard'); }

  create(): void {
    const W = 960, H = 640;
    const cx = W / 2;

    // Dark atmospheric background
    const bg = this.add.graphics();
    bg.fillGradientStyle(0x0d1a24, 0x0d1a24, 0x060d12, 0x060d12, 1, 1, 1, 1);
    bg.fillRect(0, 0, W, H);

    // Subtle star field
    for (let i = 0; i < 60; i++) {
      const x = Phaser.Math.Between(0, W);
      const y = Phaser.Math.Between(0, H * 0.7);
      const r = Math.random() * 1.5 + 0.3;
      const alpha = Math.random() * 0.6 + 0.2;
      this.add.graphics().fillStyle(0xeaf3ff, alpha).fillCircle(x, y, r);
    }

    // Mountain silhouette at bottom
    const mtn = this.add.graphics();
    mtn.fillStyle(0x0f1e2a, 1);
    mtn.fillTriangle(0, H, 200, 370, 400, H);
    mtn.fillTriangle(180, H, 480, 300, 780, H);
    mtn.fillTriangle(560, H, 800, 390, W, H);
    mtn.fillRect(0, H - 80, W, 80);

    // Title section
    this.add.text(cx, 58, "✦  The Mountain's Ledger  ✦", {
      fontFamily: '"Cinzel", Georgia, serif', fontSize: '34px', color: '#ffe4a3',
      shadow: { offsetX: 0, offsetY: 3, color: '#000', blur: 8, fill: true }
    }).setOrigin(0.5);

    this.add.text(cx, 102, "Names carved by travelers who walked before you", {
      fontFamily: '"Lora", Georgia, serif', fontSize: '16px', color: '#7aadaa',
      fontStyle: 'italic'
    }).setOrigin(0.5);

    // Decorative divider
    const div = this.add.graphics();
    div.lineStyle(1, 0xf0d89d, 0.5).lineBetween(cx - 280, 126, cx + 280, 126);
    div.fillStyle(0xf0d89d, 0.8).fillCircle(cx, 126, 3);
    div.fillStyle(0xf0d89d, 0.5).fillCircle(cx - 20, 126, 2).fillCircle(cx + 20, 126, 2);

    // Card background
    const card = this.add.graphics();
    card.fillGradientStyle(0x16263a, 0x16263a, 0x0e1c2a, 0x0e1c2a, 0.92, 0.92, 0.92, 0.92);
    card.fillRoundedRect(cx - 310, 138, 620, 380, 18);
    card.lineStyle(1.5, 0xf0d89d, 0.4).strokeRoundedRect(cx - 310, 138, 620, 380, 18);
    card.lineStyle(1, 0x5a9b8a, 0.2).strokeRoundedRect(cx - 305, 143, 610, 370, 14);

    // Column headers
    this.add.text(cx - 250, 164, 'TRAVELER', {
      fontFamily: '"Cinzel", Georgia, serif', fontSize: '11px', color: '#7aadaa', letterSpacing: 3
    }).setOrigin(0, 0.5);
    this.add.text(cx + 250, 164, 'ARCHETYPE', {
      fontFamily: '"Cinzel", Georgia, serif', fontSize: '11px', color: '#7aadaa', letterSpacing: 3
    }).setOrigin(1, 0.5);

    const headerLine = this.add.graphics();
    headerLine.lineStyle(1, 0x3d5c6b, 0.6).lineBetween(cx - 270, 178, cx + 270, 178);

    // Load and display entries
    const travelers = worldState.loadLeaderboard();
    const maxEntries = Math.min(travelers.length, 7);
    const startY = 198;
    const rowH = 46;

    for (let i = 0; i < maxEntries; i++) {
      const t = travelers[i];
      const y = startY + i * rowH;
      const isFirst = i === 0;

      // Subtle row highlight for the newest entry
      if (isFirst) {
        const rowHl = this.add.graphics();
        rowHl.fillStyle(0x1e3a4a, 0.6).fillRoundedRect(cx - 295, y - 18, 590, rowH - 4, 6);
      }

      // Index number
      this.add.text(cx - 275, y, `${(i + 1).toString().padStart(2, '0')}`, {
        fontFamily: '"Cinzel", Georgia, serif', fontSize: '13px',
        color: isFirst ? '#ffe4a3' : '#4a6a7a'
      }).setOrigin(0, 0.5);

      // Name
      this.add.text(cx - 245, y, t.name, {
        fontFamily: '"Cinzel", Georgia, serif', fontSize: isFirst ? '22px' : '20px',
        color: isFirst ? '#fff8e6' : '#c8ddd0',
        shadow: { offsetX: 0, offsetY: 1, color: '#000', blur: 3, fill: true }
      }).setOrigin(0, 0.5);

      // Title
      this.add.text(cx + 250, y, t.title, {
        fontFamily: '"Lora", Georgia, serif', fontSize: '16px',
        color: isFirst ? '#c8f0e0' : '#8aadaa',
        fontStyle: isFirst ? 'bold italic' : 'italic'
      }).setOrigin(1, 0.5);

      // Row divider
      if (i < maxEntries - 1) {
        this.add.graphics().lineStyle(1, 0x2d4455, 0.5)
          .lineBetween(cx - 270, y + rowH / 2 - 1, cx + 270, y + rowH / 2 - 1);
      }
    }

    // Bottom divider
    const div2 = this.add.graphics();
    div2.lineStyle(1, 0xf0d89d, 0.3).lineBetween(cx - 280, 534, cx + 280, 534);

    // "Begin Anew" button
    const btnBg = this.add.graphics();
    const btnX = cx, btnY = 568;
    const drawBtn = (hover: boolean) => {
      btnBg.clear();
      btnBg.fillStyle(hover ? 0x2a4a50 : 0x18283e, 0.9).fillRoundedRect(btnX - 80, btnY - 18, 160, 36, 8);
      btnBg.lineStyle(1.5, hover ? 0xfff4d5 : 0xf0d89d, hover ? 0.7 : 0.45).strokeRoundedRect(btnX - 80, btnY - 18, 160, 36, 8);
    };
    drawBtn(false);

    const btn = this.add.text(btnX, btnY, 'Begin Anew', {
      fontFamily: '"Cinzel", Georgia, serif', fontSize: '18px', color: '#ffe4a3',
      shadow: { offsetX: 0, offsetY: 1, color: '#000', blur: 3, fill: true }
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });

    btn.on('pointerover', () => { drawBtn(true); btn.setColor('#ffffff'); });
    btn.on('pointerout', () => { drawBtn(false); btn.setColor('#ffe4a3'); });
    btn.on('pointerdown', () => {
      worldState.reset();
      this.cameras.main.fadeOut(500, 10, 18, 28);
      this.time.delayedCall(520, () => this.scene.start('Title'));
    });

    this.cameras.main.fadeIn(900, 13, 26, 36);

    // Gentle ambient particle drift (small glowing motes)
    for (let i = 0; i < 8; i++) {
      const x = Phaser.Math.Between(100, 860);
      const y = Phaser.Math.Between(200, 520);
      const dot = this.add.graphics().fillStyle(0xb0e0d0, 0.25).fillCircle(0, 0, 2).setPosition(x, y);
      this.tweens.add({
        targets: dot, y: y - Phaser.Math.Between(30, 70), alpha: 0,
        duration: Phaser.Math.Between(3000, 6000), ease: 'Sine.easeInOut',
        delay: Phaser.Math.Between(0, 2000), repeat: -1, yoyo: false,
        onRepeat: () => { dot.setPosition(Phaser.Math.Between(100, 860), Phaser.Math.Between(350, 520)); dot.setAlpha(0.25); }
      });
    }
  }
}
