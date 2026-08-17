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
 * Names are fixed: Gibson is the product — the ADK and the runtime — always
 * written as a proper noun. zeroroot.ai is the company that makes it, not a
 * second brand layered above it. (The chrome product name lives separately in
 * ./brand.ts; this module owns positioning copy.)
 *
 * Reposition (2026-08-17): Gibson was described here as "the flagship security
 * engine" under a "zero-trust agent factory" umbrella. It is neither a second
 * brand nor a security engine: it is a do-it-yourself ADK and runtime that
 * platform and DevSecOps teams use to deploy always-on agents. Autonomous
 * security is now one example of what you build, not the headline. The
 * `flagship` and `pillars` exports and the GibsonBrain section went with it.
 */

/** The company that makes Gibson, as written in copy. */
export const COMPANY = "zeroroot.ai";

/** The product: the ADK and the runtime. Always a proper noun. */
export const ENGINE = "Gibson";

/**
 * Product positioning, shared across every surface. "Agent factory" is the
 * category, in the software-factory sense — the umbrella chart is Big Bang
 * compatible and that reader knows the term. It is not a metaphor.
 */
export const umbrella = {
  tagline: "The agent factory for platform and security engineering.",
  supporting:
    "An ADK and a runtime. You write the agent; Gibson gives it an identity, a grant for every tool it can touch, a sandbox, and a replayable record of what it did.",
} as const;

/** Which side of the line a persona sits on. The engine serves all four. */
type PersonaSide = "offense" | "defense" | "purple" | "platform";

interface Persona {
  readonly label: string;
  readonly side: PersonaSide;
}

/**
 * The teams that build on Gibson. The set stays broad on purpose: the runtime is
 * domain-agnostic, and security is one thing you build with it, not the boundary.
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
  "Describe the agent. Ship it under your controls.",
  "Always-on agents, built by your team, bounded by grants you set.",
  "Write the agent. Gibson runs it under an identity, a grant, and a sandbox.",
  "An agent factory your security review can actually read.",
] as const;

/**
 * Hero copy. The headline is split so the first phrase renders in the brand
 * highlight: `<highlight>{headlineHighlight}</highlight> {headlineRest}`.
 */
export const hero = {
  eyebrow: "// agent factory for platform and security engineering",
  headlineHighlight: "Describe the agent.",
  headlineRest: "Ship it under your controls.",
  subhead:
    "Build from tools you already trust — amass, nuclei, Trivy, kubectl — or write your own with the SDK. Every agent is a source-controlled artifact owned by a named human, with a grant for each tool it can touch and a record of everything it did.",
  ctaPrimary: "Start Free",
  ctaSecondary: "Star the ADK",
  quickstart: "first agent live in under an hour. See the quickstart",
} as const;

/**
 * The enterprise path. Engagements are delivered by forward-deployed engineers
 * who embed with the customer's team; self-service stays the front door, so this
 * is a second route rather than a replacement for it.
 *
 * The route is the contact form, never a bare mail link: the form owns rate
 * limiting, and an address published on a public page is scraped within days.
 */
export const consulting = {
  eyebrow: "// enterprise",
  heading: "Forward-deployed engineers",
  body: "Our engineers embed with your team to build the agents, components, and missions on your own infrastructure.",
  cta: "Talk to an engineer",
  address: "consulting@zeroroot.ai",
} as const;

/**
 * The trust strip under the hero. Every item must be true of the shipping
 * platform; accreditation claims do not belong here.
 *
 * "microVM isolation per execution" used to sit here and was false. One gate
 * decides how a component runs, from its declared content trust and the
 * deployment shape. What is true, and stronger, is that untrusted code has no
 * in-process fallback: sandbox or refusal.
 */
export const trustBar: readonly string[] = [
  "open-source core",
  "untrusted code sandboxed or refused",
  "kubernetes-native",
  "short-lived credentials",
  "bring your own LLM",
] as const;

/** One reason agents stall, and the shipping mechanism that resolves it. */
interface Blocker {
  readonly title: string;
  readonly pain: string;
  readonly resolve: string;
}

/** Pain then resolve. The resolve names a shipping mechanism, never a promise. */
export const blockers: readonly Blocker[] = [
  {
    title: "Untrusted code in production",
    pain: "AI-generated code running in your pipelines is a breach waiting to happen without real isolation.",
    resolve:
      "A component that declares it handles untrusted input runs in a Firecracker microVM, or the call is refused. There is no in-process fallback.",
  },
  {
    title: "Compliance can't audit a black box",
    pain: "Regulated environments can't run what they can't replay. \u201CThe agent did something\u201D doesn't pass an audit.",
    resolve:
      "Every model call is recorded with its full transcript and token counts, inside your tenant, and every mission replays step by step.",
  },
  {
    title: "Integration drags on for months",
    pain: "Bolting AI onto existing infrastructure means custom glue that still doesn't fit your patterns.",
    resolve:
      "Standard Kubernetes. Agents run where you already work: laptop, CI, VPS, k8s.",
  },
  {
    title: "Engineers see a threat, not a tool",
    pain: "Adoption stalls when the team that has to champion automation feels automated away.",
    resolve:
      "Your engineers build the agents, own the workflows, and hold the keys. Amplified, not replaced.",
  },
] as const;

/** One of the three component shapes you compose an agent from. */
interface Primitive {
  readonly kind: string;
  readonly what: string;
  readonly builtWith: string;
}

/**
 * The primitives section, directly under the hero. The rotator above it shows
 * eight concrete jobs; this explains how any of them get built, which nothing
 * on the page did before. Two paths on purpose: assemble parts that already
 * exist, or write your own.
 */
export const primitives = {
  eyebrow: "// what you build with",
  heading: "Three shapes, composed by a mission",
  body: "An agent is not one thing. You compose it, and everything it discovers lands in a knowledge graph the next agent starts from.",
  shapes: [
    {
      kind: "agent",
      what: "Model-driven service. Reasons, plans, delegates to tools.",
      builtWith: "sdk.NewAgent",
    },
    {
      kind: "tool",
      what: "Stateless executor. Proto in, proto out.",
      builtWith: "serve.Tool",
    },
    {
      kind: "plugin",
      what: "Stateful integration with declared methods and a lifecycle.",
      builtWith: "plugin.Serve",
    },
  ] as readonly Primitive[],
  reuse:
    "Start from parts that exist: gibson-executor is one microVM image carrying parsers for common security and ops command-line tools, and the opencode plugins put a coding agent under Gibson's controls.",
  build:
    "Or write your own against the Go SDK. TypeScript and Python SDKs are public too.",
} as const;

/** Closing lockup, reused by footer-adjacent and profile surfaces. */
export const lockup = {
  line: "Your agents. Your controls. Any domain.",
  signature: `${COMPANY} — Gibson, the agent factory`,
} as const;
