// --- HIRAGANA ---

// Gojūon (basic characters)
export const basicHiragana = [
  'あ', 'い', 'う', 'え', 'お',
  'か', 'き', 'く', 'け', 'こ',
  'さ', 'し', 'す', 'せ', 'そ',
  'た', 'ち', 'つ', 'て', 'と',
  'な', 'に', 'ぬ', 'ね', 'の',
  'は', 'ひ', 'ふ', 'へ', 'ほ',
  'ま', 'み', 'む', 'め', 'も',
  'や', 'ゆ', 'よ',
  'ら', 'り', 'る', 'れ', 'ろ',
  'わ', 'を', 'ん',
];

// Dakuten and Handakuten (voiced and semi-voiced)
export const dakutenHiragana = [
  'が', 'ぎ', 'ぐ', 'げ', 'ご',
  'ざ', 'じ', 'ず', 'ぜ', 'ぞ',
  'だ', 'ぢ', 'づ', 'で', 'ど',
  'ば', 'び', 'ぶ', 'べ', 'ぼ',
  'ぱ', 'ぴ', 'ぷ', 'ぺ', 'ぽ',
];

// Yōon (contracted sounds)
export const yoonHiragana = [
  'きゃ', 'きゅ', 'きょ',
  'しゃ', 'しゅ', 'しょ',
  'ちゃ', 'ちゅ', 'ちょ',
  'にゃ', 'にゅ', 'にょ',
  'ひゃ', 'ひゅ', 'ひょ',
  'みゃ', 'みゅ', 'みょ',
  'りゃ', 'りゅ', 'りょ',
  'ぎゃ', 'ぎゅ', 'ぎょ',
  'じゃ', 'じゅ', 'じょ',
  'びゃ', 'びゅ', 'びょ',
  'ぴゃ', 'ぴゅ', 'ぴょ',
];

export const hiragana = [
  ...basicHiragana,
  ...dakutenHiragana,
  ...yoonHiragana,
];

// --- KATAKANA ---

// Gojūon (basic characters)
export const basicKatakana = [
  'ア', 'イ', 'ウ', 'エ', 'オ',
  'カ', 'キ', 'ク', 'ケ', 'コ',
  'サ', 'シ', 'ス', 'セ', 'ソ',
  'タ', 'チ', 'ツ', 'テ', 'ト',
  'ナ', 'ニ', 'ヌ', 'ネ', 'ノ',
  'ハ', 'ヒ', 'フ', 'ヘ', 'ホ',
  'マ', 'ミ', 'ム', 'メ', 'モ',
  'ヤ', 'ユ', 'ヨ',
  'ラ', 'リ', 'ル', 'レ', 'ロ',
  'ワ', 'ヲ', 'ン',
];

// Dakuten and Handakuten (voiced and semi-voiced)
export const dakutenKatakana = [
  'ガ', 'ギ', 'グ', 'ゲ', 'ゴ',
  'ザ', 'ジ', 'ズ', 'ゼ', 'ゾ',
  'ダ', 'ヂ', 'ヅ', 'デ', 'ド',
  'バ', 'ビ', 'ブ', 'ベ', 'ボ',
  'パ', 'ピ', 'プ', 'ペ', 'ポ',
];

// Yōon (contracted sounds)
export const yoonKatakana = [
  'キャ', 'キュ', 'キョ',
  'シャ', 'シュ', 'ショ',
  'チャ', 'チュ', 'チョ',
  'ニャ', 'ニュ', 'ニョ',
  'ヒャ', 'ヒュ', 'ヒョ',
  'ミャ', 'ミュ', 'ミョ',
  'リャ', 'リュ', 'リョ',
  'ギャ', 'ギュ', 'ギョ',
  'ジャ', 'ジュ', 'ジョ',
  'ビャ', 'ビュ', 'ビョ',
  'ピャ', 'ピュ', 'ピョ',
];

// Extended Katakana (for foreign sounds)
export const extendedKatakana = [
  'ウィ', 'ウェ', 'ウォ',
  'ヴァ', 'ヴィ', 'ヴェ', 'ヴォ',
  'シェ', 'ジェ',
  'チェ',
  'ツァ', 'ツィ', 'ツェ', 'ツォ',
  'ティ', 'トゥ',
  'ディ', 'ドゥ',
  'ファ', 'フィ', 'フェ', 'フォ',
  'フュ',
];

export const katakana = [
  ...basicKatakana,
  ...dakutenKatakana,
  ...yoonKatakana,
  ...extendedKatakana,
];


export const similarHiragana = [
  ['ね', 'れ', 'わ', 'ぬ'], // Classic confusion based on the left-side loop and right-side structure.
  ['ぬ', 'め', 'あ', 'お'], // All feature a prominent, potentially confusing loop.
  ['は', 'ほ', 'ま', 'き'], // Similar core structures with variations in loops and finishing strokes.
  ['さ', 'ち', 'き', 'ぎ'], // Similar top-crossing strokes; 'gi' is added to test dakuten recognition on a similar shape.
  ['る', 'ろ', 'そ', 'を'], // Single-stroke characters with similar flow but different loops and paths.
  ['い', 'り', 'に', 'こ'], // Based on two core vertical strokes, testing length, curve, and separation.
  ['ふ', 'う', 'ら', 'ち'], // In many handwritten styles, these can become nearly indistinguishable.
  ['す', 'む', 'お', 'ゆ'], // Focus on the central loop and the direction of the exiting stroke.
  ['し', 'じ', 'つ', 'づ'], // Classic curve confusion, elevated by their easily mixed-up dakuten sounds (ji/zu).
  ['きゃ', 'ちゃ', 'しゃ'], // Yōon based on visually distinct but confusable base characters (き, ち, し).
  ['びゃ', 'ぴゃ', 'みゃ'], // Tests rapid distinction between dakuten, handakuten, and a similar base kana (み) in a yōon context.
];

export const similarKatakana = [
  ['シ', 'ツ', 'ソ', 'ン'], // The ultimate classic set; confusion is based entirely on stroke angle and direction.
  ['ウ', 'フ', 'ワ', 'ラ'], // All share a similar top or left-side stroke, forcing focus on the second stroke.
  ['ク', 'ケ', 'タ', 'ナ'], // Similar components and angles, differing by only one or two strokes.
  ['ノ', 'メ', 'ヌ', 'フ'], // Progressive complexity from a single diagonal stroke.
  ['コ', 'ユ', 'ヨ', 'エ'], // "Boxy" characters distinguished by which corner is open or closed.
  ['ス', 'ヌ', 'マ', 'セ'], // All share the '又' shape or a similar two-stroke element.
  ['ア', 'ヤ', 'マ', 'ヤ'], // Focus on subtle differences in stroke length, angle, and crossover.
  ['サ', 'セ', 'キ', 'チ'], // All feature a similar left-side element, testing recognition of the right-side strokes.
  ['カ', 'ガ', 'リ', 'ワ'], // 'ka' and 'ri' are nearly identical; 'ga' and 'wa' add dakuten and shape variation pressure.
  ['ホ', 'ホ', 'ポ', 'ボ'], // Tests diacritics on a base character that is easily confused with a kanji radical (木).
  ['シュ', 'ジュ', 'チュ'], // Yōon based on the visually similar 'shi', 'tsu', and 'chi' bases.
  ['ジャ', 'ヂャ', 'ギャ'], // Yōon combinations that are visually dense and phonetically similar.
];
