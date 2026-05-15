/**
 * Light/dark theme — three-state model.
 *
 * Modes:
 *   - `'system'`  — follow prefers-color-scheme, live-updating when the OS theme changes.
 *   - `'light'`   — explicit override; ignores OS.
 *   - `'dark'`    — explicit override; ignores OS.
 *
 * Storage encoding:
 *   - `null` in localStorage = "system"
 *   - `"light"` / `"dark"` = the corresponding explicit override
 *
 * The active *rendered* theme is mirrored onto `<html data-theme="…">`;
 * CSS keys all palette swaps off that attribute.
 *
 * The toggle button cycles `system → light → dark → system → …`, which
 * gives users a way back to "auto" — without that, once you click the
 * toggle you'd be stuck in an explicit mode forever.
 */

import type { Theme } from '@/types';

/** User-selectable theme mode (`'system'` means: follow the OS). */
export type ThemeMode = 'system' | Theme;

const STORAGE_KEY = 'theme';

/** Read the OS-level preference, defaulting to light if matchMedia is absent. */
export function systemPreference(): Theme {
  if (typeof window === 'undefined' || !window.matchMedia) return 'light';
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

/** Current mode (`'system'` when no explicit override is stored). */
export function getThemeMode(): ThemeMode {
  if (typeof localStorage === 'undefined') return 'system';
  const v = localStorage.getItem(STORAGE_KEY);
  return v === 'dark' || v === 'light' ? v : 'system';
}

/** The theme that should render right now — explicit override or system fallback. */
export function resolveTheme(): Theme {
  const mode = getThemeMode();
  return mode === 'system' ? systemPreference() : mode;
}

/**
 * Set the user's preferred mode. `'system'` clears the override (so the
 * OS preference takes back over); explicit values are persisted.
 */
export function setThemeMode(mode: ThemeMode): void {
  try {
    if (mode === 'system') localStorage.removeItem(STORAGE_KEY);
    else localStorage.setItem(STORAGE_KEY, mode);
  } catch { /* private mode */ }
  document.documentElement.dataset['theme'] = mode === 'system' ? systemPreference() : mode;
}

/** Cycle: system → light → dark → system → … . Returns the new mode. */
export function cycleTheme(): ThemeMode {
  const current = getThemeMode();
  const next: ThemeMode =
    current === 'system' ? 'light' :
    current === 'light'  ? 'dark'  :
                           'system';
  setThemeMode(next);
  return next;
}

/** Apply the resolved theme. Safe to call from a pre-paint `<script>` block. */
export function initTheme(): Theme {
  const theme = resolveTheme();
  document.documentElement.dataset['theme'] = theme;
  return theme;
}

/**
 * Subscribe to OS-level theme changes. The handler only updates the page
 * when the user is in `'system'` mode — explicit overrides always win.
 */
export function listenSystemTheme(): void {
  if (typeof window === 'undefined' || !window.matchMedia) return;
  const mql = window.matchMedia('(prefers-color-scheme: dark)');
  mql.addEventListener('change', (e) => {
    if (getThemeMode() !== 'system') return;
    document.documentElement.dataset['theme'] = e.matches ? 'dark' : 'light';
  });
}
