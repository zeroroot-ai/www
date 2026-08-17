import { blockers } from "@/lib/messaging";

/**
 * WhyBlocked, problem-first section naming the real reasons agents stall before
 * production, each paired with the platform mechanism that resolves it. The copy
 * lives in the messaging module.
 */
export function WhyBlocked() {
  return (
    <section className="border-t border-highlight/25">
      <div className="mx-auto max-w-5xl px-4 py-20 md:py-24">
        <h2 className="mb-4 font-mono text-sm md:text-base">
          <span className="text-highlight/50 select-none">$ </span>
          <span className="text-highlight">cat why-agents-stall.md</span>
        </h2>
        <p className="mb-12 max-w-2xl text-sm md:text-base leading-relaxed text-foreground/85">
          Platform engineers, SREs, and security teams aren&apos;t blocking
          agents because they don&apos;t believe in them. They&apos;re
          protecting their organizations from real risk.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-10">
          {blockers.map(({ title, pain, resolve }) => (
            <div
              key={title}
              className="rounded-lg border border-highlight/25 bg-highlight/5 p-5"
            >
              <h3 className="mb-2 font-mono text-base md:text-lg text-highlight">
                {title}
              </h3>
              <p className="mb-3 text-sm md:text-base leading-relaxed text-foreground/85">
                {pain}
              </p>
              <p className="flex gap-2 font-mono text-xs md:text-sm leading-relaxed text-foreground/90">
                <span aria-hidden="true" className="shrink-0 text-highlight">
                  →
                </span>
                {resolve}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
