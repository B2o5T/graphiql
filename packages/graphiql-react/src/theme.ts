import { useCallback, useLayoutEffect, useMemo, useState } from 'react';
import { useStorage } from './storage';

/**
 * The value `null` semantically means that the user does not explicitly choose
 * any theme, so we use the system default.
 */
export type Theme = 'light' | 'dark' | null;

export function useTheme(defaultTheme: Theme = null) {
  const storage = useStorage();

  const [theme, setThemeInternal] = useState<Theme>(() => {
    const stored = storage.get(STORAGE_KEY);
    switch (stored) {
      case 'light':
        return 'light';
      case 'dark':
        return 'dark';
      default:
        if (typeof stored === 'string') {
          // Remove the invalid stored value
          storage.set(STORAGE_KEY, '');
        }
        return defaultTheme;
    }
  });

  useLayoutEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    document.body.classList.remove('graphiql-light', 'graphiql-dark');
    if (theme) {
      document.body.classList.add(`graphiql-${theme}`);
    }
  }, [theme]);

  const setTheme = useCallback(
    (newTheme: Theme) => {
      storage.set(STORAGE_KEY, newTheme || '');
      setThemeInternal(newTheme);
    },
    [storage],
  );

  return useMemo(() => ({ theme, setTheme }), [theme, setTheme]);
}

const STORAGE_KEY = 'theme';
