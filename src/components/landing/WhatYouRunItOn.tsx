const cveMissionCue = `// Respond to a newly published advisory.
// Started by your CI, webhook, or scheduler \u2014
// Gibson does not own the clock.

mission: {
  name:        "cve-response"
  description: "Find services affected by an advisory and open the patch PR."
  version:     "1.0.0"

  constraints: {
    max_cost:        25.0   // USD, hard ceiling
    max_duration:    "45m"
    blocked_domains: ["prod.internal"]
  }

  nodes: {
    advisory: {
      id:   "advisory"
      type: "NODE_TYPE_TOOL"
      tool_config: {tool_name: "advisory-feed"}
    }
    affected: {
      id:   "affected"
      type: "NODE_TYPE_AGENT"
      agent_config: {agent_name: "graph-matcher"}
    }
    patch: {
      id:   "patch"
      type: "NODE_TYPE_AGENT"
      agent_config: {agent_name: "coding-agent"}
    }
  }
  edges: [
    {from: "advisory", to: "affected"},
    {from: "affected", to: "patch"},
  ]
  entry_points: ["advisory"]
  exit_points:  ["patch"]
}`;

export function WhatYouRunItOn() {
  return (
    <section className="border-t border-highlight/25">
      <div className="mx-auto max-w-5xl px-4 py-20 md:py-24">
        <h2 className="mb-10 font-mono text-sm md:text-base">
          <span className="text-highlight/50 select-none">$ </span>
          <span className="text-highlight">cat what-you-run-on.md</span>
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
          <p className="text-base md:text-lg leading-relaxed text-foreground/90">
            Every agent is built by your team (platform engineers,
            devsecops, red teamers, IR) for the workflows they already
            own. That&apos;s the force multiplier. Agents run where you
            work (laptop, CI, VPS, k8s) and dial out to{" "}
            <code className="font-mono text-highlight">api.zeroroot.ai</code>{" "}
            for orchestration, shared memory, and the knowledge graph.
            Your team decides what crosses the wire and what stays on
            the host. BYOK for LLM keys. A component that declares it
            handles untrusted input runs inside{" "}
            <a
              href="https://github.com/zeroroot-ai/setec"
              target="_blank"
              rel="noopener noreferrer"
              className="text-highlight font-semibold underline-offset-4 decoration-highlight/40 hover:underline hover:decoration-highlight">
              Setec microVMs
            </a>
            , or the call is refused. Hardware isolation, not containers.
          </p>
          <div>
            <div className="mb-2 flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.18em] text-highlight/60">
              <span>{'// what a mission looks like'}</span>
              <span>cve-response.cue</span>
            </div>
            <pre className="overflow-x-auto rounded-lg border border-highlight/25 bg-card/60 p-5 font-mono text-[10px] md:text-[11px] leading-[1.55] text-highlight/90">
              <code>{cveMissionCue}</code>
            </pre>
          </div>
        </div>
      </div>
    </section>
  );
}
