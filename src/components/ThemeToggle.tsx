import { Monitor, Moon, Sun } from 'react-feather';
import { useTheme } from '../hooks/useTheme';

const ThemeToggle = () => {
  const { theme, setTheme } = useTheme();

  const themes = [
    { key: 'light' as const, icon: Sun, label: 'Light' },
    { key: 'dark' as const, icon: Moon, label: 'Dark' },
    { key: 'system' as const, icon: Monitor, label: 'System' },
  ];

  return (
    <div className="flex items-center gap-1 rounded-lg border border-gray-200 bg-white/90 p-1 shadow-lg backdrop-blur-sm dark:border-gray-700 dark:bg-gray-800/90">
      {themes.map(({ key, icon: Icon, label }) => (
        <button
          key={key}
          onClick={() => setTheme(key)}
          className={`flex cursor-pointer items-center gap-1.5 rounded-md px-2 py-1.5 text-sm font-medium transition-all duration-200 ${
            theme === key
              ? 'bg-gray-100 text-gray-900 shadow-sm dark:bg-gray-700 dark:text-gray-100'
              : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700/50 dark:hover:text-gray-100'
          } `}
          aria-label={`Switch to ${label.toLowerCase()} theme`}
          title={`Switch to ${label.toLowerCase()} theme`}
        >
          <Icon size={14} className="shrink-0" />
          <span className="hidden text-xs sm:inline">{label}</span>
        </button>
      ))}
    </div>
  );
};

export default ThemeToggle;
