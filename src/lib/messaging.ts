// SPDX-License-Identifier: Elastic-2.0
// Copyright 2026 Zero Root AI

/**
 * Canonical messaging source of truth.
 *
 * Every customer-facing landing surface reads its brand copy from here so the
 * surfaces cannot drift apart. Edit copy HERE, never inline it in a component.
 *
 * The position (settled 2026-08-19, glossary in CONTEXT.md):
 *
 *   zeroroot sells the RUNTIME agents execute inside, where the boundary is a
 *   property of execution rather than a check applied afterwards. An agent gets
 *   there by being built on the SDK, or by having its model traffic redirected
 *   into it. "Control plane" is retired from customer copy: inside the codebase
 *   it means billing, signup and tenant provisioning, and it describes watching
 *   from outside, which is the opposite of the claim.
 *
 * Three claims previously shipped broader than the code supports. Copy here
 * states each with its boundary, and must keep doing so:
 *
 *   - microVM isolation is CONDITIONAL on declared content trust (ADR-0010);
 *     content_trust defaults to trusted when omitted. Say "work that declares
 *     untrusted input", never "every call".
 *   - SPIFFE is an in-cluster TRANSPORT upgrade over Capability Grant identity
 *     (ADR-0036), not a second identity system and not universal.
 *   - declared egress is enforced in the pod and setec runtime modes and is
 *     informational in process mode, so it is described with the sandbox.
 *
 * No certification is claimed anywhere. The platform ships controls, and this
 * module says controls.
 *
 * Voice (owner rules, 2026-08-25): Simplified Technical English, flavored
 * mode. Active voice with a named actor. One sentence, one idea, at most 25
 * words. No semicolons, no dash punctuation, no contractions. One name for one
 * thing: "runtime" (never platform or substrate), "check in" (never register
 * or enroll, except as a literal CLI verb), "timeline", "replay" (never
 * rewind), "microVM" (never sandbox). American spelling, enforced by
 * scripts/check-no-british-spellings.mjs.
 *
 * Voice constraints are enforced by scripts/check-no-banned-marketing-phrases.mjs.
 */

/** The company / umbrella brand, as written in copy. */
export const COMPANY = "zeroroot.ai";

/* -------------------------------------------------------------------------- */
/* Hero                                                                       */
/* -------------------------------------------------------------------------- */

/**
 * The headline is deliberately two flat sentences. The one-day claim is a
 * customer time-to-value claim, and the release-pipeline agent in `proof` is
 * its evidence, and the two move together or neither ships.
 */
export const hero = {
  eyebrow: "zero-trust agent runtime",
  headline: ["Install it today.", "Ship a production agent tomorrow."],
  sub: "Gibson is the runtime that gets an AI agent past a security review. The agent can only do what a named person granted it. Every action lands on a timeline you can replay. Run Gibson in our cloud or in your own cluster.",
  ctaPrimary: "Apply as a design partner",
  ctaSecondary: "Read the source",
  stats: [
    { value: "1 day", label: "to your first production agent" },
    { value: "Never", label: "more access than the human who granted it" },
    { value: "Ours or yours", label: "we host the runtime, or you do" },
  ],
} as const;

/* -------------------------------------------------------------------------- */
/* Repositories                                                               */
/* -------------------------------------------------------------------------- */

/**
 * Where each open-source name actually lives.
 *
 * One record, because the ADK URL had reached four call sites: the products
 * grid, the resources card, the footer, and now the hero's second action. Four
 * literals is three chances to rename a repository and miss one, and a dead
 * GitHub link is invisible to the internal-link guard, which only walks routes
 * on this site.
 */
export const repos = {
  "Gibson Runtime": "https://github.com/zeroroot-ai/gibson",
  "Gibson Console": "https://github.com/zeroroot-ai/dashboard",
  "Execution environment": "https://github.com/zeroroot-ai/setec",
  ADK: "https://github.com/zeroroot-ai/adk",
  Zerocool: "https://github.com/zeroroot-ai/zerocool-plugins",
  Bridge: "https://github.com/zeroroot-ai/sdk",
} as const satisfies Record<string, string>;

/* -------------------------------------------------------------------------- */
/* What this is                                                               */
/* -------------------------------------------------------------------------- */

interface Contrast {
  readonly title: string;
  readonly items: readonly string[];
}

/**
 * The category answer, stated before the page starts arguing.
 *
 * Written from the buyer's seat (owner call, 2026-08-25): a company where
 * every team has its own framework and its own way to get an agent into
 * production. The answer is not "pick one framework". It is "check in to one
 * runtime". Copy never states a team count.
 * The first card is what the ADK gives each team on day one, and every line
 * in it is a verb or a repository that exists: `gibson component init`,
 * `validate`, `register`, `inspect`, the Go, TypeScript and Python SDKs, the
 * LangChain adapter, the OpenAI-compatible shim, and MCP tools as components.
 * The second card is what the runtime gives the company once they are in.
 *
 * Clarity bar (owner-set, 2026-08-20): each title must parse on its own,
 * every pronoun must have one referent, zero metaphor.
 */
export const whyUs = {
  eyebrow: "what this is",
  heading: "Every team rows the same way, but with the agent development framework they prefer.",
  sub: "You do not need every team to agree on a framework. You need them to check in to the same runtime. The ADK gets each team there in a morning, in the language they already use, and the runtime does the rest.",
  contrast: [
    {
      title: "The ADK gives each team",
      items: [
        "A scaffold with the contract written down, so Claude Code or Cursor writes the component.",
        "Local validation before anything touches the runtime.",
        "One command to check in. One command to see the grants the agent holds.",
        "SDKs in Go, TypeScript and Python, and a LangChain adapter.",
        "MCP tools brought in as components.",
      ],
    },
    {
      title: "The runtime gives the company",
      items: [
        "One identity model for every agent.",
        "One grant model, bounded by the person who granted it.",
        "One typed mission format, so a bad mission fails at submit.",
        "One timeline per tenant, and replay of any run.",
        "One graph, so teams build on each other's findings.",
        "One console for all of it.",
      ],
    },
  ] as readonly Contrast[],
  outcome:
    "Every team keeps its framework and its code. What they give up is a different way to do the same thing on every team. Security reviews one runtime, and the answer covers every agent that checks in to it.",
} as const;

/* -------------------------------------------------------------------------- */
/* The world system                                                           */
/* -------------------------------------------------------------------------- */

/**
 * Replay, stated as the mechanism that makes it possible.
 *
 * The claim is exact and must stay exact (ADR-0001): the World is not stored
 * state, it is a fold of one append-only per-tenant Timeline, so any past
 * moment is reconstructable by folding the log to that point. The shipped read
 * path is WorldService.GetFrameAt(seq) in the daemon. The invariant is not in
 * customer copy (owner call 2026-08-25): the section says the outcome, an
 * exact answer for any moment, and the globe drives that same fold over a
 * sample Timeline.
 *
 * `note` is load-bearing and must not be removed. There is no customer run to
 * draw from (see the intentionally-empty proof section), so the globe shows a
 * SAMPLE mission and says so. This section illustrates the mechanism; it never
 * claims a real run. The event names it renders are real gibson domain-event
 * kinds, so they must stay real if the demo Timeline is ever edited.
 */
export const world = {
  eyebrow: "replay",
  heading: "Answer \u201cwhat did the agent do?\u201d for any moment, with proof.",
  lit: "any moment",
  sub: "An agent runs for hours or days and makes hundreds of decisions. Gibson keeps every one of them in order, and can show you the agent's exact view of the world at any moment in that run. An auditor asks what it knew before it acted. You drag to that moment and they watch.",
  note: "Sample mission. Demo data, not a customer run.",
  mission: "prove an exploitable path to the tenant key store",
  hint: "Drag the playhead or press play. Scrub back and a finding disappears, because the agent had not found it yet.",
} as const;

/* -------------------------------------------------------------------------- */
/* One agent, four hands                                                      */
/* -------------------------------------------------------------------------- */

interface Hand {
  readonly role: string;
  readonly holds: string;
  readonly body: string;
}

/**
 * Who actually has to say yes.
 *
 * Written as one agent crossing many desks. The four cards are examples of
 * desks, not a count (owner call 2026-08-25). The point is the practice
 * underneath: every team builds, checks in, grants and runs an agent the same
 * way, so a control set by one desk reaches every agent, and the silos stop
 * mattering. The way a team writes the agent does not change.
 *
 * Every `holds` value is a real control with a real holder in the product, not
 * a role we imagine: the grant model (problem #1), the two placement choices
 * (surfaces), and the budget and timeline (posture). If a control here ever
 * stops being enforced, this section is wrong, not merely stale.
 */
export const hands = {
  eyebrow: "one agent, every desk",
  heading: "The same practice for every team. The same runtime for every desk.",
  sub: "An agent crosses many desks before it runs: the developer who wrote it, security, platform, operations, compliance, and whoever owns the data it touches. Today each desk builds its own control, in its own tool, and none of them see each other. What makes that stop is the practice underneath. Every team scaffolds, checks in, grants and runs an agent the same way, so a control set by one desk reaches every agent, whichever team built it. The framework each team uses does not change: LangChain, CrewAI, or a loop of your own in Go, TypeScript or Python. Your AI coding agent does one short integration pass with the ADK, and the agent checks in like every other.",
  roles: [
    {
      role: "Developer",
      holds: "the agent",
      body: "Writes the agent in the framework they already use. Runs one short integration pass with the ADK and checks it in once. The path back to production does not run through us.",
    },
    {
      role: "Security",
      holds: "the grant",
      body: "Delegates read, write and execute by name. Security cannot delegate more than it holds. Deny wins wherever two grants disagree.",
    },
    {
      role: "Platform",
      holds: "the boundary",
      body: "Chooses where the runtime lives: hosted, or their own cluster, up to fully air-gapped. Chooses where agents run: a laptop, CI, a box on the network, or in the cluster.",
    },
    {
      role: "Operations",
      holds: "the budget and the timeline",
      body: "Sets what an agent may spend before it stops. Reads an append-only timeline of what the agent did. Any run replays move by move.",
    },
  ] as readonly Hand[],
} as const;

/* -------------------------------------------------------------------------- */
/* The problem                                                                */
/* -------------------------------------------------------------------------- */

interface Blocker {
  /** What the home-grown agent does today. Same grammatical shape on all four. */
  readonly title: string;
  /** What that costs, in the buyer's words. */
  readonly pain: string;
  /** Must name a shipping mechanism. A promise is not a resolve. */
  readonly resolve: string;
}

/**
 * Four cards in one shape (owner call, 2026-08-25): the title names what a
 * home-grown agent does the moment it touches production, `pain` says what
 * that costs, `resolve` says what Gibson does instead. The component labels
 * the two paragraphs "Today" and "With Gibson".
 */
export const problem = {
  eyebrow: "why agents stall",
  heading: "The prototype works. That was never the hard part.",
  sub: "Each team's agent works on a laptop. Here is what it does the moment it touches production, and what Gibson does instead.",
  labels: { today: "Today", gibson: "With Gibson" },
  items: [
    {
      title: "It runs on a shared service account.",
      pain: "Someone pasted a service account token into the agent's config. The agent now has every permission that account has, on every call, and nobody can say which ones it used.",
      resolve:
        "A named person grants the agent read, write or execute on specific things. The grant cannot exceed what that person holds. Every call records which grant it used.",
    },
    {
      title: "It leaves no record you can replay.",
      pain: "The agent writes to a log file. Three teams write three log formats. When an auditor asks what the agent did on Tuesday, someone greps and guesses.",
      resolve:
        "Every prompt, tool call and write goes into one ordered record per tenant. Replay any run, move by move, and it returns the same result every time.",
    },
    {
      title: "It runs generated code on the host.",
      pain: "The model writes a script and the agent runs it, on the same machine that holds production credentials. Nobody reviews the script first.",
      resolve:
        "Work that declares untrusted input runs in its own microVM, with its own kernel and a declared egress list. A code change from the coding agent arrives as a commit on a branch, and a human reviews it.",
    },
    {
      title: "It sends your data to someone else's cloud.",
      pain: "Each team picked its own model provider and its own place to host the agent. Customer data now leaves your boundary by several paths, and nobody signed off on any of them.",
      resolve:
        "One chart installs the runtime into your own cluster, with your own models and your own keys, up to fully air-gapped. Or let zeroroot host it.",
    },
  ] as readonly Blocker[],
} as const;

/* -------------------------------------------------------------------------- */
/* The spine: seven things an operator does, in order                        */
/* -------------------------------------------------------------------------- */

interface Step {
  readonly n: string;
  readonly title: string;
  readonly sub: string;
  readonly body: string;
  readonly chips: readonly string[];
}

export const spine = {
  eyebrow: "the whole path, seven steps",
  heading: "From an empty cluster to an agent you can replay.",
  steps: [
    {
      n: "01",
      title: "Pick where it runs",
      sub: "ours, or yours",
      body: "Start on the hosted runtime and there is nothing to stand up. Point agents at it and go. When it has to be yours, install the same runtime into your own Kubernetes with one chart. The chart pins every first-party image by digest, down to a fully air-gapped install. Or let zeroroot host it.",
      chips: ["hosted, nothing to run", "helm install gibson", "air-gapped"],
    },
    {
      n: "02",
      title: "Build or adapt",
      sub: "build new, or one integration pass",
      body: "Build agents on the ADK, or bring an agent you already have. Your AI coding agent reads the ADK contract and does one short integration pass: check-in, model calls through the runtime, tools declared. From then on the runtime identifies and budgets every model call.",
      chips: ["Go, TypeScript and Python SDKs", "OpenAI-compatible seam", "MCP tools"],
    },
    {
      n: "03",
      title: "Check in and grant",
      sub: "identity, then a ceiling",
      body: "An agent checks in once with a persistent host key. After that it acts on credentials that expire in 55 seconds, and it never caches them. A named human delegates read, write and execute. That human can never delegate more than they hold.",
      chips: ["Ed25519 host key", "55-second tokens", "grant ceiling", "deny wins"],
    },
    {
      n: "04",
      title: "Launch missions",
      sub: "typed at submit, not at runtime",
      body: "A mission is a typed work graph. A wrong agent name or a missing field fails when you submit the mission, not three steps into a production run. The model decides the path. The runtime checks the shape up front.",
      chips: ["CUE-typed", "pausable", "resumable"],
    },
    {
      n: "05",
      title: "They act",
      sub: "microVM or refusal",
      body: "Work that declares untrusted input runs in a microVM with a declared egress allowlist, or the runtime refuses the call. The harness is emit-only. An agent sees only the slice of the world its mission was given.",
      chips: ["Firecracker / Kata", "declared egress", "emit-only harness"],
    },
    {
      n: "06",
      title: "It lands in one graph",
      sub: "shared, per tenant",
      body: "Everything an agent discovers lands in your tenant's own graph: hosts, services, findings, evidence, and any entities and relationships of your own. The runtime keeps it, and the SDK queries it. The next mission, and the next team, start from that graph instead of from zero.",
      chips: ["append-only", "database per tenant", "no cross-tenant path"],
    },
    {
      n: "07",
      title: "Replay any of it",
      sub: "move by move",
      body: "The runtime attributes and keeps every prompt, tool call and write. Replay a mission step by step and it comes back the same every time. That is the difference between an audit answer and a shrug.",
      chips: ["deterministic", "attributable", "exportable"],
    },
  ] as readonly Step[],
} as const;

/* -------------------------------------------------------------------------- */
/* Check-in                                                                   */
/* -------------------------------------------------------------------------- */

/**
 * The transcript is NOT here. It belongs to the component that renders it, and
 * every line of it has to be verified against the real CLI: the verbs are
 * `gibson agent enroll` (mints the one-time bootstrap token),
 * `gibson component register --token …`, then `gibson mission submit`.
 */
export const checkin = {
  eyebrow: "how an agent checks in",
  heading: "Two commands, and the agent has an identity.",
  sub: "An agent's first act is to prove which host it is. After that, the agent signs every act. Each act is short-lived and bounded by the person who granted it.",
  steps: [
    {
      title: "Bootstrap once",
      body: "A one-time credential authenticates the first check-in. The agent never uses it again.",
    },
    {
      title: "Keep a host key",
      body: "A persistent Ed25519 key pair sits on disk at 0600. The host ID is the JWK thumbprint of its public key.",
    },
    {
      title: "Sign every call",
      body: "An ephemeral agent key signs a token per call. The token expires in 55 seconds, and the agent never caches it.",
    },
    {
      title: "Upgrade in cluster",
      body: "Inside a SPIRE-enabled cluster the transport upgrades to mTLS. Identity does not change. The same grant still governs.",
    },
  ],
} as const;

/* -------------------------------------------------------------------------- */
/* Adapt                                                                      */
/* -------------------------------------------------------------------------- */

/**
 * The integration is one short pass by an AI coding agent against the ADK
 * contract (owner call 2026-08-25): scaffold, wrap, validate, register, run.
 * Copy never says the code stays untouched, and never implies a foreign-agent
 * registry. The verbs in the component transcript are real ADK verbs.
 */
export const adapt = {
  eyebrow: "agents you already built",
  heading: "Keep the framework. One short integration pass brings the agent under the boundary.",
  sub: "Scaffold a component with the ADK. Your AI coding agent reads the contract in AGENTS.md and wraps the agent you already have: it adds the check-in, routes model calls through the runtime, and declares the tools. Validate, register, run. The framework and the logic stay yours.",
  bullets: [
    "Works with LangChain, CrewAI, AutoGen, LlamaIndex, or your own loop, in Go, TypeScript or Python",
    "One integration pass, done by Claude Code or Cursor against the ADK contract",
    "Checked in once, so it acts under an identity and a grant like any agent built here",
    "From then on every model call carries its identity and spends against its budget",
    "Its tools come in over MCP as components, with declared secrets and egress",
  ],
} as const;

/* -------------------------------------------------------------------------- */
/* Products                                                                   */
/* -------------------------------------------------------------------------- */

interface Product {
  /** Must be a key of `repos`, so every card links to the code it names. */
  readonly name: keyof typeof repos;
  readonly body: string;
  readonly license: string;
}

/**
 * Three pieces, each one a repository a reader can open.
 *
 * "Enclave" was retired 2026-08-25. It named the private deploy repo, so it
 * could not link anywhere, and in security it means a hardware trusted
 * execution environment, which the product does not ship. The third piece is
 * the execution environment: setec, the microVM operator the runtime
 * dispatches untrusted work into. It is listed here, not in the open-source
 * grid, so it appears once.
 */
export const platform: readonly Product[] = [
  {
    name: "Gibson Runtime",
    body: "The server your agents check in to. It holds each agent's identity and grant, runs missions, decides where work executes, and writes every event to the timeline.",
    license: "Elastic License v2",
  },
  {
    name: "Gibson Console",
    body: "The web UI on top of the runtime. Create and watch missions, set grants and budgets, browse the knowledge graph, read traces, and replay any run.",
    license: "Elastic License v2",
  },
  {
    name: "Execution environment",
    body: "Where untrusted work runs. Setec puts each tool run in its own microVM, on its own kernel, with the egress the component declared. The runtime dispatches into it and reads the result back.",
    license: "Apache-2.0",
  },
];

export const openSource: readonly Product[] = [
  { name: "ADK", body: "Build agents, tools and plugins. The gibson CLI.", license: "Apache-2.0" },
  { name: "Zerocool", body: "A coding agent built on opencode. A developer can drive it, but it is built to run on its own: the runtime dispatches work to it, from a mission or from a non-coding agent, and its changes arrive as commits a human reviews.", license: "MIT" },
  { name: "Bridge", body: "Brings any MCP-compliant tool in as a component.", license: "Apache-2.0" },
];

/**
 * The Platform menu, right column. Each entry is a question a buyer asks,
 * the mechanism that answers it, and the section on this page that explains
 * the mechanism. Every `href` is rooted at the landing page (`/#section`),
 * never a bare `#section`: the menu renders on /pricing and /contact-sales
 * too, and a bare fragment would point at a section those pages do not have.
 */
interface Mechanism {
  readonly question: string;
  readonly name: string;
  readonly line: string;
  readonly href: string;
}

export const mechanisms = {
  heading: "How it works",
  items: [
    { question: "Who can it act as?", name: "Grants", line: "Only what a named person delegated.", href: "/#check-in" },
    { question: "What is it working on?", name: "Missions", line: "A typed work graph, checked at submit.", href: "/#stack" },
    { question: "Where does the code run?", name: "Dispatch policy", line: "MicroVM, in process, or refused.", href: "/#posture" },
    { question: "What did it find?", name: "Knowledge graph", line: "Hosts, paths and findings, per tenant.", href: "/#stack" },
    { question: "What did it do?", name: "Replay", line: "Any run, rebuilt move by move.", href: "/#world" },
  ] as readonly Mechanism[],
  controls: {
    heading: "Controls",
    question: "What stops it?",
    name: "The six controls",
    line: "Enforced, conditional, or structural, and where each one ends.",
    href: "/#posture",
  },
} as const;

/* -------------------------------------------------------------------------- */
/* Where it runs                                                              */
/* -------------------------------------------------------------------------- */

/**
 * Where it runs (owner call, 2026-08-25). The architecture is one sentence:
 * the runtime, the console and the execution environment run together in one
 * Kubernetes cluster, in any cloud or on your own metal, and agents run
 * wherever the work is. The one choice is who runs the cluster, and that
 * choice changes two things for agents, both from docs/security/deployment
 * and docs/security/isolation:
 *
 *   - hosted: agents run on your machines and check in over the network.
 *     Untrusted work runs in the zeroroot microVM fleet, or the runtime
 *     refuses it (GIBSON_UNTRUSTED_EXEC=setec-only, no in-process fallback).
 *   - self-hosted: agents can also run inside the cluster, over mTLS. You own
 *     the isolation boundary (customer-isolation) and point at your own setec.
 *
 * Setec is cloud-agnostic: EKS, AKS and GKE playbooks ship in its repo, and
 * bare metal works. The diagram in the component is driven by `modes`.
 */
export const surfaces = {
  eyebrow: "where it runs",
  heading: "The runtime lives in Kubernetes. Your agents live wherever the work is.",
  sub: "Gibson Runtime, Gibson Console and the execution environment run together in one Kubernetes cluster, in any cloud or on your own metal. Your agents do not have to be in that cluster. They check in from wherever they already run. The one choice you make is who runs the cluster.",

  diagram: {
    cluster: "Kubernetes",
    pieces: [
      { name: "Gibson Console", sub: "missions, grants, replay" },
      { name: "Gibson Runtime", sub: "identity · grants · missions · timeline" },
      { name: "Execution environment", sub: "Setec microVMs, one per tool run" },
    ],
    agents: [
      { name: "Laptop", sub: "gibson component run" },
      { name: "CI", sub: "a pipeline principal" },
      { name: "Your network", sub: "a box behind the firewall" },
      { name: "Your cluster", sub: "in-cluster components" },
    ],
    agentsLabel: "your agents, wherever the work is",
    checkin: "check in",
  },

  modes: [
    {
      key: "hosted",
      name: "zeroroot hosts it",
      clouds: "zeroroot's cloud",
      clusterLabel: "zeroroot's Kubernetes. We operate it.",
      agentsLine: "Your agents run on your machines and check in over the network.",
      execLine: "Untrusted work runs in microVMs we operate, or the runtime refuses it.",
      body: "We run the cluster. Point your agents at it and start. Your agents stay on your machines and check in over the network. There is nothing for you to operate.",
      chips: ["nothing to run", "start in minutes", "your model keys"],
    },
    {
      key: "self",
      name: "you host it",
      clouds: "AWS · Google Cloud · Azure · on-prem",
      clusterLabel: "Your Kubernetes. Any cloud, or your own metal, up to air-gapped.",
      agentsLine: "Your agents check in over the network, or run inside the cluster over mTLS.",
      execLine: "Untrusted work runs in your microVMs. You own that boundary.",
      body: "One chart into Kubernetes you already run, in any cloud or on your own metal, up to fully air-gapped. Your agents can also run inside that cluster, over mTLS. Your models, your keys, your region.",
      chips: ["helm install gibson", "any cloud or on-prem", "air-gapped"],
    },
  ],

  agents: {
    label: "Where your agents run",
    note: "all of these, at once",
    items: [
      { name: "Laptop", body: "The same agent, checked in with the same host key, granted only what you work on right now." },
      { name: "CI", body: "Runs as a first-class principal. The runtime attributes its actions to the pipeline, not to whoever owns the token." },
      { name: "Anywhere on your network", body: "A box behind your firewall, checked in over the network. No cluster, no install." },
      { name: "Your cluster", body: "In your own Kubernetes. When the runtime runs there too, components upgrade to mTLS transport. The grant model does not change." },
    ],
  },

  runtime: {
    label: "Who runs the cluster",
    note: "either one, and you can change your mind",
  },
} as const;

/* -------------------------------------------------------------------------- */
/* Market                                                                     */
/* -------------------------------------------------------------------------- */

interface Entry {
  readonly slug: string;
  readonly name: string;
  /** The constraint or the job, in the reader's words. */
  readonly line: string;
}

export const industries: readonly Entry[] = [
  { slug: "defense", name: "Defense & national security", line: "air-gapped, no egress" },
  { slug: "federal", name: "Federal & public sector", line: "inside your authorization boundary" },
  { slug: "financial-services", name: "Financial services", line: "every action attributable" },
  { slug: "healthcare", name: "Healthcare", line: "data stays in your boundary" },
  { slug: "critical-infrastructure", name: "Critical infrastructure", line: "offline, segmented networks" },
  { slug: "consultancies", name: "Consultancies & MSSPs", line: "per-client isolation, white label available" },
];

export const workloads: readonly Entry[] = [
  { slug: "ci-cd", name: "CI/CD & release management", line: "reviewable commits, never the deploy" },
  { slug: "cve-response", name: "Vulnerability & CVE response", line: "always-on" },
  { slug: "coding-agents", name: "Coding agents, under control", line: "grants, not vibes" },
  { slug: "security-testing", name: "Security testing", line: "offense and defense" },
  { slug: "incident-response", name: "Incident response", line: "replayable" },
  { slug: "compliance-evidence", name: "Compliance evidence", line: "exportable" },
];

/* -------------------------------------------------------------------------- */
/* Posture                                                                    */
/* -------------------------------------------------------------------------- */

/**
 * `kind` is the honesty of the page made structural. "conditional" is not a
 * weaker word for enforced: it means the guarantee has a boundary, and the
 * boundary is stated in `body`. Marking these correctly is what stops the page
 * from re-shipping the claims that were previously overstated.
 */
type PostureKind = "enforced" | "conditional" | "structural";

export const posture = {
  eyebrow: "what is actually enforced",
  heading: "Controls, not certificates.",
  sub: "Every row below is a mechanism in shipped code, stated with its boundary. Where something is advisory rather than enforced, this page says so.",
  rows: [
    {
      name: "Agent identity",
      body: "A persistent Ed25519 host key, and per-call tokens that expire in 55 seconds. The agent never caches them.",
      kind: "enforced" as PostureKind,
    },
    {
      name: "Delegation ceiling",
      body: "A granter can only grant capabilities the granter already holds. Deny wins.",
      kind: "enforced" as PostureKind,
    },
    {
      name: "Untrusted execution",
      body: "Work that declares untrusted input runs in a microVM, or the runtime refuses it. Code that declares itself trusted runs in process.",
      kind: "conditional" as PostureKind,
    },
    {
      name: "Egress",
      body: "A component declares where it may talk. The microVM boundary and cluster policy enforce that declaration. When a plugin runs as a bare process on a laptop, egress is advisory.",
      kind: "conditional" as PostureKind,
    },
    {
      name: "Tenant isolation",
      body: "A separate graph database per tenant. Not a filter on a shared one.",
      kind: "structural" as PostureKind,
    },
    {
      name: "Audit",
      body: "An append-only timeline per tenant. Replay rebuilds a mission rather than queries a log.",
      kind: "structural" as PostureKind,
    },
  ],
} as const;

/* -------------------------------------------------------------------------- */
/* Proof                                                                      */
/* -------------------------------------------------------------------------- */

/*
 * INTENTIONALLY EMPTY. See www#56.
 *
 * The proof section is one worked case: the release-pipeline agent. As of
 * 2026-08-19 that agent exists in no repository: there is no component
 * manifest, no mission definition and no recorded run for it. Every fact the
 * section would carry (what it manages, what it was granted, what it was
 * refused) is therefore untraceable, and www#56 says untraceable facts are
 * removed rather than reworded.
 *
 * So the page ships without a proof section instead of with an invented one.
 * When the agent is live, the facts come from its manifest, its grant, its
 * mission definition and a recorded run, and the section lands then.
 *
 * Do not populate this from a plan, a demo or an intention.
 */

/* -------------------------------------------------------------------------- */
/* The offer                                                                  */
/* -------------------------------------------------------------------------- */

export const partner = {
  eyebrow: "how to start",
  heading: "We are accepting a small number of design partners.",
  sub: "You bring a workload and the environment it has to run in. We work alongside your team until the first agents are live in it. You keep everything we build.",
  gets: [
    "Your first agents live in your own environment",
    "Our engineers alongside your team, not behind a ticket queue",
    "Everything we build is yours: open protocols, your cluster, no exit penalty",
    "A direct line into what we build next",
  ],
  asks: [
    "A real workload, not a test environment",
    "Access to the people who own the boundary it has to run inside",
    "Permission to say publicly that it worked, when it does",
  ],
} as const;

export const finalCta = {
  heading: "Bring the workload you are not allowed to put an agent on.",
  ctaPrimary: "Apply as a design partner",
  ctaSecondary: "Read the docs",
} as const;

/** Closing lockup, reused by footer-adjacent and profile surfaces. */
export const lockup = {
  line: "Your agents. Your cluster. A boundary they cannot cross.",
  signature: `${COMPANY}, the zero-trust agent runtime`,
} as const;

/* -------------------------------------------------------------------------- */
/* Hubs                                                                       */
/* -------------------------------------------------------------------------- */

/**
 * A hub section per menu entry, so every Solutions link lands somewhere that
 * discusses the thing it named. Each is the constraint or the job, the
 * mechanisms that answer it, and nothing else. An entry graduates to its own
 * page when a customer story justifies one.
 *
 * `mechanisms` must name shipped behavior. No row here is a roadmap. One
 * exception by owner call (2026-08-25): "White label available" under
 * Consultancies & MSSPs is a commercial offer, not a mechanism in code.
 */
interface HubSection {
  readonly slug: string;
  readonly name: string;
  readonly lede: string;
  readonly mechanisms: readonly string[];
}

export const industryHub: readonly HubSection[] = [
  {
    slug: "defense",
    name: "Defense & national security",
    lede: "The workload cannot reach the internet, and the model cannot either. Both have to run inside the boundary you already hold.",
    mechanisms: [
      "One chart installs the runtime in your cluster, up to fully air-gapped",
      "Local models: bring Ollama or a self-hosted endpoint, and no call leaves the boundary",
      "The chart pins every image by digest at package time",
      "An append-only timeline per tenant, exportable for review",
    ],
  },
  {
    slug: "federal",
    name: "Federal & public sector",
    lede: "The runtime installs inside your authorization boundary. It does not ask you to extend that boundary around someone else's cloud.",
    mechanisms: [
      "One Helm install into a cluster you already run",
      "Your identity provider. Agents act on 55-second credentials",
      "Every action traces to a named human's grant",
      "Replay rebuilds a mission for a reviewer, step by step",
    ],
  },
  {
    slug: "financial-services",
    name: "Financial services",
    lede: "An agent that touches a regulated system has to be explainable afterwards, by someone who was not there.",
    mechanisms: [
      "An append-only timeline. Replay returns the same result every time",
      "An agent can never hold more than the human who granted it",
      "Deny wins wherever two policies disagree",
      "A separate graph database per tenant, not a filter on a shared one",
    ],
  },
  {
    slug: "healthcare",
    name: "Healthcare",
    lede: "The question is not what the model was trained on. The question is whether the data ever leaves your boundary.",
    mechanisms: [
      "Self-hosted install. Your cluster, your keys, your region",
      "Bring your own model, including one that runs locally",
      "Declared egress, enforced at the microVM boundary",
      "Per-tenant isolation at the database, not the query",
    ],
  },
  {
    slug: "critical-infrastructure",
    name: "Critical infrastructure",
    lede: "Segmented networks, long-lived equipment, and no tolerance for an agent that improvises.",
    mechanisms: [
      "Runs without egress. No phone-home in the install path",
      "Untrusted work runs in a microVM, or the runtime refuses it",
      "A mission has a type at submit, so a malformed mission never starts",
      "Grants are explicit, reviewable and revocable",
    ],
  },
  {
    slug: "consultancies",
    name: "Consultancies & MSSPs",
    lede: "One engagement's data must never be visible from another. Every client wants their own evidence.",
    mechanisms: [
      "A separate graph database per tenant. No cross-tenant query path exists",
      "Per-client grants, revocable the day an engagement ends",
      "An exportable timeline per client",
      "One chart installs the runtime in their cluster or yours. Or let zeroroot host it",
      "White label available",
    ],
  },
];

export const workloadHub: readonly HubSection[] = [
  {
    slug: "ci-cd",
    name: "CI/CD & release management",
    lede: "A pipeline change is a code change. A code change an agent makes has to arrive the way any other one does: as a commit somebody reviews.",
    mechanisms: [
      "Mission-scoped git workspaces. Changes arrive as reviewable commits",
      "A language server validates edits before the agent applies them",
      "The runtime rolls an edit back when validation fails",
      "Granted the pipeline, never the deploy",
    ],
  },
  {
    slug: "cve-response",
    name: "Vulnerability & CVE response",
    lede: "An advisory lands. The question is whether it is reachable in your estate, not whether it is severe in general.",
    mechanisms: [
      "Findings land in the shared graph, so the next run starts from them",
      "Missions run on your trigger: CI, a webhook, or a scheduler you own",
      "Scanner output is evidence in the timeline, not an inbox",
      "Every conclusion replays to the step that produced it",
    ],
  },
  {
    slug: "coding-agents",
    name: "Coding agents, under control",
    lede: "The problem with a coding agent is not what it writes. It is what it can reach while it writes.",
    mechanisms: [
      "Grants at the repository, tool and data level",
      "An agent can never exceed the engineer who granted it",
      "Model-generated code that declares untrusted input runs in a microVM",
      "The timeline attributes every prompt and edit, and replay rebuilds them",
    ],
  },
  {
    slug: "security-testing",
    name: "Security testing",
    lede: "Offense and defense on one runtime, and both write into one picture of the environment.",
    mechanisms: [
      "Hosts, paths and findings accumulate in the tenant graph",
      "Untrusted payloads detonate in a microVM",
      "Declared egress, enforced at that boundary",
      "A mission replays move by move for the report",
    ],
  },
  {
    slug: "incident-response",
    name: "Incident response",
    lede: "During an incident nobody has time to rebuild what the automation did. Afterwards, everybody needs to.",
    mechanisms: [
      "The timeline captures every act as the work happens",
      "Replay returns the same sequence every time",
      "Agents act on short-lived credentials that expire in 55 seconds",
      "You can revoke a grant mid-incident without a redeploy",
    ],
  },
  {
    slug: "compliance-evidence",
    name: "Compliance evidence",
    lede: "Evidence collection is the work nobody wants and everybody has to do twice a year.",
    mechanisms: [
      "Every action traces to a named human's grant",
      "Timeline exports for a reviewer",
      "A mission has a type, so the same check runs the same way",
      "Controls stated with their boundaries, not as a certification claim",
    ],
  },
];
