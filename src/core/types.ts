export type Choice = 'YES' | 'NO';
export type BiomeId = 'forest' | 'pass' | 'bamboo' | 'cavern' | 'summit';
export type SfxType = 'click' | 'shrine' | 'gate-open' | 'gate-choose' | 'transition' | 'ending';

export interface ChoiceRecord {
  stage: number;
  value: Choice;
  at: number;
}

export interface SaveData {
  version: 2;
  choices: ChoiceRecord[];
  stage: number;
}

export interface GameEvents {
  'world:changed': [{ stage: number; choice?: Choice }];
  'choice:opened': [{ stage: number }];
  'choice:locked': [{ stage: number; choice: Choice }];
  'dialogue:show': [{ speaker: string; portrait: string; text: string; persistent?: boolean }];
  'dialogue:hide': [];
  'audio:biome': [{ biome: BiomeId; tension: number }];
  'hud:refresh': [];
  'personality:show': [{ title: string; desc: string }];
  'personality:hide': [];
  'sfx:play': [{ type: SfxType }];
}
