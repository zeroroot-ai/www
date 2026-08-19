/**
 * Canonical messaging source of truth.
 *
 * Every customer-facing landing surface reads its brand copy from here so the
 * surfaces cannot drift apart. Edit copy HERE, never inline it in a component.
 *
 * The position (settled 2026-08-19, glossary in CONTEXT.md):
 *
 *   zeroroot sells the RUNTIME agents execute inside — where the boundary is a
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
 * its evidence — the two move together or neither ships.
 */
export const hero = {
  eyebrow: "zero-trust agent runtime",
  headline: ["Install it today.", "Ship a production agent tomorrow."],
  sub: "Gibson Runtime is the substrate your agents execute inside — installed in your own cluster, granted rights they can never exceed, and replayable move by move.",
  ctaPrimary: "Take a design partner slot",
  ctaSecondary: "helm install gibson",
  stats: [
    { value: "1 day", label: "install to first production agent" },
    { value: "55s", label: "credential lifetime, never cached" },
    { value: "0", label: "data leaves your boundary" },
  ],
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
        "A named human delegates read, write and execute — and cannot delegate more than they hold themselves. Deny wins wherever the two disagree.",
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
        "Work that declares untrusted input runs in a microVM, or the call is refused. There is no in-process fallback to fall back to.",
    },
    {
      title: "The data cannot leave",
      pain: "For a bank, an agency or a hospital, the entire question is whether the workload can run inside the boundary that already exists.",
      resolve:
        "One chart into your own cluster, your own models, your own keys. The air-gapped install is the same artefact as the hosted one.",
    },
  ] as readonly Blocker[],
} as const;

/* -------------------------------------------------------------------------- */
/* The spine — seven things an operator does, in order                        */
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
      title: "Install",
      sub: "one chart, your cluster",
      body: "One umbrella chart into the environment you already run, with every first-party image pinned by digest at package time. Hosted, self-hosted and air-gapped install the same artefact.",
      chips: ["helm install gibson", "digest-pinned", "runs without egress"],
    },
    {
      n: "02",
      title: "Build or adapt",
      sub: "the SDK, or one base URL",
      body: "Build agents on the ADK, or take an agent you already have and point its model traffic at the runtime. No rewrite — and from that call onward it is identified, budgeted and recorded.",
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
      body: "Every prompt, tool call and write is attributed and kept. Rewind a mission step by step and it comes back the same every time — the difference between an audit answer and a shrug.",
      chips: ["deterministic", "attributable", "exportable"],
    },
  ] as readonly Step[],
} as const;

/* -------------------------------------------------------------------------- */
/* Check-in                                                                   */
/* -------------------------------------------------------------------------- */

/**
 * The transcript is NOT here. It belongs to the component that renders it, and
 * every line of it has to be verified against the real CLI — the verbs are
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
      body: "Inside a SPIRE-enabled cluster the transport upgrades to mTLS. Identity does not change — the same grant still governs.",
    },
  ],
} as const;

/* -------------------------------------------------------------------------- */
/* Adapt                                                                      */
/* -------------------------------------------------------------------------- */

/**
 * States the seam accurately. Redirecting the MODEL call path is not the same
 * as registering a foreign agent, and this copy must never imply the latter —
 * there is no foreign-agent registry.
 */
export const adapt = {
  eyebrow: "agents you already built",
  heading: "Change one line. Keep the agent.",
  sub: "Anything that watches an agent from outside can only report what came out of it. Sitting in the call path means the runtime can refuse the call instead — and you did not rewrite anything to get there.",
  bullets: [
    "Point any OpenAI-compatible client at the runtime — LangChain, CrewAI, AutoGen, LlamaIndex, or your own",
    "Every call becomes an attributable record with a budget and a transcript",
    "Bring MCP tools in as components with declared secrets and egress",
    "Swap the model underneath without touching agent logic",
  ],
} as const;

/* -------------------------------------------------------------------------- */
/* Products                                                                   */
/* -------------------------------------------------------------------------- */

interface Product {
  readonly name: string;
  readonly body: string;
  readonly licence: string;
}

export const platform: readonly Product[] = [
  {
    name: "Gibson Runtime",
    body: "The substrate agents execute inside. Identity, grants, dispatch, missions and the timeline.",
    licence: "Elastic License v2",
  },
  {
    name: "Gibson Console",
    body: "Missions in flight, grants and who holds them, traces, and replay of any run.",
    licence: "Elastic License v2",
  },
  {
    name: "Enclave",
    body: "Self-hosted and air-gapped install. Your cluster, your models, your keys, your region.",
    licence: "Elastic License v2",
  },
];

export const openSource: readonly Product[] = [
  { name: "ADK", body: "Build agents, tools and plugins. The gibson CLI.", licence: "Apache-2.0" },
  { name: "Setec", body: "The Firecracker and Kata microVM sandbox untrusted work runs in.", licence: "Apache-2.0" },
  { name: "Zerocool", body: "The coding agent, as opencode plugins and a TypeScript SDK.", licence: "MIT" },
  { name: "Bridge", body: "Any MCP-compliant tool, brought in as a component.", licence: "Apache-2.0" },
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

export const surfaces = {
  eyebrow: "where it runs",
  heading: "Same agent. Same identity. Four places.",
  items: [
    { name: "Laptop", body: "The same agent, checked in with the same host key, granted only what you are actually doing." },
    { name: "CI", body: "Runs as a first-class principal. Its actions are attributed to the pipeline, not to whoever owns the token." },
    { name: "Your cluster", body: "One chart. In-cluster components upgrade to mTLS transport; the grant model is unchanged." },
    { name: "Air-gapped enclave", body: "Your models, your keys, your region. The install artefact is identical to the hosted one." },
  ],
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
 * weaker word for enforced — it means the guarantee has a boundary, and the
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
 * INTENTIONALLY EMPTY — see www#56.
 *
 * The proof section is one worked case: the release-pipeline agent. As of
 * 2026-08-19 that agent exists in no repository — there is no component
 * manifest, no mission definition and no recorded run for it. Every fact the
 * section would carry (what it manages, what it was granted, what it was
 * refused) is therefore untraceable, and www#56 says untraceable facts are
 * removed rather than reworded.
 *
 * So the page ships without a proof section instead of with an invented one.
 * When the agent is live, the facts come from its manifest, its grant, its
 * mission definition and a recorded run — and the section lands then.
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
    "Everything built is yours — open protocols, your cluster, no exit penalty",
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
 * mechanisms that answer it, and nothing else — an entry graduates to its own
 * page when a customer story justifies one.
 *
 * `mechanisms` must name shipped behaviour. No row here is a roadmap.
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
      "Local models — bring Ollama or a self-hosted endpoint; no call leaves the boundary",
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
      "A separate graph database per tenant — no cross-tenant query path exists",
      "Per-client grants, revocable the day an engagement ends",
      "Exportable timeline per client",
      "The same artefact installs into their environment or yours",
    ],
  },
];

export const workloadHub: readonly HubSection[] = [
  {
    slug: "ci-cd",
    name: "CI/CD & release management",
    lede: "A pipeline change is a code change, and a code change an agent makes has to arrive the way any other one does — as a commit somebody reviews.",
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
    lede: "An advisory lands, and the question is whether it is reachable in your estate — not whether it is severe in general.",
    mechanisms: [
      "Findings land in the shared graph, so the next run starts from them",
      "Missions run on your trigger — CI, a webhook, or a scheduler you own",
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
