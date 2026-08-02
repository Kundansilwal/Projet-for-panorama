import Phaser from 'phaser';
import { BootScene } from '../scenes/BootScene';
import { TitleScene } from '../scenes/TitleScene';
import { JourneyScene } from '../scenes/JourneyScene';
import { UIScene } from '../scenes/UIScene';
import { WaterRipplePipeline } from '../shaders/WaterRipplePipeline';

import { LeaderboardScene } from '../scenes/LeaderboardScene';

export const gameConfig: Phaser.Types.Core.GameConfig = {
  type: Phaser.WEBGL,
  parent: 'app',
  width: 960,
  height: 640,
  backgroundColor: '#182a35',
  pixelArt: false,
  render: { antialias: true, roundPixels: true, powerPreference: 'high-performance' },
  dom: { createContainer: true },
  pipeline: { WaterRipplePipeline: WaterRipplePipeline as unknown as typeof Phaser.Renderer.WebGL.WebGLPipeline },
  physics: {
    default: 'arcade',
    arcade: { gravity: { x: 0, y: 0 }, debug: false }
  },
  scale: { mode: Phaser.Scale.FIT, autoCenter: Phaser.Scale.CENTER_BOTH },
  scene: [BootScene, TitleScene, JourneyScene, LeaderboardScene, UIScene]
};
