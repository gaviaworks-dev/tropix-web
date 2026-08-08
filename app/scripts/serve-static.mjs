#!/usr/bin/env node
/**
 * Local stand-in for GitHub Pages, for verifying the static build before it
 * ships (`bun run preview:static`).
 *
 * It reproduces the three Pages behaviours the build depends on, so a page that
 * works here works there:
 *   - the site is mounted under the base path, not at "/" — anything requested
 *     outside it is refused rather than silently resolved
 *   - "/x" 301-redirects to "/x/", which then serves "/x/index.html"
 *   - unmatched paths serve 404.html with a 404 status
 *
 * Range requests are honoured so <video> seeking behaves like a real host.
 */
import { createReadStream } from "node:fs";
import { stat, readFile } from "node:fs/promises";
import { createServer } from "node:http";
import { join, normalize, extname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = fileURLToPath(new URL("../dist-static/client", import.meta.url));
const PORT = Number(process.env.PORT ?? 4173);
const BASE_PATH = normalizeBasePath(process.env.BASE_PATH ?? "/tropix-web/");

function normalizeBasePath(value) {
  const trimmed = value.trim().replace(/^\/+|\/+$/g, "");
  return trimmed ? `/${trimmed}/` : "/";
}

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".xml": "application/xml; charset=utf-8",
  ".txt": "text/plain; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".ico": "image/x-icon",
  ".mp4": "video/mp4",
  ".webm": "video/webm",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
};

async function statFile(path) {
  try {
    const info = await stat(path);
    return info.isFile() ? info : null;
  } catch {
    return null;
  }
}

async function send(res, status, path, info, range) {
  const type = MIME[extname(path).toLowerCase()] ?? "application/octet-stream";

  if (range && status === 200) {
    const match = /^bytes=(\d*)-(\d*)$/.exec(range);
    if (match) {
      const start = match[1] ? Number(match[1]) : 0;
      const end = match[2] ? Number(match[2]) : info.size - 1;
      if (start <= end && end < info.size) {
        res.writeHead(206, {
          "content-type": type,
          "content-length": end - start + 1,
          "content-range": `bytes ${start}-${end}/${info.size}`,
          "accept-ranges": "bytes",
        });
        createReadStream(path, { start, end }).pipe(res);
        return;
      }
    }
  }

  res.writeHead(status, {
    "content-type": type,
    "content-length": info.size,
    "accept-ranges": "bytes",
  });
  createReadStream(path).pipe(res);
}

async function notFound(res) {
  const path = join(ROOT, "404.html");
  const info = await statFile(path);
  if (!info) {
    res.writeHead(404, { "content-type": "text/plain; charset=utf-8" });
    res.end("404");
    return;
  }
  await send(res, 404, path, info);
}

const server = createServer(async (req, res) => {
  try {
    const url = new URL(req.url ?? "/", `http://localhost:${PORT}`);
    let pathname = decodeURIComponent(url.pathname);

    // Everything lives under the base path, exactly as on a project Pages site.
    if (BASE_PATH !== "/") {
      if (pathname === BASE_PATH.slice(0, -1)) {
        res.writeHead(301, { location: BASE_PATH });
        res.end();
        return;
      }
      if (!pathname.startsWith(BASE_PATH)) {
        await notFound(res);
        return;
      }
      pathname = pathname.slice(BASE_PATH.length - 1);
    }

    const relative = normalize(pathname).replace(/^(\.\.[/\\])+/, "");
    const target = join(ROOT, relative);
    if (!target.startsWith(ROOT)) {
      await notFound(res);
      return;
    }

    const direct = await statFile(target);
    if (direct) {
      await send(res, 200, target, direct, req.headers.range);
      return;
    }

    // Directory-style URL → its index.html; bare path → redirect to the slash
    // form first, so relative URLs inside the page resolve the same way Pages
    // makes them resolve.
    const indexInfo = await statFile(join(target, "index.html"));
    if (indexInfo) {
      if (!pathname.endsWith("/")) {
        res.writeHead(301, { location: `${url.pathname}/${url.search}` });
        res.end();
        return;
      }
      await send(res, 200, join(target, "index.html"), indexInfo);
      return;
    }

    await notFound(res);
  } catch (error) {
    console.error(error);
    res.writeHead(500, { "content-type": "text/plain; charset=utf-8" });
    res.end("500");
  }
});

server.listen(PORT, () => {
  console.log(`[serve-static] http://localhost:${PORT}${BASE_PATH}`);
});
