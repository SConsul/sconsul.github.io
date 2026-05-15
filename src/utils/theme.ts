/**
 * Light/dark theme.
 *
 * Three-state model:
 *   - `null` in localStorage → "system" (follows prefers-color-scheme,
 *     and live-updates when the OS theme changes)
 *   - `"light"` or `"dark"`   → explicit user override; ignores the OS
 *
 * The active value is mirrored onto `<html data-theme="…">`; CSS keys
 * all palette swaps off that attribute (see styles/global.css).
 */

import type { Theme } from '@/types';

const STORAGE_KEY = 'theme';

/** Read the OS-level preference, defaulting to light if matchMedia is absent. */
export function systemPreference(): Theme {
  if (typeof window === 'undefined' || !window.matchMedia) return 'light';
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

/**
 * Read the *explicit* stored preference, if any. Returns `null` when
 * the user hasn't picked one (in which case callers should fall back
 * to {@link systemPreference}).
 */
export function getStoredTheme(): Theme | null {
  if (typeof localStorage === 'undefined') return null;
  const v = localStorage.getItem(STORAGE_KEY);
  return v === 'dark' || v === 'light' ? v : null;
}

/** Resolve the theme that should currently render: stored override → system. */
export function resolveTheme(): Theme {
  return getStoredTheme() ?? systemPreference();
}

/** Apply a theme to <html> and persist it as an explicit override. */
export function applyTheme(theme: Theme): void {
  document.documentElement.dataset['theme'] = theme;
  try { localStorage.setItem(STORAGE_KEY, theme); } catch { /* private mode */ }
}

/** Flip the *currently rendered* theme. Always sets an explicit override. */
export function toggleTheme(): Theme {
  const current = (document.documentElement.dataset['theme'] as Theme | undefined) ?? resolveTheme();
  const next: Theme = current === 'dark' ? 'light' : 'dark';
  applyTheme(next);
  return next;
}

/**
 * Apply the resolved theme. Safe to call from a `<script>` block in
 * `<head>` — `localStorage` and `matchMedia` are both synchronous.
 */
export function initTheme(): Theme {
  const theme = resolveTheme();
  document.documentElement.dataset['theme'] = theme;
  return theme;
}

/**
 * Subscribe to OS-level theme changes. The handler only fires when the
 * user has NOT set an explicit override; an explicit choice always wins.
 */
export function listenSystemTheme(): void {
  if (typeof window === 'undefined' || !window.matchMedia) return;
  const mql = window.matchMedia('(prefers-color-scheme: dark)');
  mql.addEventListener('change', (e) => {
    if (getStoredTheme() !== null) return; // explicit override wins
    document.documentElement.dataset['theme'] = e.matches ? 'dark' : 'light';
  });
}
