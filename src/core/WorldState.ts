import type { Choice, ChoiceRecord, SaveData, TravelerRecord } from './types';

const SAVE_KEY = 'personality-quiz-world-v2';
const SETTINGS_KEY = 'personality-quiz-settings';

export class WorldState {
  private history: ChoiceRecord[] = [];
  private currentStage = 1;
  musicEnabled = true;
  sfxEnabled = true;

  load(): void {
    try {
      const raw = localStorage.getItem(SAVE_KEY);
      if (raw) {
        const save = JSON.parse(raw) as SaveData;
        if (save.version === 2 && Array.isArray(save.choices) && save.stage >= 1 && save.stage <= 10) {
          this.history = save.choices.filter((item): item is ChoiceRecord =>
            Number.isInteger(item.stage) && item.stage >= 1 && item.stage <= 10 && (item.value === 'YES' || item.value === 'NO'));
          this.currentStage = save.stage;
        }
      }
    } catch { this.history = []; this.currentStage = 1; }
    try {
      const settings = localStorage.getItem(SETTINGS_KEY);
      if (settings) {
        const parsed = JSON.parse(settings) as { music?: boolean; sfx?: boolean };
        if (typeof parsed.music === 'boolean') this.musicEnabled = parsed.music;
        if (typeof parsed.sfx === 'boolean') this.sfxEnabled = parsed.sfx;
      }
    } catch { /* use defaults */ }
  }

  save(): void {
    const data: SaveData = { version: 2, choices: this.history, stage: this.currentStage };
    try { localStorage.setItem(SAVE_KEY, JSON.stringify(data)); } catch { /* private browsing can reject persistence */ }
  }

  saveSettings(): void {
    try { localStorage.setItem(SETTINGS_KEY, JSON.stringify({ music: this.musicEnabled, sfx: this.sfxEnabled })); } catch { /* ok */ }
  }

  loadLeaderboard(): TravelerRecord[] {
    try {
      const raw = localStorage.getItem('personality-quiz-leaderboard');
      if (raw) {
        const data = JSON.parse(raw);
        if (data && data.version === 1 && Array.isArray(data.travelers)) {
          return data.travelers;
        }
      }
    } catch { /* ignore */ }
    
    // Default mysterious travelers for atmosphere if local leaderboard is empty
    return [
      { name: 'Elias', title: 'The Seeker', date: Date.now() - 86400000 * 42 },
      { name: 'Rowan', title: 'The Harmonizer', date: Date.now() - 86400000 * 15 },
      { name: 'Kael', title: 'The Lone Wolf', date: Date.now() - 86400000 * 3 },
    ];
  }

  saveToLeaderboard(name: string, title: string): void {
    const travelers = this.loadLeaderboard();
    travelers.unshift({ name, title, date: Date.now() });
    try {
      localStorage.setItem('personality-quiz-leaderboard', JSON.stringify({ version: 1, travelers }));
    } catch { /* ignore */ }
  }

  toggleMusic(): boolean { this.musicEnabled = !this.musicEnabled; this.saveSettings(); return this.musicEnabled; }
  toggleSfx(): boolean { this.sfxEnabled = !this.sfxEnabled; this.saveSettings(); return this.sfxEnabled; }

  reset(): void { this.history = []; this.currentStage = 1; this.save(); }
  get stage(): number { return this.currentStage; }
  get choices(): readonly ChoiceRecord[] { return this.history; }
  get complete(): boolean { return this.currentStage > 10; }
  choiceFor(stage: number): Choice | undefined { return this.history.find((item) => item.stage === stage)?.value; }
  tension(): number { return this.history.filter((item) => item.value === 'NO').length / Math.max(1, this.history.length); }

  lockChoice(choice: Choice): void {
    if (this.complete || this.choiceFor(this.currentStage)) return;
    this.history.push({ stage: this.currentStage, value: choice, at: Date.now() });
    this.currentStage += 1;
    this.save();
  }

  /** World geometry stays constant; these flags make earlier choices echo forward. */
  echo(): { bridge: 'repaired' | 'ruined'; spirit: 'awake' | 'asleep'; warmth: number } {
    return {
      bridge: this.choiceFor(1) === 'YES' ? 'repaired' : 'ruined',
      spirit: this.choiceFor(4) === 'YES' ? 'awake' : 'asleep',
      warmth: this.history.filter((item) => item.value === 'YES').length / 10
    };
  }
}
