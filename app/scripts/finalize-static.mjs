#!/usr/bin/env node
/**
 * Post-step of the GitHub Pages build (`bun run build:static`).
 *
 * `vite build --mode static` prerenders the six routes; this script adds the
 * four things a Pages host needs that the prerender does not emit, then throws
 * away the SSR scaffolding so only publishable files remain:
 *
 *   .nojekyll   — Pages runs Jekyll by default, and Jekyll drops every path
 *                 segment starting with "_". TanStack Start emits all hashed
 *                 client assets under /_build/, so without this file the site
 *                 loads as unstyled HTML with no JS. Non-negotiable.
 *   404.html    — Pages' fallback for unmatched paths. The prerenderer cannot
 *                 produce it: a request to a nonexistent route answers 404 and
 *                 the prerenderer only writes 2xx responses.
 *   robots.txt  — the app serves these from Worker route handlers
 *   sitemap.xml   (src/routes/robots[.]txt.ts, sitemap[.]xml.ts) which have no
 *                 static equivalent, so they are rendered here instead.
 *
 * Nothing in this script touches app source; it only writes into the build
 * output directory.
 */
import { readFile, rm, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const APP_ROOT = fileURLToPath(new URL("..", import.meta.url));
const OUT_DIR = join(APP_ROOT, "dist-static");
const CLIENT_DIR = join(OUT_DIR, "client");
const SERVER_DIR = join(OUT_DIR, "server");

/** Must match vite.config.ts — same env var, same default, same normalization. */
const BASE_PATH = normalizeBasePath(process.env.BASE_PATH ?? "/tropix-web/");
const SITE_ORIGIN = (process.env.SITE_ORIGIN ?? "https://gaviaworks-dev.github.io").replace(
  /\/+$/,
  "",
);
const SITE_URL = `${SITE_ORIGIN}${BASE_PATH}`;

const ROUTES = ["", "hakkimizda", "urunlerimiz", "bayilik", "kariyer", "bize-ulasin"];

function normalizeBasePath(value) {
  const trimmed = value.trim().replace(/^\/+|\/+$/g, "");
  return trimmed ? `/${trimmed}/` : "/";
}

// Brand tokens, copied from src/scroll-scrub-scenes.ts (scrollScrubTheme). This
// page is deploy scaffolding, not part of the designed site — it exists only so
// a mistyped URL lands somewhere that looks like Tropix instead of on GitHub's
// default 404.
const THEME = { background: "#01190a", ink: "#ffffff", muted: "#93ab99", accent: "#7bc043" };

function notFoundHtml() {
  return `<!doctype html>
<html lang="tr">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="robots" content="noindex" />
    <title>Sayfa bulunamadı — Tropix</title>
    <link rel="icon" href="${BASE_PATH}assets/favicon.svg" />
    <style>
      html, body { margin: 0; height: 100%; }
      body {
        display: grid; place-items: center; padding: 2rem;
        background: ${THEME.background}; color: ${THEME.ink};
        font-family: "Instrument Sans", ui-sans-serif, system-ui, sans-serif;
        text-align: center; -webkit-font-smoothing: antialiased;
      }
      img { width: 148px; height: auto; margin-bottom: 2rem; }
      h1 { margin: 0 0 0.75rem; font-size: clamp(1.75rem, 4vw, 2.5rem); font-weight: 600; }
      p { margin: 0 0 2rem; color: ${THEME.muted}; font-size: 1rem; line-height: 1.6; }
      a {
        display: inline-block; padding: 0.75rem 1.5rem; border-radius: 999px;
        background: ${THEME.accent}; color: ${THEME.background};
        font-weight: 600; text-decoration: none;
      }
    </style>
  </head>
  <body>
    <main>
      <img src="${BASE_PATH}assets/tropix-logo-white.png" alt="Tropix" />
      <h1>Sayfa bulunamadı</h1>
      <p>Aradığınız sayfa taşınmış ya da hiç var olmamış olabilir.</p>
      <a href="${BASE_PATH}">Ana sayfaya dön</a>
    </main>
  </body>
</html>
`;
}

// The scroll-scrub engine only starts fetching a clip when its band comes
// within 1.5 viewport heights, and it must download the file WHOLE before it
// can attach a <video>. Measured on the deployed site with a cold cache and a
// human-paced scroll, that is far too late: every scene was still showing its
// poster when the reader reached it, and the clips only landed after the whole
// page had been scrolled past.
//
// So we tell the browser about the clips up front. Each prerendered page gets
// preload hints for exactly the clips it uses, derived from the poster URLs the
// engine already rendered into the markup — no scene list to keep in sync here,
// and no change to the engine, the components or the media.
//
// Priorities mirror reading order: the first clip is what you see immediately,
// so it goes high and gets the bandwidth; the rest go low and fill in while you
// read the opening chapter. `as="fetch"` (not "video") because the engine loads
// them with fetch() into a blob — that is what makes the preload reusable.
//
// `crossorigin` is REQUIRED, even though these are same-origin. An `as="fetch"`
// preload is issued in CORS mode, and it is only reused by the engine's later
// fetch() when the two agree on credentials. Measured: without the attribute
// every clip downloads TWICE (preload + fetch); with bare `crossorigin`
// (anonymous) the fetch hits the preload and downloads once;
// `crossorigin="use-credentials"` double-downloads again.
//
// The media queries mirror the engine's own mobile test so a phone never pulls
// the desktop set, nor a desktop the mobile one. Deliberately level-3 syntax:
// the level-4 form `not ((hover: none) and (pointer: coarse)) and (…)` was
// measured NOT to match anywhere, silently disabling the desktop hints.
// `(pointer: fine)` is the portable inverse of the engine's coarse-pointer test.
const MOBILE_MEDIA = "(hover: none) and (pointer: coarse), (max-width: 860px)";
const DESKTOP_MEDIA = "(pointer: fine) and (min-width: 861px)";

function clipPreloadTags(html) {
  const desktop = [];
  const mobile = [];
  // Posters are emitted as <img src="…-poster.jpg"> and, when a mobile variant
  // exists, <source srcSet="…-mobile-poster.jpg">. Clip names differ only by
  // dropping "-poster" and swapping the extension.
  for (const [, url] of html.matchAll(/(?:src|srcSet)="([^"]*\/assets\/world\/[^"]*-poster\.jpg)"/g)) {
    const clip = url.replace(/-poster\.jpg$/, ".mp4");
    const bucket = url.includes("-mobile-poster.jpg") ? mobile : desktop;
    if (!bucket.includes(clip)) bucket.push(clip);
  }

  const tag = (href, media, first) =>
    `<link rel="preload" as="fetch" crossorigin href="${href}" media="${media}" fetchpriority="${first ? "high" : "low"}">`;

  return [
    ...desktop.map((href, i) => tag(href, DESKTOP_MEDIA, i === 0)),
    ...mobile.map((href, i) => tag(href, MOBILE_MEDIA, i === 0)),
  ].join("");
}

function robotsTxt() {
  return `User-agent: *\nAllow: /\n\nSitemap: ${SITE_URL}sitemap.xml\n`;
}

function sitemapXml(lastmod) {
  const urls = ROUTES.map((route) =>
    [
      "  <url>",
      `    <loc>${SITE_URL}${route}${route ? "/" : ""}</loc>`,
      `    <lastmod>${lastmod}</lastmod>`,
      "    <changefreq>weekly</changefreq>",
      `    <priority>${route ? "0.8" : "1.0"}</priority>`,
      "  </url>",
    ].join("\n"),
  ).join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`;
}

async function main() {
  if (!existsSync(CLIENT_DIR)) {
    console.error(`[finalize-static] ${CLIENT_DIR} not found — run the static build first.`);
    process.exit(1);
  }

  // Fail loudly rather than publishing a site with missing pages.
  const missing = ROUTES.filter(
    (route) => !existsSync(join(CLIENT_DIR, route, "index.html")),
  );
  if (missing.length > 0) {
    console.error(
      `[finalize-static] prerender did not emit: ${missing.map((r) => `/${r}`).join(", ")}`,
    );
    process.exit(1);
  }

  // Inject the clip preload hints into each prerendered page.
  let hinted = 0;
  for (const route of ROUTES) {
    const file = join(CLIENT_DIR, route, "index.html");
    const html = await readFile(file, "utf8");
    const tags = clipPreloadTags(html);
    if (!tags) continue;
    await writeFile(file, html.replace("</head>", `${tags}</head>`));
    hinted += 1;
  }

  await writeFile(join(CLIENT_DIR, ".nojekyll"), "");
  await writeFile(join(CLIENT_DIR, "404.html"), notFoundHtml());
  await writeFile(join(CLIENT_DIR, "robots.txt"), robotsTxt());
  await writeFile(join(CLIENT_DIR, "sitemap.xml"), sitemapXml(new Date().toISOString().slice(0, 10)));

  // The SSR bundle was only ever prerender scaffolding — it must not be published.
  await rm(SERVER_DIR, { recursive: true, force: true });

  console.log(`[finalize-static] ${CLIENT_DIR}`);
  console.log(`[finalize-static] base=${BASE_PATH} site=${SITE_URL}`);
  console.log(
    `[finalize-static] wrote .nojekyll, 404.html, robots.txt, sitemap.xml; clip preload hints on ${hinted} page(s); removed dist-static/server`,
  );
}

await main();
