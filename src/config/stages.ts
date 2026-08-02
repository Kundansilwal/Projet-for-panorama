import type { BiomeId } from '../core/types';

export interface StageDefinition {
  id: number;
  biome: BiomeId;
  guardian: string;
  portrait: string;
  title: string;
  description: string;
  prompt: string;
  yesLabel: string;
  noLabel: string;
}

export const STAGES: readonly StageDefinition[] = [
  { id: 1, biome: 'forest', guardian: 'Mori', portrait: 'elder', title: 'The First Lantern',
    description: 'The rain does not ask who it falls upon. Will your light be as freely given?',
    prompt: 'Will you carry a stranger\'s lantern through the cedar rain?', yesLabel: 'Carry it', noLabel: 'Keep walking' },
  { id: 2, biome: 'pass', guardian: 'Rin', portrait: 'scout', title: 'A Narrow Pass',
    description: 'The summit is the same whether reached alone or together, but the journey changes entirely.',
    prompt: 'Will you wait for a slower traveller before climbing?', yesLabel: 'Wait together', noLabel: 'Climb ahead' },
  { id: 3, biome: 'bamboo', guardian: 'Kiku', portrait: 'spirit', title: 'The Listening Grove',
    description: 'Every secret whispered to the bamboo is eventually carried away by the wind.',
    prompt: 'Will you speak honestly when the bamboo repeats your thoughts?', yesLabel: 'Speak openly', noLabel: 'Stay guarded' },
  { id: 4, biome: 'cavern', guardian: 'Nami', portrait: 'keeper', title: 'The Unlit Bell',
    description: 'A silence unbroken for centuries holds a heavy peace. To break it is to call forth what sleeps below.',
    prompt: 'Will you ring a bell that may wake an old spirit?', yesLabel: 'Ring the bell', noLabel: 'Leave it silent' },
  { id: 5, biome: 'forest', guardian: 'Taro', portrait: 'hermit', title: 'The Last Ration',
    description: 'The frost takes indiscriminately. In the cold, every crumb holds the weight of tomorrow.',
    prompt: 'Will you share food before the snowline?', yesLabel: 'Share it', noLabel: 'Save it' },
  { id: 6, biome: 'pass', guardian: 'Aya', portrait: 'builder', title: 'The Echoing Bridge',
    description: 'We walk upon the mended wood of those who came before us, and leave ruins for those who follow.',
    prompt: 'Will you repair what your journey has revealed?', yesLabel: 'Mend it', noLabel: 'Pass by' },
  { id: 7, biome: 'cavern', guardian: 'Sora', portrait: 'diver', title: 'Deep Water',
    description: 'The surface reflects only the sky. To see what is buried, one must step into the dark.',
    prompt: 'Will you enter the ruins beneath the mountain spring?', yesLabel: 'Enter gently', noLabel: 'Turn back' },
  { id: 8, biome: 'bamboo', guardian: 'Hana', portrait: 'weaver', title: 'Borrowed Power',
    description: 'That which flows from the earth belongs to no one, though many reach their hands into the current.',
    prompt: 'Will you take power from a sacred waterfall?', yesLabel: 'Borrow it', noLabel: 'Protect it' },
  { id: 9, biome: 'pass', guardian: 'Yoru', portrait: 'wanderer', title: 'Your Shadow',
    description: 'A silhouette cast by the dying sun. It wears the shape of every door you opened, and every door you closed.',
    prompt: 'Will you face the silhouette that knows your every choice?', yesLabel: 'Face it', noLabel: 'Walk on' },
  { id: 10, biome: 'summit', guardian: 'The Mountain', portrait: 'mountain', title: 'The Quiet Summit',
    description: 'The wind above the clouds carries a single, endless note. It waits only for a harmony to complete it.',
    prompt: 'Will you join your voice to the island\'s sleeping song?', yesLabel: 'Join the song', noLabel: 'Keep your voice' }
];

export const stageFor = (id: number): StageDefinition => STAGES[Math.min(Math.max(id, 1), 10) - 1];
