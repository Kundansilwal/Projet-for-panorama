import Phaser from 'phaser';
import { eventBus } from '../core/EventBus';
import type { Choice } from '../core/types';
import { Player } from '../entities/Player';
import { stageFor } from '../config/stages';
import { AudioDirector } from '../systems/AudioDirector';
import { TreadmillMap } from '../systems/TreadmillMap';
import { WeatherSystem } from '../systems/WeatherSystem';
import { worldState } from '../state/session';

export class JourneyScene extends Phaser.Scene {
  private player!: Player;
  private map!: TreadmillMap;
  private weather!: WeatherSystem;
  private readonly audio = new AudioDirector();
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private movement!: Record<'up' | 'down' | 'left' | 'right', Phaser.Input.Keyboard.Key>;
  private interact!: Phaser.Input.Keyboard.Key;
  private reset!: Phaser.Input.Keyboard.Key;
  private gatesOpen = false;
  private transitioning = false;
  private lastHint = '';

  constructor() { super('Journey'); }

  create(): void {
    this.physics.world.setBounds(18, 16, 924, 610);
    this.map = new TreadmillMap(this, worldState);
    this.player = new Player(this, 480, 550);
    this.weather = new WeatherSystem(this);
    this.weather.setStage(worldState.stage);
    this.cameras.main.setBounds(0, 0, 960, 640).setDeadzone(130, 100).setZoom(1.04);
    this.cameras.main.startFollow(this.player, true, 0.09, 0.09);
    this.cameras.main.fadeIn(500, 12, 19, 30);

    this.cursors = this.input.keyboard!.createCursorKeys();
    const keyboard = this.input.keyboard!;
    this.movement = { up: keyboard.addKey('W'), down: keyboard.addKey('S'), left: keyboard.addKey('A'), right: keyboard.addKey('D') };
    this.interact = keyboard.addKey('E'); this.reset = keyboard.addKey('R');
    this.physics.add.overlap(this.player, this.map.interactZone, () => this.showHint('E  •  listen at the shrine'));
    this.map.choiceGates.forEach((gate) => this.physics.add.overlap(this.player, gate.zone, () => this.commitChoice(gate.choice)));
    this.refreshStage(false);
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, this.shutdown, this);
  }

  update(): void {
    if (Phaser.Input.Keyboard.JustDown(this.reset) && !this.transitioning) {
      worldState.reset(); this.player.setPosition(480, 550); this.refreshStage(true); 
      eventBus.emit('personality:hide');
      return;
    }
    this.player.move(this.cursors, this.movement, this.input.activePointer);
    
    // Boundary constraints to keep player on the path
    let py = Phaser.Math.Clamp(this.player.y, this.gatesOpen ? 215 : 230, 620);
    this.player.setY(py);

    let minX = 425;
    let maxX = 535;
    if (py > 240) {
      const t = (py - 240) / 400;
      minX = 425 - t * 27;
      maxX = 535 + t * 27;
    } else if (this.gatesOpen) {
      // Player is in the horizontal corridor zone — allow full width
      minX = 210;
      maxX = 750;
    }
    this.player.setX(Phaser.Math.Clamp(this.player.x, minX, maxX));

    const camera = this.cameras.main;
    camera.setFollowOffset(Phaser.Math.Clamp(this.player.body!.velocity.x * 0.08, -18, 18), Phaser.Math.Clamp(this.player.body!.velocity.y * 0.045, -12, 12));

    // Handle interact via keyboard or if tapping the shrine zone directly
    let pointerInteract = false;
    if (this.input.activePointer.isDown && this.nearShrine()) {
      // Check if tap was roughly on the shrine
      const px = this.input.activePointer.worldX;
      const py = this.input.activePointer.worldY;
      if (Math.abs(px - 480) < 60 && Math.abs(py - 265) < 60) pointerInteract = true;
    }

    if (Phaser.Input.Keyboard.JustDown(this.interact) || pointerInteract) {
      this.audio.unlock();
      if (this.nearShrine() && !this.gatesOpen && !this.transitioning) this.openChoice();
    }
    if (!this.nearShrine() && !this.gatesOpen && !this.transitioning) this.showHint('Find the moonlit shrine ahead');
    if (this.gatesOpen) this.showHint('Walk or tap through a gate to make this choice yours');
  }

  private nearShrine(): boolean { return Phaser.Math.Distance.Between(this.player.x, this.player.y, 480, 265) < 88; }

  private openChoice(): void {
    this.gatesOpen = true;
    this.map.setGatesVisible(true);
    this.audio.playSfx('shrine');
    const stage = this.map.currentStage;
    eventBus.emit('choice:opened', { stage: stage.id });
    eventBus.emit('dialogue:show', { speaker: `${stage.guardian}  •  ${stage.title}`, portrait: stage.portrait, text: stage.prompt, persistent: true });
    this.cameras.main.zoomTo(1.14, 450, 'Sine.easeInOut');
    this.time.delayedCall(300, () => this.audio.playSfx('gate-open'));
  }

  private commitChoice(choice: Choice): void {
    if (!this.gatesOpen || this.transitioning) return;
    this.transitioning = true;
    this.player.setControl(false);
    this.audio.playSfx('gate-choose');
    const completedStage = worldState.stage;
    eventBus.emit('choice:locked', { stage: completedStage, choice });
    eventBus.emit('dialogue:show', { speaker: choice === 'YES' ? 'The warm gate opens' : 'The quiet gate opens', portrait: this.map.currentStage.portrait, text: choice === 'YES' ? 'Your courage becomes a small light on the path.' : 'Your boundary becomes a small shelter on the path.', persistent: true });
    
    // Wait 2.5 seconds to let the player read the consequence text before fading out
    this.time.delayedCall(2500, () => {
      this.cameras.main.fadeOut(620, 226, 239, 230);
      this.time.delayedCall(640, () => {
        worldState.lockChoice(choice);
        if (worldState.complete) { this.showEnding(); return; }
        this.audio.playSfx('transition');
        this.player.setPosition(480, 550);
        this.refreshStage(false);
        this.cameras.main.fadeIn(620, 226, 239, 230);
        this.time.delayedCall(700, () => { this.player.setControl(true); this.transitioning = false; });
      });
    });
  }

  private refreshStage(announce: boolean): void {
    this.gatesOpen = false; this.map.rebuild(); this.weather.setStage(worldState.stage);
    const stage = stageFor(worldState.stage);
    this.audio.crossfade(stage.biome, worldState.tension());
    eventBus.emit('audio:biome', { biome: stage.biome, tension: worldState.tension() });
    eventBus.emit('world:changed', { stage: worldState.stage }); eventBus.emit('hud:refresh');
    this.cameras.main.zoomTo(1.04, 460, 'Sine.easeOut');
    if (announce) {
      eventBus.emit('dialogue:show', { speaker: 'The mountain remembers', portrait: stage.portrait, text: `Your journey returns to ${stage.title}.` });
    } else {
      // Show stage title first, then the description about what the stage signifies
      eventBus.emit('dialogue:show', { speaker: `Stage ${stage.id}  ·  ${stage.title}`, portrait: stage.portrait, text: stage.description });
    }
  }

  private showEnding(): void {
    this.map.setGatesVisible(false);
    const isYes = (id: number) => worldState.choiceFor(id) === 'YES';
    const empathy = (isYes(1)?1:0) + (isYes(2)?1:0) + (isYes(5)?1:0) + (isYes(6)?1:0);
    const courage = (isYes(4)?1:0) + (isYes(7)?1:0) + (isYes(9)?1:0);
    const openness = (isYes(3)?1:0) + (isYes(10)?1:0);
    const ambition = isYes(8) ? 1 : 0;
    
    let title = '';
    let desc = '';
    
    if (empathy >= 3 && openness === 2) {
      title = 'The Luminary'; desc = 'You possess a radiant and open-hearted spirit. By freely sharing your light and warmth with others, you illuminate the darkest paths. Your journey is defined by deep empathy and an unwavering willingness to remain vulnerable.';
    } else if (empathy >= 3 && openness === 0) {
      title = 'The Silent Guardian'; desc = 'You protect others fiercely while keeping your own heart shielded. Though your compassion runs deep, you understand that strength often requires boundaries. You are the dependable watcher in the night.';
    } else if (courage >= 2 && ambition === 1) {
      title = 'The Pioneer'; desc = 'Bold, ambitious, and unyielding, you dive into the unknown to claim its power. You view challenges not as threats, but as opportunities for growth, forging new trails and defying quiet boundaries.';
    } else if (courage <= 1 && ambition === 0 && empathy <= 2) {
      title = 'The Wise Ascetic'; desc = 'Cautious and deeply reverent, you observe the world without disturbing its peace. You understand that not every bell must be rung, finding harmony by leaving the world exactly as you found it.';
    } else if (empathy <= 1 && openness === 0) {
      title = 'The Lone Wolf'; desc = 'Perfectly self-reliant, you walk your path wrapped in quiet independence. You rely entirely on your own strength, carefully guarding your energy and protecting your peace. The summit is yours alone.';
    } else if (empathy <= 1 && courage >= 2) {
      title = 'The Maverick'; desc = 'Fiercely independent and undeniably bold, you forge your own daring trail. You refuse to be weighed down by the expectations of others, yet you never shy away from the deepest waters or the darkest shadows.';
    } else if (empathy >= 3 && courage <= 1) {
      title = 'The Steadfast Friend'; desc = 'Reliable, generous, and grounding, you prioritize the safety and warmth of those around you above the thrill of the unknown. You are the anchor in the storm, proving that true courage lies in care.';
    } else if (openness === 2 && courage >= 2) {
      title = 'The Seeker'; desc = 'Deeply curious and profoundly open, you embrace the world\'s deepest mysteries head-on. Whether speaking to the bamboo or facing your own shadow, your journey is a relentless pursuit of truth.';
    } else if (empathy === 2 && openness === 0) {
      title = 'The Stoic'; desc = 'Calm and measured, you maintain your boundaries with quiet, unassuming strength. You know exactly when to give and when to hold back, navigating the world\'s demands without ever losing your center.';
    } else if (ambition === 0 && openness === 2) {
      title = 'The Harmonizer'; desc = 'Reverent and highly expressive, you seek to gently blend your voice with nature rather than dominate it. You walk in true alignment with the spirits of the mountain, open to the world\'s songs.';
    } else {
      title = 'The Balanced Wanderer'; desc = 'Walking the middle path, you carry both courage and caution in equal measure. Your journey is defined by adaptability, leaving you perfectly attuned to both the needs of others and the preservation of your own soul.';
    }
                 
    this.cameras.main.fadeIn(700, 226, 239, 230);
    eventBus.emit('world:changed', { stage: 10 }); eventBus.emit('hud:refresh');
    eventBus.emit('dialogue:hide');
    eventBus.emit('personality:show', { title, desc });
    this.audio.playSfx('ending');
    
    // Do not give control back to player, but allow resetting
    this.time.delayedCall(760, () => { this.transitioning = false; });
  }

  private showHint(message: string): void {
    if (message === this.lastHint) return;
    this.lastHint = message; this.registry.set('hint', message); eventBus.emit('hud:refresh');
  }

  private shutdown(): void { this.audio.dispose(); this.weather.destroy(); this.map.destroy(); }
}
