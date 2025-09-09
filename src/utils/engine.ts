import { toHiragana, toKatakana, toRomaji } from 'wanakana';
import { japaneseCities } from '../data/cities';
import {
  basicHiragana,
  basicKatakana,
  dakutenHiragana,
  dakutenKatakana,
  extendedKatakana,
  similarHiragana,
  similarKatakana,
  yoonHiragana,
  yoonKatakana,
} from '../data/kana';
import { japaneseNames } from '../data/names';
import { generateQuestionId, getRandomElement, shuffleArray } from './helpers';
import { generateDistractors } from './levenshtein';

// Question Types
export const QUESTION_TYPES = {
  // Beginner
  HIRAGANA_TO_ROMAJI: 'hiragana_to_romaji',
  KATAKANA_TO_ROMAJI: 'katakana_to_romaji',
  ROMAJI_TO_HIRAGANA: 'romaji_to_hiragana',
  ROMAJI_TO_KATAKANA: 'romaji_to_katakana',
  // Intermediate
  HIRAGANA_TO_KATAKANA: 'hiragana_to_katakana',
  KATAKANA_TO_HIRAGANA: 'katakana_to_hiragana',
  SIMILAR_HIRAGANA_ROMAJI_READING: 'similar_hiragana_romaji_reading',
  SIMILAR_KATAKANA_ROMAJI_READING: 'similar_katakana_romaji_reading',
  // Advanced
  SIMILAR_HIRAGANA_KATAKANA_READING: 'similar_hiragana_katakana_reading',
  SIMILAR_KATAKANA_HIRAGANA_READING: 'similar_katakana_hiragana_reading',
  WRITE_IN_HIRAGANA: 'write_in_hiragana',
  WRITE_IN_KATAKANA: 'write_in_katakana',
} as const;

export type QuestionType = (typeof QUESTION_TYPES)[keyof typeof QUESTION_TYPES];
export type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced';

export interface QuizQuestion {
  id: string;
  question: string;
  correctAnswer: string;
  options: string[];
}

// Question Generation Functions

// Shared function for kana to romaji questions
function generateKanaToRomajiQuestion(kanaSet: string[], questionType: QuestionType): QuizQuestion {
  const romaji = kanaSet.map(k => toRomaji(k));

  const pick = getRandomElement(kanaSet);
  const correctAnswer = toRomaji(pick);
  const distractors = generateDistractors(correctAnswer, romaji);

  return {
    id: generateQuestionId(questionType),
    question: `What is the romaji reading of: ${pick}`,
    correctAnswer,
    options: shuffleArray([correctAnswer, ...distractors]),
  };
}

function generateHiraganaToRomajiQuestion(): QuizQuestion {
  const kana = [...basicHiragana, ...dakutenHiragana];
  return generateKanaToRomajiQuestion(kana, QUESTION_TYPES.HIRAGANA_TO_ROMAJI);
}

function generateKatakanaToRomajiQuestion(): QuizQuestion {
  const kana = [...basicKatakana, ...dakutenKatakana];
  return generateKanaToRomajiQuestion(kana, QUESTION_TYPES.KATAKANA_TO_ROMAJI);
}

// Shared function for romaji to kana questions
function generateRomajiToKanaQuestion(
  kanaSet: string[],
  questionType: QuestionType,
  targetScript: 'hiragana' | 'katakana',
  converter: (romaji: string) => string
): QuizQuestion {
  const romaji = kanaSet.map(k => toRomaji(k));

  const pick = getRandomElement(romaji);
  const correctAnswer = converter(pick);
  const distractors = generateDistractors(correctAnswer, kanaSet);

  return {
    id: generateQuestionId(questionType),
    question: `What is the ${targetScript} writing of: ${pick}`,
    correctAnswer,
    options: shuffleArray([correctAnswer, ...distractors]),
  };
}

function generateRomajiToHiraganaQuestion(): QuizQuestion {
  const kana = [...basicHiragana, ...dakutenHiragana];
  return generateRomajiToKanaQuestion(
    kana,
    QUESTION_TYPES.ROMAJI_TO_HIRAGANA,
    'hiragana',
    toHiragana
  );
}

function generateRomajiToKatakanaQuestion(): QuizQuestion {
  const kana = [...basicKatakana, ...dakutenKatakana];
  return generateRomajiToKanaQuestion(
    kana,
    QUESTION_TYPES.ROMAJI_TO_KATAKANA,
    'katakana',
    toKatakana
  );
}

function generateHiraganaToKatakanaQuestion(): QuizQuestion {
  const hiraganaSet = [...dakutenHiragana, ...yoonHiragana];
  const katakanaSet = [...dakutenKatakana, ...yoonKatakana, ...extendedKatakana];

  const pick = getRandomElement(hiraganaSet);
  const correctAnswer = toKatakana(pick);
  const distractors = generateDistractors(correctAnswer, katakanaSet);

  return {
    id: generateQuestionId(QUESTION_TYPES.HIRAGANA_TO_KATAKANA),
    question: `What is the katakana equivalent of: ${pick}`,
    correctAnswer,
    options: shuffleArray([correctAnswer, ...distractors]),
  };
}

function generateKatakanaToHiraganaQuestion(): QuizQuestion {
  const hiraganaSet = [...dakutenHiragana, ...yoonHiragana];
  const katakanaSet = [...dakutenKatakana, ...yoonKatakana, ...extendedKatakana];

  const pick = getRandomElement(katakanaSet);
  const correctAnswer = toHiragana(pick);
  const distractors = generateDistractors(correctAnswer, hiraganaSet);

  return {
    id: generateQuestionId(QUESTION_TYPES.KATAKANA_TO_HIRAGANA),
    question: `What is the hiragana equivalent of: ${pick}`,
    correctAnswer,
    options: shuffleArray([correctAnswer, ...distractors]),
  };
}

// Shared function for similar character sequence questions
function generateSimilarCharacterSequenceQuestion(
  similarGroups: string[][],
  questionType: QuestionType,
  questionFormat: string,
  converter: (char: string) => string
): QuizQuestion {
  // Pick a random group of similar characters
  const similarGroup = getRandomElement(similarGroups);

  // Shuffle the characters in the group
  const shuffledGroup = shuffleArray([...similarGroup]);

  // Generate the correct answer (converted sequence)
  const correctAnswer = shuffledGroup.map(char => converter(char)).join(' ');

  // Generate distractors by shuffling the group multiple times
  const distractors: string[] = [];
  const maxAttempts = similarGroup.length * 3; // Use group size as base for attempts

  for (let i = 0; i < maxAttempts && distractors.length < 2; i++) {
    const shuffledVariant = shuffleArray([...shuffledGroup]);
    const distractor = shuffledVariant.map(char => converter(char)).join(' ');
    if (distractor !== correctAnswer && !distractors.includes(distractor)) {
      distractors.push(distractor);
    }
  }

  return {
    id: generateQuestionId(questionType),
    question: `${questionFormat}: ${shuffledGroup.join(' ')}`,
    correctAnswer,
    options: shuffleArray([correctAnswer, ...distractors]),
  };
}

function generateSimilarHiraganaRomajiQuestion(): QuizQuestion {
  return generateSimilarCharacterSequenceQuestion(
    similarHiragana,
    QUESTION_TYPES.SIMILAR_HIRAGANA_ROMAJI_READING,
    'Read this in romaji',
    toRomaji
  );
}

function generateSimilarHiraganaKatakanaQuestion(): QuizQuestion {
  return generateSimilarCharacterSequenceQuestion(
    similarHiragana,
    QUESTION_TYPES.SIMILAR_HIRAGANA_KATAKANA_READING,
    'Read this in katakana',
    toKatakana
  );
}

function generateSimilarKatakanaRomajiQuestion(): QuizQuestion {
  return generateSimilarCharacterSequenceQuestion(
    similarKatakana,
    QUESTION_TYPES.SIMILAR_KATAKANA_ROMAJI_READING,
    'Read this in romaji',
    toRomaji
  );
}

function generateSimilarKatakanaHiraganaQuestion(): QuizQuestion {
  return generateSimilarCharacterSequenceQuestion(
    similarKatakana,
    QUESTION_TYPES.SIMILAR_KATAKANA_HIRAGANA_READING,
    'Read this in hiragana',
    toHiragana
  );
}

// Shared function for writing Japanese words in different scripts
function generateWriteInScriptQuestion(
  questionType: QuestionType,
  inputScript: 'hiragana' | 'katakana',
  targetScript: 'hiragana' | 'katakana'
): QuizQuestion {
  // Combine names and cities for a larger pool of words
  const allWords = [...japaneseNames, ...japaneseCities];

  const pick = getRandomElement(allWords);
  const correctAnswer = pick[targetScript];

  // Create a pool of all possible answers in the target script for distractors
  const allAnswersInScript = allWords.map(word => word[targetScript]);
  const distractors = generateDistractors(correctAnswer, allAnswersInScript);

  return {
    id: generateQuestionId(questionType),
    question: `What is the ${targetScript} writing of: ${pick[inputScript]}`,
    correctAnswer,
    options: shuffleArray([correctAnswer, ...distractors]),
  };
}

function generateWriteInHiraganaQuestion(): QuizQuestion {
  return generateWriteInScriptQuestion(QUESTION_TYPES.WRITE_IN_HIRAGANA, 'katakana', 'hiragana');
}

function generateWriteInKatakanaQuestion(): QuizQuestion {
  return generateWriteInScriptQuestion(QUESTION_TYPES.WRITE_IN_KATAKANA, 'hiragana', 'katakana');
}

// Main question generator
export function generateQuestion(targetType: QuestionType): QuizQuestion {
  const questionGenerators: Partial<Record<QuestionType, () => QuizQuestion>> = {
    [QUESTION_TYPES.HIRAGANA_TO_ROMAJI]: generateHiraganaToRomajiQuestion,
    [QUESTION_TYPES.KATAKANA_TO_ROMAJI]: generateKatakanaToRomajiQuestion,
    [QUESTION_TYPES.ROMAJI_TO_HIRAGANA]: generateRomajiToHiraganaQuestion,
    [QUESTION_TYPES.ROMAJI_TO_KATAKANA]: generateRomajiToKatakanaQuestion,
    [QUESTION_TYPES.HIRAGANA_TO_KATAKANA]: generateHiraganaToKatakanaQuestion,
    [QUESTION_TYPES.KATAKANA_TO_HIRAGANA]: generateKatakanaToHiraganaQuestion,
    [QUESTION_TYPES.SIMILAR_HIRAGANA_ROMAJI_READING]: generateSimilarHiraganaRomajiQuestion,
    [QUESTION_TYPES.SIMILAR_HIRAGANA_KATAKANA_READING]: generateSimilarHiraganaKatakanaQuestion,
    [QUESTION_TYPES.SIMILAR_KATAKANA_ROMAJI_READING]: generateSimilarKatakanaRomajiQuestion,
    [QUESTION_TYPES.SIMILAR_KATAKANA_HIRAGANA_READING]: generateSimilarKatakanaHiraganaQuestion,
    [QUESTION_TYPES.WRITE_IN_HIRAGANA]: generateWriteInHiraganaQuestion,
    [QUESTION_TYPES.WRITE_IN_KATAKANA]: generateWriteInKatakanaQuestion,
  };

  const generator =
    questionGenerators[targetType] ||
    (() => {
      throw new Error(`No generator for type: ${targetType}`);
    });

  return generator();
}

// Generate a quiz with a specified number of questions
export function generateQuiz(questionCount: number = 25, types?: QuestionType[]): QuizQuestion[] {
  const quiz: QuizQuestion[] = [];
  const defaultTypes = Object.values(QUESTION_TYPES);

  const availableTypes = types || defaultTypes;

  // Create a shuffled pool of question types that cycles through all types
  const shuffledTypes: QuestionType[] = [];

  // Calculate how many complete cycles we need
  const completeCycles = Math.ceil(questionCount / availableTypes.length);

  // Create shuffled cycles upfront
  for (let cycle = 0; cycle < completeCycles; cycle++) {
    shuffledTypes.push(...shuffleArray([...availableTypes]));
  }

  for (let i = 0; i < questionCount; i++) {
    const questionType = shuffledTypes[i];
    quiz.push(generateQuestion(questionType));
  }

  return quiz;
}

// Generate a quiz tailored to a specific difficulty level
export function generateQuizByDifficulty(
  difficulty: DifficultyLevel,
  questionCount: number = 25
): QuizQuestion[] {
  const difficultyTypes = {
    beginner: [
      QUESTION_TYPES.HIRAGANA_TO_ROMAJI,
      QUESTION_TYPES.KATAKANA_TO_ROMAJI,
      QUESTION_TYPES.ROMAJI_TO_HIRAGANA,
      QUESTION_TYPES.ROMAJI_TO_KATAKANA,
    ],
    intermediate: [
      QUESTION_TYPES.HIRAGANA_TO_KATAKANA,
      QUESTION_TYPES.KATAKANA_TO_HIRAGANA,
      QUESTION_TYPES.SIMILAR_HIRAGANA_ROMAJI_READING,
      QUESTION_TYPES.SIMILAR_KATAKANA_ROMAJI_READING,
    ],
    advanced: [
      QUESTION_TYPES.SIMILAR_HIRAGANA_KATAKANA_READING,
      QUESTION_TYPES.SIMILAR_KATAKANA_HIRAGANA_READING,
      QUESTION_TYPES.WRITE_IN_HIRAGANA,
      QUESTION_TYPES.WRITE_IN_KATAKANA,
    ],
  };

  return generateQuiz(questionCount, difficultyTypes[difficulty]);
}
