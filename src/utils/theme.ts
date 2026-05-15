/**
 * Light/dark theme — applied as a `data-theme` attribute on `<html>`,
 * persisted in localStorage. CSS keys all colors off this attribute via
 * the `[data-theme="dark"]` selector in global.css.
 */

import type { Theme } from '@/types';

const STORAGE_KEY = 'theme';

/** Read the persisted theme, defaulting to "light" if absent or invalid. */
export function getStoredTheme(): Theme {
  if (typeof localStorage === 'undefined') return 'light';
  return localStorage.getItem(STORAGE_KEY) === 'dark' ? 'dark' : 'light';
}

/** Apply a theme to `<html>` and persist it. */
export function applyTheme(theme: Theme): void {
  document.documentElement.dataset['theme'] = theme;
  try { localStorage.setItem(STORAGE_KEY, theme); } catch { /* private mode */ }
}

/** Flip the current theme. Returns the new value. */
export function toggleTheme(): Theme {
  const current = (document.documentElement.dataset['theme'] as Theme | undefined) ?? 'light';
  const next: Theme = current === 'dark' ? 'light' : 'dark';
  applyTheme(next);
  return next;
}

/**
 * Apply the stored theme as early as possible to avoid a FOUC. Call
 * from a `<script>` block in `<head>` (before stylesheets) for best
 * results.
 */
export function initTheme(): Theme {
  const theme = getStoredTheme();
  applyTheme(theme);
  return theme;
}
