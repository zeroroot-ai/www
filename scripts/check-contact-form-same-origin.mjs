#!/usr/bin/env node
/**
 * check-contact-form-same-origin.mjs: the contact-sales submission must stay
 * same-origin.
 *
 * The defect this exists to keep fixed: the form posted to
 * `${APP_ORIGIN}/api/contact-sales`, a route that lived in the dashboard.
 * `app.zeroroot.ai` has no DNS record, so in a real browser the fetch THREW
 * rather than returning a response: the form showed "An error occurred.
 * Please try again." and nothing was logged, because no request ever reached
 * a server that could log it.
 *
 * Nothing else caught it. The build succeeded, the endpoint answered 200 to
 * curl, and the origins guard was satisfied because the origin came from
 * `@/lib/origins` exactly as it is supposed to. The bug was that the endpoint
 * had MOVED (deploy ADR-0009 put it on this site's own distribution) while the
 * caller had not.
 *
 * So the assertion is about the shape of the call, not about hostnames:
 * every fetch to /api/ must use a root-relative literal.
 *
 * Deliberately NOT folded into check-no-hardcoded-origins.mjs. That guard's
 * job is the opposite: it insists cross-surface links go THROUGH
 * `@/lib/origins` so they stay environment-derived. This one insists the API
 * call does not go through it at all. Merging them would blur two rules that
 * disagree on purpose.
 *
 * Usage:
 *   node scripts/check-contact-form-same-origin.mjs            # scan src/
 *   node scripts/check-contact-form-same-origin.mjs --selftest # verify the scanner
 *
 * Exit codes: 0 clean, 1 violations found (or selftest failure).
 */
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative, sep, extname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(fileURLToPath(new URL(".", import.meta.url)), "..");
const SRC = join(ROOT, "src");
const SCANNED_EXT = new Set([".ts", ".tsx", ".js", ".jsx", ".astro"]);

/** A fetch whose target reaches /api/ but does not start with a bare "/". */
const BAD_FETCH = /fetch\(\s*[`'"](?!\/)[^`'"]*\/api\//;

/** A template literal that interpolates anything before /api/. */
const BAD_TEMPLATE = /fetch\(\s*`\$\{[^}]*\}[^`]*\/api\//;

function* walk(dir) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) yield* walk(full);
    else yield full;
  }
}

function scanText(text) {
  const hits = [];
  text.split("\n").forEach((line, i) => {
    if (BAD_FETCH.test(line) || BAD_TEMPLATE.test(line)) hits.push({ line: i + 1, text: line.trim() });
  });
  return hits;
}

function scan() {
  const violations = [];
  for (const file of walk(SRC)) {
    if (!SCANNED_EXT.has(extname(file))) continue;
    const rel = relative(ROOT, file).split(sep).join("/");
    for (const hit of scanText(readFileSync(file, "utf8"))) {
      violations.push(`${rel}:${hit.line}: ${hit.text}`);
    }
  }
  return violations;
}

function selftest() {
  const cases = [
    { line: 'const res = await fetch("/api/contact-sales", {', bad: false },
    { line: "const res = await fetch(`/api/contact-sales`, {", bad: false },
    { line: "await fetch(`${APP}/api/contact-sales`, {", bad: true },
    { line: 'await fetch("https://app.zeroroot.ai/api/contact-sales", {', bad: true },
    { line: "await fetch(`${import.meta.env.PUBLIC_APP_ORIGIN}/api/x`)", bad: true },
    // Not an /api/ call at all, must not be flagged.
    { line: 'await fetch("https://example.com/other")', bad: false },
  ];

  let failures = 0;
  for (const { line, bad } of cases) {
    const caught = scanText(line).length > 0;
    if (bad && !caught) {
      console.error(`selftest FAILED: not caught → ${line}`);
      failures += 1;
    }
    if (!bad && caught) {
      console.error(`selftest FAILED: false positive → ${line}`);
      failures += 1;
    }
  }

  if (failures > 0) process.exit(1);
  console.log(`selftest OK (${cases.length} cases)`);
}

if (process.argv.includes("--selftest")) {
  selftest();
} else {
  const violations = scan();
  if (violations.length > 0) {
    console.error(
      "Cross-origin /api/ call found. The contact-sales endpoint is a second\n" +
        "origin on this site's own distribution (deploy ADR-0009); post to a\n" +
        "root-relative path so the request stays same-origin:\n",
    );
    for (const v of violations) console.error("  " + v);
    console.error("");
    process.exit(1);
  }
  console.log("check-contact-form-same-origin: OK");
}
