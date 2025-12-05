import { useState } from 'react';
import { GitHub } from 'react-feather';
import QuizGame from './components/QuizGame';
import ThemeToggle from './components/ThemeToggle';

function App() {
  const [isGameActive, setIsGameActive] = useState(false);

  return (
    <div className="flex min-h-screen flex-col bg-gray-50 transition-colors dark:bg-gray-900">
      {/* Floating Theme Toggle */}
      <div className="fixed top-4 right-4 z-50">
        <ThemeToggle />
      </div>

      {/* Main content */}
      <main className="container mx-auto grow px-0 py-0 md:px-4 md:py-8">
        <QuizGame onGameStateChange={setIsGameActive} />
      </main>

      {/* Footer - hidden when game is active */}
      {!isGameActive && (
        <footer className="border-t border-blue-100 bg-gradient-to-r from-blue-50 to-indigo-50 dark:border-gray-600 dark:from-gray-800 dark:to-gray-700">
          <div className="container mx-auto px-4 py-6">
            <div className="flex flex-col items-center gap-2 text-center">
              <a
                href="https://github.com/Amenokori/kana-quiz"
                target="_blank"
                className="flex items-center gap-1 text-sm text-blue-600 transition-colors hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
              >
                <GitHub size={14} />
                <span>View on GitHub</span>
              </a>

              <p className="text-sm text-gray-500 dark:text-gray-300">
                This project is open source, developed and maintained by{' '}
                <a
                  className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                  href="https://amenokori.com/"
                >
                  Amenokori
                </a>
                .
              </p>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
}

export default App;
