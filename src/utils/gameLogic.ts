import { WordEntry, GameSettings, GameState } from '../types';
import { buildLinkedList } from './linkedList';
import { selectWord } from './wordQueue';
import animalsData from '../data/animals.json';
import foodData from '../data/food.json';
import placesData from '../data/places.json';
import professionsData from '../data/professions.json';

export const CATEGORIES: Record<string, WordEntry[]> = {
  animals: animalsData as unknown as WordEntry[],
  food: foodData as unknown as WordEntry[],
  places: placesData as unknown as WordEntry[],
  professions: professionsData as unknown as WordEntry[],
};

export const CATEGORY_LABELS: Record<string, string> = {
  animals: 'Animals',
  food: 'Food',
  places: 'Places',
  professions: 'Professions',
};

export function shuffle<T>(arr: T[]): T[] {
  const result = [...arr];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

export function initGame(players: string[], settings: GameSettings): GameState {
  // 1. Roll everyoneImpostorChance
  const everyoneIsImposter =
    settings.everyoneImpostorChance > 0 &&
    Math.random() * 100 < settings.everyoneImpostorChance;

  // 2. Pick category (user-selected or random)
  const categoryKeys = Object.keys(CATEGORIES);
  const category =
    settings.selectedCategory !== 'random' && CATEGORIES[settings.selectedCategory]
      ? settings.selectedCategory
      : categoryKeys[Math.floor(Math.random() * categoryKeys.length)];

  // 3. Select word, avoiding recent queue
  const entry = selectWord(category, CATEGORIES[category]);
  const word = entry.word;
  const hint = entry.hint;

  // 4. Shuffle players, assign roles
  const shuffledPlayers = shuffle(players);

  let playerData: Array<{ name: string; role: 'imposter' | 'civilian'; word?: string }>;
  let allImpostors: string[];

  if (everyoneIsImposter) {
    playerData = shuffledPlayers.map((name) => ({ name, role: 'imposter' as const }));
    allImpostors = [...shuffledPlayers];
  } else {
    const impostorCount = Math.min(settings.impostorCount, shuffledPlayers.length - 1);
    const impostorSet = new Set(shuffledPlayers.slice(0, impostorCount));
    allImpostors = shuffledPlayers.slice(0, impostorCount);

    playerData = shuffledPlayers.map((name) => {
      if (impostorSet.has(name)) {
        return { name, role: 'imposter' as const };
      }
      return { name, role: 'civilian' as const, word };
    });
  }

  // 5. Build fake imposter map (only when everyone is imposter + impostors know each other)
  const fakeImpostorMap: Record<string, string[]> = {};
  if (everyoneIsImposter && settings.impostorsKnowEachOther) {
    const fakeCount = Math.min(settings.impostorCount, shuffledPlayers.length - 1);
    for (const player of shuffledPlayers) {
      const others = shuffledPlayers.filter((p) => p !== player);
      fakeImpostorMap[player] = shuffle(others).slice(0, fakeCount);
    }
  }

  // 6. Build linked list
  const headNode = buildLinkedList(playerData);

  return {
    phase: 'passing',
    currentNode: headNode,
    headNode,
    category,
    word,
    hint,
    allImpostors,
    fakeImpostorMap,
    totalPlayers: players.length,
    currentIndex: 1,
    everyoneIsImposter,
  };
}
