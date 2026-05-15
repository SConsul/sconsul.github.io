/**
 * String formatting and padding helpers.
 *
 * Used primarily by the profiler's nvidia-smi table renderer to align
 * columns whose cells may contain inline HTML color spans
 * (`<span class="ok">…</span>`). Naïve `String.padEnd` counts tag
 * characters, which would break alignment — {@link padToVis} measures
 * *visible* length only.
 */

/** Returns the visible length of a string, ignoring HTML tags. */
export function visibleLength(s: string): number {
  return s.replace(/<[^>]+>/g, '').length;
}

/**
 * Pad a string with trailing spaces to reach `width` *visible* characters.
 * If the visible length already exceeds `width`, the string is returned
 * unchanged (never truncated — callers must clip beforehand if needed).
 */
export function padToVis(s: string, width: number): string {
  const need = width - visibleLength(s);
  return need > 0 ? s + ' '.repeat(need) : s;
}

/** Right-align (`padStart`) — convenience for stringly-numeric values. */
export function padL(value: string | number, width: number, fillChar = ' '): string {
  return String(value).padStart(width, fillChar);
}

/** Left-align (`padEnd`) — convenience that accepts numbers. */
export function padR(value: string | number, width: number, fillChar = ' '): string {
  return String(value).padEnd(width, fillChar);
}

/**
 * Format an elapsed-milliseconds duration as `mMss`.
 *
 *     formatUptime(83_000)  // "1m23s"
 *     formatUptime(9_500)   // "0m09s"
 */
export function formatUptime(ms: number): string {
  const totalSec = Math.floor(ms / 1000);
  const min = Math.floor(totalSec / 60);
  const sec = String(totalSec % 60).padStart(2, '0');
  return `${min}m${sec}s`;
}

/** Bytes → MB (raw float; caller decides how to format). */
export function bytesToMB(bytes: number): number {
  return bytes / 1_048_576;
}

/**
 * Truncate to N visible characters, ignoring HTML tags.
 * Tags pass through; visible text is sliced. Used when an injected value
 * (e.g. GPU name) may exceed a fixed column width.
 */
export function clipVis(s: string, width: number): string {
  if (visibleLength(s) <= width) return s;
  // Slow path: walk the string and count visible chars; only happens for
  // overflow cases so allocation cost is negligible.
  let out = '';
  let vis = 0;
  let inTag = false;
  for (const ch of s) {
    if (ch === '<') inTag = true;
    if (!inTag) {
      if (vis >= width) break;
      vis++;
    }
    out += ch;
    if (ch === '>') inTag = false;
  }
  return out;
}
