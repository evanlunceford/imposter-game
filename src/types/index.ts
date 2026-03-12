export interface WordEntry {
  word: string;
  hint: string;
}

export interface PlayerNode {
  name: string;
  role: 'imposter' | 'civilian';
  word?: string;           // undefined for imposters
  next: PlayerNode | null;
}

export interface GameSettings {
  impostorCount: number;
  impostorsKnowEachOther: boolean;
  everyoneImpostorChance: number;
  impostorsGetHint: boolean;
  selectedCategory: string; // 'random' or a category key
}

export type GamePhase = 'setup' | 'passing' | 'reveal' | 'done';

export interface GameState {
  phase: GamePhase;
  currentNode: PlayerNode | null;
  headNode: PlayerNode | null;
  category: string;
  word: string;
  hint: string;
  allImpostors: string[];
  totalPlayers: number;
  currentIndex: number;
  everyoneIsImposter: boolean;
  // Only populated when everyoneIsImposter && impostorsKnowEachOther.
  // Maps each player to a random subset of other players shown as their "fellow imposters".
  fakeImpostorMap: Record<string, string[]>;
}
