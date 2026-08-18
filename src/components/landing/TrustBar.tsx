/**
 * TrustBar, a single strip of platform facts under the hero. Every item
 * must be true of the shipping platform today; aspirational claims
 * (accreditations, certifications) do not belong here.
 */
/**
 * KEPT FROM www#32 while the rest of this copy was reverted to the pre-#30
 * wording. "microVM isolation per execution" sat here and was false: one gate
 * decides how a component runs, from its declared content trust and the
 * deployment shape. What is true, and stronger, is that untrusted code has no
 * in-process fallback — sandbox or refusal.
 */
const items = [
  "open-source core",
  "untrusted code sandboxed or refused",
  "kubernetes-native",
  "short-lived credentials",
  "bring your own LLM",
] as const;

export function TrustBar() {
  return (
    <section className="border-t border-border">
      <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-center gap-x-8 gap-y-2 px-4 py-5 font-mono text-xs text-muted-foreground">
        {items.map((item) => (
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
