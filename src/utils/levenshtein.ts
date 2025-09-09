import { isRomaji, toRomaji } from 'wanakana';
import { shuffleArray } from './helpers';

// Levenshtein distance for string similarity
export function levenshtein(a: string, b: string): number {
  // Input validation
  if (typeof a !== 'string' || typeof b !== 'string') {
    throw new Error('Both arguments must be strings');
  }

  if (a.length === 0) return b.length;
  if (b.length === 0) return a.length;

  const matrix: number[][] = [];

  for (let i = 0; i <= b.length; i++) {
    matrix[i] = [i];
  }

  for (let j = 0; j <= a.length; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        );
      }
    }
  }

  return matrix[b.length][a.length];
}

export function generateDistractors(
  correctAnswer: string,
  allOptions: string[],
  count: number = 2,
  similarityFn?: (a: string, b: string) => number
): string[] {
  if (allOptions.length === 0) return [];

  const distractors = allOptions.filter(option => option !== correctAnswer);

  // If we don't have enough distractors, return what we have
  if (distractors.length <= count) {
    return shuffleArray(distractors);
  }

  // Check if correctAnswer is romaji, if not convert it
  const comparisonAnswer = isRomaji(correctAnswer) ? correctAnswer : toRomaji(correctAnswer);

  // Use levenshtein by default to find the most similar options
  const similarity = similarityFn || levenshtein;

  // Sort distractors by similarity, converting to romaji if needed for comparison
  distractors.sort((a, b) => {
    const aComparison = isRomaji(a) ? a : toRomaji(a);
    const bComparison = isRomaji(b) ? b : toRomaji(b);

    return similarity(comparisonAnswer, aComparison) - similarity(comparisonAnswer, bComparison);
  });

  return distractors.slice(0, count);
}
