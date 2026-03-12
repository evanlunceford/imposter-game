import { WordEntry } from '../types';

const STORAGE_KEY = 'imposter_word_queue';
const MAX_QUEUE_SIZE = 10;

type WordQueueStore = Record<string, string[]>;

function loadStore(): WordQueueStore {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    return JSON.parse(raw) as WordQueueStore;
  } catch {
    return {};
  }
}

function saveStore(store: WordQueueStore): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
  } catch {
    // localStorage may be unavailable; silently ignore
  }
}

export function getRecentWords(category: string): string[] {
  const store = loadStore();
  return store[category] ?? [];
}

export function addToQueue(category: string, word: string): void {
  const store = loadStore();
  const queue = store[category] ?? [];
  queue.push(word);
  if (queue.length > MAX_QUEUE_SIZE) {
    queue.splice(0, queue.length - MAX_QUEUE_SIZE);
  }
  store[category] = queue;
  saveStore(store);
}

export function selectWord(category: string, entries: WordEntry[]): WordEntry {
  const recent = getRecentWords(category);
  const available = entries.filter((e) => !recent.includes(e.word));
  const pool = available.length > 0 ? available : entries;
  const chosen = pool[Math.floor(Math.random() * pool.length)];
  addToQueue(category, chosen.word);
  return chosen;
}
