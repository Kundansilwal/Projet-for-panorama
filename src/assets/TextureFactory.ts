import Phaser from 'phaser';

type Painter = (g: Phaser.GameObjects.Graphics) => void;

export class TextureFactory {
  static create(scene: Phaser.Scene): void {
    const paint = (key: string, width: number, height: number, painter: Painter): void => {
      if (scene.textures.exists(key)) return;
      const graphics = scene.make.graphics();
      painter(graphics);
      graphics.generateTexture(key, width, height);
      graphics.destroy();
    };

    const hero = (key: string, step: number, moving: boolean): void => paint(key, 54, 68, (g) => {
      const bob = moving ? (step === 1 ? 2 : step === 2 ? -1 : 0) : 0;
      const stride = moving ? (step === 0 ? -3 : step === 1 ? 3 : step === 2 ? 1 : -1) : 0;
      // Ground shadow, sword, and layered hakama keep the silhouette readable at game scale.
      g.fillStyle(0x1a2736, 0.32).fillEllipse(27, 61, 34, 8);
      g.lineStyle(5, 0x352936).lineBetween(37, 35 + bob, 48, 52 + bob);
      g.lineStyle(2, 0xb99865).lineBetween(38, 34 + bob, 48, 51 + bob);
      g.fillStyle(0x443242).fillRoundedRect(35, 29 + bob, 7, 23, 3);
      g.fillStyle(0x283852).fillTriangle(17, 40 + bob, 29, 38 + bob, 33, 60 + bob).fillTriangle(37, 40 + bob, 25, 38 + bob, 21, 60 + bob);
      g.fillStyle(0x18243b).fillTriangle(19, 48 + bob, 28, 45 + bob, 25 + stride, 62 + bob).fillTriangle(35, 48 + bob, 27, 45 + bob, 30 - stride, 62 + bob);
      g.fillStyle(0x6f443d).fillRoundedRect(18 + stride, 60 + bob, 11, 4, 2).fillRoundedRect(28 - stride, 60 + bob, 11, 4, 2);
      g.fillStyle(0x2f466d).fillRoundedRect(14, 24 + bob, 26, 24, 8);
      g.fillStyle(0x4e7099).fillTriangle(14, 31 + bob, 7, 45 + bob, 19, 40 + bob).fillTriangle(40, 31 + bob, 46, 45 + bob, 35, 40 + bob);
      g.fillStyle(0xb88755).fillRect(15, 39 + bob, 24, 4);
      g.fillStyle(0xe8be94).fillCircle(27, 20 + bob, 11);
      g.fillStyle(0x3b2a39).fillCircle(27, 15 + bob, 11).fillRect(16, 15 + bob, 22, 8);
      g.fillStyle(0xe1bb72).fillEllipse(27, 13 + bob, 34, 12);
      g.fillStyle(0xb4834d).fillEllipse(27, 12 + bob, 27, 8);
      g.fillStyle(0x33263a).fillRect(12, 11 + bob, 30, 3).fillCircle(27, 7 + bob, 4);
      g.fillStyle(0x332b39).fillCircle(23, 21 + bob, 1.4).fillCircle(31, 21 + bob, 1.4);
      g.lineStyle(1, 0xa36158).lineBetween(24, 27 + bob, 30, 27 + bob);
    });
    hero('hero-idle', 0, false);
    hero('hero-run-0', 0, true); hero('hero-run-1', 1, true); hero('hero-run-2', 2, true); hero('hero-run-3', 3, true);

    paint('shrine', 96, 108, (g) => {
      g.fillStyle(0x1c293b, 0.34).fillEllipse(48, 94, 88, 17);
      g.fillStyle(0x4c5266).fillRoundedRect(18, 61, 60, 25, 7);
      g.fillStyle(0x8e9ba5).fillRoundedRect(25, 55, 46, 25, 6);
      g.fillStyle(0xd2d8cb).fillRoundedRect(33, 49, 30, 20, 4);
      g.fillStyle(0x74bea4, 0.18).fillCircle(48, 36, 31);
      g.fillStyle(0x9de2b8, 0.58).fillCircle(48, 36, 22);
      g.fillStyle(0xfff4bc).fillCircle(48, 36, 13);
      g.fillStyle(0xffffff, 0.66).fillCircle(44, 31, 4);
      g.lineStyle(2, 0x3d4355).strokeRoundedRect(25, 55, 46, 25, 6);
    });
    paint('gate-yes', 132, 110, (g) => this.gate(g, 0x73c5a0, 0xd9f0b6, true));
    paint('gate-no', 132, 110, (g) => this.gate(g, 0x9f6987, 0xf0b1a3, false));
    paint('tree', 78, 118, (g) => {
      g.fillStyle(0x283344, 0.25).fillEllipse(40, 110, 55, 10);
      g.fillStyle(0x543e36).fillRoundedRect(34, 56, 13, 52, 4);
      g.fillStyle(0x755049).fillRect(39, 60, 3, 42);
      g.fillStyle(0x294f47).fillCircle(39, 41, 32).fillCircle(19, 53, 24).fillCircle(57, 55, 24);
      g.fillStyle(0x477a59).fillCircle(34, 27, 22).fillCircle(58, 47, 16).fillCircle(17, 44, 13);
      g.fillStyle(0x6b9b67, 0.7).fillCircle(28, 25, 8).fillCircle(51, 37, 7);
      // Birds in tree
      g.fillStyle(0x181e29);
      g.fillTriangle(22, 28, 24, 25, 26, 28).fillEllipse(24, 29, 6, 4);
      g.fillTriangle(48, 40, 50, 37, 52, 40).fillEllipse(50, 41, 5, 4);
    });
    paint('bamboo', 46, 126, (g) => {
      g.fillStyle(0x3e705a).fillRect(18, 13, 8, 108).fillRect(5, 33, 7, 88).fillRect(31, 4, 7, 117);
      g.fillStyle(0x6cae75).fillRect(19, 14, 3, 106).fillRect(32, 6, 3, 113);
      g.fillStyle(0x558365).fillTriangle(19, 38, 2, 28, 13, 46).fillTriangle(25, 56, 42, 43, 31, 64);
    });
    paint('rock', 78, 58, (g) => {
      g.fillStyle(0x566173).fillRoundedRect(8, 22, 63, 31, 12);
      g.fillStyle(0x82909b).fillRoundedRect(17, 12, 43, 28, 11);
      g.fillStyle(0xa4adb3).fillCircle(31, 22, 7);
    });
    paint('cloud', 188, 78, (g) => {
      g.fillStyle(0xf2f3df, 0.72).fillCircle(46, 43, 28).fillCircle(78, 29, 34).fillCircle(117, 43, 29).fillRoundedRect(30, 42, 112, 24, 12);
    });
    const paintFlower = (key: string, color: number) => paint(key, 24, 30, (g) => {
      g.fillStyle(0x437a56).fillRect(11, 13, 3, 15).fillTriangle(12, 20, 4, 16, 11, 18).fillTriangle(14, 23, 21, 18, 14, 20);
      g.fillStyle(color).fillCircle(8, 10, 5).fillCircle(16, 10, 5).fillCircle(12, 5, 5).fillCircle(12, 14, 5);
      g.fillStyle(0xffec9f).fillCircle(12, 10, 3);
    });
    paintFlower('flower-pink', 0xf1aac1);
    paintFlower('flower-blue', 0x93b5e1);
    paintFlower('flower-yellow', 0xf2d988);
    paint('lotus', 36, 26, (g) => {
      g.fillStyle(0x305c43).fillEllipse(18, 20, 32, 10);
      g.fillStyle(0x437a56).fillEllipse(18, 19, 28, 8);
      g.fillStyle(0xf1aac1).fillTriangle(18, 4, 12, 18, 24, 18);
      g.fillStyle(0xe57c9e).fillTriangle(12, 8, 6, 18, 18, 18);
      g.fillStyle(0xe57c9e).fillTriangle(24, 8, 18, 18, 30, 18);
      g.fillStyle(0xffffff, 0.8).fillTriangle(18, 7, 15, 18, 21, 18);
      g.fillStyle(0xffec9f).fillEllipse(18, 18, 8, 4);
    });
    paint('grass-tuft', 32, 24, (g) => {
      g.lineStyle(2, 0x699e6b, 0.9).lineBetween(15, 23, 5, 8).lineBetween(16, 23, 13, 4).lineBetween(17, 23, 25, 7).lineBetween(18, 23, 30, 12);
      g.lineStyle(1, 0xb1cb81, 0.55).lineBetween(16, 23, 10, 10).lineBetween(17, 23, 22, 9);
    });
    paint('lantern', 26, 46, (g) => {
      g.fillStyle(0x344052, 0.35).fillEllipse(13, 42, 22, 5);
      g.lineStyle(2, 0x5a4050).lineBetween(13, 2, 13, 11);
      g.fillStyle(0x5e4350).fillRoundedRect(5, 11, 16, 23, 4);
      g.fillStyle(0xffd989, 0.88).fillRoundedRect(8, 15, 10, 14, 2);
      g.fillStyle(0xfff3b8, 0.46).fillCircle(13, 22, 11);
      g.lineStyle(2, 0x413746).strokeRoundedRect(5, 11, 16, 23, 4);
    });
    paint('firefly', 12, 12, (g) => { g.fillStyle(0xfff6a6, 0.3).fillCircle(6, 6, 6); g.fillStyle(0xfff8b4).fillCircle(6, 6, 2); });
    paint('portrait-elder', 76, 76, (g) => this.portrait(g, 0x8ba770, 0xe9c5a3, 0xe9e1cb, 'elder'));
    paint('portrait-scout', 76, 76, (g) => this.portrait(g, 0x6f96b1, 0xf2c8a1, 0x40394b, 'scout'));
    paint('portrait-spirit', 76, 76, (g) => this.portrait(g, 0xa374a2, 0xe6b3c2, 0xeee7cf, 'spirit'));
    paint('portrait-keeper', 76, 76, (g) => this.portrait(g, 0x92725d, 0xe5b287, 0x252e45, 'keeper'));
    paint('portrait-hermit', 76, 76, (g) => this.portrait(g, 0x996f52, 0xf0c49a, 0x5b4334, 'hermit'));
    paint('portrait-builder', 76, 76, (g) => this.portrait(g, 0x729b91, 0xf3c79b, 0x342c38, 'builder'));
    paint('portrait-diver', 76, 76, (g) => this.portrait(g, 0x5a9cb5, 0xeab98c, 0x25354e, 'diver'));
    paint('portrait-weaver', 76, 76, (g) => this.portrait(g, 0xbb8293, 0xf1c5a8, 0x443247, 'weaver'));
    paint('portrait-wanderer', 76, 76, (g) => this.portrait(g, 0x7a718f, 0xe7bda5, 0x202839, 'wanderer'));
    paint('portrait-mountain', 76, 76, (g) => this.portrait(g, 0x66899d, 0xd6e3d7, 0xf7efd3, 'mountain'));

    if (!scene.anims.exists('hero-idle')) scene.anims.create({ key: 'hero-idle', frames: [{ key: 'hero-idle' }], frameRate: 1, repeat: -1 });
    if (!scene.anims.exists('hero-run')) scene.anims.create({ key: 'hero-run', frames: ['hero-run-0', 'hero-run-1', 'hero-run-2', 'hero-run-3'].map((key) => ({ key })), frameRate: 11, repeat: -1 });
  }

  private static gate(g: Phaser.GameObjects.Graphics, outer: number, light: number, yes: boolean): void {
    g.fillStyle(0x20283b, 0.35).fillEllipse(66, 96, 116, 15);
    g.fillStyle(outer).fillRoundedRect(13, 29, 106, 61, 18);
    g.fillStyle(light, 0.8).fillRoundedRect(23, 37, 86, 47, 13);
    g.fillStyle(0xffffff, 0.6).fillCircle(66, 55, 17);
    g.fillStyle(outer).fillTriangle(yes ? 57 : 75, 50, yes ? 57 : 75, 60, yes ? 76 : 56, 55);
    g.lineStyle(3, 0xe4ddbd, 0.8).strokeRoundedRect(13, 29, 106, 61, 18);
  }

  private static portrait(g: Phaser.GameObjects.Graphics, clothes: number, skin: number, hair: number, role: string): void {
    g.fillStyle(0x1d2b42).fillRoundedRect(2, 2, 72, 72, 14);
    g.fillStyle(0x718fa1, 0.25).fillCircle(18, 16, 15).fillCircle(61, 55, 19);
    g.fillStyle(clothes).fillRoundedRect(13, 47, 50, 25, 13);
    g.fillStyle(skin).fillCircle(38, 34, 21);
    g.fillStyle(hair).fillCircle(38, 27, 22).fillRect(16, 28, 44, 9);
    
    const eyeColor = 0x343142;
    const mouthColor = 0x9e5d5d;
    
    // Draw curved eyes helper
    const drawCurvedEyes = (radius: number, yOffset: number) => {
      g.lineStyle(2, eyeColor).beginPath().arc(31, 36 + yOffset, radius, Math.PI, 0).strokePath();
      g.beginPath().arc(45, 36 + yOffset, radius, Math.PI, 0).strokePath();
    };

    if (role === 'elder') {
      drawCurvedEyes(4, 1);
      g.lineStyle(2, mouthColor).beginPath().arc(38, 43, 6, 0, Math.PI).strokePath();
    } else if (role === 'scout') {
      drawCurvedEyes(5, 0);
      g.fillStyle(mouthColor).fillEllipse(38, 46, 12, 6); // open smile
    } else if (role === 'spirit') {
      g.lineStyle(2, 0x9de2b8).beginPath().arc(31, 36, 4, Math.PI, 0).strokePath();
      g.beginPath().arc(45, 36, 4, Math.PI, 0).strokePath();
      g.lineStyle(2, mouthColor).beginPath().arc(38, 44, 4, 0, Math.PI).strokePath();
    } else if (role === 'keeper') {
      drawCurvedEyes(3, 1);
      g.lineStyle(2, eyeColor).lineBetween(28, 32, 34, 34).lineBetween(48, 32, 42, 34); // happy eyebrows
      g.lineStyle(2, mouthColor).beginPath().arc(38, 44, 7, 0, Math.PI).strokePath();
    } else if (role === 'hermit') {
      drawCurvedEyes(4, 2);
      g.lineStyle(2, mouthColor).beginPath().arc(38, 42, 8, 0, Math.PI).strokePath();
    } else if (role === 'builder') {
      drawCurvedEyes(4, 0);
      g.lineStyle(3, hair).lineBetween(27, 32, 35, 31).lineBetween(49, 32, 41, 31); // raised eyebrows
      g.fillStyle(mouthColor).fillRoundedRect(32, 44, 12, 5, 2); // wide toothy smile
    } else if (role === 'diver') {
      drawCurvedEyes(5, 1);
      g.lineStyle(2, mouthColor).beginPath().arc(38, 45, 5, 0, Math.PI).strokePath();
    } else if (role === 'weaver') {
      drawCurvedEyes(4, 0);
      // eyelashes on curved eyes
      g.lineStyle(1.5, eyeColor).lineBetween(27, 35, 25, 33).lineBetween(49, 35, 51, 33);
      g.lineStyle(2, mouthColor).beginPath().arc(38, 43, 6, 0, Math.PI).strokePath();
    } else if (role === 'wanderer') {
      drawCurvedEyes(3, 1);
      g.lineStyle(2, mouthColor).beginPath().arc(38, 45, 4, 0, Math.PI).strokePath();
    } else if (role !== 'mountain') {
      drawCurvedEyes(4, 0);
      g.lineStyle(2, mouthColor).beginPath().arc(38, 44, 5, 0, Math.PI).strokePath();
    }
    if (role === 'elder') { g.fillStyle(0xece6d2).fillRect(18, 24, 40, 5).fillTriangle(29, 43, 38, 57, 47, 43); }
    if (role === 'scout') { g.fillStyle(0xc89b54).fillEllipse(38, 20, 53, 13).fillEllipse(38, 16, 35, 8); g.lineStyle(2, 0x684438).lineBetween(57, 47, 68, 28); }
    if (role === 'spirit') { g.fillStyle(0xf0e5d2).fillTriangle(20, 17, 26, 2, 31, 18).fillTriangle(45, 18, 51, 2, 56, 17); g.fillStyle(0x85547f).fillCircle(31, 36, 3).fillCircle(45, 36, 3); }
    if (role === 'keeper') { g.fillStyle(0xd49c58).fillRect(15, 33, 46, 6); g.lineStyle(2, 0x4d3644).lineBetween(18, 39, 58, 39); }
    if (role === 'hermit') { g.fillStyle(0xd8c7ad).fillTriangle(25, 40, 38, 62, 51, 40); g.lineStyle(2, 0x76594b).lineBetween(28, 45, 48, 45); }
    if (role === 'builder') { g.fillStyle(0xe0b44f).fillRect(15, 22, 46, 7); g.fillStyle(0x54434a).fillRect(52, 45, 12, 18); }
    if (role === 'diver') { g.fillStyle(0x87cad3).fillCircle(16, 50, 11).fillCircle(61, 55, 9); g.fillStyle(0x315a79).fillRect(19, 31, 38, 7); }
    if (role === 'weaver') { g.fillStyle(0xf0aac0).fillCircle(17, 21, 5).fillCircle(58, 19, 5).fillCircle(62, 27, 4); }
    if (role === 'wanderer') { g.fillStyle(0x202639, 0.65).fillTriangle(7, 62, 38, 4, 70, 62); g.fillStyle(0xe6d3ad).fillRect(23, 51, 30, 5); }
    if (role === 'mountain') { g.fillStyle(0xe8e5ce).fillRoundedRect(20, 18, 36, 35, 12); g.fillStyle(0x587c92).fillCircle(30, 34, 4).fillCircle(46, 34, 4); g.lineStyle(2, 0x49687b).lineBetween(30, 44, 46, 44); }
  }
}
