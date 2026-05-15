/**
 * Shared TypeScript types used across data, utilities, and components.
 *
 * Kept centralized so that:
 *   - Data files declare their shape via `import type` (no runtime cost).
 *   - Utility modules speak in the same vocabulary as the data layer.
 *   - The profiler's RuntimeStats has one source of truth.
 *
 * All structural types here are immutable (`readonly`) by convention.
 * The profiler's RuntimeStats is the only mutable shape — it's a shared
 * mutable record that observers write into.
 */

// ─── Profile ────────────────────────────────────────────────────────────────

export interface Profile {
  readonly name: string;
  readonly tagline: string;
  readonly bio: string;
  /** A one-liner about what you're doing *right now*, shown in the hero pill. */
  readonly now: string;
  readonly location: string;
  readonly email: string;
  readonly github: string;
  readonly linkedin: string;
  readonly scholar: string;
  /** Absolute or root-relative URL to a downloadable resume PDF. */
  readonly resumeUrl: string;
}

// ─── Experience ─────────────────────────────────────────────────────────────

export interface ExperienceRole {
  readonly company: string;
  readonly location: string;
  readonly title: string;
  /** ISO month string, e.g. "2023-04". */
  readonly start: string;
  /** ISO month string, or `null` to indicate "present". */
  readonly end: string | null;
  /** Bullet-point summaries of the role; one sentence each. */
  readonly highlights: readonly string[];
}

// ─── Projects ───────────────────────────────────────────────────────────────

export type ProjectStatus = 'wip' | 'shipped' | 'archived';

export interface Project {
  readonly id: string;
  readonly title: string;
  readonly description: string;
  readonly tech: readonly string[];
  readonly status: ProjectStatus;
  readonly url?: string;
  /** When true, the project is featured on the home page. */
  readonly featured?: boolean;
}

// ─── Publications ───────────────────────────────────────────────────────────

export interface Publication {
  readonly title: string;
  readonly venue: string;
  readonly year: number;
  readonly url: string;
}

// ─── Education ──────────────────────────────────────────────────────────────

export interface EducationEntry {
  readonly school: string;
  readonly degree: string;
  readonly notes?: string;
}

// ─── Tech stack ─────────────────────────────────────────────────────────────

export interface StackGroup {
  readonly category: string;
  readonly items: readonly string[];
}

// ─── Profiler ───────────────────────────────────────────────────────────────

export type Theme = 'light' | 'dark';

/**
 * Mutable record of live runtime statistics, shared between the perf monitor,
 * Web Vitals observers, network refresher, and the table renderers.
 *
 * NOT `readonly` — observers mutate fields directly to avoid per-tick
 * object allocation in the hot path.
 */
export interface RuntimeStats {
  // rendering
  fps: number;
  frameMs: number;
  frameId: number;
  // memory
  heapMB: number;
  heapLimitMB: number;
  // gpu / display
  /** Short, display-ready model name (e.g. "M2-Pro", "RTX-4090"). */
  gpu: string;
  /** Raw renderer string from WebGL_debug_renderer_info. */
  gpuFull: string;
  vendor: string;
  /** Display refresh rate snapped to a common value (60/120/144/...). */
  vsync: number;
  /** Viewport, formatted as "WIDTH×HEIGHT". */
  vp: string;
  dpr: number;
  // dom
  domCount: number;
  paints: number;
  longTasks: number;
  // net
  resourceCount: number;
  transferKB: number;
  /** navigator.connection.effectiveType (e.g. "4g", "wifi"). */
  conn: string;
  downlinkMbps: number;
  // web vitals
  lcp: number;
  fcp: number;
  cls: number;
  inp: number;
  tbt: number;
  // uptime — `performance.now()` at startup
  tStart: number;
}

export type VitalMetric = 'lcp' | 'fcp' | 'cls' | 'inp' | 'tbt';
export type VitalStatus = 'good' | 'needs-improvement' | 'poor';

/** One sample in the frame-time ring buffer used by the nsys timeline. */
export interface FrameSample {
  readonly t: number;
  readonly dt: number;
}
