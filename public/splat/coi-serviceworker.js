/*!
 * coi-serviceworker — vendored copy of github.com/gzuidhof/coi-serviceworker
 * (MIT, v0.1.7). Adds COOP/COEP response headers from a service worker so
 * the page becomes `crossOriginIsolated`, which unlocks SharedArrayBuffer
 * — required by `wasm-bindgen-rayon` for the gsplat-web thread pool.
 *
 * GitHub Pages can't set those headers server-side; this is the workaround.
 * Scope is the directory this script lives in (/splat/), so it doesn't
 * affect the rest of the site.
 *
 * On first load it registers itself + reloads the page; on every load
 * after that it just intercepts fetches and rewrites the headers.
 */

let coepCredentialless = false;

if (typeof window === 'undefined') {
  // ── Service-worker side ────────────────────────────────────────────────
  self.addEventListener('install', () => self.skipWaiting());
  self.addEventListener('activate', (event) => event.waitUntil(self.clients.claim()));

  self.addEventListener('message', (ev) => {
    if (!ev.data) return;
    if (ev.data.type === 'deregister') {
      self.registration.unregister()
        .then(() => self.clients.matchAll())
        .then((clients) => clients.forEach((c) => c.navigate(c.url)));
    } else if (ev.data.type === 'coepCredentialless') {
      coepCredentialless = ev.data.value;
    }
  });

  self.addEventListener('fetch', (event) => {
    const r = event.request;
    if (r.cache === 'only-if-cached' && r.mode !== 'same-origin') return;

    const request = (coepCredentialless && r.mode === 'no-cors')
      ? new Request(r, { credentials: 'omit' })
      : r;

    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response.status === 0) return response;
          const headers = new Headers(response.headers);
          headers.set(
            'Cross-Origin-Embedder-Policy',
            coepCredentialless ? 'credentialless' : 'require-corp',
          );
          if (!coepCredentialless) {
            headers.set('Cross-Origin-Resource-Policy', 'cross-origin');
          }
          headers.set('Cross-Origin-Opener-Policy', 'same-origin');

          // Long-cache the immutable assets: scene file + transform
          // sidecar. They're versioned implicitly by filename and
          // never change in place; GH Pages serves them with a
          // short default Cache-Control. wasm/js artifacts rotate
          // when we rebuild, so they don't get this treatment —
          // they ride the normal GH Pages cache (ETag-revalidated).
          const url = new URL(r.url);
          if (url.pathname.endsWith('.spzps') || url.pathname.endsWith('.transform.txt')) {
            headers.set('Cache-Control', 'public, max-age=31536000, immutable');
          }

          return new Response(response.body, {
            status: response.status,
            statusText: response.statusText,
            headers,
          });
        })
        .catch((e) => console.error(e)),
    );
  });
} else {
  // ── Page side: register the SW and reload once if needed ───────────────
  (() => {
    const reloadedBySelf = window.sessionStorage.getItem('coiReloadedBySelf');
    window.sessionStorage.removeItem('coiReloadedBySelf');
    const coepDegrading = reloadedBySelf === 'coepdegrade';

    const coi = {
      shouldRegister: () => !reloadedBySelf,
      shouldDeregister: () => false,
      coepCredentialless: () => true,
      coepDegrade: () => true,
      doReload: () => window.location.reload(),
      quiet: false,
      ...window.coi,
    };

    const n = navigator;

    if (n.serviceWorker && n.serviceWorker.controller) {
      n.serviceWorker.controller.postMessage({
        type: 'coepCredentialless',
        value: (coepDegrading || !coi.coepCredentialless())
          ? false
          : coi.coepCredentialless(),
      });
      if (coi.shouldDeregister()) {
        n.serviceWorker.controller.postMessage({ type: 'deregister' });
      }
    }

    // Already cross-origin-isolated (server set the headers, or the SW is
    // already installed from a previous load): nothing to do.
    if (window.crossOriginIsolated !== false || !n.serviceWorker) return;

    if (!window.isSecureContext) {
      if (!coi.quiet) {
        console.log('COOP/COEP service worker requires a secure context (HTTPS).');
      }
      return;
    }

    if (coi.shouldRegister()) {
      n.serviceWorker.register(window.document.currentScript.src).then(
        (registration) => {
          if (!coi.quiet) {
            console.log('COOP/COEP service worker registered:', registration.scope);
          }

          registration.addEventListener('updatefound', () => {
            window.sessionStorage.setItem('coiReloadedBySelf', 'updatefound');
            coi.doReload();
          });

          // First install: registration is active but the current page isn't
          // controlled by it yet. Reload so the SW intercepts every fetch.
          if (registration.active && !n.serviceWorker.controller) {
            window.sessionStorage.setItem('coiReloadedBySelf', 'notcontrolling');
            coi.doReload();
          }
        },
        (err) => {
          if (!coi.quiet) {
            console.error('COOP/COEP service worker failed to register:', err);
          }
        },
      );
    }
  })();
}
