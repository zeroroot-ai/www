#!/usr/bin/env node
/**
 * check-no-hardcoded-origins.mjs: functional cross-surface links must come
 * from src/lib/origins.ts (www#15, epic env-derived-links).
 *
 * The app and docs origins are environment-derived: the Docker build bakes
 * sentinels and the nginx entrypoint substitutes the environment's real
 * origins at container start. A literal `https://app.zeroroot.ai` or
 * `https://docs.zeroroot.ai` anywhere else in src/ silently re-pins that
 * link to prod in every environment, exactly the staging bug this guard
 * exists to keep fixed.
 *
 * Scope: every file under src/ except src/lib/origins.ts (the one sanctioned
 * home of the literals, as prod defaults). Bare hostnames without a scheme
 * ("app.zeroroot.ai/dashboard" in terminal art) are display copy and stay
 * legal: only scheme-carrying origins can become links.
 *
 * Usage:
 *   node scripts/check-no-hardcoded-origins.mjs            # scan src/
 *   node scripts/check-no-hardcoded-origins.mjs --selftest # verify the scanner
 *
 * Exit codes: 0 clean, 1 violations found (or selftest failure).
 */
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative, sep } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(fileURLToPath(new URL(".", import.meta.url)), "..");
const SRC = join(ROOT, "src");
const ALLOWED = join("src", "lib", "origins.ts");

// No /g flag: a global regex is stateful across .test() calls (lastIndex).
const ORIGIN_RE = /https:\/\/(?:app|docs)\.zeroroot\.ai/;

function* walk(dir) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) {
      yield* walk(full);
    } else {
      yield full;
    }
  }
}

function scan() {
  const violations = [];
  for (const file of walk(SRC)) {
    const rel = relative(ROOT, file);
    if (rel === ALLOWED) continue;
    // Generated modules are rebuilt from canonical sources by their own
    // generators; a hit there means the generator is wrong, and it still fails.
    const text = readFileSync(file, "utf8");
    const lines = text.split("\n");
    lines.forEach((line, i) => {
      if (ORIGIN_RE.test(line)) {
        violations.push(`${rel.split(sep).join("/")}:${i + 1}: ${line.trim()}`);
      }
    });
  }
  return violations;
}

function selftest() {
  // The scanner must flag a scheme-carrying origin and must NOT flag the
  // schemeless display form or the api host.
  const flag = ORIGIN_RE.test("https://app.zeroroot.ai/signup");
  const flagDocs = ORIGIN_RE.test("https://docs.zeroroot.ai");
  const passBare = ORIGIN_RE.test("app.zeroroot.ai/dashboard");
  const passApi = ORIGIN_RE.test("https://api.zeroroot.ai");
  if (!flag || !flagDocs || passBare || passApi) {
    console.error("selftest FAILED: origin regex does not behave as specified");
    process.exit(1);
  }
  // And the allowlisted module must actually contain the prod defaults,
  // if it moves, the exclusion above silently allowlists nothing.
  const origins = readFileSync(join(ROOT, ALLOWED), "utf8");
  if (!ORIGIN_RE.test(origins)) {
    console.error(`selftest FAILED: ${ALLOWED} no longer holds the prod defaults`);
    process.exit(1);
  }
  console.log("selftest OK");
}

if (process.argv.includes("--selftest")) {
  selftest();
} else {
  const violations = scan();
  if (violations.length > 0) {
    console.error(
      "Hardcoded app/docs origins found outside src/lib/origins.ts.\n" +
        "Import APP_ORIGIN / DOCS_ORIGIN from @/lib/origins instead:\n",
    );
    for (const v of violations) console.error("  " + v);
    process.exit(1);
  }
  console.log("no hardcoded cross-surface origins outside src/lib/origins.ts");
}
