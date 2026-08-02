import type { BiomeId } from '../core/types';

export interface StageDefinition {
  id: number;
  biome: BiomeId;
  guardian: string;
  portrait: string;
  title: string;
  prompt: string;
  yesLabel: string;
  noLabel: string;
}

export const STAGES: readonly StageDefinition[] = [
  { id: 1, biome: 'forest', guardian: 'Mori', portrait: 'elder', title: 'The First Lantern', prompt: 'Will you carry a stranger’s lantern through the cedar rain?', yesLabel: 'Carry it', noLabel: 'Keep walking' },
  { id: 2, biome: 'pass', guardian: 'Rin', portrait: 'scout', title: 'A Narrow Pass', prompt: 'Will you wait for a slower traveller before climbing?', yesLabel: 'Wait together', noLabel: 'Climb ahead' },
  { id: 3, biome: 'bamboo', guardian: 'Kiku', portrait: 'spirit', title: 'The Listening Grove', prompt: 'Will you speak honestly when the bamboo repeats your thoughts?', yesLabel: 'Speak openly', noLabel: 'Stay guarded' },
  { id: 4, biome: 'cavern', guardian: 'Nami', portrait: 'keeper', title: 'The Unlit Bell', prompt: 'Will you ring a bell that may wake an old spirit?', yesLabel: 'Ring the bell', noLabel: 'Leave it silent' },
  { id: 5, biome: 'forest', guardian: 'Taro', portrait: 'hermit', title: 'The Last Ration', prompt: 'Will you share food before the snowline?', yesLabel: 'Share it', noLabel: 'Save it' },
  { id: 6, biome: 'pass', guardian: 'Aya', portrait: 'builder', title: 'The Echoing Bridge', prompt: 'Will you repair what your journey has revealed?', yesLabel: 'Mend it', noLabel: 'Pass by' },
  { id: 7, biome: 'cavern', guardian: 'Sora', portrait: 'diver', title: 'Deep Water', prompt: 'Will you enter the ruins beneath the mountain spring?', yesLabel: 'Enter gently', noLabel: 'Turn back' },
  { id: 8, biome: 'bamboo', guardian: 'Hana', portrait: 'weaver', title: 'Borrowed Power', prompt: 'Will you take power from a sacred waterfall?', yesLabel: 'Borrow it', noLabel: 'Protect it' },
  { id: 9, biome: 'pass', guardian: 'Yoru', portrait: 'wanderer', title: 'Your Shadow', prompt: 'Will you face the silhouette that knows your every choice?', yesLabel: 'Face it', noLabel: 'Walk on' },
  { id: 10, biome: 'summit', guardian: 'The Mountain', portrait: 'mountain', title: 'The Quiet Summit', prompt: 'Will you join your voice to the island’s sleeping song?', yesLabel: 'Join the song', noLabel: 'Keep your voice' }
];

export const stageFor = (id: number): StageDefinition => STAGES[Math.min(Math.max(id, 1), 10) - 1];
