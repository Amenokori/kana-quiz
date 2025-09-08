import React, { useEffect, useRef, useState } from 'react';
import { generateQuiz, generateQuizByDifficulty, type QuizQuestion } from '../utils/engine';

type Difficulty = 'beginner' | 'intermediate' | 'advanced' | 'mixed';

interface QuizConfig {
  difficulty: Difficulty;
  questionCount: 25 | 50 | 75 | 100;
  timeMode: boolean;
  timeLimit: number; // in seconds
}

interface QuizState {
  questions: QuizQuestion[];
  currentQuestionIndex: number;
  score: number;
  userAnswers: (string | null)[];
  isGameStarted: boolean;
  isGameCompleted: boolean;
  selectedAnswer: string | null;
  showResult: boolean;
  timeRemaining: number;
  gameEndedByTime: boolean;
}

interface QuizGameProps {
  onGameStateChange: (isActive: boolean) => void;
}

const QuizGame: React.FC<QuizGameProps> = ({ onGameStateChange }) => {
  const [config, setConfig] = useState<QuizConfig>({
    difficulty: 'mixed',
    questionCount: 25,
    timeMode: false,
    timeLimit: 10,
  });

  const [quizState, setQuizState] = useState<QuizState>({
    questions: [],
    currentQuestionIndex: 0,
    score: 0,
    userAnswers: [],
    isGameStarted: false,
    isGameCompleted: false,
    selectedAnswer: null,
    showResult: false,
    timeRemaining: 0,
    gameEndedByTime: false,
  });

  const timerRef = useRef<number | null>(null);

  // Notify parent component when game state changes
  useEffect(() => {
    onGameStateChange(quizState.isGameStarted && !quizState.isGameCompleted);
  }, [quizState.isGameStarted, quizState.isGameCompleted, onGameStateChange]);

  // Timer effect for time mode
  useEffect(() => {
    // Clear any existing timer first
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    if (
      config.timeMode &&
      quizState.isGameStarted &&
      !quizState.isGameCompleted &&
      !quizState.showResult &&
      quizState.timeRemaining > 0
    ) {
      timerRef.current = window.setInterval(() => {
        setQuizState(prev => {
          if (prev.timeRemaining <= 1) {
            // Time's up - end the game
            return {
              ...prev,
              timeRemaining: 0,
              isGameCompleted: true,
              gameEndedByTime: true,
            };
          }
          return {
            ...prev,
            timeRemaining: prev.timeRemaining - 1,
          };
        });
      }, 1000);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [
    config.timeMode,
    quizState.isGameStarted,
    quizState.isGameCompleted,
    quizState.showResult,
    quizState.timeRemaining,
  ]);

  // Cleanup timer on component unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  const startQuiz = () => {
    const questions =
      config.difficulty === 'mixed'
        ? generateQuiz(config.questionCount)
        : generateQuizByDifficulty(config.difficulty, config.questionCount);

    setQuizState({
      questions,
      currentQuestionIndex: 0,
      score: 0,
      userAnswers: new Array(config.questionCount).fill(null),
      isGameStarted: true,
      isGameCompleted: false,
      selectedAnswer: null,
      showResult: false,
      timeRemaining: config.timeMode ? config.timeLimit : 0,
      gameEndedByTime: false,
    });
  };

  const handleAnswerSelect = (answer: string) => {
    setQuizState(prev => ({
      ...prev,
      selectedAnswer: answer,
    }));
  };

  const submitAnswer = () => {
    if (!quizState.selectedAnswer) return;

    const currentQuestion = quizState.questions[quizState.currentQuestionIndex];
    const isCorrect = quizState.selectedAnswer === currentQuestion.correctAnswer;

    const newUserAnswers = [...quizState.userAnswers];
    newUserAnswers[quizState.currentQuestionIndex] = quizState.selectedAnswer;

    setQuizState(prev => ({
      ...prev,
      score: isCorrect ? prev.score + 1 : prev.score,
      userAnswers: newUserAnswers,
      showResult: true,
    }));

    // Auto-advance after showing result
    setTimeout(() => {
      nextQuestion();
    }, 1000);
  };

  const nextQuestion = () => {
    const nextIndex = quizState.currentQuestionIndex + 1;

    if (nextIndex >= quizState.questions.length) {
      setQuizState(prev => ({
        ...prev,
        isGameCompleted: true,
        showResult: false,
        timeRemaining: 0,
      }));
    } else {
      setQuizState(prev => ({
        ...prev,
        currentQuestionIndex: nextIndex,
        selectedAnswer: null,
        showResult: false,
        timeRemaining: config.timeMode ? config.timeLimit : 0,
      }));
    }
  };

  const restartGame = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    setQuizState({
      questions: [],
      currentQuestionIndex: 0,
      score: 0,
      userAnswers: [],
      isGameStarted: false,
      isGameCompleted: false,
      selectedAnswer: null,
      showResult: false,
      timeRemaining: 0,
      gameEndedByTime: false,
    });
  };

  const endGame = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    setQuizState(prev => ({
      ...prev,
      isGameCompleted: true,
      showResult: false,
      timeRemaining: 0,
    }));
  };

  if (!quizState.isGameStarted) {
    return (
      <div className="flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-lg">
          <div className="rounded-2xl border border-blue-100 bg-white p-6 shadow-2xl dark:border-slate-700 dark:bg-slate-800">
            <div className="mb-8 text-center">
              <h2 className="mb-2 text-2xl font-bold text-slate-900 dark:text-white">
                Ready to Test Your Skills? 🎯
              </h2>
              <p className="text-slate-600 dark:text-slate-400">
                Choose your settings and let's begin!
              </p>
            </div>

            <div className="mb-6">
              <label className="mb-3 block text-sm font-semibold text-slate-700 dark:text-slate-300">
                Difficulty Level
              </label>
              <div className="grid grid-cols-2 gap-2">
                {(['mixed', 'beginner', 'intermediate', 'advanced'] as const).map(difficulty => (
                  <button
                    key={difficulty}
                    onClick={() => setConfig(prev => ({ ...prev, difficulty }))}
                    className={`relative rounded-xl p-3 text-sm font-medium capitalize transition-all duration-200 ${
                      config.difficulty === difficulty
                        ? 'bg-blue-500 text-white shadow-lg dark:bg-blue-500'
                        : 'border border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100 dark:border-slate-600 dark:bg-slate-700 dark:text-blue-300 dark:hover:bg-slate-600'
                    }`}
                  >
                    <div className="mb-1 text-base">
                      {difficulty === 'mixed' && '🥷🏻'}
                      {difficulty === 'beginner' && '🌱'}
                      {difficulty === 'intermediate' && '📚'}
                      {difficulty === 'advanced' && '🔥'}
                    </div>
                    {difficulty === 'mixed' ? 'Mixed' : difficulty}
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-8">
              <label className="mb-3 block text-sm font-semibold text-slate-700 dark:text-slate-300">
                Questions
              </label>
              <div className="grid grid-cols-4 gap-2">
                {([25, 50, 75, 100] as const).map(count => (
                  <button
                    key={count}
                    onClick={() => setConfig(prev => ({ ...prev, questionCount: count }))}
                    className={`rounded-xl p-3 text-sm font-semibold transition-all duration-200 ${
                      config.questionCount === count
                        ? 'bg-green-500 text-white shadow-lg dark:bg-green-500'
                        : 'border border-green-200 bg-green-50 text-green-700 hover:bg-green-100 dark:border-slate-600 dark:bg-slate-700 dark:text-green-300 dark:hover:bg-slate-600'
                    }`}
                  >
                    {count}
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <label className="mb-3 block text-sm font-semibold text-slate-700 dark:text-slate-300">
                Time Mode
              </label>
              <div className="mb-4">
                <button
                  onClick={() => setConfig(prev => ({ ...prev, timeMode: !prev.timeMode }))}
                  className={`w-full rounded-xl p-3 text-sm font-semibold transition-all duration-200 ${
                    config.timeMode
                      ? 'bg-orange-500 text-white shadow-lg dark:bg-orange-500'
                      : 'border border-orange-200 bg-orange-50 text-orange-700 hover:bg-orange-100 dark:border-slate-600 dark:bg-slate-700 dark:text-orange-300 dark:hover:bg-slate-600'
                  }`}
                >
                  <div className="mb-1 text-base">{config.timeMode ? '⏰' : '🐌'}</div>
                  {config.timeMode ? 'Time Mode: ON' : 'Time Mode: OFF'}
                </button>
              </div>

              {config.timeMode && (
                <div>
                  <label className="mb-2 block text-xs font-medium text-slate-600 dark:text-slate-400">
                    Time per question: {config.timeLimit}s
                  </label>
                  <div className="grid grid-cols-5 gap-1">
                    {([5, 10, 15, 20, 30] as const).map(seconds => (
                      <button
                        key={seconds}
                        onClick={() => setConfig(prev => ({ ...prev, timeLimit: seconds }))}
                        className={`rounded-lg p-2 text-xs font-semibold transition-all duration-200 ${
                          config.timeLimit === seconds
                            ? 'bg-orange-400 text-white shadow-md dark:bg-orange-400'
                            : 'border border-orange-200 bg-orange-50 text-orange-600 hover:bg-orange-100 dark:border-slate-600 dark:bg-slate-700 dark:text-orange-300 dark:hover:bg-slate-600'
                        }`}
                      >
                        {seconds}s
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={startQuiz}
              className="w-full rounded-xl bg-blue-600 px-6 py-4 text-lg font-bold text-white shadow-xl transition-all duration-200 hover:scale-105 hover:bg-blue-700 hover:shadow-2xl active:scale-95 dark:bg-blue-500 dark:hover:bg-blue-600"
            >
              🚀 Start Quiz
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (quizState.isGameCompleted) {
    const percentage = Math.round((quizState.score / quizState.questions.length) * 100);

    return (
      <div className="flex min-h-[calc(100vh-120px)] items-center justify-center px-4 py-8">
        <div className="w-full max-w-lg">
          <div className="rounded-2xl border border-blue-100 bg-white p-6 text-center shadow-2xl dark:border-slate-700 dark:bg-slate-800">
            <div className="mb-6">
              <div className="mb-4 text-6xl">
                {quizState.gameEndedByTime
                  ? '⏰'
                  : percentage >= 90
                    ? '🏆'
                    : percentage >= 80
                      ? '🎉'
                      : percentage >= 70
                        ? '👍'
                        : percentage >= 60
                          ? '😊'
                          : '📚'}
              </div>
              <h2 className="mb-4 text-3xl font-bold text-slate-900 dark:text-white">
                {quizState.gameEndedByTime ? "Time's Up!" : 'Quiz Complete!'}
              </h2>
            </div>

            <div className="mb-8">
              <div
                className={`mb-3 text-5xl font-bold ${
                  percentage >= 90
                    ? 'text-green-600 dark:text-green-400'
                    : percentage >= 80
                      ? 'text-blue-600 dark:text-blue-400'
                      : percentage >= 70
                        ? 'text-emerald-600 dark:text-emerald-400'
                        : percentage >= 60
                          ? 'text-orange-600 dark:text-orange-400'
                          : 'text-red-600 dark:text-red-400'
                }`}
              >
                {percentage}%
              </div>
              <p className="text-lg text-slate-600 dark:text-slate-400">
                {quizState.score} out of {quizState.questions.length} correct
              </p>
            </div>

            <div className="mb-8 rounded-xl bg-slate-50 p-4 dark:bg-slate-700">
              <p className="text-base text-slate-700 dark:text-slate-300">
                {quizState.gameEndedByTime
                  ? 'Time ran out! Keep practicing to improve your speed! ⚡'
                  : percentage >= 90
                    ? "Excellent work! You're a kana master! 🎉"
                    : percentage >= 80
                      ? 'Great job! Keep practicing! 👏'
                      : percentage >= 70
                        ? "Good effort! You're improving! 💪"
                        : percentage >= 60
                          ? 'Not bad! More practice will help! 📚'
                          : 'Keep studying! Practice makes perfect! 🌟'}
              </p>
            </div>

            <div className="flex flex-col gap-3">
              <button
                onClick={restartGame}
                className="rounded-xl bg-blue-600 px-6 py-3 font-bold text-white shadow-xl transition-all duration-200 hover:scale-105 hover:bg-blue-700 hover:shadow-2xl active:scale-95 dark:bg-blue-500 dark:hover:bg-blue-600"
              >
                New Quiz
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const currentQuestion = quizState.questions[quizState.currentQuestionIndex];

  return (
    <div className="flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-2xl">
        <div className="rounded-2xl border border-blue-100 bg-white shadow-2xl dark:border-slate-700 dark:bg-slate-800">
          <div className="flex items-center justify-between rounded-t-2xl bg-blue-100 p-3 text-sm font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-400">
            <span>
              Question {quizState.currentQuestionIndex + 1}/{quizState.questions.length}
            </span>
            <div className="flex items-center space-x-4">
              {config.timeMode && !quizState.showResult && (
                <span
                  className={`font-bold ${quizState.timeRemaining <= 3 ? 'animate-pulse text-red-500' : 'text-orange-500'}`}
                >
                  ⏰ {quizState.timeRemaining}s
                </span>
              )}
              <span>
                Score: {quizState.score}/
                {quizState.currentQuestionIndex + (quizState.showResult ? 1 : 0)}
              </span>
            </div>
          </div>
          {/* Question Section - Emphasized */}
          <div className="border-b border-blue-100 bg-blue-50 p-8 dark:border-slate-600 dark:bg-slate-700">
            {config.timeMode && !quizState.showResult && (
              <div className="mb-4">
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
                    Time Remaining
                  </span>
                  <span
                    className={`text-sm font-bold ${quizState.timeRemaining <= 3 ? 'text-red-500' : 'text-orange-500'}`}
                  >
                    {quizState.timeRemaining}s
                  </span>
                </div>
                <div className="h-2 w-full rounded-full bg-slate-200 dark:bg-slate-600">
                  <div
                    className={`h-2 rounded-full transition-all duration-1000 ease-linear ${
                      quizState.timeRemaining <= 3 ? 'bg-red-500' : 'bg-orange-500'
                    }`}
                    style={{
                      width: `${(quizState.timeRemaining / config.timeLimit) * 100}%`,
                    }}
                  />
                </div>
              </div>
            )}
            <h3 className="mb-2 text-2xl font-bold text-slate-900 dark:text-white">
              {(() => {
                const parts = currentQuestion.question.split(':');
                if (parts.length === 2) {
                  return (
                    <>
                      <div className="text-center">{parts[0].trim()}:</div>
                      <div className="mt-4 text-center text-3xl">{parts[1].trim()}</div>
                    </>
                  );
                }
                return currentQuestion.question;
              })()}
            </h3>
          </div>

          {/* Answer Options */}
          <div className="space-y-3 p-6">
            {currentQuestion.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswerSelect(option)}
                disabled={
                  quizState.showResult || (config.timeMode && quizState.timeRemaining === 0)
                }
                className={`w-full rounded-xl p-4 text-left font-semibold ${
                  quizState.showResult
                    ? option === currentQuestion.correctAnswer
                      ? 'border-2 border-green-500 bg-green-50 text-green-700 shadow-lg dark:bg-green-900/20 dark:text-green-300'
                      : option === quizState.selectedAnswer
                        ? 'border-2 border-red-500 bg-red-50 text-red-700 shadow-lg dark:bg-red-900/20 dark:text-red-300'
                        : 'border border-slate-200 bg-slate-50 text-slate-400 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-500'
                    : config.timeMode && quizState.timeRemaining === 0
                      ? 'cursor-not-allowed border border-slate-200 bg-slate-50 text-slate-400 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-500'
                      : quizState.selectedAnswer === option
                        ? 'border-2 border-blue-300 bg-white text-slate-700 hover:border-blue-300 hover:bg-blue-50 hover:shadow-md dark:border-blue-600 dark:bg-slate-700 dark:text-slate-300 dark:hover:border-blue-500 dark:hover:bg-slate-600'
                        : 'border-2 border-slate-200 bg-white text-slate-700 hover:border-blue-300 hover:bg-blue-50 hover:shadow-md dark:border-slate-600 dark:bg-slate-700 dark:text-slate-300 dark:hover:border-blue-500 dark:hover:bg-slate-600'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-lg">{option}</span>
                  {quizState.showResult && option === currentQuestion.correctAnswer && (
                    <span className="text-2xl text-green-600 dark:text-green-400">✓</span>
                  )}
                  {quizState.showResult &&
                    option === quizState.selectedAnswer &&
                    option !== currentQuestion.correctAnswer && (
                      <span className="text-2xl text-red-600 dark:text-red-400">✗</span>
                    )}
                  {!quizState.showResult && quizState.selectedAnswer === option && (
                    <span className="text-xl text-blue-500">✓</span>
                  )}
                </div>
              </button>
            ))}
          </div>

          {/* Result Feedback */}
          {quizState.showResult && (
            <div className="px-6 pb-4 text-center">
              <div
                className={`inline-flex items-center rounded-full px-6 py-3 text-lg font-bold ${
                  quizState.selectedAnswer === currentQuestion.correctAnswer
                    ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                    : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                }`}
              >
                {quizState.selectedAnswer === currentQuestion.correctAnswer ? (
                  <>
                    <span className="mr-2 text-2xl">🎉</span>
                    Correct!
                  </>
                ) : (
                  <>
                    <span className="mr-2 text-2xl">💭</span>
                    Incorrect
                  </>
                )}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col items-center space-y-4 p-6 pt-2">
            {!quizState.showResult ? (
              <>
                {config.timeMode && quizState.timeRemaining === 0 ? (
                  <div className="w-full rounded-xl bg-red-100 p-4 text-center dark:bg-red-900/20">
                    <p className="text-lg font-bold text-red-700 dark:text-red-400">
                      ⏰ Time's Up! Game Over
                    </p>
                  </div>
                ) : (
                  <button
                    onClick={submitAnswer}
                    disabled={!quizState.selectedAnswer}
                    className={`w-full rounded-xl px-8 py-4 text-lg font-bold transition-all duration-200 ${
                      quizState.selectedAnswer
                        ? 'bg-blue-600 text-white shadow-xl hover:scale-105 hover:bg-blue-700 hover:shadow-2xl active:scale-95 dark:bg-blue-500 dark:hover:bg-blue-600'
                        : 'cursor-not-allowed border border-slate-200 bg-slate-100 text-slate-400 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-500'
                    }`}
                  >
                    {quizState.selectedAnswer ? '✅ Submit Answer' : '👆 Select an answer'}
                  </button>
                )}
              </>
            ) : null}

            <button
              onClick={endGame}
              className="text-sm font-medium text-red-500 transition-colors hover:text-red-600 active:scale-95 dark:text-red-400 dark:hover:text-red-300"
            >
              🏃‍♂️ End Game Early
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizGame;
