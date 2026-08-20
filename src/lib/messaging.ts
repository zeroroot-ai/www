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
  sub: "Gibson Runtime is the substrate your agents execute inside. Let us host it or install it yourself, either way: agents granted rights they can never exceed, and replayable move by move.",
  ctaPrimary: "Take a design partner slot",
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
  ADK: "https://github.com/zeroroot-ai/adk",
  Setec: "https://github.com/zeroroot-ai/setec",
  Zerocool: "https://github.com/zeroroot-ai/zerocool-plugins",
  Bridge: "https://github.com/zeroroot-ai/sdk",
} as const satisfies Record<string, string>;

/* -------------------------------------------------------------------------- */
/* What this is                                                               */
/* -------------------------------------------------------------------------- */

interface Contrast {
  readonly title: string;
  readonly body: string;
}

/**
 * The category answer, stated before the page starts arguing.
 *
 * A reader arriving from a comparison is asking which platform to build their
 * agents on. The honest answer is that this is not on that list: they keep the
 * builder they have, and what changes is where the agent executes and what it
 * can do when it gets there. Answering the question they asked, on the terms
 * they asked it, loses. Leaving the category wins.
 *
 * The proof is mechanical and it is the one thing a builder cannot copy
 * without becoming a runtime: sitting in the call path is what makes refusal
 * possible. It names no competitor, and it does not need to. The distinction
 * is architectural, so it holds against a whole class rather than a company.
 *
 * `outcome` is the capability claim and it is deliberately unquantified. There
 * are no customers in production, so any number here would be a projection.
 * Every clause of it is true today.
 */
export const whyUs = {
  eyebrow: "what this is",
  heading: "Not another way to build agents.",
  sub: "It is what lets the agent you already built run where you are not allowed to run it today. Keep your framework, your prompts, your logic. What changes is where the agent executes, and what it can reach once it is there.",
  contrast: [
    {
      title: "It sits in the call path",
      body: "Every model call, every tool call and every write goes through the runtime. Standing there is what makes refusal possible: a call outside the grant does not happen and get reported, it is denied at the moment it is made.",
    },
    {
      title: "Not alongside it",
      body: "Anything that watches an agent from outside can only report what already came out of it. That is a record of the incident, written after the incident, by something that was never able to stop it.",
    },
  ] as readonly Contrast[],
  outcome:
    "So the workload nobody will let you automate runs tonight: inside your own boundary, holding only what a named human granted it, and replayable move by move when someone asks what it did.",
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
 * Written as one agent crossing four desks rather than four cards describing
 * four audiences. Four cards about one product restate it four times and argue
 * breadth; a single object passing through four pairs of hands shows the
 * division of control, which is the thing that makes an agent shippable.
 *
 * Every `holds` value is a real control with a real holder in the product, not
 * a role we imagine: the grant model (problem #1), the two placement choices
 * (surfaces), and the budget and timeline (posture). If a control here ever
 * stops being enforced, this section is wrong, not merely stale.
 */
export const hands = {
  eyebrow: "one agent, four hands",
  heading: "Everyone who has to say yes holds a different piece.",
  sub: "One agent crosses four desks before it runs, and crosses them again every day it keeps running. Nobody is asked to trust anyone else's judgment, because nobody is holding anyone else's control.",
  roles: [
    {
      role: "Developer",
      holds: "the agent",
      body: "Writes it in the framework they already use and checks it in once. The logic stays theirs. Nothing about the path back to production runs through us.",
    },
    {
      role: "Security",
      holds: "the grant",
      body: "Delegates read, write and execute by name, and cannot delegate more than they hold themselves. Deny wins wherever two grants disagree.",
    },
    {
      role: "Platform",
      holds: "the boundary",
      body: "Chooses where the runtime lives, hosted or their own cluster, up to fully air-gapped, and where agents run: a laptop, CI, a box on the network, or in-cluster.",
    },
    {
      role: "Operations",
      holds: "the budget and the trail",
      body: "Sets what an agent may spend before it stops, and reads an append-only timeline of what it did. Any run replays move by move.",
    },
  ] as readonly Hand[],
} as const;

/* -------------------------------------------------------------------------- */
/* The problem                                                                */
/* -------------------------------------------------------------------------- */

interface Blocker {
  readonly title: string;
  readonly pain: string;
  /** Must name a shipping mechanism. A promise is not a resolve. */
  readonly resolve: string;
}

export const problem = {
  eyebrow: "why agents stall",
  heading: "The prototype works. That was never the hard part.",
  sub: "Platform and security teams are not blocking agents because they doubt them. They are refusing to put something in production that cannot be bounded, attributed, or undone.",
  items: [
    {
      title: "It can do anything its token can do",
      pain: "An agent handed a service account inherits every permission that account has, forever, with no way to see what it used.",
      resolve:
        "A named human delegates read, write and execute, and cannot delegate more than they hold themselves. Deny wins wherever the two disagree.",
    },
    {
      title: "Nobody can say what it did",
      pain: "“The agent did something” does not survive an audit, an incident review, or a regulator.",
      resolve:
        "Every prompt, tool call and write is appended to your tenant's own timeline. Rewind a mission move by move and it returns the same result.",
    },
    {
      title: "It runs code nobody wrote",
      pain: "Model-generated code executing in your pipeline is an unreviewed change holding production credentials.",
      resolve:
        "The coding agent writes against a finding already in your graph, and its change arrives where every other change does: a commit on a branch, checked by a language server, waiting for a human. Nothing it writes reaches production without that review.",
    },
    {
      title: "The data cannot leave",
      pain: "For a bank, an agency or a hospital, the entire question is whether the workload can run inside the boundary that already exists.",
      resolve:
        "One chart into your own cluster, your own models, your own keys. The air-gapped install is the same artifact as the hosted one.",
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
      body: "Start on the hosted runtime and there is nothing to stand up: point agents at it and go. When it has to be yours, the same platform installs into your own Kubernetes with one chart, every first-party image pinned by digest, down to a fully air-gapped enclave. The two are the same artifact, so the choice is not a fork in the road.",
      chips: ["hosted, nothing to run", "helm install gibson", "air-gapped"],
    },
    {
      n: "02",
      title: "Build or adapt",
      sub: "the SDK, or one base URL",
      body: "Build agents on the ADK, or take an agent you already have and point its model traffic at the runtime. No rewrite, and from that call onward it is identified, budgeted and recorded.",
      chips: ["Go + TypeScript SDK", "OpenAI-compatible seam", "MCP tools"],
    },
    {
      n: "03",
      title: "Check in and grant",
      sub: "identity, then a ceiling",
      body: "An agent registers once with a persistent host key, then acts on credentials that expire in 55 seconds and are never cached. A named human delegates read, write and execute, and can never delegate more than they hold themselves.",
      chips: ["Ed25519 host key", "55-second tokens", "grant ceiling", "deny wins"],
    },
    {
      n: "04",
      title: "Launch missions",
      sub: "typed at submit, not at runtime",
      body: "A mission is a typed work-graph. A wrong agent name or a missing field fails when you submit it, not three steps into a production run. The model decides the path; the shape is checked up front.",
      chips: ["CUE-typed", "pausable", "resumable"],
    },
    {
      n: "05",
      title: "They act",
      sub: "sandbox or refusal",
      body: "Work that declares untrusted input runs in a microVM with a declared egress allowlist, or the call is refused. The harness is emit-only, and an agent can only see the slice of the world its mission was given.",
      chips: ["Firecracker / Kata", "declared egress", "emit-only harness"],
    },
    {
      n: "06",
      title: "It lands in one graph",
      sub: "shared, per tenant",
      body: "Every host, path and finding an agent turns up is appended to your tenant's own timeline and projected into your own graph database. The next mission, and the next team, start from it instead of from zero.",
      chips: ["append-only", "database per tenant", "no cross-tenant path"],
    },
    {
      n: "07",
      title: "Replay any of it",
      sub: "move by move",
      body: "Every prompt, tool call and write is attributed and kept. Rewind a mission step by step and it comes back the same every time: the difference between an audit answer and a shrug.",
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
  heading: "Four seconds of setup, and a ceiling it cannot argue with.",
  sub: "An agent's first act is to prove which host it is. Every act after that is signed, short-lived, and bounded by the person who granted it.",
  steps: [
    {
      title: "Bootstrap once",
      body: "A one-time credential authenticates the very first registration. It is never used again.",
    },
    {
      title: "Keep a host key",
      body: "A persistent Ed25519 keypair on disk at 0600. The host ID is the JWK thumbprint of its public key.",
    },
    {
      title: "Sign every call",
      body: "An ephemeral agent key signs a token per call. It expires in 55 seconds and is never cached.",
    },
    {
      title: "Upgrade in cluster",
      body: "Inside a SPIRE-enabled cluster the transport upgrades to mTLS. Identity does not change: the same grant still governs.",
    },
  ],
} as const;

/* -------------------------------------------------------------------------- */
/* Adapt                                                                      */
/* -------------------------------------------------------------------------- */

/**
 * States the seam accurately. Redirecting the MODEL call path is not the same
 * as registering a foreign agent, and this copy must never imply the latter:
 * there is no foreign-agent registry.
 */
export const adapt = {
  eyebrow: "agents you already built",
  heading: "Keep the agent. Bring it under the boundary.",
  sub: "The integration is a wrapper around the agent framework you already use: point its model client at the runtime, check the agent in so it has an identity, declare its tools. Its logic stays exactly as you wrote it. Anything that watches an agent from outside can only report what came out of it, and sitting in the call path is what lets the runtime refuse instead.",
  bullets: [
    "Wraps an OpenAI-compatible client: LangChain, CrewAI, AutoGen, LlamaIndex, or your own",
    "Check it in once, so it acts under an identity and a grant like any agent built here",
    "From then on every model call is an attributable record with a budget and a transcript",
    "Bring its tools in over MCP as components, with declared secrets and egress",
  ],
} as const;

/* -------------------------------------------------------------------------- */
/* Products                                                                   */
/* -------------------------------------------------------------------------- */

interface Product {
  readonly name: string;
  readonly body: string;
  readonly license: string;
}

export const platform: readonly Product[] = [
  {
    name: "Gibson Runtime",
    body: "The substrate agents execute inside. Identity, grants, dispatch, missions and the timeline: hosted by us, or installed in your own cluster.",
    license: "Elastic License v2",
  },
  {
    name: "Gibson Console",
    body: "Missions in flight, grants and who holds them, traces, and replay of any run.",
    license: "Elastic License v2",
  },
  {
    name: "Enclave",
    body: "The self-hosted end of that choice, up to fully air-gapped. Your cluster, your models, your keys, your region.",
    license: "Elastic License v2",
  },
];

export const openSource: readonly Product[] = [
  { name: "ADK", body: "Build agents, tools and plugins. The gibson CLI.", license: "Apache-2.0" },
  { name: "Setec", body: "The Firecracker and Kata microVM sandbox untrusted work runs in.", license: "Apache-2.0" },
  { name: "Zerocool", body: "The coding agent, as opencode plugins and a TypeScript SDK.", license: "MIT" },
  { name: "Bridge", body: "Any MCP-compliant tool, brought in as a component.", license: "Apache-2.0" },
];

export const mechanisms: readonly string[] = [
  "Missions",
  "Knowledge graph",
  "Grants",
  "Replay",
  "Dispatch policy",
];

/* -------------------------------------------------------------------------- */
/* Where it runs                                                              */
/* -------------------------------------------------------------------------- */

/**
 * Where it runs, in two parts, because they are two independent choices and an
 * earlier version of this section flattened them into one grid of five cards.
 * That grid quietly implied a single answer. There are two:
 *
 *   agents  = run in ALL of these places at once, wherever the work is
 *   runtime = is EITHER hosted by us OR installed by you. Both are first
 *             class, both are the same platform, and the page has to say so
 *             without leaning on either one.
 */
export const surfaces = {
  eyebrow: "where it runs",
  heading: "Two independent choices, and both are yours.",
  sub: "Agents run wherever the work already is. The runtime they check in to is either one we host and operate for you, or one you install and own: the same platform in both cases, and the same agents either way.",

  agents: {
    label: "Where your agents run",
    note: "all of these, at once",
    items: [
      { name: "Laptop", body: "The same agent, checked in with the same host key, granted only what you are actually doing." },
      { name: "CI", body: "Runs as a first-class principal. Its actions are attributed to the pipeline, not to whoever owns the token." },
      { name: "Anywhere on your network", body: "A box behind your firewall, checked in over the network. No cluster, no install, no effort." },
      { name: "Your cluster", body: "In-cluster components upgrade to mTLS transport. The grant model is unchanged." },
    ],
  },

  runtime: {
    label: "Where the runtime runs",
    note: "either one, and you can change your mind",
    options: [
      {
        name: "We host it",
        body: "Managed by us. Point agents at it and start: nothing to stand up, nothing to operate, no cluster of your own required.",
        chips: ["nothing to run", "start in minutes", "your model keys"],
      },
      {
        name: "You host it",
        body: "One chart into Kubernetes you already run, inside your own boundary, up to fully air-gapped, with your models, your keys and your region.",
        chips: ["helm install gibson", "your boundary", "air-gapped"],
      },
    ],
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
  { slug: "consultancies", name: "Consultancies & MSSPs", line: "per-client isolation" },
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
  sub: "Everything below is a mechanism in shipped code, stated with its boundary. Where something is advisory rather than enforced, this page says so.",
  rows: [
    {
      name: "Agent identity",
      body: "A persistent Ed25519 host key and per-call tokens that expire in 55 seconds and are never cached.",
      kind: "enforced" as PostureKind,
    },
    {
      name: "Delegation ceiling",
      body: "An agent can only be granted capabilities its granter already holds. Deny wins.",
      kind: "enforced" as PostureKind,
    },
    {
      name: "Untrusted execution",
      body: "Work that declares untrusted input runs in a microVM or is refused. Code that declares itself trusted runs in process.",
      kind: "conditional" as PostureKind,
    },
    {
      name: "Egress",
      body: "A component declares where it may talk. Enforced at the microVM boundary and by cluster policy; advisory when a plugin runs as a bare process on a laptop.",
      kind: "conditional" as PostureKind,
    },
    {
      name: "Tenant isolation",
      body: "A separate graph database per tenant. Not a filter on a shared one.",
      kind: "structural" as PostureKind,
    },
    {
      name: "Audit",
      body: "An append-only timeline per tenant. Replay reconstructs a mission rather than querying a log.",
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
  heading: "We are taking a small number of design partners.",
  sub: "You bring a workload and the environment it has to run in. We work alongside your team until the first agents are live in it, and you keep everything that gets built.",
  gets: [
    "Your first agents live in your own environment",
    "Our engineers alongside your team, not behind a ticket queue",
    "Everything built is yours: open protocols, your cluster, no exit penalty",
    "A direct line into what gets built next",
  ],
  asks: [
    "A real workload, not a sandbox",
    "Access to the people who own the boundary it has to run inside",
    "Permission to say publicly that it worked, when it does",
  ],
} as const;

export const finalCta = {
  heading: "Bring the workload you are not allowed to put an agent on.",
  ctaPrimary: "Take a design partner slot",
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
 * `mechanisms` must name shipped behavior. No row here is a roadmap.
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
    lede: "The workload cannot reach the internet, and the model cannot either. Both have to run inside the enclave you already hold.",
    mechanisms: [
      "The air-gapped install is the same chart as the hosted one",
      "Local models: bring Ollama or a self-hosted endpoint; no call leaves the boundary",
      "Every image pinned by digest at package time",
      "Append-only timeline per tenant, exportable for review",
    ],
  },
  {
    slug: "federal",
    name: "Federal & public sector",
    lede: "The platform deploys inside your authorization boundary rather than asking you to extend it around someone else's cloud.",
    mechanisms: [
      "One Helm install into a cluster you already run",
      "Your identity provider; agents act on 55-second credentials",
      "Every action attributable to a named human's grant",
      "Replay reconstructs a mission for a reviewer, step by step",
    ],
  },
  {
    slug: "financial-services",
    name: "Financial services",
    lede: "An agent that touches a regulated system has to be explainable afterwards, by someone who was not there.",
    mechanisms: [
      "Append-only timeline; replay returns the same result every time",
      "An agent can never be granted more than the human who granted it",
      "Deny wins wherever two policies disagree",
      "A separate graph database per tenant, not a filter on a shared one",
    ],
  },
  {
    slug: "healthcare",
    name: "Healthcare",
    lede: "The question is not what the model is trained on. It is whether the data ever leaves your boundary.",
    mechanisms: [
      "Self-hosted install; your cluster, your keys, your region",
      "Bring your own model, including one that runs locally",
      "Declared egress, enforced at the sandbox boundary",
      "Per-tenant isolation at the database, not the query",
    ],
  },
  {
    slug: "critical-infrastructure",
    name: "Critical infrastructure",
    lede: "Segmented networks, long-lived equipment, and no tolerance for an agent that improvises.",
    mechanisms: [
      "Runs without egress; no phone-home in the install path",
      "Untrusted work runs in a microVM or is refused",
      "Missions are typed at submit, so a malformed one never starts",
      "Grants are explicit, reviewable and revocable",
    ],
  },
  {
    slug: "consultancies",
    name: "Consultancies & MSSPs",
    lede: "One engagement's data must never be visible from another's, and every client wants their own evidence.",
    mechanisms: [
      "A separate graph database per tenant. No cross-tenant query path exists",
      "Per-client grants, revocable the day an engagement ends",
      "Exportable timeline per client",
      "The same artifact installs into their environment or yours",
    ],
  },
];

export const workloadHub: readonly HubSection[] = [
  {
    slug: "ci-cd",
    name: "CI/CD & release management",
    lede: "A pipeline change is a code change, and a code change an agent makes has to arrive the way any other one does: as a commit somebody reviews.",
    mechanisms: [
      "Mission-scoped git workspaces; changes arrive as reviewable commits",
      "Edits are language-server validated before they are applied",
      "Rolled back automatically when validation fails",
      "Granted the pipeline, never the deploy",
    ],
  },
  {
    slug: "cve-response",
    name: "Vulnerability & CVE response",
    lede: "An advisory lands, and the question is whether it is reachable in your estate, not whether it is severe in general.",
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
    lede: "The problem with a coding agent is not what it writes. It is what it is allowed to reach while writing it.",
    mechanisms: [
      "Grants at the repository, tool and data level",
      "An agent can never exceed the engineer who granted it",
      "Model-generated code that declares untrusted input runs in a microVM",
      "Every prompt and edit attributable, and replayable",
    ],
  },
  {
    slug: "security-testing",
    name: "Security testing",
    lede: "Offense and defense on one runtime, writing into one picture of the environment.",
    mechanisms: [
      "Hosts, paths and findings accumulate in the tenant graph",
      "Untrusted payloads detonate in a microVM sandbox",
      "Declared egress, enforced at that boundary",
      "A mission replays move by move for the report",
    ],
  },
  {
    slug: "incident-response",
    name: "Incident response",
    lede: "During an incident nobody has time to reconstruct what the automation did. Afterwards, everybody needs to.",
    mechanisms: [
      "Append-only timeline captured as the work happens",
      "Replay returns the same sequence every time",
      "Agents act on short-lived credentials that expire in 55 seconds",
      "Grants revocable mid-incident without redeploying anything",
    ],
  },
  {
    slug: "compliance-evidence",
    name: "Compliance evidence",
    lede: "Evidence collection is the work nobody wants and everybody has to do twice a year.",
    mechanisms: [
      "Every action attributable to a named human's grant",
      "Timeline exports for a reviewer",
      "Missions are typed, so the same check runs the same way",
      "Controls stated with their boundaries, not as a certification claim",
    ],
  },
];
