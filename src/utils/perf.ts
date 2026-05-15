/**
 * Per-frame performance monitor.
 *
 * Maintains an FPS / frame-time / heap snapshot plus a 5-second ring
 * buffer of frame samples (consumed by the nsys timeline renderer).
 *
 * The monitor is a singleton-able factory: call {@link createPerfMonitor}
 * once and pass the returned `stats` / `history` to other modules.
 */

import type { RuntimeStats, FrameSample } from '@/types';

/** Rolling window kept for the nsys frame::time lane. */
export const HISTORY_MS = 5000;

/** Cadence at which aggregate fields are recomputed and onTick fires. */
export const TICK_MS = 500;

export interface PerfMonitor {
  /** Mutable shared stats — other modules also write into this. */
  readonly stats: RuntimeStats;
  /** Sliding 5-second frame history (oldest first). */
  readonly history: FrameSample[];
  /**
   * Begin the rAF loop.
   * @param onTick fires every {@link TICK_MS} ms, after stats are refreshed.
   */
  start(onTick?: () => void): void;
}

/**
 * Browser-typed access to non-standard `performance.memory`
 * (Chromium-only at time of writing).
 */
interface PerformanceWithMemory extends Performance {
  memory?: {
    usedJSHeapSize: number;
    jsHeapSizeLimit: number;
  };
}

/**
 * Create a new perf monitor with zeroed stats.
 *
 * Field defaults are tuned so that early renders (before the first tick
 * completes) display "--" rather than NaN — see `gpu: 'detecting'`,
 * `vsync: 60`, etc.
 */
export function createPerfMonitor(): PerfMonitor {
  const stats: RuntimeStats = {
    fps: 0,
    frameMs: 0,
    frameId: 0,
    heapMB: 0,
    heapLimitMB: 256,
    gpu: 'detecting',
    gpuFull: '',
    vendor: '',
    vsync: 60,
    vp: '',
    dpr: typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1,
    domCount: 0,
    paints: 0,
    longTasks: 0,
    resourceCount: 0,
    transferKB: 0,
    conn: 'unknown',
    downlinkMbps: 0,
    lcp: 0,
    fcp: 0,
    cls: 0,
    inp: 0,
    tbt: 0,
    tStart: typeof performance !== 'undefined' ? performance.now() : 0,
  };

  const history: FrameSample[] = [];
  let lastWinTs = stats.tStart;
  let lastFrameTs = stats.tStart;
  let frameCount = 0;

  function start(onTick?: () => void): void {
    const loop = (now: number): void => {
      // Per-frame book-keeping (cheap; runs every animation frame).
      const dt = now - lastFrameTs;
      lastFrameTs = now;
      stats.frameId++;
      frameCount++;
      history.push({ t: now, dt });

      // Evict samples that have aged out of the rolling window.
      while (history.length > 0 && history[0]!.t < now - HISTORY_MS) {
        history.shift();
      }

      // Periodic aggregation (only every TICK_MS, to avoid jitter).
      const winMs = now - lastWinTs;
      if (winMs >= TICK_MS) {
        stats.fps = Math.round((frameCount * 1000) / winMs);
        stats.frameMs = winMs / frameCount;

        const mem = (performance as PerformanceWithMemory).memory;
        if (mem) {
          stats.heapMB = mem.usedJSHeapSize / 1_048_576;
          stats.heapLimitMB = mem.jsHeapSizeLimit / 1_048_576;
        }

        frameCount = 0;
        lastWinTs = now;
        onTick?.();
      }

      requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);
  }

  return { stats, history, start };
}

/**
 * Cheap, on-demand refresh of fields whose update doesn't fit elsewhere
 * (DOM count, viewport string). Call from the per-tick callback.
 */
export function refreshLive(stats: RuntimeStats): void {
  stats.vp = `${window.innerWidth}×${window.innerHeight}`;
  stats.domCount = document.getElementsByTagName('*').length;
}
