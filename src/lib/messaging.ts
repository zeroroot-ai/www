/**
 * Canonical messaging source of truth (dashboard#886, parent #885).
 *
 * Every customer-facing landing surface reads its brand copy from here so the
 * surfaces cannot drift apart again. That drift is exactly why #885 exists: the
 * org profile said "agent factory", the dashboard said "security & ops", and the
 * docs said "security work". Edit copy HERE, never inline it in a component.
 *
 * Voice constraints are enforced by
 * scripts/check-no-banned-marketing-phrases.mjs: no probability jargon, no
 * competitor contrast, no "no playbooks" wedge, and the game-engine vocabulary
 * (World / Scroller / tick) stays a product-feature name, never a headline. See
 * the parent PRD's Messaging Spec for the full direction.
 *
 * Names are fixed: zeroroot.ai is the company / umbrella; Gibson is the engine,
 * always written as a proper noun. (The chrome product name, "Zero Root AI",
 * lives separately in ./brand.ts; this module owns positioning copy.)
 */

/** The company / umbrella brand, as written in copy. */
export const COMPANY = "zeroroot.ai";

/** The flagship engine. Always a proper noun. */
export const ENGINE = "Gibson";

/** Umbrella positioning, shared across every surface. */
export const umbrella = {
  tagline: "The zero-trust agent factory.",
  supporting:
    "Build any agent. Run it on a substrate that enforces zero trust at every layer.",
} as const;

/** One Gibson flagship pillar: a buyer-legible outcome, no jargon. */
interface Pillar {
  readonly title: string;
  readonly body: string;
}

/**
 * The three flagship pillars. Pillar 2 is the signature and is deliberately the
 * most specific: WorldView (gibson internal/engine/harness/worldview.go, ADR-0012)
 * is a server-projected, mission-scope-limited read of the tenant World, where
 * every entity carries an opaque server-minted handle the agent cannot construct
 * or iterate. "Cannot name what it was not sent to find" is that property in
 * plain English, not a metaphor — enumerating past the slice is unrepresentable.
 *
 * Each claim here is code-backed: the World is per-tenant and long-lived
 * (brain/mission_projection.go), and the emit contract is append-only
 * (ADR-0012, harness/append_only_test.go).
 */
export const pillars: readonly Pillar[] = [
  {
    title: "A World, not a report",
    body: "One model per tenant, not one per agent. Every asset, path and finding an agent turns up lands in the same place, and outlives the mission that found it.",
  },
  {
    title: "Every agent gets a world view",
    body: "An agent reads a slice of the World, never the whole thing. Its mission fixes the boundary and the server draws it, so an agent cannot name what it was not sent to find.",
  },
  {
    title: "Replayable, move by move",
    body: "Observations are append-only and attributed. Rewind a mission step by step and get the same answer twice.",
  },
] as const;

/** Which side of the line a persona sits on. The engine serves all four. */
type PersonaSide = "offense" | "defense" | "purple" | "platform";

interface Persona {
  readonly label: string;
  readonly side: PersonaSide;
}

/**
 * Side-neutral persona set. Offense walks the path, defense cuts it, purple
 * shares one replayable picture, platform/DevSecOps wants reachable risk over a
 * CVE list. Consumed by the landing persona rotator (slice S2, #887).
 */
export const personas: readonly Persona[] = [
  { label: "Pentest", side: "offense" },
  { label: "Red Team", side: "offense" },
  { label: "Bug Bounty", side: "offense" },
  { label: "Blue Team", side: "defense" },
  { label: "SOC", side: "defense" },
  { label: "Incident Response", side: "defense" },
  { label: "Purple Team", side: "purple" },
  { label: "Platform", side: "platform" },
  { label: "DevSecOps", side: "platform" },
] as const;

/** Approved outcome-first headline candidates. The hero leads with the first. */
export const headlines: readonly string[] = [
  "Gibson thinks in paths, not checklists.",
  "Autonomous security that maps how risk actually connects, for the teams breaking in and the teams locking down.",
  "Reachable risk, not a wall of findings.",
  "One engine. Both sides of the line.",
] as const;

/**
 * Hero copy. The headline is split so the first phrase renders in the brand
 * highlight: `<highlight>{headlineHighlight}</highlight> {headlineRest}`.
 */
export const hero = {
  eyebrow: "// agent platform for security & ops teams",
  headlineHighlight: "Zero Trust",
  headlineRest: "runtime and control plane for agents.",
  subhead:
    "Agents run where you work: laptop, CI, k8s. Identity, missions, shared memory, and audit run in the control plane.",
  ctaPrimary: "Start Free",
  ctaSecondary: "Star the ADK",
  quickstart: "first agent live in under an hour. See the quickstart",
} as const;

/**
 * The flagship section header. Lived inline in GibsonBrain.tsx until now,
 * which is exactly what this module exists to prevent: the file's own header
 * says "Edit copy HERE, never inline it in a component", and an inline
 * paragraph is how the surfaces drift apart again.
 */
export const flagship = {
  eyebrow: "// the flagship",
  heading: "Autonomous security that maps how risk connects",
  body: "One model of your environment, built as agents work it. Each agent reads only its slice.",
} as const;

/** Closing lockup, reused by footer-adjacent and profile surfaces. */
export const lockup = {
  line: "Your agents. Any domain. Zero-trust substrate.",
  signature: `${COMPANY}, the zero-trust agent factory`,
} as const;
