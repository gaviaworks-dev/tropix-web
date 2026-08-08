import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import {
  higgsfieldDesignInspectorVitePlugin,
  higgsfieldDesignSourceBabelPlugin,
} from "./src/module/design-inspector/vite";
import svgr from "vite-plugin-svgr";
import { defaultServerConditions, defineConfig, type PluginOption } from "vite";
import { fileURLToPath } from "node:url";

// The vendored @higgsfield/quanta components import their glyphs from the private
// Nexus-only `@higgsfield-ai/icons`. Generated sites build on the PUBLIC npm
// registry, so we redirect every `@higgsfield-ai/icons/*` import to a lucide
// shim instead (see src/lib/quanta-icons.ts). tsconfig.json has
// the matching `paths` entry so type-checking resolves it too.
const QUANTA_ICONS_SHIM = fileURLToPath(
  new URL("./src/lib/quanta-icons.ts", import.meta.url),
);

// ─── STATIC (GITHUB PAGES) BUILD ────────────────────────────────────────────
// A SECOND build target that lives next to the Cloudflare Worker build; it does
// not replace it. `vite build` still emits the Worker bundle into dist/ exactly
// as before. `vite build --mode static` prerenders every route to plain HTML in
// dist-static/client/ for GitHub Pages. Everything below is gated on that mode.

/** The six content routes. Prerendered one-for-one; no crawling, no surprises. */
const STATIC_ROUTES = [
  "/",
  "/hakkimizda",
  "/urunlerimiz",
  "/bayilik",
  "/kariyer",
  "/bize-ulasin",
] as const;

/** "" | "/" → "/"; "tropix-web" | "/tropix-web/" → "/tropix-web/". */
function normalizeBasePath(value: string): string {
  const trimmed = value.trim().replace(/^\/+|\/+$/g, "");
  return trimmed ? `/${trimmed}/` : "/";
}

/**
 * Rewrite root-absolute URL literals in app source to carry the Pages base path.
 *
 * Vite's `base` only reaches HTML attributes, CSS `url()` and module imports.
 * It cannot see a root-absolute path written as a plain string in TS/TSX — and
 * this site has plenty: every `/assets/**` poster, clip and logo, the og:image
 * and favicon in app-meta.json, and two hand-written `href="/…"` anchors. On a
 * project Pages URL the site is served from /<repo>/, so those literals resolve
 * against the wrong root unless they are prefixed.
 *
 * Doing it here keeps the fix in the build layer: no component, no scene data
 * and no stylesheet is edited, and the Worker build (base "/") never runs this
 * plugin at all. `enforce: "pre"` means we see the untranspiled source, so the
 * literals are still literals.
 *
 * `to`/`Link` props are deliberately NOT touched — TanStack Router prefixes
 * those itself from the router basepath, which it derives from Vite's `base`.
 */
function staticBasePathPlugin(base: string): PluginOption {
  const ASSET_LITERAL = /(["'`])\/assets\//g;
  const HREF_LITERAL = /href="\/(?!\/)/g;
  const TRANSFORMABLE = /\.(?:tsx?|jsx?|css|json)$/;

  return {
    name: "tropix-static-base-path",
    enforce: "pre",
    apply: "build",
    transform(code, id) {
      const file = id.split("?")[0];
      if (!TRANSFORMABLE.test(file)) return null;
      // Vendored @higgsfield/* workspaces and installed deps are out of scope —
      // they ship no /assets references and must stay byte-identical.
      if (file.includes("/node_modules/") || file.includes("/packages/")) return null;
      if (!code.includes("/assets/") && !code.includes('href="/')) return null;

      return {
        code: code.replace(ASSET_LITERAL, `$1${base}assets/`).replace(HREF_LITERAL, `href="${base}`),
        map: null,
      };
    },
  };
}

export default defineConfig(({ command, mode }) => {
  // TROPIX_STATIC is not redundant with `--mode static`. To prerender, Start
  // reloads THIS config file through `vite.preview({ configFile })` — without
  // forwarding the mode. That reload must resolve the same outDir and base as
  // the build it is previewing, otherwise it looks for the Worker bundle in
  // dist/ and every page fails. The env var is what survives the reload;
  // `build:static` sets it, and `--mode static` stays supported on its own.
  const staticBuild = mode === "static" || process.env.TROPIX_STATIC === "1";
  // Overridable so the same build can target a user/org Pages site ("/") or a
  // custom domain without editing this file: BASE_PATH=/ bun run build:static
  const basePath = staticBuild ? normalizeBasePath(process.env.BASE_PATH ?? "/tropix-web/") : "/";
  // The design inspector is a Higgsfield-platform-only tool; it never ships in
  // the public static site regardless of the ambient env var.
  const designInspectorEnabled =
    !staticBuild && (process.env.HF_DESIGN_INSPECTOR === "1" || mode === "design");

  return {
    base: basePath,
    // fsevents can miss edits under some setups (bun-launched dev, synced/virtual
    // dirs), leaving HMR dead so changes only appear after a manual restart.
    // Polling the watcher makes file changes reliably trigger HMR / SSR reload.
    server: {
      watch: { usePolling: true, interval: 150 },
    },
    resolve: {
      tsconfigPaths: true,
      alias: [{ find: /^@higgsfield-ai\/icons(\/.*)?$/, replacement: QUANTA_ICONS_SHIM }],
    },
    // The server bundle runs as a Cloudflare Worker — there is no node_modules
    // at runtime. Vite's default SSR build leaves npm deps as bare external
    // imports (h3, react, @tanstack/*, seroval, …), which resolve on a Node
    // server but throw "No such module" in a Worker. Bundle them all in.
    // (node: builtins stay external — nodejs_compat provides them.)
    // BUILD ONLY: `vite dev` SSR runs in Node where externalized deps are
    // correct — noExternal there makes the dev module runner evaluate CJS
    // deps (react) as ESM and crash with "module is not defined".
    ssr: {
      // BUILD ONLY: the SSR bundle runs on workerd (Cloudflare Workers), not
      // Node. Target a worker runtime and resolve bundled deps through the
      // edge export conditions (workerd/worker/browser) so packages that ship
      // both variants bundle their edge build (react-dom's web-streams server,
      // etc.) instead of the Node variant leaning on nodejs_compat shims.
      // `vite dev` SSR runs in Node, where default node resolution is correct.
      // STATIC BUILD: also skipped. The prerender pass boots the SSR bundle in a
      // Node `vite preview` server, so it must be a Node bundle, not a workerd one.
      ...(command === "build" && !staticBuild
        ? {
            target: "webworker" as const,
            resolve: {
              conditions: [
                "workerd",
                "worker",
                "browser",
                ...defaultServerConditions.filter((c) => c !== "node"),
              ],
            },
          }
        : {}),
      // STATIC BUILD: keep Vite's default externalization. Node resolves deps
      // from node_modules during prerender, and bundling them all would only
      // slow the build down for an artifact that is thrown away afterwards.
      noExternal: command === "build" && !staticBuild ? true : undefined,
      // `cloudflare:workers` is a workerd runtime built-in that exposes the Worker
      // env / bindings (D1 `DB`, R2 `STORAGE`). Like node: builtins it must NOT be
      // bundled; the runtime provides it. (`ssr.external` is typed string[].)
      external: ["cloudflare:workers"],
    },
    build: {
      // STATIC BUILD writes to dist-static/ (client + server) so it never
      // overwrites the Worker artifact in dist/. Only dist-static/client is
      // published; dist-static/server is prerender scaffolding.
      outDir: staticBuild ? "dist-static" : "dist",
      // public/assets/** is copied to <out>/assets/**, which is also Vite's
      // default home for hashed chunks — 42 MB of media and the JS/CSS bundle
      // in one folder, where a public file could one day shadow a chunk. Give
      // the bundle its own folder in the static artifact. (Not "_build": a
      // leading underscore would make the whole site depend on .nojekyll
      // surviving, and this is the one directory that must always be served.)
      ...(staticBuild ? { assetsDir: "build" } : {}),
      // Keep `cloudflare:*` external in the SSR rollup pass too — `noExternal`
      // above would otherwise try to resolve+bundle it and fail.
      rollupOptions: { external: [/^cloudflare:/] },
    },
    plugins: [
      // Local SVG assets (e.g. the branded generate-button sparkle) import as
      // React components via `?react`. `icon: true` sizes them 1em; fill is
      // forced to currentColor so they color like text. Keep the viewBox so
      // CSS sizing scales the glyph.
      svgr({
        svgrOptions: {
          icon: true,
          svgProps: { fill: "currentColor" },
          svgoConfig: {
            plugins: [{ name: "preset-default", params: { overrides: { removeViewBox: false } } }],
          },
        },
      }),
      // TanStack Start plugin must run before React's plugin.
      //
      // SSR build: `vite build` emits a Workers-shaped server bundle
      // (dist/server/server.js — `export default { fetch }`) plus dist/client
      // (hashed static assets). The platform publishes that as a per-tenant
      // Worker on Workers for Platforms, served at <sub>.higgsfield.app/ (host
      // root, so Vite's default base "/" — no base-path juggling).
      //
      // Rendering happens on the server per request, so site code must be
      // SSR-safe: never touch browser-only globals (window, document,
      // localStorage, navigator) during render or at module top level — only
      // inside effects/handlers, or guarded with `typeof window !== "undefined"`.
      //
      // STATIC BUILD: `pages` + `prerender` turn the same SSR bundle into a
      // one-shot page renderer. Start boots the built server behind a local
      // `vite preview`, requests each route, and writes the HTML into the
      // client output dir (dist-static/client/<route>/index.html, and
      // index.html for "/"). Routes are listed explicitly and crawling is off,
      // so the page set is exactly these six — /app, /robots.txt and
      // /sitemap.xml stay Worker-only and never reach the static site.
      // The router basepath is derived from `base` above by Start itself.
      tanstackStart({
        server: { entry: "server" },
        ...(staticBuild
          ? {
              pages: STATIC_ROUTES.map((path) => ({ path })),
              prerender: {
                enabled: true,
                crawlLinks: false,
                autoStaticPathsDiscovery: false,
                failOnError: true,
                retryCount: 1,
              },
            }
          : {}),
      }),
      staticBuild && basePath !== "/" ? staticBasePathPlugin(basePath) : null,
      higgsfieldDesignInspectorVitePlugin(designInspectorEnabled),
      react({
        babel: {
          plugins: designInspectorEnabled ? [higgsfieldDesignSourceBabelPlugin] : [],
        },
      }),
      tailwindcss(),
    ],
  };
});
