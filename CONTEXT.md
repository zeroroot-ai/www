# www — customer-facing positioning

The language the marketing site uses to name what zeroroot.ai sells. Copy lives
in `src/lib/messaging.ts`; this file governs the words that copy is allowed to
use, and why. Engine-internal vocabulary is defined in
`enterprise/platform/gibson/CONTEXT.md` and does not automatically transfer here
— where the two disagree, the conflict is recorded below.

## Language

**Runtime**:
The thing zeroroot.ai sells, on every customer surface — the substrate agents
execute inside, where the boundary is a property of execution rather than a
check applied afterwards.
_Avoid_: control plane (see Flagged ambiguities), orchestrator, framework

**Agent factory**:
The company-level framing for zeroroot.ai, read as *software factory* in the
established DoD sense. Never a substitute for **Runtime** as the product noun.
_Avoid_: agent platform, agent builder, Big Bang (see Flagged ambiguities)

**Product names** (settled 2026-08-19):
Descriptive where the buyer reads, canon codenames where engineers already use
them. Every name resolves to a repo.

| Name | Is | Repo | Licence |
|---|---|---|---|
| **Gibson Runtime** | the substrate agents execute inside | `gibson` | Elastic v2 |
| **Gibson Console** | missions, grants, traces, replay | `dashboard` | Elastic v2 |
| **Enclave** | self-host and air-gapped install | `deploy` | Elastic v2 |
| **ADK** | build agents; the `gibson` CLI | `adk` + `sdk` | Apache-2.0 |
| **Setec** | Firecracker/Kata microVM sandbox | `setec` | Apache-2.0 |
| **Zerocool** | coding agent, opencode plugins | `zerocool-plugins`, `sdk-ts` | MIT |
| **Bridge** | MCP tools as components | `sdk` (`mcpbridge`) | Apache-2.0 |

_Avoid_: inventing a name that does not resolve to a repo; renaming a repo to
match a marketing name.

**Call path**:
The seam through which an agent built on someone else's framework comes under
the **Runtime** — the agent's model and tool traffic is redirected to Gibson
(one base-URL change via the OpenAI-compatible shim), so every call is
identified, budgeted, journaled, and refusable.
_Avoid_: integration, connector (a connector is a component whose runtime is
`mcp-bridge` — a narrower, engine-level thing)

**Grant**:
The rights a named human delegates to an agent — read, write, execute — set once,
up front, and **bounded by what that human holds themselves**: only capabilities
the granter already has can be forwarded to the agent principal, and deny wins
wherever the two disagree. The grant is the human's *only* ongoing control
surface; there is no runtime approval prompt (ADR-0008).
_Avoid_: approval, ratification, human-in-the-loop (all imply a runtime pause
that does not exist), permission (too generic)

**Enforced / advisory**:
The distinction the whole position rests on. A guarantee is **enforced** when the
substrate makes the disallowed thing unrepresentable or refuses it outright; it
is **advisory** when something inspects, scores, or logs the result afterwards.
Only enforced guarantees may be stated as guarantees in copy.
_Avoid_: guardrail (ambiguous — name which of the two it is)

## Relationships

- The **Runtime** is what a customer buys; **Gibson** is its name.
- An agent reaches the **Runtime** either by being built on the SDK, or by
  having its **Call path** redirected into it.
- **Enforced** claims may appear in copy; advisory ones are described as what
  they are, or left out.

**Design partner**:
A customer taken through first production deployment alongside zeroroot
engineers, from a deliberately limited number of slots. The enterprise motion;
self-serve stays the front door.
_Avoid_: pilot, POC, trial (all imply the thing might not go to production),
customer (a design partner is not yet a reference)

## Settled positioning (2026-08-19)

| Decision | Settled as |
|---|---|
| Category | The runtime agents execute inside — enforced, not observed — reached either by building on the SDK or by redirecting the **Call path** |
| Buyer | The exec who owns the mandate to get agents into production |
| Offer | **Design partner** slots, not an open services promise |
| Headline number | *First agent in production in a day.* Stated as a customer claim; the release-pipeline agent is its evidence |
| Spine | Seven operator steps: install → build or adapt → check in and grant → launch missions → act → it lands in one graph → replay |
| Proof | The release-pipeline agent, in depth. No logo wall, no awards, no certifications |
| Skin | "Acid concrete" — acid green on a concrete (non-white) ground, light-first, stark contrast, re-skinned in the shared brand package so the console moves in lock step |
| Type | Inter Tight for display and body, JetBrains Mono for code, labels and chips. Self-hosted — `www` loads no webfont today |
| Lock step | One brand, one ground, both surfaces. The console goes light too and consumes the published package (ADR-0064) |
| Page | Fifteen sections |
| Solutions menu | Two hub pages (Industries, Workloads), one section per entry, deep-linked by anchor. An entry graduates to its own page when a customer story justifies it |

## Flagged ambiguities

- **"Control plane"** is used two incompatible ways. `gibson/CONTEXT.md` scopes
  *Platform control plane* to billing, signup, and tenant/service provisioning,
  explicitly excluding mission execution; customer copy
  (`messaging.ts` hero, `Production.tsx`) uses it to mean the whole hosted
  product. **Resolved 2026-08-19:** the engine meaning stands, and customer
  surfaces stop using the phrase as the product noun — the product noun is
  **Runtime**. It also describes watching from outside, which is the opposite of
  the claim being made.
- **"Every tool invocation runs in a microVM"** and **"every component carries a
  SPIFFE SVID"** were both shipped as copy and are both false (dispatch policy
  defaults `content_trust` to `trusted`; off-cluster identity is the Capability
  Grant Protocol, a second plane). Declared egress has the same shape —
  it is enforced in `pod` and `setec` runtime modes and is **informational
  logging only** in `process` mode. Copy states the mechanism and its boundary,
  never the universal.
