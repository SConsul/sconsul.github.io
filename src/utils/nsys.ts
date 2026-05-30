/**
 * Renderer for the nsys-style timeline tab.
 *
 * Currently only one lane is drawn: `frame::time`, fed from the real
 * 5-second frame ring buffer maintained by the perf monitor. Earlier
 * versions had three additional lanes (`cpu::main`, `gpu::paint`,
 * `net::xhr`) drawn with deterministic mock bars — they're gone now
 * because "static-looking placeholder" was worse than "no lane".
 *
 * If we want to bring those lanes back, the path is real
 * PerformanceObserver streams: `longtask` for CPU, `paint` for paint
 * events, `resource` for network. They'd be sparse during idle but
 * accurate.
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
