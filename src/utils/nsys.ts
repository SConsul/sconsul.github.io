/**
 * Renderer for the nsys-style timeline tab.
 *
 * Four lanes:
 *   - `cpu::main`  ← longtask PerformanceObserver
 *   - `gpu::paint` ← paint + layout-shift PerformanceObservers
 *   - `net::xhr`   ← resource PerformanceObserver
 *   - `frame::time`← real 5-second frame ring buffer (from perf.ts)
 *
 * Lanes are sparse during idle by design — modern browsers do very
 * little when nothing's happening. Interact (scroll, click, navigate)
 * to see activity.
 */

import type { FrameSample, EventSample } from '@/types';
import { HISTORY_MS } from './perf';

// ─── Frame-time lane (existing) ─────────────────────────────────────────────

/** Color a frame-time bar by render budget. */
export function frameColor(dt: number): string {
  if (dt < 18) return '#4ade80'; // green: well under 60Hz budget
  if (dt < 34) return '#facc15'; // yellow: missed 60Hz, under 30Hz
  return '#f87171';              // red:    dropped below 30Hz
}

/**
 * Produce HTML for the frame-time lane from the live history buffer.
 *
 * Bars are positioned by percentage along the lane (old → new = left → right).
 * `laneHeight` is the pixel height of the containing `.lane` element;
 * it caps bar height so very slow frames don't overflow visually.
 */
export function frameLaneHtml(now: number, history: readonly FrameSample[], laneHeight: number): string {
  return history
    .map(({ t, dt }) => {
      const ageMs = now - t;
      const xPct = (1 - ageMs / HISTORY_MS) * 100;
      const h = Math.min(laneHeight - 2, (dt / 33) * (laneHeight - 2));
      return (
        `<div class="bar" style="left:${xPct.toFixed(2)}%;` +
        `height:${h.toFixed(1)}px;background:${frameColor(dt)};"></div>`
      );
    })
    .join('');
}

// ─── Event lanes (cpu, gpu, net) ────────────────────────────────────────────

export interface EventLaneOptions {
  /** Tailwind-style hex (e.g. '#60a5fa'). */
  readonly color: string;
  /** Bar opacity, 0..1. */
  readonly opacity?: number;
  /**
   * Minimum bar width in % of the lane, so instantaneous events
   * (duration=0, e.g. paint markers) still render as a visible tick.
   */
  readonly minWidthPct?: number;
}

/**
 * Produce HTML for an event lane from a rolling event history. Each
 * event becomes one bar; horizontal position = age, width = duration.
 *
 * Old samples that have rolled out of the window are not skipped here
 * — the caller is expected to trim the array. (We could skip-render
 * them too, but trimming keeps the histories from growing unbounded
 * across the page lifetime.)
 */
export function eventLaneHtml(
  now: number,
  history: readonly EventSample[],
  opts: EventLaneOptions,
): string {
  const opacity = opts.opacity ?? 0.85;
  const minWidthPct = opts.minWidthPct ?? 0.4;
  return history
    .map(({ t, duration }) => {
      const ageMs = now - t;
      const xPct = (1 - ageMs / HISTORY_MS) * 100;
      const wPct = Math.max(minWidthPct, (duration / HISTORY_MS) * 100);
      return (
        `<div class="bar" style="left:${xPct.toFixed(2)}%;` +
        `width:${wPct.toFixed(2)}%;background:${opts.color};` +
        `opacity:${opacity};"></div>`
      );
    })
    .join('');
}

/** Pre-baked color/opacity pairs for the three event lanes. */
export const EVENT_LANE_STYLE = {
  cpu: { color: '#f87171', opacity: 0.85, minWidthPct: 0.5 }, // red: long tasks are bad
  gpu: { color: '#a78bfa', opacity: 0.85, minWidthPct: 0.5 }, // purple: paint events
  net: { color: '#fbbf24', opacity: 0.85, minWidthPct: 0.5 }, // amber: net activity
} as const;

/**
 * Drop samples older than `windowMs` from the head of the array.
 * O(k) where k is the number of expired samples — cheap because we
 * only run it once per render.
 */
export function trimHistory(history: EventSample[], now: number, windowMs: number = HISTORY_MS): void {
  while (history.length > 0 && history[0]!.t < now - windowMs) {
    history.shift();
  }
}
