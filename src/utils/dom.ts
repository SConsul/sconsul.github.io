/**
 * Tiny DOM helpers — typed wrappers over `getElementById` and
 * `querySelector` that surface the element type in the IDE.
 */

/**
 * Typed `getElementById` that throws if the element doesn't exist.
 *
 * Use for elements that *must* exist at the call site (the contract is
 * static — the markup includes that id). For optional lookups use
 * {@link $maybe}.
 */
export function $<T extends HTMLElement = HTMLElement>(id: string): T {
  const el = document.getElementById(id);
  if (!el) throw new Error(`[$] Element #${id} not found in DOM`);
  return el as T;
}

/** Like {@link $}, but returns `null` for absent elements. */
export function $maybe<T extends HTMLElement = HTMLElement>(id: string): T | null {
  return document.getElementById(id) as T | null;
}

/** Typed `querySelectorAll` returning a real array (not NodeList). */
export function $$<T extends HTMLElement = HTMLElement>(selector: string, root: ParentNode = document): T[] {
  return Array.from(root.querySelectorAll<T>(selector));
}
