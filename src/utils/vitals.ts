/**
 * Web Vitals observers + classification helpers.
 *
 * Wires PerformanceObservers for:
 *   - paint            → first-contentful-paint (FCP) + paint count
 *   - largest-contentful-paint → LCP
 *   - layout-shift     → CLS (excluding shifts within 500ms of input)
 *   - longtask         → TBT estimate + long-task count
 *   - event            → INP approximation
 *
 * Updates mutate the shared RuntimeStats object directly — no allocation
 * per event.
 */

import type { RuntimeStats, VitalMetric, VitalStatus } from '@/types';

/** Lighthouse-style thresholds. */
interface VitalThreshold {
  readonly good: number;
  readonly needsImprovement: number;
}

export const VITAL_THRESHOLDS: Readonly<Record<VitalMetric, VitalThreshold>> = {
  lcp: { good: 2500, needsImprovement: 4000 },
  fcp: { good: 1800, needsImprovement: 3000 },
  cls: { good: 0.10, needsImprovement: 0.25 },
  inp: { good: 200,  needsImprovement: 500 },
  tbt: { good: 200,  needsImprovement: 600 },
};

/** Classify a vital reading into Lighthouse's three buckets. */
export function classify(metric: VitalMetric, value: number): VitalStatus {
  const t = VITAL_THRESHOLDS[metric];
  if (value <= t.good) return 'good';
  if (value <= t.needsImprovement) return 'needs-improvement';
  return 'poor';
}

/**
 * Browser-typed access to non-standard layout-shift entry fields.
 * The shape is stable in Chromium; defining it locally avoids leaking
 * unsupported types into the public API.
 */
interface LayoutShiftEntry extends PerformanceEntry {
  readonly value: number;
  readonly hadRecentInput: boolean;
}

/**
 * Subscribe to Web Vitals streams and mirror values into the provided
 * stats record. Silently no-ops for entry types the current browser
 * doesn't support (e.g. Safari currently lacks LCP).
 */
export function observeVitals(stats: RuntimeStats): void {
  observe('paint', (entries) => {
    stats.paints += entries.length;
    for (const e of entries) {
      if (e.name === 'first-contentful-paint') stats.fcp = e.startTime;
    }
  });

  observe('largest-contentful-paint', (entries) => {
    const last = entries[entries.length - 1];
    if (last) stats.lcp = last.startTime;
  });

  observe<LayoutShiftEntry>('layout-shift', (entries) => {
    for (const e of entries) {
      // Exclude shifts that occur within 500ms of user input — they're
      // expected (e.g. accordion expand), not site-quality issues.
      if (!e.hadRecentInput) stats.cls += e.value;
    }
  });

  observe('longtask', (entries) => {
    stats.longTasks += entries.length;
    for (const e of entries) {
      // TBT = sum of (duration - 50ms) over long tasks, per the spec.
      stats.tbt += Math.max(0, e.duration - 50);
    }
  });

  observe('event', (entries) => {
    for (const e of entries) {
      if (e.duration > stats.inp) stats.inp = e.duration;
    }
  });
}

/**
 * Internal: subscribe to a single performance entry type, swallowing
 * errors that indicate the type isn't supported in this browser.
 */
function observe<T extends PerformanceEntry = PerformanceEntry>(
  type: string,
  cb: (entries: T[]) => void
): void {
  try {
    const obs = new PerformanceObserver((list) => cb(list.getEntries() as T[]));
    obs.observe({ type, buffered: true } as PerformanceObserverInit);
  } catch {
    // Entry type not supported — degrade silently.
  }
}
