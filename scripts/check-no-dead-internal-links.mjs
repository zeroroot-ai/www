#!/usr/bin/env node
/**
 * check-no-dead-internal-links.mjs — every root-relative link must resolve to
 * something this site actually builds.
 *
 * The defect this exists to catch: `HeroSection.tsx` linked to `/docs`. Docs
 * live on their own host (deploy ADR-0006), this site emits no `/docs` page,
 * and nginx.conf deliberately has no catch-all — so the link 404'd in
 * production, on the landing page, for as long as it shipped.
 *
 * check-no-hardcoded-origins.mjs did not catch it and could not: that guard
 * matches SCHEME-carrying literals (`https://docs.zeroroot.ai`), because its
 * job is to stop a link being pinned to prod in every environment. A bare
 * `/docs` carries no scheme, so it is invisible to that regex. The two guards
 * are complementary — one asks "is this cross-surface link environment-
 * derived?", this one asks "does this local link exist at all?".
 *
 * Deliberately NOT an allowlist of foreign path prefixes (`/docs`, `/login`,
 * `/signup`, ...). An allowlist only catches the paths someone thought of,
 * and goes stale the moment a route is renamed. Deriving the legal set from
 * `src/pages/` and `public/` means a renamed page fails immediately and a
 * brand-new dead link is caught without anyone updating this file.
 *
 * Scope: string literals in `href=` / `href:` position under `src/`.
 * Non-literal hrefs (`href={cta.href}`) are skipped — they cannot be resolved
 * statically, and their literals are caught where they are written.
 *
 * Usage:
 *   node scripts/check-no-dead-internal-links.mjs            # scan src/
 *   node scripts/check-no-dead-internal-links.mjs --selftest # verify the scanner
 *
 * Exit codes: 0 clean, 1 violations found (or selftest failure).
 */
import { readdirSync, readFileSync, statSync, existsSync } from "node:fs";
import { join, relative, sep, extname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(fileURLToPath(new URL(".", import.meta.url)), "..");
const SRC = join(ROOT, "src");
const PAGES = join(SRC, "pages");
const PUBLIC = join(ROOT, "public");

const SCANNED_EXT = new Set([".astro", ".ts", ".tsx", ".js", ".jsx", ".md", ".mdx"]);
const PAGE_EXT = new Set([".astro", ".md", ".mdx"]);

/** `href="/x"`, `href='/x'`, `href: "/x"`, `href={"/x"}` — literals only. */
const HREF_RE = /href\s*[=:]\s*\{?\s*["'](\/[^"']*)["']/g;

function* walk(dir) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) yield* walk(full);
    else yield full;
  }
}

/**
 * The routes this site emits, derived from the file tree rather than declared.
 *
 * @param {string} pagesDir
 * @param {string} publicDir
 * @returns {Set<string>}
 */
function buildableRoutes(pagesDir, publicDir) {
  const routes = new Set();

  if (existsSync(pagesDir)) {
    for (const file of walk(pagesDir)) {
      if (!PAGE_EXT.has(extname(file))) continue;
      // Dynamic routes ([slug].astro) cannot be resolved statically; a link
      // into one is not a dead-link question this guard can answer.
      if (file.includes("[")) continue;
      const rel = relative(pagesDir, file).split(sep).join("/");
      const noExt = rel.replace(/\.(astro|md|mdx)$/, "");
      routes.add(noExt === "index" ? "/" : `/${noExt.replace(/\/index$/, "")}`);
    }
  }

  if (existsSync(publicDir)) {
    for (const file of walk(publicDir)) {
      routes.add(`/${relative(publicDir, file).split(sep).join("/")}`);
    }
  }

  return routes;
}

/** Drop the query and fragment; a link's identity is its path. */
function normalise(href) {
  const path = href.split(/[?#]/)[0];
  if (path === "/") return "/";
  return path.replace(/\/$/, "");
}

function scan(srcDir, routes) {
  const violations = [];
  for (const file of walk(srcDir)) {
    if (!SCANNED_EXT.has(extname(file))) continue;
    const rel = relative(ROOT, file).split(sep).join("/");
    const lines = readFileSync(file, "utf8").split("\n");
    lines.forEach((line, i) => {
      for (const m of line.matchAll(HREF_RE)) {
        const path = normalise(m[1]);
        if (routes.has(path)) continue;
        violations.push(
          `${rel}:${i + 1}: ${m[1]} — this site builds no such route. ` +
            `If it lives on another host, import APP_ORIGIN / DOCS_ORIGIN from @/lib/origins.`,
        );
      }
    });
  }
  return violations;
}

function selftest() {
  // Routes exactly as the real tree yields them, so a page rename that breaks
  // derivation is caught here too.
  const routes = buildableRoutes(PAGES, PUBLIC);
  for (const expected of ["/", "/pricing", "/contact-sales"]) {
    if (!routes.has(expected)) {
      console.error(`selftest FAILED: route derivation lost ${expected}`);
      process.exit(1);
    }
  }

  // The scanner must reject the exact defect it was written for, accept the
  // real local links, and ignore hrefs it cannot resolve statically.
  const cases = [
    { line: '<a href="/docs">quickstart</a>', dead: true },
    { line: '<a href="/login">sign in</a>', dead: true },
    { line: '<a href="/pricing">pricing</a>', dead: false },
    { line: '  href: "/contact-sales?tier=" + encodeURIComponent(t.id),', dead: false },
    { line: '<a href="/dashboard-preview.png">shot</a>', dead: false },
    { line: "<a href={cta.href}>go</a>", dead: false },
    { line: "<a href={`${APP}/signup?plan=${id}`}>start</a>", dead: false },
  ];

  let failures = 0;
  for (const { line, dead } of cases) {
    const hits = [...line.matchAll(HREF_RE)].filter((m) => !routes.has(normalise(m[1])));
    if (dead && hits.length === 0) {
      console.error(`selftest FAILED: dead link not caught → ${line.trim()}`);
      failures += 1;
    }
    if (!dead && hits.length > 0) {
      console.error(`selftest FAILED: false positive → ${line.trim()}`);
      failures += 1;
    }
  }

  if (failures > 0) process.exit(1);
  console.log(`selftest OK (${cases.length} cases, ${routes.size} routes derived)`);
}

if (process.argv.includes("--selftest")) {
  selftest();
} else {
  const violations = scan(SRC, buildableRoutes(PAGES, PUBLIC));
  if (violations.length > 0) {
    console.error("Dead internal links found — these 404 in production.\n");
    for (const v of violations) console.error("  " + v);
    console.error("");
    process.exit(1);
  }
  console.log("check-no-dead-internal-links: OK");
}
