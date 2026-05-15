/**
 * Site-wide tooltip system.
 *
 * Any element with a `data-tooltip="…"` attribute gets a small dark
 * popover after a short hover delay. The popover is a single floating
 * `<div>` appended to `<body>` — positioned with `position: fixed` so:
 *
 *   1. It can escape `overflow: hidden` clipping on parents (profiler
 *      panel, narrow card meta footers).
 *   2. It can be clamped to the viewport, which is the main reason this
 *      module exists: a centered CSS `::after` tooltip overflows the
 *      browser edge when its anchor is near the left or right gutter.
 *
 * The delay before show (`SHOW_DELAY_MS`) matches the OS "long hover"
 * convention — fast enough to feel responsive, slow enough not to fire
 * when the cursor is just passing through.
 */

const SHOW_DELAY_MS = 500;
const HIDE_DELAY_MS = 80;
const VIEWPORT_PADDING_PX = 8;
const VERTICAL_OFFSET_PX = 8;

/** The single shared popover element (created lazily). */
let tip: HTMLDivElement | null = null;
let showTimer: number | null = null;
let hideTimer: number | null = null;
let activeTarget: HTMLElement | null = null;

/**
 * Install global hover listeners. Idempotent — safe to call multiple times.
 * Call once per page from a client-side script.
 */
export function initTooltips(root: HTMLElement | Document = document): void {
  if ((root as HTMLElement & { __ttBound?: boolean }).__ttBound) return;
  (root as HTMLElement & { __ttBound?: boolean }).__ttBound = true;

  root.addEventListener('mouseover', onEnter as EventListener);
  root.addEventListener('mouseout', onLeave as EventListener);
  root.addEventListener('focusin', onEnter as EventListener);
  root.addEventListener('focusout', onLeave as EventListener);

  // Stale positioning is worse than no tooltip — hide aggressively on
  // viewport changes.
  window.addEventListener('scroll', hideNow, { passive: true, capture: true });
  window.addEventListener('resize', hideNow);
}

function onEnter(e: Event): void {
  const target = (e.target as HTMLElement | null)?.closest<HTMLElement>('[data-tooltip]');
  if (!target) return;
  const text = target.dataset['tooltip'];
  if (!text) return;
  scheduleShow(target, text);
}

function onLeave(e: Event): void {
  const me = e as MouseEvent;
  const target = (me.target as HTMLElement | null)?.closest<HTMLElement>('[data-tooltip]');
  if (!target) return;
  // Ignore movement between descendants of the same tooltipped element.
  const related = (me.relatedTarget as Node | null) ?? null;
  if (related && target.contains(related)) return;
  scheduleHide();
}

function scheduleShow(target: HTMLElement, text: string): void {
  cancelHide();
  cancelShow();
  activeTarget = target;
  showTimer = window.setTimeout(() => {
    showTimer = null;
    render(target, text);
  }, SHOW_DELAY_MS);
}

function scheduleHide(): void {
  cancelShow();
  cancelHide();
  hideTimer = window.setTimeout(hideNow, HIDE_DELAY_MS);
}

function cancelShow(): void {
  if (showTimer !== null) { clearTimeout(showTimer); showTimer = null; }
}
function cancelHide(): void {
  if (hideTimer !== null) { clearTimeout(hideTimer); hideTimer = null; }
}

function hideNow(): void {
  cancelShow();
  cancelHide();
  activeTarget = null;
  if (tip) tip.classList.remove('visible');
}

function render(target: HTMLElement, text: string): void {
  const el = ensureTip();
  el.textContent = text;
  el.classList.add('visible');

  // Position after layout so we have measured dimensions to clamp.
  requestAnimationFrame(() => {
    if (activeTarget !== target) return; // user moved away during the rAF gap

    const anchor = target.getBoundingClientRect();
    const tipRect = el.getBoundingClientRect();
    const vw = window.innerWidth;

    // Center horizontally on the anchor, then clamp to the viewport.
    let x = anchor.left + anchor.width / 2 - tipRect.width / 2;
    x = Math.max(
      VIEWPORT_PADDING_PX,
      Math.min(x, vw - tipRect.width - VIEWPORT_PADDING_PX)
    );

    // Default position: above the anchor. If that would clip off the top
    // of the viewport, flip below.
    let y = anchor.top - tipRect.height - VERTICAL_OFFSET_PX;
    if (y < VIEWPORT_PADDING_PX) {
      y = anchor.bottom + VERTICAL_OFFSET_PX;
    }

    el.style.left = `${x}px`;
    el.style.top = `${y}px`;
  });
}

function ensureTip(): HTMLDivElement {
  if (tip) return tip;
  tip = document.createElement('div');
  tip.className = 'profiler-tip';
  tip.setAttribute('role', 'tooltip');
  document.body.appendChild(tip);
  return tip;
}
