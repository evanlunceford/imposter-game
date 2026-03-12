import { GameSettings } from '../types';

const KEY = 'imposter_last_game';

interface LastGame {
  players: string[];
  settings: GameSettings;
}

export function loadLastGame(): LastGame | null {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    return JSON.parse(raw) as LastGame;
  } catch {
    return null;
  }
}

export function saveLastGame(players: string[], settings: GameSettings): void {
  try {
    localStorage.setItem(KEY, JSON.stringify({ players, settings }));
  } catch {
    // ignore
  }
}
