/**
 * Profiler — client-side wiring.
 *
 * Composes the utility modules in src/utils/ into a single entry point
 * that's invoked from src/components/Profiler.astro:
 *
 *   1.  Bootstraps theme + theme-toggle button.
 *   2.  Creates the per-frame perf monitor.
 *   3.  One-shot detections: GPU (WebGL) + vsync (rAF probe).
 *   4.  Subscribes Web Vitals observers.
 *   5.  Wires slim-bar click → panel toggle and tab switching.
 *   6.  Render loop: updates the slim bar every tick; only renders the
 *       active tab when the panel is open.
 */

import { $, $$, $maybe } from '@utils/dom';
import { createPerfMonitor, refreshLive } from '@utils/perf';
import { observeVitals } from '@utils/vitals';
import { refreshNet } from '@utils/network';
import { detectGpu, probeVsync } from '@utils/gpu';
import { buildSmiTable } from '@utils/smi-table';
import { frameLaneHtml } from '@utils/nsys';
import { initTheme, cycleTheme, getThemeMode, listenSystemTheme } from '@utils/theme';
import { initTooltips } from '@utils/tooltip';

/** Tabs available in the expanded profiler panel. */
type Tab = 'smi' | 'nsys';

/** Public entry point. Idempotent — calling twice is harmless. */
export function initProfiler(): void {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', wire, { once: true });
  } else {
    wire();
  }
}

function wire(): void {
  initTheme();
  listenSystemTheme();
  bindThemeToggle();
  initTooltips();

  const profilerEl = $maybe('profiler');
  if (!profilerEl) return; // profiler not present on this page

  // ─── Per-frame monitor + one-shot detections ──────────────────────────
  const monitor = createPerfMonitor();
  const stats = monitor.stats;

  const gpu = detectGpu();
  stats.gpu = gpu.model;
  stats.gpuFull = gpu.full;
  stats.vendor = gpu.vendor;

  void probeVsync().then((hz) => { stats.vsync = hz; });

  observeVitals(stats);

  // ─── Render functions ─────────────────────────────────────────────────
  let activeTab: Tab = 'smi';
  /** Counter for the per-tick aggregator. Used to throttle expensive
      refreshes (DOM scan, resource enumeration) when the profiler
      panel is closed — see the comment in `monitor.start(...)` below. */
  let tickCount = 0;

  const renderBar = (): void => {
    $('fps').textContent  = String(stats.fps);
    $('frame').textContent = `${stats.frameMs.toFixed(1)}ms`;
    $('heap').textContent = hasMemory() ? `${stats.heapMB.toFixed(1)}MB` : 'n/a';
    $('gpu').textContent  = stats.gpu;
    $('dom').textContent  = String(stats.domCount);
  };

  const renderSmi = (): void => {
    $('smiTable').innerHTML = buildSmiTable(stats);
  };

  const renderNsys = (): void => {
    const frameLane = $maybe('laneFrame');
    if (!frameLane) return;
    const h = frameLane.clientHeight || 20;
    frameLane.innerHTML = frameLaneHtml(performance.now(), monitor.history, h);

    const framesEl = $maybe('nsysFrames');
    if (framesEl) framesEl.textContent = String(monitor.history.length);
  };

  /** Render the active tab if the panel is open. */
  const renderActiveTab = (): void => {
    if (!profilerEl.classList.contains('open')) return;
    if (activeTab === 'smi') renderSmi();
    else renderNsys();
  };

  // ─── Tick handler — runs at perf.TICK_MS cadence (500 ms) ────────────
  // When the profiler panel is collapsed we don't need fresh values
  // for the expensive fields (`refreshLive` does an O(N) DOM scan,
  // `refreshNet` enumerates resource entries) — the only things the
  // slim bar displays are fps/frame/heap/gpu/dom, and dom rarely
  // changes between mounts. Throttle the expensive refreshes to
  // every 6 ticks (~3 s) when the panel is closed, keep them at every
  // tick when it's open.
  monitor.start(() => {
    tickCount++;
    const open = profilerEl.classList.contains('open');
    if (open || tickCount % 6 === 0) {
      refreshLive(stats);
      refreshNet(stats);
    }
    renderBar();
    if (open) {
      if (activeTab === 'smi') renderSmi();
      else renderNsys();
    }
  });

  // ─── Interactions: bar click, close, tab switch, dblclick-to-close ────
  bindBarToggle(profilerEl, renderActiveTab);
  bindClose(profilerEl);
  bindTabs((tab) => {
    activeTab = tab;
    renderActiveTab();
  });
  bindDblClickToClose(profilerEl);
}

// ────────────────────────────────────────────────────────────────────────────
// Wiring helpers
// ────────────────────────────────────────────────────────────────────────────

function bindThemeToggle(): void {
  const btn = $maybe<HTMLButtonElement>('themeToggle');
  if (!btn) return;
  syncLabel(btn);
  btn.addEventListener('click', () => {
    cycleTheme();
    syncLabel(btn);
  });
}

/** Button shows the current MODE (auto / light / dark), not the active theme. */
function syncLabel(btn: HTMLButtonElement): void {
  const mode = getThemeMode();
  btn.textContent = `[${mode === 'system' ? 'auto' : mode}]`;
}

function bindBarToggle(profilerEl: HTMLElement, onOpen: () => void): void {
  const bar = $('profilerBar');
  bar.addEventListener('click', (e) => {
    // Tab buttons + close button bubble up to here; ignore them.
    const target = e.target as HTMLElement;
    if (target.closest('.profiler-tab-btn, .close')) return;
    profilerEl.classList.toggle('open');
    onOpen();
  });
}

function bindClose(profilerEl: HTMLElement): void {
  $('profilerClose').addEventListener('click', (e) => {
    e.stopPropagation();
    profilerEl.classList.remove('open');
  });
}

/**
 * Double-clicking anywhere on the page outside the profiler closes it
 * when it's open. Convenience gesture — dismiss the panel without
 * having to aim for the small × close button.
 *
 * Side effect: a dblclick selects the word it lands on (browser
 * default), which still happens — we just close the panel as well.
 * Inside the profiler itself we let dblclick behave normally so users
 * can word-select metric labels.
 */
function bindDblClickToClose(profilerEl: HTMLElement): void {
  document.addEventListener('dblclick', (e) => {
    if (!profilerEl.classList.contains('open')) return;
    const target = e.target as HTMLElement | null;
    if (target?.closest('#profiler')) return;
    profilerEl.classList.remove('open');
  });
}

function bindTabs(onSwitch: (tab: Tab) => void): void {
  const buttons = $$<HTMLButtonElement>('.profiler-tab-btn');
  const panes = $$<HTMLElement>('.profiler-pane');
  for (const btn of buttons) {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const tab = btn.dataset['tab'] as Tab;
      for (const b of buttons) b.classList.toggle('active', b === btn);
      for (const p of panes)   p.hidden = p.dataset['pane'] !== tab;
      onSwitch(tab);
    });
  }
}

/** Chromium-only `performance.memory` capability check. */
function hasMemory(): boolean {
  return 'memory' in performance;
}
