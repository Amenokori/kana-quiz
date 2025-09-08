import { toHiragana, toKatakana, toRomaji } from 'wanakana';
import {
  japaneseAnimals,
  japaneseCities,
  japaneseColors,
  japaneseFamily,
  japaneseFoodAndDrink,
  japaneseItems,
  japaneseNames,
  japaneseNature,
  japaneseNumbers,
  japaneseVerbs,
  katakanaLoanwords,
} from '../data/japanese';
import { hiragana, katakana, similarHiragana, similarKatakana } from '../data/kana';
import { findSimilarKana, generateQuestionId, getRandomElement, shuffleArray } from './helpers';
import { generateDistractors, levenshtein } from './levenshtein';

// Question Types
export const QUESTION_TYPES = {
  HIRAGANA_TO_ROMAJI: 'hiragana_to_romaji',
  ROMAJI_TO_HIRAGANA: 'romaji_to_hiragana',
  KATAKANA_TO_ROMAJI: 'katakana_to_romaji',
  ROMAJI_TO_KATAKANA: 'romaji_to_katakana',
  HIRAGANA_TO_KATAKANA: 'hiragana_to_katakana',
  KATAKANA_TO_HIRAGANA: 'katakana_to_hiragana',
  WORD_TO_HIRAGANA: 'word_to_hiragana',
  WORD_TO_KATAKANA: 'word_to_katakana',
  HIRAGANA_WORD_TO_ROMAJI: 'hiragana_word_to_romaji',
  KATAKANA_WORD_TO_ROMAJI: 'katakana_word_to_romaji',
  MIXED_SCRIPT_READING: 'mixed_script_reading',
  SIMILAR_KANA_DISTINCTION: 'similar_kana_distinction',
  DAKUTEN_HANDAKUTEN: 'dakuten_handakuten',
  COMBINATION_KANA: 'combination_kana',
  MINIMAL_PAIR_DISCRIMINATION: 'minimal_pair_discrimination',
  MISSING_DAKUTEN: 'missing_dakuten',
  SIMILAR_KANA_GROUP_TO_ROMAJI: 'similar_kana_group_to_romaji',
  ROMAJI_GROUP_TO_SIMILAR_KANA: 'romaji_group_to_similar_kana',
} as const;

export type QuestionType = (typeof QUESTION_TYPES)[keyof typeof QUESTION_TYPES];

export interface QuizQuestion {
  id: string;
  type: QuestionType;
  question: string;
  correctAnswer: string;
  options: string[];
}

// Implemented question types
const IMPLEMENTED_TYPES: QuestionType[] = [
  QUESTION_TYPES.HIRAGANA_TO_ROMAJI,
  QUESTION_TYPES.ROMAJI_TO_HIRAGANA,
  QUESTION_TYPES.KATAKANA_TO_ROMAJI,
  QUESTION_TYPES.ROMAJI_TO_KATAKANA,
  QUESTION_TYPES.HIRAGANA_TO_KATAKANA,
  QUESTION_TYPES.KATAKANA_TO_HIRAGANA,
  QUESTION_TYPES.WORD_TO_HIRAGANA,
  QUESTION_TYPES.WORD_TO_KATAKANA,
  QUESTION_TYPES.HIRAGANA_WORD_TO_ROMAJI,
  QUESTION_TYPES.KATAKANA_WORD_TO_ROMAJI,
  QUESTION_TYPES.SIMILAR_KANA_DISTINCTION,
  QUESTION_TYPES.DAKUTEN_HANDAKUTEN,
  QUESTION_TYPES.COMBINATION_KANA,
  QUESTION_TYPES.MIXED_SCRIPT_READING,
  QUESTION_TYPES.MINIMAL_PAIR_DISCRIMINATION,
  QUESTION_TYPES.MISSING_DAKUTEN,
  QUESTION_TYPES.SIMILAR_KANA_GROUP_TO_ROMAJI,
  QUESTION_TYPES.ROMAJI_GROUP_TO_SIMILAR_KANA,
];

// Question Generation Functions

export function generateHiraganaToRomajiQuestion(): QuizQuestion {
  const kana = getRandomElement(hiragana);
  const correctAnswer = toRomaji(kana);
  const allRomaji = hiragana.map(h => toRomaji(h));
  const distractors = generateDistractors(correctAnswer, allRomaji);

  return {
    id: generateQuestionId('hr'),
    type: QUESTION_TYPES.HIRAGANA_TO_ROMAJI,
    question: `What is the romaji reading of: ${kana}`,
    correctAnswer,
    options: shuffleArray([correctAnswer, ...distractors]),
  };
}

export function generateRomajiToHiraganaQuestion(): QuizQuestion {
  const kana = getRandomElement(hiragana);
  const romaji = toRomaji(kana);
  const distractors = generateDistractors(kana, hiragana);

  return {
    id: generateQuestionId('rh'),
    type: QUESTION_TYPES.ROMAJI_TO_HIRAGANA,
    question: `Which hiragana character represents the sound: ${romaji}`,
    correctAnswer: kana,
    options: shuffleArray([kana, ...distractors]),
  };
}

export function generateKatakanaToRomajiQuestion(): QuizQuestion {
  const kana = getRandomElement(katakana);
  const correctAnswer = toRomaji(kana);
  const allRomaji = katakana.map(k => toRomaji(k));
  const distractors = generateDistractors(correctAnswer, allRomaji);

  return {
    id: generateQuestionId('kr'),
    type: QUESTION_TYPES.KATAKANA_TO_ROMAJI,
    question: `What is the romaji reading of: ${kana}`,
    correctAnswer,
    options: shuffleArray([correctAnswer, ...distractors]),
  };
}

export function generateRomajiToKatakanaQuestion(): QuizQuestion {
  const kana = getRandomElement(katakana);
  const romaji = toRomaji(kana);
  const distractors = generateDistractors(kana, katakana);

  return {
    id: generateQuestionId('rk'),
    type: QUESTION_TYPES.ROMAJI_TO_KATAKANA,
    question: `Which katakana character represents the sound: ${romaji}`,
    correctAnswer: kana,
    options: shuffleArray([kana, ...distractors]),
  };
}

export function generateHiraganaToKatakanaQuestion(): QuizQuestion {
  const hiraganaChar = getRandomElement(hiragana);
  const correctAnswer = toKatakana(hiraganaChar);

  // Generate distractors from visually similar katakana.
  const distractors = findSimilarKana(correctAnswer, similarKatakana);

  // If not enough similar distractors, add random ones.
  if (distractors.length < 3) {
    const randomDistractors = generateDistractors(correctAnswer, katakana, 3 - distractors.length);
    distractors.push(...randomDistractors);
  }

  return {
    id: generateQuestionId('hk'),
    type: QUESTION_TYPES.HIRAGANA_TO_KATAKANA,
    question: `What is the katakana equivalent of: ${hiraganaChar}`,
    correctAnswer: correctAnswer,
    options: shuffleArray([correctAnswer, ...distractors]),
  };
}

export function generateKatakanaToHiraganaQuestion(): QuizQuestion {
  const katakanaChar = getRandomElement(katakana);
  const correctAnswer = toHiragana(katakanaChar);

  // Generate distractors from visually similar hiragana.
  const distractors = findSimilarKana(correctAnswer, similarHiragana);

  // If not enough similar distractors, add random ones.
  if (distractors.length < 3) {
    const randomDistractors = generateDistractors(correctAnswer, hiragana, 3 - distractors.length);
    distractors.push(...randomDistractors);
  }

  return {
    id: generateQuestionId('kh'),
    type: QUESTION_TYPES.KATAKANA_TO_HIRAGANA,
    question: `What is the hiragana equivalent of: ${katakanaChar}`,
    correctAnswer: correctAnswer,
    options: shuffleArray([correctAnswer, ...distractors]),
  };
}

export function generateWordToHiraganaQuestion(): QuizQuestion {
  const words = [
    ...japaneseAnimals,
    ...japaneseFoodAndDrink,
    ...japaneseItems,
    ...japaneseCities,
    ...japaneseNames,
    ...japaneseNumbers,
    ...japaneseColors,
    ...japaneseFamily,
    ...japaneseVerbs,
    ...japaneseNature,
  ];
  const word = getRandomElement(words);
  const hiraganaWord = toHiragana(word);
  const allHiraganaWords = words.map(w => toHiragana(w));
  const distractors = generateDistractors(
    hiraganaWord,
    allHiraganaWords,
    3,
    (a, b) => 1 / (1 + levenshtein(a, b))
  );

  return {
    id: generateQuestionId('wh'),
    type: QUESTION_TYPES.WORD_TO_HIRAGANA,
    question: `How do you write "${word}" in hiragana?`,
    correctAnswer: hiraganaWord,
    options: shuffleArray([hiraganaWord, ...distractors]),
  };
}

export function generateWordToKatakanaQuestion(): QuizQuestion {
  const word = getRandomElement(katakanaLoanwords);
  const katakanaWord = toKatakana(word);
  const allKatakanaWords = katakanaLoanwords.map(w => toKatakana(w));
  const distractors = generateDistractors(
    katakanaWord,
    allKatakanaWords,
    3,
    (a, b) => 1 / (1 + levenshtein(a, b))
  );

  return {
    id: generateQuestionId('wk'),
    type: QUESTION_TYPES.WORD_TO_KATAKANA,
    question: `How do you write "${word}" in katakana?`,
    correctAnswer: katakanaWord,
    options: shuffleArray([katakanaWord, ...distractors]),
  };
}

export function generateHiraganaWordToRomajiQuestion(): QuizQuestion {
  const words = [
    ...japaneseAnimals,
    ...japaneseFoodAndDrink,
    ...japaneseItems,
    ...japaneseCities,
    ...japaneseNames,
    ...japaneseNumbers,
    ...japaneseColors,
    ...japaneseFamily,
    ...japaneseVerbs,
    ...japaneseNature,
  ];
  const word = getRandomElement(words);
  const hiraganaWord = toHiragana(word);
  const distractors = generateDistractors(word, words, 3, (a, b) => 1 / (1 + levenshtein(a, b)));

  return {
    id: generateQuestionId('hwr'),
    type: QUESTION_TYPES.HIRAGANA_WORD_TO_ROMAJI,
    question: `What does this hiragana word mean in romaji: ${hiraganaWord}`,
    correctAnswer: word,
    options: shuffleArray([word, ...distractors]),
  };
}

export function generateKatakanaWordToRomajiQuestion(): QuizQuestion {
  const word = getRandomElement(katakanaLoanwords);
  const katakanaWord = toKatakana(word);
  const distractors = generateDistractors(
    word,
    katakanaLoanwords,
    3,
    (a, b) => 1 / (1 + levenshtein(a, b))
  );

  return {
    id: generateQuestionId('kwr'),
    type: QUESTION_TYPES.KATAKANA_WORD_TO_ROMAJI,
    question: `What does this katakana word mean in romaji: ${katakanaWord}`,
    correctAnswer: word,
    options: shuffleArray([word, ...distractors]),
  };
}

export function generateSimilarKanaDistinctionQuestion(): QuizQuestion {
  const isHiragana = Math.random() > 0.5;
  const similarGroup = getRandomElement(isHiragana ? similarHiragana : similarKatakana);
  const targetKana = getRandomElement(similarGroup);
  const correctAnswer = toRomaji(targetKana);
  const distractors = similarGroup.filter(kana => kana !== targetKana).map(kana => toRomaji(kana));

  return {
    id: generateQuestionId('skd'),
    type: QUESTION_TYPES.SIMILAR_KANA_DISTINCTION,
    question: `Which sound does this character make: ${targetKana}`,
    correctAnswer,
    options: shuffleArray([correctAnswer, ...distractors]),
  };
}

export function generateDakutenHandakutenQuestion(): QuizQuestion {
  const baseSounds = ['か', 'さ', 'た', 'は'];
  const baseSound = getRandomElement(baseSounds);
  const dakutenSound =
    baseSound === 'は' ? 'ば' : baseSound === 'か' ? 'が' : baseSound === 'さ' ? 'ざ' : 'だ';
  const handakutenSound = baseSound === 'は' ? 'ぱ' : null;

  const variations = [baseSound, dakutenSound];
  if (handakutenSound) variations.push(handakutenSound);

  const targetSound = getRandomElement(variations);
  const correctAnswer = toRomaji(targetSound);
  const distractors = variations
    .filter(sound => sound !== targetSound)
    .map(sound => toRomaji(sound));

  // Add one more random distractor if needed.
  if (distractors.length < 3) {
    const randomKana = getRandomElement(hiragana);
    const randomRomaji = toRomaji(randomKana);
    if (!distractors.includes(randomRomaji)) {
      distractors.push(randomRomaji);
    }
  }

  return {
    id: generateQuestionId('dh'),
    type: QUESTION_TYPES.DAKUTEN_HANDAKUTEN,
    question: `What sound does this character make: ${targetSound}`,
    correctAnswer,
    options: shuffleArray([correctAnswer, ...distractors.slice(0, 3)]),
  };
}

export function generateCombinationKanaQuestion(): QuizQuestion {
  const combinations = hiragana.filter(h => h.length > 1); // きゃ, しゅ, etc.
  if (combinations.length === 0) {
    // Fallback safety: no combinations present in data.
    return generateHiraganaToRomajiQuestion();
  }
  const combination = getRandomElement(combinations);
  const correctAnswer = toRomaji(combination);

  // Generate distractors with similar starting sounds or endings.
  const baseChar = combination[0];
  const allCombinationRomaji = combinations.map(c => toRomaji(c));
  const distractors = generateDistractors(correctAnswer, allCombinationRomaji, 3, (a, b) =>
    toHiragana(a)[0] === baseChar || toHiragana(b)[0] === baseChar ? 1 : 0
  );

  return {
    id: generateQuestionId('ck'),
    type: QUESTION_TYPES.COMBINATION_KANA,
    question: `What is the romaji reading of this combination: ${combination}`,
    correctAnswer,
    options: shuffleArray([correctAnswer, ...distractors]),
  };
}

export function generateMixedScriptQuestion(): QuizQuestion {
  const hiraganaWordPool = [
    ...japaneseAnimals,
    ...japaneseFoodAndDrink,
    ...japaneseItems,
    ...japaneseCities,
    ...japaneseNames,
    ...japaneseNumbers,
    ...japaneseColors,
    ...japaneseFamily,
    ...japaneseVerbs,
    ...japaneseNature,
  ];

  // Pick a hiragana-native style word & a katakana loanword.
  const hiraganaWordSrc = getRandomElement(hiraganaWordPool);
  const katakanaWordSrc = getRandomElement(katakanaLoanwords);

  const hiraganaWord = toHiragana(hiraganaWordSrc);
  const katakanaWord = toKatakana(katakanaWordSrc);

  // Randomize order to increase variety.
  const hiraganaFirst = Math.random() > 0.5;
  const firstWord = hiraganaFirst ? hiraganaWord : katakanaWord;
  const secondWord = hiraganaFirst ? katakanaWord : hiraganaWord;

  // Connector variations.
  const connectors = [
    { char: '・', romajiSep: ' ' }, // common separator between mixed terms
    { char: ' ', romajiSep: ' ' }, // simple space
    { char: '', romajiSep: ' ' }, // no visible connector, still separate in romaji
    { char: '-', romajiSep: '-' }, // hyphenated loan style
  ];
  const connector = getRandomElement(connectors);

  const mixedText = `${firstWord}${connector.char}${secondWord}`;
  const firstRomaji = toRomaji(firstWord).toLowerCase();
  const secondRomaji = toRomaji(secondWord).toLowerCase();
  const correctAnswer = `${firstRomaji}${connector.romajiSep}${secondRomaji}`.trim();

  // Build distractors: swap order, change one component, change both.
  const otherHiraganaWords = hiraganaWordPool.filter(w => w !== hiraganaWordSrc);
  const otherLoanwords = katakanaLoanwords.filter(w => w !== katakanaWordSrc);

  const similarHiraganaDistractors = generateDistractors(
    hiraganaWordSrc,
    otherHiraganaWords,
    3,
    (a, b) => 1 / (1 + levenshtein(a, b))
  );
  const similarKatakanaDistractors = generateDistractors(
    katakanaWordSrc,
    otherLoanwords,
    3,
    (a, b) => 1 / (1 + levenshtein(a, b))
  );

  const distractors: string[] = [];

  for (let i = 0; i < 4 && distractors.length < 4; i++) {
    const hCand = similarHiraganaDistractors[i] || getRandomElement(otherHiraganaWords);
    const kCand = similarKatakanaDistractors[i] || getRandomElement(otherLoanwords);
    const hRomaji = toRomaji(toHiragana(hCand)).toLowerCase();
    const kRomaji = toRomaji(toKatakana(kCand)).toLowerCase();

    // Mirror order occasionally for variety.
    const mirror = Math.random() > 0.5;
    const candidate = hiraganaFirst
      ? `${mirror ? kRomaji : hRomaji}${connector.romajiSep}${mirror ? hRomaji : kRomaji}`
      : `${mirror ? hRomaji : kRomaji}${connector.romajiSep}${mirror ? kRomaji : hRomaji}`;

    if (candidate !== correctAnswer) distractors.push(candidate.trim());
  }

  const uniqueDistractors = Array.from(new Set(distractors)).slice(0, 3);

  // Ensure we still have 3 distractors (fallback random combos).
  while (uniqueDistractors.length < 3) {
    const randH = getRandomElement(otherHiraganaWords);
    const randK = getRandomElement(otherLoanwords);
    const hR = toRomaji(toHiragana(randH)).toLowerCase();
    const kR = toRomaji(toKatakana(randK)).toLowerCase();
    const combo = hiraganaFirst
      ? `${hR}${connector.romajiSep}${kR}`
      : `${kR}${connector.romajiSep}${hR}`;
    if (combo !== correctAnswer && !uniqueDistractors.includes(combo.trim())) {
      uniqueDistractors.push(combo.trim());
    }
  }

  return {
    id: generateQuestionId('ms'),
    type: QUESTION_TYPES.MIXED_SCRIPT_READING,
    question: `Read this mixed script text: ${mixedText}`,
    correctAnswer,
    options: shuffleArray([correctAnswer, ...uniqueDistractors]).slice(0, 4),
  };
}

// Minimal pair discrimination: choose correct kana for a romaji among visually similar forms.
export function generateMinimalPairDiscriminationQuestion(): QuizQuestion {
  const isHiragana = Math.random() > 0.5;
  const group = getRandomElement(isHiragana ? similarHiragana : similarKatakana);
  const targetKana = getRandomElement(group);
  const romajiPrompt = toRomaji(targetKana);
  let options = [...group];
  // If group < 3, pad with random kana of same script to keep variety.
  if (options.length < 3) {
    const pool = isHiragana ? hiragana : katakana;
    while (options.length < 3) {
      const candidate = getRandomElement(pool);
      if (!options.includes(candidate)) options.push(candidate);
    }
  }
  // Limit to max 4 options.
  options = shuffleArray(options).slice(0, 4);
  return {
    id: generateQuestionId('mpd'),
    type: QUESTION_TYPES.MINIMAL_PAIR_DISCRIMINATION,
    question: `Select the kana for the sound: ${romajiPrompt}`,
    correctAnswer: targetKana,
    options: shuffleArray(options),
  };
}

// Missing dakuten: identify voiced variant from romaji.
export function generateMissingDakutenQuestion(): QuizQuestion {
  // Base kana for rows with dakuten/handakuten.
  const baseRows = [
    { base: 'か', voiced: 'が' },
    { base: 'さ', voiced: 'ざ' },
    { base: 'た', voiced: 'だ' },
    { base: 'は', voiced: 'ば', handaku: 'ぱ' },
  ];
  const row = getRandomElement(baseRows);
  const variants = [row.base, row.voiced, ...(row.handaku ? [row.handaku] : [])];
  const target = getRandomElement(variants);
  const romajiPrompt = toRomaji(target);

  // Pad distractor pool with other row variants to reach 4 options if needed.
  let options = [...variants];
  if (options.length < 4) {
    const otherVariants = baseRows
      .flatMap(r => [r.base, r.voiced, ...(r.handaku ? [r.handaku] : [])])
      .filter(k => !options.includes(k));
    while (options.length < 4 && otherVariants.length) {
      const cand = getRandomElement(otherVariants);
      options.push(cand);
    }
  }
  options = shuffleArray(Array.from(new Set(options))).slice(0, 4);

  return {
    id: generateQuestionId('mdk'),
    type: QUESTION_TYPES.MISSING_DAKUTEN,
    question: `Select the kana that matches the romaji: ${romajiPrompt}`,
    correctAnswer: target,
    options,
  };
}

export function generateSimilarKanaGroupToRomajiQuestion(): QuizQuestion {
  const isHiragana = Math.random() > 0.5;
  const similarGroup = getRandomElement(isHiragana ? similarHiragana : similarKatakana);

  const shuffledKana = shuffleArray([...similarGroup]);
  const questionKana = shuffledKana.join(', ');
  const correctAnswer = shuffledKana.map(k => toRomaji(k)).join(', ');

  const distractors: string[] = [];
  // Distractor 1: reversed order
  if (shuffledKana.length > 1) {
    distractors.push(
      [...shuffledKana]
        .reverse()
        .map(k => toRomaji(k))
        .join(', ')
    );
  }

  // Other distractors from other similar groups
  const otherGroups = (isHiragana ? similarHiragana : similarKatakana).filter(
    g => g.join() !== similarGroup.join()
  );

  while (distractors.length < 3 && otherGroups.length > 0) {
    const randomGroup = getRandomElement(otherGroups);
    const randomGroupShuffled = shuffleArray([...randomGroup]);
    const distractor = randomGroupShuffled.map(k => toRomaji(k)).join(', ');
    if (!distractors.includes(distractor) && distractor !== correctAnswer) {
      distractors.push(distractor);
    }
    // Avoid infinite loop if all distractors are the same
    const index = otherGroups.findIndex(g => g.join() === randomGroup.join());
    if (index > -1) {
      otherGroups.splice(index, 1);
    }
  }

  return {
    id: generateQuestionId('skgr'),
    type: QUESTION_TYPES.SIMILAR_KANA_GROUP_TO_ROMAJI,
    question: `What are the romaji readings for: ${questionKana}`,
    correctAnswer,
    options: shuffleArray([correctAnswer, ...distractors]),
  };
}

export function generateRomajiGroupToSimilarKanaQuestion(): QuizQuestion {
  const isHiragana = Math.random() > 0.5;
  const similarGroup = getRandomElement(isHiragana ? similarHiragana : similarKatakana);

  const romajiGroup = similarGroup.map(k => toRomaji(k));
  const shuffledRomaji = shuffleArray([...romajiGroup]);
  const questionRomaji = shuffledRomaji.join(', ');

  // Convert romaji back to the correct kana based on the original similar group
  const correspondingKana = shuffledRomaji.map(r => {
    // Find the original kana that matches this romaji
    return similarGroup.find(k => toRomaji(k) === r) || toHiragana(r);
  });

  const correctAnswer = correspondingKana.join(', ');

  const distractors: string[] = [];
  // Distractor 1: reversed order
  if (correspondingKana.length > 1) {
    const reversedKana = [...correspondingKana].reverse();
    distractors.push(reversedKana.join(', '));
  }

  // Other distractors from other similar groups
  const otherGroups = (isHiragana ? similarHiragana : similarKatakana).filter(
    g => g.join() !== similarGroup.join()
  );

  while (distractors.length < 3 && otherGroups.length > 0) {
    const randomGroup = getRandomElement(otherGroups);
    const randomGroupShuffled = shuffleArray([...randomGroup]);
    const distractor = randomGroupShuffled.join(', ');
    if (!distractors.includes(distractor) && distractor !== correctAnswer) {
      distractors.push(distractor);
    }
    const index = otherGroups.findIndex(g => g.join() === randomGroup.join());
    if (index > -1) {
      otherGroups.splice(index, 1);
    }
  }

  return {
    id: generateQuestionId('rgsk'),
    type: QUESTION_TYPES.ROMAJI_GROUP_TO_SIMILAR_KANA,
    question: `What are the kana for: ${questionRomaji}`,
    correctAnswer,
    options: shuffleArray([correctAnswer, ...distractors]),
  };
}

// Main question generator
export function generateQuestion(type?: QuestionType): QuizQuestion {
  const questionGenerators: Partial<Record<QuestionType, () => QuizQuestion>> = {
    [QUESTION_TYPES.HIRAGANA_TO_ROMAJI]: generateHiraganaToRomajiQuestion,
    [QUESTION_TYPES.ROMAJI_TO_HIRAGANA]: generateRomajiToHiraganaQuestion,
    [QUESTION_TYPES.KATAKANA_TO_ROMAJI]: generateKatakanaToRomajiQuestion,
    [QUESTION_TYPES.ROMAJI_TO_KATAKANA]: generateRomajiToKatakanaQuestion,
    [QUESTION_TYPES.HIRAGANA_TO_KATAKANA]: generateHiraganaToKatakanaQuestion,
    [QUESTION_TYPES.KATAKANA_TO_HIRAGANA]: generateKatakanaToHiraganaQuestion,
    [QUESTION_TYPES.WORD_TO_HIRAGANA]: generateWordToHiraganaQuestion,
    [QUESTION_TYPES.WORD_TO_KATAKANA]: generateWordToKatakanaQuestion,
    [QUESTION_TYPES.HIRAGANA_WORD_TO_ROMAJI]: generateHiraganaWordToRomajiQuestion,
    [QUESTION_TYPES.KATAKANA_WORD_TO_ROMAJI]: generateKatakanaWordToRomajiQuestion,
    [QUESTION_TYPES.SIMILAR_KANA_DISTINCTION]: generateSimilarKanaDistinctionQuestion,
    [QUESTION_TYPES.DAKUTEN_HANDAKUTEN]: generateDakutenHandakutenQuestion,
    [QUESTION_TYPES.COMBINATION_KANA]: generateCombinationKanaQuestion,
    [QUESTION_TYPES.MIXED_SCRIPT_READING]: generateMixedScriptQuestion,
    [QUESTION_TYPES.MINIMAL_PAIR_DISCRIMINATION]: generateMinimalPairDiscriminationQuestion,
    [QUESTION_TYPES.MISSING_DAKUTEN]: generateMissingDakutenQuestion,
    [QUESTION_TYPES.SIMILAR_KANA_GROUP_TO_ROMAJI]: generateSimilarKanaGroupToRomajiQuestion,
    [QUESTION_TYPES.ROMAJI_GROUP_TO_SIMILAR_KANA]: generateRomajiGroupToSimilarKanaQuestion,
  };

  const availableTypes = Object.keys(questionGenerators).filter(
    key => questionGenerators[key as QuestionType]
  ) as QuestionType[];
  const targetType = type || getRandomElement(availableTypes);
  const generator = questionGenerators[targetType];

  if (!generator) {
    // Fallback to a basic question type if the specified generator is not found.
    return generateHiraganaToRomajiQuestion();
  }

  return generator();
}

// Generate a quiz with a specified number of questions
export function generateQuiz(questionCount: number = 25, types?: QuestionType[]): QuizQuestion[] {
  const quiz: QuizQuestion[] = [];
  const defaultTypes = IMPLEMENTED_TYPES;

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
  difficulty: 'beginner' | 'intermediate' | 'advanced',
  questionCount: number = 25
): QuizQuestion[] {
  const difficultyTypes = {
    beginner: [
      QUESTION_TYPES.HIRAGANA_TO_ROMAJI,
      QUESTION_TYPES.ROMAJI_TO_HIRAGANA,
      QUESTION_TYPES.KATAKANA_TO_ROMAJI,
      QUESTION_TYPES.ROMAJI_TO_KATAKANA,
    ],
    intermediate: [
      QUESTION_TYPES.HIRAGANA_TO_KATAKANA,
      QUESTION_TYPES.KATAKANA_TO_HIRAGANA,
      QUESTION_TYPES.WORD_TO_HIRAGANA,
      QUESTION_TYPES.WORD_TO_KATAKANA,
      QUESTION_TYPES.DAKUTEN_HANDAKUTEN,
      QUESTION_TYPES.MISSING_DAKUTEN,
    ],
    advanced: [
      QUESTION_TYPES.HIRAGANA_WORD_TO_ROMAJI,
      QUESTION_TYPES.SIMILAR_KANA_DISTINCTION,
      QUESTION_TYPES.COMBINATION_KANA,
      QUESTION_TYPES.MIXED_SCRIPT_READING,
      QUESTION_TYPES.KATAKANA_WORD_TO_ROMAJI,
      QUESTION_TYPES.MINIMAL_PAIR_DISCRIMINATION,
      QUESTION_TYPES.SIMILAR_KANA_GROUP_TO_ROMAJI,
      QUESTION_TYPES.ROMAJI_GROUP_TO_SIMILAR_KANA,
    ],
  };

  return generateQuiz(questionCount, difficultyTypes[difficulty]);
}
