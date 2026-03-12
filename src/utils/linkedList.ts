import { PlayerNode } from '../types';

export function buildLinkedList(
  players: Array<{ name: string; role: 'imposter' | 'civilian'; word?: string }>
): PlayerNode | null {
  if (players.length === 0) return null;

  const head: PlayerNode = {
    name: players[0].name,
    role: players[0].role,
    word: players[0].word,
    next: null,
  };

  let current = head;
  for (let i = 1; i < players.length; i++) {
    const node: PlayerNode = {
      name: players[i].name,
      role: players[i].role,
      word: players[i].word,
      next: null,
    };
    current.next = node;
    current = node;
  }

  return head;
}
