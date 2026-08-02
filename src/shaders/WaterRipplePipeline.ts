import Phaser from 'phaser';

/** Subtle WebGL distortion used by the ground layer; safe to remove for Canvas-only ports. */
export class WaterRipplePipeline extends Phaser.Renderer.WebGL.Pipelines.SinglePipeline {
  constructor(game: Phaser.Game) {
    super({
      game,
      name: 'WaterRipplePipeline',
      fragShader: `
precision mediump float;
uniform sampler2D uMainSampler;
uniform float uTime;
varying vec2 outTexCoord;
varying vec4 outTint;
void main() {
  vec2 uv = outTexCoord;
  uv.x += sin(uv.y * 24.0 + uTime * 1.35) * 0.0022;
  vec4 color = texture2D(uMainSampler, uv);
  gl_FragColor = color * outTint;
}`
    });
  }

  onPreRender(): void { this.set1f('uTime', this.game.loop.time / 1000); }
}
