// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';

/**
 * Cross-origin isolation headers — required for SharedArrayBuffer,
 * which the gsplat-web build needs because it uses
 * `wasm-bindgen-rayon` for the depth-sort thread pool. Without these
 * headers, `initThreadPool(…)` throws at viewer init.
 *
 * GitHub Pages can't set custom headers, so this only fixes
 * `npm run dev` / `npm run preview` — see the splat README for
 * production options.
 */
/**
 * @typedef {{ setHeader: (k: string, v: string) => void }} ResLike
 * @typedef {{ middlewares: { use: (mw: (req: unknown, res: ResLike, next: () => void) => void) => void } }} ServerLike
 */
const setHeaders = (/** @type {ServerLike} */ server) => {
  server.middlewares.use((_req, res, next) => {
    res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
    res.setHeader('Cross-Origin-Embedder-Policy', 'require-corp');
    next();
  });
};

const coopCoep = {
  name: 'coop-coep-headers',
  /** @param {ServerLike} server */
  configureServer(server) { setHeaders(server); },
  /** @param {ServerLike} server */
  configurePreviewServer(server) { setHeaders(server); },
};

// https://astro.build/config
export default defineConfig({
  site: 'https://sconsul.github.io',
  integrations: [mdx()],
  output: 'static',
  build: {
    inlineStylesheets: 'auto',
  },
  vite: {
    plugins: [coopCoep],
  },
});
