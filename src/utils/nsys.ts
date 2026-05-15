/**
 * Renderer for the nsys-style timeline tab.
 *
 * The `frame::time` lane is driven by REAL frame samples — bar height is
 * proportional to frame duration (taller = slower frame), color steps
 * from green to yellow to red as the frame budget tightens.
 *
 * The CPU / GPU / network lanes currently render deterministic mock
 * activity so the timeline shape is visible. Wiring them to real
 * PerformanceObserver events (paint timings, longtask) is a follow-up.
 */

import type { FrameSample } from '@/types';
import { HISTORY_MS } from './perf';

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

/**
 * Deterministic faux-busy bars for the CPU/GPU/network lanes.
 *
 * Uses a tiny LCG seeded by `count` so the same parameters yield the
 * same bar pattern across renders — avoids visual jitter on re-open.
 */
export function fakeLaneHtml(
  count: number,
  color: string,
  maxWidthPct: number,
  opacity: number
): string {
  let seed = count * 1337;
  const rand = (): number => {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };

  const bars: string[] = [];
  for (let i = 0; i < count; i++) {
    const xPct = rand() * 100;
    const wPct = rand() * maxWidthPct + 0.4;
    bars.push(
      `<div class="bar" ` +
      `style="left:${xPct.toFixed(1)}%;width:${wPct.toFixed(2)}%;` +
      `background:${color};opacity:${opacity};"></div>`
    );
  }
  return bars.join('');
}

/** Pre-baked configurations for the three mock lanes. */
export const FAKE_LANE_CONFIG = {
  cpu: { count: 45, color: '#60a5fa', maxWidth: 1.6, opacity: 0.7 },
  gpu: { count: 28, color: '#a78bfa', maxWidth: 2.4, opacity: 0.75 },
  net: { count: 7,  color: '#fbbf24', maxWidth: 5.0, opacity: 0.85 },
} as const;
