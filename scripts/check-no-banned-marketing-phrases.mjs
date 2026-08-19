#!/usr/bin/env node
/**
 * check-no-banned-marketing-phrases.mjs — landing copy must obey the brand
 * voice constraints.
 *
 * Banned in customer-facing landing copy:
 *   - probability jargon ("probabilistic model", "P(juicy|exploitable|reachable",
 *     "scores the (attack) surface", "belief field") — name the mechanism
 *     instead, in the words a reader already has.
 *   - the "no playbooks" wedge — lead with what the runtime does, not what it
 *     lacks.
 *   - competitor contrast ("unlike other/most/competing") — state what the
 *     runtime IS, positively. The position is competitive; the copy is not.
 *   - overt game-engine framing ("game engine") — World / Scroller / tick are
 *     product-feature names, never the pitch.
 *   - "control plane" as the product noun — it means billing, signup and tenant
 *     provisioning inside the codebase, and it describes watching from outside,
 *     which is the opposite of the claim. The product noun is "runtime".
 *
 * The remediation text below used to prescribe "thinks in paths", which the
 * 2026-08-19 reposition retired — a guard that pushes authors toward dead
 * vocabulary is worse than no guard.
 *
 * Detection contract (mirrors scripts/check-no-emdash.mjs):
 *   - TSX/TS: comments are stripped first (line numbers preserved), so only
 *     text that can reach the DOM (string/template/JSX text) is checked. Code
 *     comments are immune by construction — they may discuss the banned terms.
 *   - MDX/MD: the whole file is customer prose; every match is a violation.
 *   - Test files (*.test.*, *.spec.*, __tests__/) are skipped.
 *
 * Zero tolerance — no allowlist. Coverage grows by extending SCOPED_ROOTS as
 * later slices land (S2 #887 broadens landing, S3 #888 adds content/docs).
 *
 * Usage:
 *   node scripts/check-no-banned-marketing-phrases.mjs            # scan scoped roots
 *   node scripts/check-no-banned-marketing-phrases.mjs --selftest # verify the scanner
 *
 * Exit codes: 0 clean, 1 violations found (or selftest failure).
 */

import { readdir, readFile, stat, mkdtemp, rm, writeFile, mkdir } from "node:fs/promises";
import { join, relative, extname } from "node:path";
import { fileURLToPath } from "node:url";
import { tmpdir } from "node:os";

const __filename = fileURLToPath(import.meta.url);
const SITE_ROOT = join(__filename, "..", "..");

// Landing surfaces that consume the canonical messaging module. Kept narrow on
// purpose; widen as later slices bring more copy under the contract.
const SCOPED_ROOTS = [
  "src/components/landing",
  "src/layouts",
  "src/lib/messaging.ts",
  "src/pages",
];

const SKIP_DIRS = new Set(["node_modules", ".astro", "dist", "test-results", "__tests__", "__snapshots__"]);
const CODE_EXT = new Set([".ts", ".tsx", ".js", ".jsx", ".mjs", ".cjs"]);
const PROSE_EXT = new Set([".mdx", ".md"]);

/** Each rule: a matcher and the fix to suggest. */
const BANNED = [
  { re: /probabilistic model/i, why: 'probability jargon — name the mechanism instead' },
  { re: /\bP\(\s*(juicy|exploitable|reachable)/i, why: 'probability jargon — say what the agent found and why it matters' },
  { re: /scores?\s+the\s+(attack\s+)?surface/i, why: 'probability jargon — say what the mission actually does' },
  { re: /belief\s+field/i, why: 'internal term — describe the outcome, not the engine' },
  { re: /\bno\s+playbooks\b/i, why: 'dated wedge — lead with what the runtime does, not what it lacks' },
  { re: /\bunlike\s+(other|most|competing)/i, why: 'competitor contrast — state what the runtime IS, positively' },
  { re: /\bcontrol\s+plane\b/i, why: 'not the product noun — "control plane" means billing/signup/provisioning internally, and describes watching from outside. Say "runtime"' },
  { re: /game[-\s]?engine/i, why: 'keep game framing out of customer copy — World/Scroller/tick are feature names only' },
];

function isTestFile(path) {
  return /\.(test|spec)\.[a-z]+$/.test(path) || /__tests__/.test(path);
}

/**
 * Blank out block and line comments so developer prose never trips the guard
 * (same approach as check-no-emdash / check-no-hardcoded-colors). Newlines are
 * preserved so reported line numbers match the source.
 */
function stripComments(text) {
  return text
    .replace(/\/\*[\s\S]*?\*\//g, (m) => m.replace(/[^\n]/g, " "))
    .replace(/([^:]|^)\/\/.*$/gm, (m, p1) => p1 + " ".repeat(m.length - p1.length));
}

/** Return { line, excerpt, why } violations for one file's contents. */
export function scanContent(content, ext) {
  const violations = [];
  const text = PROSE_EXT.has(ext) ? content : stripComments(content);
  text.split("\n").forEach((line, i) => {
    for (const rule of BANNED) {
      if (rule.re.test(line)) {
        violations.push({ line: i + 1, excerpt: line.trim().slice(0, 100), why: rule.why });
      }
    }
  });
  return violations;
}

async function* walk(path) {
  let s;
  try {
    s = await stat(path);
  } catch {
    return;
  }
  if (s.isFile()) {
    yield path;
    return;
  }
  if (!s.isDirectory()) return;
  for (const entry of await readdir(path, { withFileTypes: true })) {
    if (entry.isDirectory()) {
      if (SKIP_DIRS.has(entry.name)) continue;
      yield* walk(join(path, entry.name));
    } else {
      yield join(path, entry.name);
    }
  }
}

async function scanTree(roots = SCOPED_ROOTS, base = SITE_ROOT) {
  const found = [];
  for (const root of roots) {
    for await (const file of walk(join(base, root))) {
      const ext = extname(file);
      if (!CODE_EXT.has(ext) && !PROSE_EXT.has(ext)) continue;
      if (isTestFile(file)) continue;
      const content = await readFile(file, "utf8");
      for (const v of scanContent(content, ext)) {
        found.push({ file: relative(base, file), ...v });
      }
    }
  }
  return found;
}

async function selftest() {
  const dir = await mkdtemp(join(tmpdir(), "no-banned-mktg-"));
  try {
    const cases = [
      // [name, relpath, content, expectViolation]
      ["jsx jargon", "a/Hero.tsx", `export const X = () => <p>A probabilistic model of your surface.</p>;\n`, true],
      ["P(juicy) string", "a/B.tsx", `export const s = "we compute P(juicy) per host";\n`, true],
      ["belief field text", "a/C.tsx", `export const X = () => <p>The belief field scores risk.</p>;\n`, true],
      ["no-playbooks wedge", "a/D.tsx", `export const t = "no playbooks, just an LLM";\n`, true],
      ["competitor contrast", "a/E.tsx", `export const t = "unlike other agents, ours is real";\n`, true],
      ["game engine pitch", "a/F.tsx", `export const t = "it runs on a game engine";\n`, true],
      ["mdx prose", "a/page.mdx", `Gibson uses a probabilistic model under the hood.\n`, true],
      ["compliant copy", "a/Good.tsx", `export const X = () => <p>Gibson thinks in paths, not checklists.</p>;\n`, false],
      ["banned in block comment", "a/Cmt.tsx", `/* internally this is the belief field */\nexport const x = 1;\n`, false],
      ["banned in line comment", "a/Line.tsx", `export const x = 1; // no playbooks here, internal note\n`, false],
      ["test file", "a/Hero.test.tsx", `it("x", () => expect("belief field").toBe("belief field"));\n`, false],
    ];
    let failed = 0;
    for (const [name, rel, content, expectViolation] of cases) {
      const p = join(dir, rel);
      await mkdir(join(p, ".."), { recursive: true });
      await writeFile(p, content);
      const found = await scanTree(["a"], dir);
      const hit = found.some((v) => join(dir, v.file) === p);
      if (hit !== expectViolation) {
        console.error(`✗ selftest [${name}]: expected ${expectViolation ? "violation" : "clean"}, got ${hit ? "violation" : "clean"}`);
        failed++;
      }
      await rm(p);
    }
    if (failed) {
      console.error(`check-no-banned-marketing-phrases selftest: ${failed} case(s) failed`);
      process.exit(1);
    }
    console.log(`✓ check-no-banned-marketing-phrases selftest: ${cases.length} cases passed`);
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
}

async function main() {
  if (process.argv.includes("--selftest")) {
    await selftest();
    return;
  }
  const found = await scanTree();
  if (found.length) {
    console.error(`✗ check-no-banned-marketing-phrases: ${found.length} banned phrase(s) in landing copy:\n`);
    for (const v of found) {
      console.error(`  ${v.file}:${v.line}  ${v.excerpt}\n      ↳ ${v.why}`);
    }
    console.error(
      "\nThe brand voice forbids these in customer copy (dashboard#885). Rewrite " +
        "to the approved framing in src/lib/messaging.ts.",
    );
    process.exit(1);
  }
  console.log(`✓ check-no-banned-marketing-phrases: landing copy clean (${SCOPED_ROOTS.join(", ")})`);
}

main().catch((err) => {
  console.error("check-no-banned-marketing-phrases crashed:", err);
  process.exit(1);
});
