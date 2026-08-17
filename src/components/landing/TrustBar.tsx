import { trustBar } from "@/lib/messaging";

/**
 * TrustBar, a single strip of platform facts under the hero. The items live in
 * the messaging module, which is where landing copy belongs.
 */
export function TrustBar() {
  return (
    <section className="border-t border-border">
      <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-center gap-x-8 gap-y-2 px-4 py-5 font-mono text-xs text-muted-foreground">
        {trustBar.map((item) => (
          <span key={item} className="flex items-center gap-2">
            <span aria-hidden="true" className="text-highlight">
              ✔
            </span>
            {item}
          </span>
        ))}
      </div>
    </section>
  );
}
