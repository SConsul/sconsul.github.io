/**
 * Real GPU detection — uses WebGL's WEBGL_debug_renderer_info extension
 * to read the unmasked renderer string (e.g. "Apple M2 Pro", "RTX 4090").
 *
 * Some browsers / privacy configurations obfuscate the renderer; in that
 * case we degrade to a generic label rather than throwing.
 */

export interface GpuInfo {
  /** Short, display-ready model: "M2-Pro", "RTX-4090", "Intel-Iris". */
  readonly model: string;
  /** Raw renderer string as reported by WebGL. */
  readonly full: string;
  /** Raw vendor string as reported by WebGL. */
  readonly vendor: string;
}

const UNKNOWN: GpuInfo = { model: 'unknown', full: '', vendor: '' };

/**
 * Try to read the underlying GPU model/vendor via WebGL.
 *
 * Implementation note: we create a throwaway `<canvas>` rather than
 * reusing one in the DOM, to keep this function side-effect free.
 */
export function detectGpu(): GpuInfo {
  try {
    const canvas = document.createElement('canvas');
    const gl =
      (canvas.getContext('webgl') ||
        canvas.getContext('experimental-webgl')) as WebGLRenderingContext | null;
    if (!gl) return { model: 'no-webgl', full: '', vendor: '' };

    const ext = gl.getExtension('WEBGL_debug_renderer_info');
    const renderer: string = ext
      ? (gl.getParameter(ext.UNMASKED_RENDERER_WEBGL) as string)
      : (gl.getParameter(gl.RENDERER) as string);
    const vendor: string = ext
      ? (gl.getParameter(ext.UNMASKED_VENDOR_WEBGL) as string)
      : (gl.getParameter(gl.VENDOR) as string);

    return {
      model: shortGpuName(renderer ?? ''),
      full: renderer ?? '',
      vendor: vendor ?? '',
    };
  } catch {
    return UNKNOWN;
  }
}

/**
 * Heuristic shortening of the verbose renderer string to a marketing-name slug.
 *
 * Real renderer strings look like:
 *   - "ANGLE (Apple, ANGLE Metal Renderer: Apple M2 Pro, Unspecified Version)"
 *   - "ANGLE (NVIDIA, NVIDIA GeForce RTX 4090 (0x00002684) Direct3D11 vs_5_0…)"
 *   - "Mesa Intel(R) UHD Graphics 770 (RPL-S)"
 *
 * Order matters — Apple M-series is matched first because its substring
 * pattern is more specific.
 */
export function shortGpuName(raw: string): string {
  if (!raw) return 'unknown';
  let m: RegExpMatchArray | null;
  if ((m = raw.match(/Apple\s+(M\d+(?:\s+\w+)?)/))) return m[1]!.replace(/\s+/g, '-');
  if ((m = raw.match(/(RTX\s*\d+\s*\w*)/i)))       return m[1]!.replace(/\s+/g, '-');
  if ((m = raw.match(/(GTX\s*\d+\s*\w*)/i)))       return m[1]!.replace(/\s+/g, '-');
  if ((m = raw.match(/Radeon[^,)(]*?(\d{3,4}\s*\w*)/i))) {
    return 'Radeon-' + m[1]!.replace(/\s+/g, '');
  }
  if (/Iris/i.test(raw))        return 'Intel-Iris';
  if (/UHD/i.test(raw))         return 'Intel-UHD';
  if (/Intel/i.test(raw))       return 'Intel-GFX';
  if (/SwiftShader/i.test(raw)) return 'SwiftShader';
  return raw.split(/[(,]/)[0]!.trim().slice(0, 14).replace(/\s+/g, '-');
}

/**
 * Probe the effective vsync rate by sampling rAF intervals.
 *
 * Resolves with a value snapped to the closest common refresh rate
 * (60, 75, 90, 120, 144, 165, 240). Defaults to 60Hz if probing fails.
 */
export function probeVsync(samples = 30): Promise<number> {
  return new Promise((resolve) => {
    const dts: number[] = [];
    let last = performance.now();
    let n = 0;

    const step = (now: number): void => {
      if (n++ > 0) dts.push(now - last);
      last = now;
      if (n < samples) {
        requestAnimationFrame(step);
      } else {
        const avg = dts.reduce((a, b) => a + b, 0) / dts.length;
        const hz = Math.round(1000 / avg);
        const snap = [60, 75, 90, 120, 144, 165, 240].reduce((a, b) =>
          Math.abs(b - hz) < Math.abs(a - hz) ? b : a
        );
        resolve(snap);
      }
    };

    requestAnimationFrame(step);
  });
}
