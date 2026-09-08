#!/usr/bin/env node
// SPDX-License-Identifier: Elastic-2.0
// Copyright 2026 Zero Root AI

/**
 * gen-plans.mjs, canonical plan registry → TypeScript emitter.
 *
 * The canonical plan registry lives in the public umbrella chart repo
 * zeroroot-ai/charts, under helm/gibson-operators/files/. The tenant operator
 * ships the same file as a ConfigMap, so the site and the operator read one
 * registry. (Open-core relocation, ADR-0050: billing and plans left OSS
 * gibson, and the chart repo took the registry.)
 *
 * Two source modes:
 *
 *   remote (default)   fetch plans.yaml + plans.schema.json from GitHub raw at
 *                      https://raw.githubusercontent.com/zeroroot-ai/charts/{ref}/helm/gibson-operators/files/...
 *                      charts is public, so no credential is needed. A
 *                      GITHUB_TOKEN env var, when set, is sent to raise the
 *                      rate limit.
 *                      Ref: PLANS_REF env var, default "main".
 *
 *   local              read plans.yaml + plans.schema.json from the directory
 *                      named by the PLANS_DIR env var. Point PLANS_DIR at
 *                      helm/gibson-operators/files/ inside a charts checkout.
 *                      Used for offline work and when a chart edit is not
 *                      pushed yet. There is no implicit sibling path: the
 *                      directory is always explicit.
 *
 * Mode selection:
 *   --remote / --source=remote  | PLANS_SOURCE=remote   ⇒ remote
 *   --local  / --source=local   | PLANS_SOURCE=local    ⇒ local
 *   default                                              ⇒ remote
 *
 * Emits:  src/generated/plans.ts
 *
 * The generated file contains strongly-typed Plan / Quotas / Pricing / PlanID
 * definitions and the frozen `plans` constant that /pricing renders. This
 * script is the single bridge between the chart registry and the site. No
 * other TypeScript file parses the YAML directly.
 *
 * The script exits with a non-zero status on any failure, so a build fails
 * loudly rather than emitting stale types.
 *
 * Schema simplified by spec plans-and-quotas-simplification:
 *   - Four plan ids: team, org, enterprise, enterprise-deploy
 *   - Two quotas: concurrent_missions, concurrent_agents (0 = unlimited)
 *   - Pricing block carries display metadata
 *   - No more Features / has_* flags
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { parse as parseYaml } from "yaml";

const HERE = dirname(fileURLToPath(import.meta.url));
// The site root holds scripts/ and src/. Resolving from the script file keeps
// this correct in a git worktree and in a container, because it never walks
// above the checkout.
const SITE_ROOT = resolve(HERE, "..");
const OUTPUT = resolve(SITE_ROOT, "src/generated/plans.ts");

const REMOTE_REPO = "zeroroot-ai/charts";
const CHART_FILES_DIR = "helm/gibson-operators/files";
const REMOTE_PATHS = {
  yaml: `${CHART_FILES_DIR}/plans.yaml`,
  schema: `${CHART_FILES_DIR}/plans.schema.json`,
};
// Where the generated header points a reader who wants the registry itself.
const SOURCE_REF = `${REMOTE_REPO} ${REMOTE_PATHS.yaml}`;

const KNOWN_PLAN_IDS = ["team", "org", "enterprise", "enterprise-deploy"];

const REQUIRED_QUOTA_KEYS = ["concurrent_missions", "concurrent_agents"];

function die(msg) {
  process.stderr.write(`gen-plans: ${msg}\n`);
  process.exit(1);
}

/**
 * Resolve the active source mode from CLI flags + env vars. CLI flags win
 * over env vars; env wins over the implicit default ("local").
 */
function resolveSource(argv) {
  for (const arg of argv) {
    if (arg === "--remote") return "remote";
    if (arg === "--local") return "local";
    if (arg.startsWith("--source=")) {
      const v = arg.slice("--source=".length);
      if (v === "remote" || v === "local") return v;
      die(`--source must be 'remote' or 'local', got ${JSON.stringify(v)}`);
    }
  }
  const env = process.env.PLANS_SOURCE;
  if (env === "remote" || env === "local") return env;
  if (env && env !== "") {
    die(`PLANS_SOURCE must be 'remote' or 'local', got ${JSON.stringify(env)}`);
  }
  return "remote";
}

/**
 * Fetch a single file from the chart repo's raw content endpoint.
 * charts is public, so no credential is required. A GITHUB_TOKEN env var,
 * when present, only raises the rate limit.
 */
async function fetchRemoteFile(ref, repoPath) {
  const token = process.env.GITHUB_TOKEN;
  const url = `https://raw.githubusercontent.com/${REMOTE_REPO}/${encodeURIComponent(ref)}/${repoPath}`;
  const headers = {
    Accept: "application/vnd.github.raw",
    "User-Agent": "zeroroot-www-gen-plans",
  };
  if (token) headers.Authorization = `Bearer ${token}`;
  let resp;
  try {
    resp = await fetch(url, { headers });
  } catch (e) {
    die(`fetch ${url}: ${e.message}`);
  }
  if (!resp.ok) {
    die(
      `fetch ${url}: HTTP ${resp.status} ${resp.statusText}` +
        (resp.status === 404
          ? ` (check PLANS_REF=${JSON.stringify(ref)} resolves to a commit on ${REMOTE_REPO}, and that ${repoPath} still exists there)`
          : resp.status === 403 || resp.status === 429
            ? " (rate limited: set GITHUB_TOKEN, or use PLANS_SOURCE=local with PLANS_DIR)"
            : ""),
    );
  }
  return await resp.text();
}

/**
 * Load plans.yaml + plans.schema.json from the directory named by PLANS_DIR.
 * The caller states the directory, so no workstation layout is assumed.
 */
function loadLocal() {
  const dir = process.env.PLANS_DIR;
  if (!dir) {
    die(
      "local mode requires the PLANS_DIR env var. Point it at " +
        `${CHART_FILES_DIR} inside a ${REMOTE_REPO} checkout, for example ` +
        `PLANS_DIR=../charts/${CHART_FILES_DIR}. Drop PLANS_SOURCE=local to ` +
        "read the same files from GitHub instead.",
    );
  }
  const plansYaml = resolve(dir, "plans.yaml");
  const plansSchema = resolve(dir, "plans.schema.json");
  if (!existsSync(plansYaml)) {
    die(`plans.yaml not found at ${plansYaml} (PLANS_DIR=${dir})`);
  }
  if (!existsSync(plansSchema)) {
    die(`plans.schema.json not found at ${plansSchema} (PLANS_DIR=${dir})`);
  }
  return {
    yamlText: readFileSync(plansYaml, "utf8"),
    schemaText: readFileSync(plansSchema, "utf8"),
    sourceLabel: `local: ${plansYaml}`,
  };
}

/** Fetch plans.yaml + plans.schema.json from the canonical remote source. */
async function loadRemote() {
  const ref = process.env.PLANS_REF || "main";
  // Diagnostic to stderr (never stdout): in --stdout mode the caller captures
  // stdout as the generated TypeScript payload, so any progress line on stdout
  // pollutes the capture and breaks a drift check that diffs it against the
  // committed file.
  process.stderr.write(
    `gen-plans: fetching from ${REMOTE_REPO}@${ref} (PLANS_SOURCE=remote)\n`,
  );
  const yamlText = await fetchRemoteFile(ref, REMOTE_PATHS.yaml);
  const schemaText = await fetchRemoteFile(ref, REMOTE_PATHS.schema);
  return {
    yamlText,
    schemaText,
    sourceLabel: `remote: ${REMOTE_REPO}@${ref}`,
  };
}

async function main() {
  const argv = process.argv.slice(2);
  const stdoutMode = argv.includes("--stdout");
  const source = resolveSource(argv);

  if (!stdoutMode && process.env.SKIP_GEN_PLANS === "1" && existsSync(OUTPUT)) {
    // Diagnostic to stderr so --stdout consumers never see it (defense in
    // depth, the !stdoutMode guard already prevents this path, but stderr
    // is the right channel regardless).
    process.stderr.write(
      `gen-plans: SKIP_GEN_PLANS=1, using pre-generated ${OUTPUT}\n`,
    );
    return;
  }

  const loaded = source === "remote" ? await loadRemote() : loadLocal();
  // schemaText is intentionally not re-validated here; validate() below is
  // the structural gate. The schema file is the source-of-truth for the Go
  // validator in tenant-operator.
  void loaded.schemaText;

  let doc;
  try {
    doc = parseYaml(loaded.yamlText);
  } catch (e) {
    die(`parse plans.yaml (${loaded.sourceLabel}): ${e.message}`);
  }

  validate(doc);

  const ts = renderTypeScript(doc);
  if (stdoutMode) {
    process.stdout.write(ts);
    return;
  }
  mkdirSync(dirname(OUTPUT), { recursive: true });
  writeFileSync(OUTPUT, ts, "utf8");
  process.stderr.write(
    `gen-plans: wrote ${OUTPUT} (${doc.plans.length} plans, source=${loaded.sourceLabel})\n`,
  );
}

function validate(doc) {
  if (!doc || typeof doc !== "object") {
    die("plans.yaml did not parse to an object");
  }
  if (doc.version !== "v1") {
    die(`unsupported registry version: ${doc.version}`);
  }
  if (!Array.isArray(doc.plans) || doc.plans.length === 0) {
    die("plans.yaml must contain a non-empty plans[] array");
  }
  const seen = new Set();
  for (const [i, plan] of doc.plans.entries()) {
    if (!plan.id) die(`plan[${i}]: missing id`);
    if (!KNOWN_PLAN_IDS.includes(plan.id)) {
      die(`plan[${i}]: unknown id ${JSON.stringify(plan.id)}`);
    }
    if (seen.has(plan.id)) die(`plan id ${plan.id} defined more than once`);
    seen.add(plan.id);
    for (const f of ["displayName", "tagline"]) {
      if (!plan[f]) die(`plan[${plan.id}]: missing ${f}`);
    }
    if (!plan.pricing || typeof plan.pricing !== "object") {
      die(`plan[${plan.id}]: pricing missing`);
    }
    const hasPrice =
      typeof plan.pricing.monthlyUSD === "number" ||
      typeof plan.pricing.annualUSD === "number" ||
      plan.pricing.contactSales === true;
    if (!hasPrice) {
      die(
        `plan[${plan.id}]: pricing must set at least one of monthlyUSD, annualUSD, or contactSales=true`,
      );
    }
    if (!plan.quotas || typeof plan.quotas !== "object") {
      die(`plan[${plan.id}]: quotas missing`);
    }
    for (const k of REQUIRED_QUOTA_KEYS) {
      if (!Number.isInteger(plan.quotas[k])) {
        die(`plan[${plan.id}]: quotas.${k} must be an integer`);
      }
      if (plan.quotas[k] < 0) {
        die(`plan[${plan.id}]: quotas.${k} must be >= 0 (0 = unlimited)`);
      }
    }
  }
}

function renderTypeScript(doc) {
  const lines = [];
  lines.push(
    "// GENERATED FILE, do not edit.",
    `// Source: ${SOURCE_REF}`,
    "// Generator: scripts/gen-plans.mjs",
    "// Run `node scripts/gen-plans.mjs` to regenerate.",
    "",
    "export type PlanID =",
    ...KNOWN_PLAN_IDS.map((id, i) => {
      const last = i === KNOWN_PLAN_IDS.length - 1 ? ";" : "";
      return `  | ${JSON.stringify(id)}${last}`;
    }),
    "",
    "export interface Quotas {",
    "  /** Max concurrent (in-flight) missions; 0 = unlimited. */",
    "  concurrent_missions: number;",
    "  /** Max concurrent agents bound to in-flight tasks; 0 = unlimited.",
    "   *  Idle-but-connected agents do NOT count toward this quota. */",
    "  concurrent_agents: number;",
    "}",
    "",
    "export interface Pricing {",
    "  monthlyUSD?: number;",
    "  annualUSD?: number;",
    "  annualSavingsPct?: number;",
    "  contactSales?: boolean;",
    "}",
    "",
    "export interface Plan {",
    "  id: PlanID;",
    "  displayName: string;",
    "  tagline: string;",
    "  stripeProductId: string | null;",
    "  /** Card-first-signup trial length (days). 0/absent on contactSales tiers. */",
    "  trialDays?: number;",
    "  pricing: Pricing;",
    "  quotas: Quotas;",
    "}",
    "",
    `export const PLAN_REGISTRY_VERSION = ${JSON.stringify(doc.version)};`,
    "",
    "export const plans: readonly Plan[] = Object.freeze([",
    ...doc.plans.map((p) => "  " + jsonToTsLiteral(normalizePlan(p)) + ","),
    "]);",
    "",
    `export const planIDs: readonly PlanID[] = Object.freeze([${KNOWN_PLAN_IDS.map(
      (id) => JSON.stringify(id),
    ).join(", ")}]) as readonly PlanID[];`,
    "",
    "const byID: Readonly<Record<PlanID, Plan>> = Object.freeze(",
    "  Object.fromEntries(plans.map((p) => [p.id, p])) as Record<PlanID, Plan>,",
    ");",
    "",
    "export function lookupPlan(id: PlanID): Plan {",
    "  const p = byID[id];",
    "  if (!p) throw new Error(`unknown plan id: ${id}`);",
    "  return p;",
    "}",
    "",
  );
  return lines.join("\n");
}

/**
 * normalizePlan strips any YAML keys not part of the Plan TS interface and
 * fills in `stripeProductId: null` when omitted, so the generated literal
 * matches the type exactly.
 */
function normalizePlan(p) {
  return {
    id: p.id,
    displayName: p.displayName,
    tagline: p.tagline,
    stripeProductId: p.stripeProductId ?? null,
    ...(typeof p.trialDays === "number" && p.trialDays > 0 ? { trialDays: p.trialDays } : {}),
    pricing: {
      ...(typeof p.pricing.monthlyUSD === "number" ? { monthlyUSD: p.pricing.monthlyUSD } : {}),
      ...(typeof p.pricing.annualUSD === "number" ? { annualUSD: p.pricing.annualUSD } : {}),
      ...(typeof p.pricing.annualSavingsPct === "number" ? { annualSavingsPct: p.pricing.annualSavingsPct } : {}),
      ...(p.pricing.contactSales === true ? { contactSales: true } : {}),
    },
    quotas: {
      concurrent_missions: p.quotas.concurrent_missions,
      concurrent_agents: p.quotas.concurrent_agents,
    },
  };
}

/**
 * jsonToTsLiteral serialises a plan object as a TS object-literal string.
 * Using JSON.stringify produces valid TS because all values are JSON-safe
 * (no Dates, no undefined keys after null-normalisation).
 */
function jsonToTsLiteral(obj) {
  return JSON.stringify(obj, null, 2).replace(/\n/g, "\n  ");
}

await main();
