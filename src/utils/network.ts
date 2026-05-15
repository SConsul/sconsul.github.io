/**
 * Network metrics derived from PerformanceResourceTiming + the Network
 * Information API (where available).
 */

import type { RuntimeStats } from '@/types';

interface NetInformation {
  effectiveType?: string;
  downlink?: number;
}

interface NavigatorWithNet extends Navigator {
  connection?: NetInformation;
}

/**
 * Refresh resource count + transferred bytes from the
 * PerformanceResourceTiming buffer, and pull effective connection type
 * from navigator.connection if available.
 *
 * Idempotent and cheap — safe to call from the per-tick callback.
 */
export function refreshNet(stats: RuntimeStats): void {
  const res = performance.getEntriesByType('resource') as PerformanceResourceTiming[];
  stats.resourceCount = res.length;
  stats.transferKB = res.reduce((sum, r) => sum + (r.transferSize || 0), 0) / 1024;

  const c = (navigator as NavigatorWithNet).connection;
  if (c) {
    stats.conn = c.effectiveType ?? 'unknown';
    stats.downlinkMbps = c.downlink ?? 0;
  }
}
