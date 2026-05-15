/**
 * ASCII renderer for the nvidia-smi-style table inside the profiler panel.
 *
 * Layout uses real nvidia-smi column proportions (29/22/21) and the
 * classic `+`, `-`, `|`, `=` box-drawing characters. Cells may contain
 * inline `<span class="ok|dim|warn|err|hl">` tags; column-width math
 * uses {@link visibleLength}/{@link padToVis} so colors don't break
 * alignment.
 *
 * The output is a single multi-line string designed to be assigned to
 * `pre.innerHTML` in a monospace font.
 */

import type { RuntimeStats, VitalMetric } from '@/types';
import { padToVis, padL, padR, formatUptime, clipVis } from './format';
import { classify } from './vitals';

// ─── Layout constants ───────────────────────────────────────────────────────

/** Inner content widths for the 3 columns (pre-padding). */
const W = [29, 22, 21] as const;
const SEP = '|';
/** Total visible width of a row spanning all 3 columns + separators. */
const FULL_INNER = W[0] + W[1] + W[2] + 6;

const dashRow = (ch: string): string =>
  `+${ch.repeat(W[0] + 2)}+${ch.repeat(W[1] + 2)}+${ch.repeat(W[2] + 2)}+`;

const BORDER  = dashRow('-');
const SECTION = dashRow('=');

const row3 = (a: string, b: string, c: string): string =>
  `${SEP} ${padToVis(a, W[0])} ${SEP} ${padToVis(b, W[1])} ${SEP} ${padToVis(c, W[2])} ${SEP}`;

const fullRow = (s: string): string =>
  `${SEP} ${padToVis(s, FULL_INNER)} ${SEP}`;

// ─── Color span helpers ─────────────────────────────────────────────────────

const span = (cls: string, s: string): string => `<span class="${cls}">${s}</span>`;
const ok   = (s: string): string => span('ok',   s);
const dim  = (s: string): string => span('dim',  s);
const warn = (s: string): string => span('warn', s);
const err  = (s: string): string => span('err',  s);
const hl   = (s: string): string => span('hl',   s);

// ─── Public API ─────────────────────────────────────────────────────────────

/**
 * Build the HTML for the entire nvidia-smi panel from a stats snapshot.
 * Pure function — safe to call every render tick.
 */
export function buildSmiTable(stats: RuntimeStats): string {
  const ua = matchUserAgent();
  const fid = padL(stats.frameId, 5, '0');
  const cpu = padL(Math.min(99, Math.round((stats.frameMs / 16.7) * 8)), 2);
  const uptime = formatUptime(performance.now() - stats.tStart);

  // Pre-format variable-width values to fit their cells.
  const fps    = padL(stats.fps, 3);
  const frame  = padL(stats.frameMs.toFixed(1) + 'ms', 7);
  const heap   = padL(stats.heapMB.toFixed(1) + 'MB', 7);
  const heapT  = padL((stats.heapLimitMB | 0) + 'MB', 7);
  const gpuStr = padL(stats.gpu, 14);
  const vp     = padL(stats.vp || '--', 11);
  const hz     = padL(stats.vsync + 'Hz', 5);
  const dom    = padL(stats.domCount, 4);
  const paints = padL(stats.paints, 3);
  const lts    = padL(stats.longTasks, 2);
  const reqs   = padL(stats.resourceCount, 3);
  const kb     = padL(stats.transferKB.toFixed(0) + 'KB', 6);
  const conn   = padL(stats.conn, 8);
  const dl     = stats.downlinkMbps ? `${stats.downlinkMbps}Mbps` : 'n/a';
  const netStatus = stats.resourceCount > 0 ? ok('done') : dim('idle');

  const lines: string[] = [
    BORDER,
    fullRow(`${hl('sarthak-smi 0.1.0')}     Browser: ${ua}     Build: a3f2c8     up: ${uptime}`),
    BORDER,
    row3('LN  Process           Pers.', 'Identifier        Disp.', 'Volatile   Status'),
    row3('Metric            Perf  Pwr', '       Usage', 'Util       Mode'),
    SECTION,

    // ── Lane 0: render::main ──
    ...lane(
      ` 0  render::main        ${ok('On')}`,
      `frame:${fid}      ${ok('live')}`,
      `${fps} ${frame}  P0  12W/64W`,
      ` ${heap} / ${heapT}`,
      `   ${cpu}%      RAF`
    ),

    // ── Lane 1: display::gpu (real GPU info) ──
    ...lane(
      ` 1  display::gpu        ${ok('On')}`,
      `${gpuStr}    ${ok('live')}`,
      `${hz} ${vp}    P2  34W/64W`,
      clipVis(` dpr: ${stats.dpr.toFixed(1)}x  vsync: ${stats.vsync}`, W[1]),
      `             paint`
    ),

    // ── Lane 2: dom::tree ──
    ...lane(
      ` 2  dom::tree           ${ok('On')}`,
      `paints:${paints}        ${ok('idle')}`,
      `${dom} nodes  long-tasks: ${lts}`,
      `  layout-shifts:${padL(stats.cls.toFixed(3), 5)}`,
      `   --       clean`
    ),

    // ── Lane 3: net::xhr ──
    ...lane(
      ` 3  net::xhr            ${ok('On')}`,
      `${reqs} reqs        ${netStatus}`,
      ` ${kb}     P8   2W/64W`,
      clipVis(` conn:${conn} ${dl.padStart(6)}`, W[1]),
      `   0%       done`
    ),

    // ── Web Vitals section ──
    '',
    BORDER,
    fullRow(`${hl('Web Vitals:')}                                              Status`),
    fullRow('Metric            Value         Threshold              Status'),
    SECTION,
    fullRow(vitalRow('LCP', stats.lcp, 'ms', '< 2500ms', 'lcp')),
    fullRow(vitalRow('FCP', stats.fcp, 'ms', '< 1800ms', 'fcp')),
    fullRow(vitalRow('CLS', stats.cls, '',   '< 0.10',   'cls')),
    fullRow(vitalRow('INP', stats.inp, 'ms', '< 200ms',  'inp')),
    fullRow(vitalRow('TBT', stats.tbt, 'ms', '< 200ms',  'tbt')),
    BORDER,
  ];

  return lines.join('\n');
}

// ─── Internals ──────────────────────────────────────────────────────────────

/** Build a 2-row lane group: status row, metric row, closing border. */
function lane(top1: string, top2: string, bot1: string, bot2: string, bot3: string): string[] {
  return [
    row3(top1, top2, `                 ${ok('OK')}`),
    row3(bot1, bot2, bot3),
    BORDER,
  ];
}

/** Format a Web Vitals row with a colored status tag. */
function vitalRow(
  name: string,
  value: number,
  suffix: string,
  threshold: string,
  metric: VitalMetric
): string {
  const displayValue = metric === 'cls' ? value.toFixed(3) : `${value.toFixed(0)}${suffix}`;
  const status = classify(metric, value);
  const colored =
    status === 'good' ? ok(status) :
    status === 'poor' ? err(status) :
                        warn(status);
  return `${padR(name, 17)} ${padR(displayValue, 13)} ${padR(threshold, 22)} ${colored}`;
}

/** Best-effort short user-agent tag (e.g. "Chrome/138", "Safari/605"). */
function matchUserAgent(): string {
  const match = navigator.userAgent.match(/Chrome\/\d+|Firefox\/\d+|Safari\/\d+/);
  return match ? match[0] : 'Browser/?';
}
