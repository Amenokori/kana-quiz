import { shuffleArray } from './helpers';

// Levenshtein distance for string similarity
export function levenshtein(a: string, b: string): number {
  if (a.length === 0) return b.length;
  if (b.length === 0) return a.length;

  const matrix = [];

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
  count: number = 3,
  similarityFn?: (a: string, b: string) => number
): string[] {
  if (allOptions.length === 0) return [];

  let distractors = allOptions.filter(option => option !== correctAnswer);

  if (similarityFn) {
    distractors.sort((a, b) => similarityFn(correctAnswer, b) - similarityFn(correctAnswer, a));
  } else {
    // Shuffle if no similarity function is provided to maintain randomness
    distractors = shuffleArray(distractors);
  }

  return distractors.slice(0, count);
}
