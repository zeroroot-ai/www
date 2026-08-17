import { primitives } from "@/lib/messaging";

/**
 * Primitives, directly under the hero. The rotator above shows eight concrete
 * jobs; this section explains how any of them actually get built, which nothing
 * on the page did before.
 *
 * Two paths, deliberately given equal weight: compose parts that already exist,
 * or write your own. Copy lives in the messaging module.
 */
export function Primitives() {
  return (
    <section className="border-t border-border">
      <div className="mx-auto max-w-5xl px-4 py-20 md:py-24">
        <h2 className="mb-3 font-mono text-sm md:text-base">
          <span className="text-highlight/50 select-none">$ </span>
          <span className="text-highlight">{primitives.eyebrow}</span>
        </h2>
        <h3 className="mb-4 font-display text-2xl font-bold text-foreground md:text-3xl">
          {primitives.heading}
        </h3>
        <p className="mb-10 max-w-2xl text-sm md:text-base leading-relaxed text-foreground/85">
          {primitives.body}
        </p>

        <div className="mb-10 grid grid-cols-1 gap-6 md:grid-cols-3">
          {primitives.shapes.map(({ kind, what, builtWith }) => (
            <div
              key={kind}
              className="rounded-lg border border-highlight/25 bg-highlight/5 p-5"
            >
              <h4 className="mb-2 font-mono text-base md:text-lg text-highlight">
                {kind}
              </h4>
              <p className="mb-3 text-sm leading-relaxed text-foreground/85">
                {what}
              </p>
              <code className="font-mono text-xs text-highlight/80">
                {builtWith}
              </code>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <p className="text-sm md:text-base leading-relaxed text-foreground/85">
            <span className="text-highlight">{"// reuse"}</span>
            <br />
            {primitives.reuse}
          </p>
          <p className="text-sm md:text-base leading-relaxed text-foreground/85">
            <span className="text-highlight">{"// or build"}</span>
            <br />
            {primitives.build}
          </p>
        </div>
      </div>
    </section>
  );
}
