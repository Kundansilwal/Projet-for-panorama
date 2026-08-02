import Phaser from 'phaser';
import type { BiomeId } from '../core/types';
import type { WorldState } from '../core/WorldState';
import { stageFor, type StageDefinition } from '../config/stages';

interface Gate {
  choice: 'YES' | 'NO';
  zone: Phaser.GameObjects.Zone;
  sprite: Phaser.GameObjects.Image;
  label: Phaser.GameObjects.Text;
}

/**
 * A reusable 960×640 room. Crossing an airlock never extends the world; it
 * rebuilds the same room with new layers from WorldState while the screen is obscured.
 */
export class TreadmillMap {
  private readonly art: Phaser.GameObjects.Graphics;
  private readonly shrine: Phaser.GameObjects.Image;
  private readonly shrineZone: Phaser.GameObjects.Zone;
  private readonly gates: Gate[];
  private readonly decorations: Phaser.GameObjects.Image[] = [];
  private readonly atmosphere: Phaser.GameObjects.Image[] = [];
  private decorationCursor = 0;
  private stage: StageDefinition;

  constructor(private readonly scene: Phaser.Scene, private readonly state: WorldState) {
    this.art = scene.add.graphics().setDepth(0);
    this.shrine = scene.add.image(480, 245, 'shrine').setDepth(14);
    this.shrineZone = scene.add.zone(480, 265, 120, 120).setOrigin(0.5);
    scene.physics.add.existing(this.shrineZone, true);
    this.gates = [this.createGate('YES', 280), this.createGate('NO', 680)];
    this.stage = stageFor(state.stage);
    this.build();
  }

  get currentStage(): StageDefinition { return this.stage; }
  get interactZone(): Phaser.GameObjects.Zone { return this.shrineZone; }
  get choiceGates(): readonly Gate[] { return this.gates; }

  rebuild(): void { this.stage = stageFor(this.state.stage); this.build(); }

  setGatesVisible(visible: boolean): void {
    this.gates.forEach((gate) => {
      gate.sprite.setVisible(visible); gate.label.setVisible(visible); gate.zone.setActive(visible).setVisible(false);
      (gate.zone.body as Phaser.Physics.Arcade.StaticBody).enable = visible;
    });
  }

  private createGate(choice: 'YES' | 'NO', x: number): Gate {
    const zone = this.scene.add.zone(x, 218, 110, 60).setOrigin(0.5);
    this.scene.physics.add.existing(zone, true);
    const sprite = this.scene.add.image(x, 218, choice === 'YES' ? 'gate-yes' : 'gate-no').setDepth(16);
    const label = this.scene.add.text(x, 268, '', { fontFamily: 'Georgia', fontSize: '15px', color: '#fff4d5', stroke: '#182033', strokeThickness: 4, align: 'center', wordWrap: { width: 180 } }).setOrigin(0.5).setDepth(18);
    return { choice, zone, sprite, label };
  }

  private build(): void {
    const { stage } = this;
    const palette = this.palette(stage.biome, stage.id);
    this.art.clear();
    this.drawSky(palette, stage.id);
    
    // Atmospheric mist behind mountains
    this.art.fillGradientStyle(0xffffff, 0xffffff, palette.sky, palette.sky, 0.1, 0.1, 0, 0);
    this.art.fillRect(0, 100, 960, 250);

    // Distant Mountain Layer (Layer 3)
    this.art.fillStyle(palette.mountain, 0.35);
    this.art.fillTriangle(-50, 354, 120, 150, 380, 354).fillTriangle(250, 354, 500, 110, 800, 354).fillTriangle(600, 354, 880, 140, 1100, 354);
    
    // Mid Mountain Layer (Layer 2)
    this.art.fillStyle(palette.mountain, 0.65);
    this.art.fillTriangle(0, 354, 245, 70, 510, 354).fillTriangle(360, 354, 680, 30, 960, 354);
    // Snow caps for Mid Layer
    this.art.fillStyle(0xffffff, 0.45);
    this.art.fillTriangle(194, 129, 245, 70, 295, 129).fillTriangle(622, 98, 680, 30, 735, 95);
    
    // Foreground Mountain Layer (Layer 1)
    this.art.fillStyle(palette.far, 0.9);
    this.art.fillTriangle(-100, 354, 180, 180, 480, 354).fillTriangle(380, 354, 770, 140, 1050, 354);
    // Subtle shadow lines on foreground mountains
    this.art.fillStyle(0x1a2130, 0.15);
    this.art.fillTriangle(180, 180, 150, 354, 480, 354).fillTriangle(770, 140, 700, 354, 1050, 354);

    // Heavy horizon mist blending ground and mountains
    this.art.fillGradientStyle(palette.sky, palette.sky, palette.ground, palette.ground, 0.8, 0.8, 1, 1);
    this.art.fillRect(0, 260, 960, 45);

    // Ground and Path
    this.art.fillStyle(palette.ground).fillRect(0, 305, 960, 335);
    this.art.fillStyle(0x315a4c, 0.16).fillEllipse(214, 443, 470, 130).fillEllipse(752, 497, 470, 160);
    this.art.fillStyle(0x293a45, 0.18).fillEllipse(480, 630, 380, 50);
    this.art.fillStyle(palette.path)
      .fillTriangle(398, 640, 562, 640, 535, 240)
      .fillTriangle(535, 240, 425, 240, 398, 640)
      // Horizontal corridor left and right from path top
      .fillRect(280, 228, 200, 28)
      .fillRect(480, 228, 200, 28)
      // Circular platforms at each end
      .fillEllipse(280, 242, 140, 55)
      .fillEllipse(680, 242, 140, 55);
    this.art.lineStyle(2, 0xfff0bf, 0.38).lineBetween(479, 640, 480, 268);
    this.art.lineStyle(2, 0x887b63, 0.24).lineBetween(423, 489, 537, 489).lineBetween(431, 395, 529, 395).lineBetween(439, 318, 522, 318);
    // Horizontal corridor center line
    this.art.lineStyle(1, 0xfff0bf, 0.22).lineBetween(280, 242, 680, 242);
    
    // Top UI bar shadow
    this.art.fillStyle(0x142130, 0.25).fillRect(0, 0, 960, 55);
    this.art.lineStyle(2, 0xffe8af, 0.45).lineBetween(0, 55, 960, 55);

    this.decorationCursor = 0;
    this.decorations.forEach((item) => item.setVisible(false));
    this.placeBiomeDecor(stage.biome, palette);
    this.placeAtmosphere(stage.id);
    this.drawEchoes();
    this.shrine.setTint(palette.shrineTint).setAlpha(0.88 + this.state.echo().warmth * 0.12);
    this.shrineZone.setPosition(480, 265);
    this.gates.forEach((gate) => {
      gate.label.setText(gate.choice === 'YES' ? stage.yesLabel : stage.noLabel);
      gate.sprite.setPosition(gate.choice === 'YES' ? 280 : 680, 218);
      gate.zone.setPosition(gate.sprite.x, gate.sprite.y);
      gate.label.setPosition(gate.sprite.x, 268);
    });
    this.setGatesVisible(false);
  }

  private drawEchoes(): void {
    const echo = this.state.echo();
    if (this.stage.id < 6) return;
    const bridgeTint = echo.bridge === 'repaired' ? 0xbad4c0 : 0x6c5764;
    this.art.fillStyle(bridgeTint).fillRoundedRect(373, 382, 214, 24, 5).lineStyle(3, 0x3d4555).strokeRoundedRect(373, 382, 214, 24, 5);
    if (echo.bridge === 'ruined') {
      this.art.fillStyle(0x263047).fillRect(467, 380, 28, 30);
      this.art.lineStyle(2, 0xaa6b6b, 0.8).lineBetween(445, 382, 462, 405).lineBetween(510, 382, 528, 405);
    }
    if (echo.spirit === 'awake') {
      this.art.fillStyle(0xb9efd0, 0.42).fillCircle(782, 320, 34).fillCircle(811, 300, 19);
    }
  }

  private placeBiomeDecor(biome: BiomeId, palette: ReturnType<TreadmillMap['palette']>): void {
    const points = [
      [75, 398], [145, 345], [215, 470], [790, 365], [860, 450], [912, 338], [55, 540], [895, 570], [155, 580], [736, 565]
    ] as const;
    const texture = biome === 'bamboo' ? 'bamboo' : biome === 'pass' || biome === 'summit' || biome === 'cavern' ? 'rock' : 'tree';
    points.forEach(([x, y], index) => {
      const item = this.borrow(texture);
      item.setPosition(x, y).setDepth(8 + Math.floor(y / 100)).setScale(0.75 + (index % 3) * 0.14).setTint(palette.decor);
      if (biome === 'cavern') item.setAlpha(0.76);
    });
    const accents = [
      [104, 518], [286, 375], [352, 568], [608, 498], [718, 405], [838, 530], [65, 370], [910, 588],
      [150, 450], [220, 520], [410, 420], [530, 550], [680, 530], [820, 410], [880, 490], [25, 470], [930, 420]
    ] as const;
    const flowerTypes = ['flower-pink', 'flower-blue', 'flower-yellow'];
    accents.forEach(([x, y], index) => {
      const isFlower = index % 3 === 0;
      const type = isFlower ? flowerTypes[index % flowerTypes.length] : 'grass-tuft';
      const item = this.borrow(type);
      item.setPosition(x, y).setDepth(10 + Math.floor(y / 100)).setScale(0.7 + (index % 2) * 0.18).setTint(biome === 'cavern' ? 0x8092a1 : 0xffffff);
    });
    
    if (biome === 'summit' || biome === 'pass') {
      // Huge bloom of multi-colored flowers for the sunny mountain!
      for (let i = 0; i < 45; i++) {
        const item = this.borrow(flowerTypes[i % flowerTypes.length]);
        const x = 30 + ((Math.sin(i * 12.3) + 1) / 2) * 900;
        const y = 300 + ((Math.cos(i * 4.56) + 1) / 2) * 280;
        item.setPosition(x, y).setDepth(10 + Math.floor(y / 100)).setScale(0.5 + ((Math.sin(i) + 1) / 2) * 0.4).clearTint();
      }
    }
    
    if (biome !== 'cavern') {
      [[101, 279], [853, 282], [176, 343], [790, 365]].forEach(([x, y]) => this.borrow('lantern').setPosition(x, y).setDepth(14).setScale(0.78));
    }
    if (biome === 'bamboo') {
      [[250, 310], [690, 320], [320, 380], [600, 390]].forEach(([x, y]) => this.borrow('lantern').setPosition(x, y).setDepth(14).setScale(0.65).setTint(0xe6f2e8));
      [[140, 340], [280, 480], [720, 410], [860, 540], [420, 580]].forEach(([x, y]) => this.borrow('lotus').setPosition(x, y).setDepth(10 + Math.floor(y / 100)).setScale(0.85));
    }
    if (biome === 'cavern') {
      this.art.fillStyle(0x182136, 0.62).fillTriangle(0, 72, 280, 285, 0, 400).fillTriangle(960, 72, 680, 285, 960, 400);
    }
  }

  private borrow(texture: string): Phaser.GameObjects.Image {
    const item = this.decorations[this.decorationCursor++] ?? this.scene.add.image(0, 0, texture).setDepth(5);
    if (!this.decorations.includes(item)) this.decorations.push(item);
    item.setTexture(texture).setVisible(true).setAlpha(1).clearTint();
    return item;
  }

  private borrowAtmosphere(): Phaser.GameObjects.Image {
    const item = this.atmosphere.find((candidate) => !candidate.visible) ?? this.scene.add.image(0, 0, 'cloud').setDepth(2);
    if (!this.atmosphere.includes(item)) this.atmosphere.push(item);
    item.setVisible(true).setAlpha(0.16).setTint(0xffffff);
    return item;
  }

  private placeAtmosphere(stage: number): void {
    this.atmosphere.forEach((item) => item.setVisible(false));
    [[155, 119, 0.55], [756, 161, 0.74], [455, 93, 0.37]].forEach(([x, y, scale]) => {
      this.borrowAtmosphere().setPosition(x, y).setScale(scale).setAlpha(0.13 + stage * 0.006);
    });
    const moon = this.borrowAtmosphere();
    moon.setPosition(826, 105).setTexture('firefly').setScale(4.4).setAlpha(0.4 + stage * 0.035).setDepth(3);
  }

  private drawSky(palette: ReturnType<TreadmillMap['palette']>, _stage?: number): void {
    const top = Phaser.Display.Color.IntegerToColor(palette.sky);
    const bottom = Phaser.Display.Color.IntegerToColor(palette.far).lighten(10);
    for (let index = 0; index < 18; index += 1) {
      const mix = Phaser.Display.Color.Interpolate.ColorWithColor(top, bottom, 17, index);
      this.art.fillStyle(Phaser.Display.Color.GetColor(mix.r, mix.g, mix.b)).fillRect(0, index * 16, 960, 17);
    }
    this.art.fillStyle(0xfff1b5, 0.16).fillCircle(765, 102, 51);
  }

  private palette(biome: BiomeId, stage: number): { sky: number; mountain: number; far: number; ground: number; path: number; decor: number; shrineTint: number } {
    const night = Phaser.Math.Linear(0, 0.42, (stage - 1) / 9);
    const choices: Record<BiomeId, [number, number, number, number, number, number]> = {
      forest: [0x8fc8c8, 0x4c6e77, 0x678d79, 0x5e9370, 0xd2bd8c, 0xffffff],
      pass: [0xa6bdd2, 0x57677e, 0x718092, 0x7b8e83, 0xc3af8d, 0xc3c5c6],
      bamboo: [0x9bc8b4, 0x53776e, 0x6f9e84, 0x5b9675, 0xcbba88, 0xe0f4c8],
      cavern: [0x46516f, 0x283348, 0x3b4660, 0x344859, 0x8e8791, 0x8f9cb0],
      summit: [0x7186ae, 0x4b5676, 0x7584a0, 0x8494a7, 0xd8c7a7, 0xe5e6f7]
    };
    const [sky, mountain, far, ground, path, decor] = choices[biome];
    const shade = (color: number): number => Phaser.Display.Color.IntegerToColor(color).darken(Math.round(night * 70)).color;
    return { sky: shade(sky), mountain: shade(mountain), far: shade(far), ground: shade(ground), path: shade(path), decor: shade(decor), shrineTint: stage > 7 ? 0xaab9ff : 0xffffff };
  }

  destroy(): void { this.art.destroy(); this.shrine.destroy(); this.shrineZone.destroy(); this.gates.forEach((gate) => { gate.zone.destroy(); gate.sprite.destroy(); gate.label.destroy(); }); this.decorations.forEach((item) => item.destroy()); this.atmosphere.forEach((item) => item.destroy()); }
}
