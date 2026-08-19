#!/usr/bin/env node
/**
 * check-no-british-spellings.mjs — this site is written in American English.
 *
 * Owner call, 2026-08-19. The copy had drifted into a mix: "artefact" and
 * "licence" in the messaging module, "colour" and "behaviour" in the comments
 * around it, "normalise" in the build scripts. Half a page in one spelling and
 * half in the other reads as carelessness to the exact buyer this site is for.
 *
 * Scope is src/ and scripts/, code and prose alike, because identifiers leak:
 * a `normalisePlan` helper becomes a `normalisePlan` mention in a comment and
 * then a "normalise" in copy. One rule everywhere is simpler than a rule with
 * an exception, and there are few enough of these that fixing them is cheap.
 *
 * The list is deliberately short and high-confidence. It carries only the
 * classes that actually appeared or plausibly will: -our/-or, -ise/-ize on
 * words we use, -re/-er, doubled-l participles, and the handful of one-off
 * spellings. It does NOT try to be a dictionary — a guard that fires on
 * something a writer believes is correct gets disabled, and then it protects
 * nothing.
 *
 * Usage:
 *   node scripts/check-no-british-spellings.mjs            # scan
 *   node scripts/check-no-british-spellings.mjs --selftest # verify the scanner
 *
 * Exit codes: 0 clean, 1 violations found (or selftest failure).
 */

import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative, sep, extname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(fileURLToPath(new URL(".", import.meta.url)), "..");
const ROOTS = ["src", "scripts"];
const SKIP_DIRS = new Set(["node_modules", ".astro", "dist", "test-results", "generated"]);
const EXT = new Set([".ts", ".tsx", ".js", ".jsx", ".mjs", ".cjs", ".astro", ".md", ".mdx", ".css"]);

/** British spelling → the American one this site uses. */
export const SPELLINGS = new Map([
  ["artefact", "artifact"],
  ["behaviour", "behavior"],
  ["cancelled", "canceled"],
  ["catalogue", "catalog"],
  ["centred", "centered"],
  ["colour", "color"],
  ["defence", "defense"],
  ["fulfil", "fulfill"],
  ["labelled", "labeled"],
  ["licence", "license"],
  ["modelled", "modeled"],
  ["normalise", "normalize"],
  ["optimise", "optimize"],
  ["organise", "organize"],
  ["prioritise", "prioritize"],
  ["recognise", "recognize"],
  ["summarise", "summarize"],
  ["utilise", "utilize"],
  ["whilst", "while"],
]);

/**
 * Matches a listed spelling as a whole word, plus the endings those words take.
 * Written as one alternation so a new entry in the map needs no second edit.
 *
 * The trailing boundary is `(?![a-z])` rather than `\b`, so a camelCase
 * identifier is caught too: `normalisePlan` is exactly the shape that seeded
 * the drift this guard exists to stop, and `\b` sails straight past it.
 *
 * That lookahead is why there is no `i` flag. Under `i`, `[a-z]` matches
 * uppercase as well, so `(?![a-z])` would reject the `P` in `normalisePlan` and
 * the guard would miss the one case it was written for. Each entry instead
 * carries its own leading `[Xx]`, which covers the capitalized form without
 * making the whole pattern case-insensitive.
 */
const RE = new RegExp(
  `\\b(${[...SPELLINGS.keys()].map((w) => `[${w[0].toUpperCase()}${w[0]}]${w.slice(1)}`).join("|")})` +
    `(s|d|r|rs|ing|ion|ions|ed|ment|ments)?(?![a-z])`,
  "g",
);

function* walk(dir) {
  for (const entry of readdirSync(dir)) {
    if (SKIP_DIRS.has(entry)) continue;
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) yield* walk(full);
    else yield full;
  }
}

/** @returns {Array<{line: number, found: string, want: string}>} */
export function scanContent(content) {
  const hits = [];
  content.split("\n").forEach((line, i) => {
    for (const m of line.matchAll(RE)) {
      const base = m[1].toLowerCase();
      hits.push({ line: i + 1, found: m[0], want: SPELLINGS.get(base) });
    }
  });
  return hits;
}

function selftest() {
  const cases = [
    { text: "the same artefact as the hosted one", dirty: true },
    { text: "Apache-2.0 licence", dirty: true },
    { text: "// re-tuned for the new colours", dirty: true },
    { text: "function normalisePlan(p) {", dirty: true },
    { text: "it recognises the constraint", dirty: true },
    { text: "the same artifact as the hosted one", dirty: false },
    { text: "Apache-2.0 license", dirty: false },
    { text: "// re-tuned for the new colors", dirty: false },
    { text: "a licenced professional", dirty: true },
    { text: "the fulfilment of the order", dirty: true },
    // Correct spellings that merely look close must not fire.
    { text: "an unlicensed build", dirty: false },
    { text: "we deliver value", dirty: false },
    { text: "the council was dissolved", dirty: false },
  ];
  let failures = 0;
  for (const { text, dirty } of cases) {
    const hits = scanContent(text);
    if (dirty && hits.length === 0) {
      console.error(`selftest FAILED: missed → ${text}`);
      failures += 1;
    }
    if (!dirty && hits.length > 0) {
      console.error(`selftest FAILED: false positive → ${text} (${hits.map((h) => h.found).join(", ")})`);
      failures += 1;
    }
  }
  if (failures) {
    console.error(`check-no-british-spellings: selftest FAILED (${failures})`);
    process.exit(1);
  }
  console.log(`selftest OK (${cases.length} cases, ${SPELLINGS.size} spellings)`);
}

function main() {
  if (process.argv.includes("--selftest")) return selftest();

  const violations = [];
  for (const root of ROOTS) {
    const dir = join(ROOT, root);
    for (const file of walk(dir)) {
      if (!EXT.has(extname(file))) continue;
      if (file.endsWith("check-no-british-spellings.mjs")) continue;
      const rel = relative(ROOT, file).split(sep).join("/");
      for (const h of scanContent(readFileSync(file, "utf8"))) {
        violations.push(`${rel}:${h.line}: ${h.found} — this site writes American English: ${h.want}`);
      }
    }
  }

  if (violations.length === 0) {
    console.log(`✓ check-no-british-spellings: clean (${ROOTS.join(", ")})`);
    return;
  }
  console.error("✗ check-no-british-spellings: British spelling(s) found:\n");
  for (const v of violations) console.error(`  ${v}`);
  process.exit(1);
}

main();
