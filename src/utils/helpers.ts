import { v4 as uuidv4 } from 'uuid';

// Utility functions

export function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export function getRandomElement<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

export function getRandomElements<T>(array: T[], count: number): T[] {
  if (array.length === 0) return [];
  const shuffled = shuffleArray([...array]);
  return shuffled.slice(0, Math.min(count, array.length));
}

// Find visually similar kana for distractors
export function findSimilarKana(
  kanaChar: string,
  similarGroups: string[][],
  count: number = 3
): string[] {
  const group = similarGroups.find(g => g.includes(kanaChar));
  if (group) {
    return group.filter(k => k !== kanaChar).slice(0, count);
  }
  return [];
}

// Utility function for better ID generation
export function generateQuestionId(prefix: string): string {
  return `${prefix}_${uuidv4()}`;
}
