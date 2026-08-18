import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { pricingDisplays, type PricingTierDisplay } from "@/lib/pricing-display";

/**
 * The pricing tiers, ported from the dashboard's app/(public)/pricing/page.tsx.
 *
 * ONE deliberate difference from the original, and it is about where this page
 * now runs rather than about the design:
 *
 * The dashboard page rendered on a server, so it could fetch live Stripe
 * prices per request and fall back to the committed plans.yaml figure when
 * Stripe was unreachable. This site is a static build behind nginx — there is
 * no request-time server and no Stripe credential — so the price shown is
 * always the plans.yaml figure.
 *
 * That is the same number, not an approximation: plans.yaml is the canonical
 * plan data and the Stripe products are mirrored from it. If the two ever
 * disagree, plans.yaml is the source of truth and Stripe is the drift.
 *
 * src/generated/plans.ts is generated from it by scripts/gen-plans.mjs.
 */

const SAAS_TIER_IDS = new Set(["team", "org", "enterprise"]);
const FEATURED_TIER_ID = "org";
const DEPLOY_TIER_ID = "enterprise-deploy";

/**
 * SALES-ASSISTED HOLDING PATTERN — reverting this commit IS the flip.
 *
 * Every tier routes to /contact-sales while `app.zeroroot.ai` does not exist.
 * The steady state is unchanged and recorded in deploy/CONTEXT.md: paid tiers
 * link to `${APP}/signup?plan=<id>` labelled "Start trial", and only
 * contact-sales tiers use the form.
 *
 * This is a constraint of the torn-down estate, not a go-to-market decision.
 * There is no app host to send a buyer to, so a "Start trial" button would be
 * a dead link — which is what it is on production right now.
 *
 * Deliberately NOT a flag. ADR-0027 forbids a flag that gates a cutover, and a
 * build-time flag would need a rebuild to switch, which is exactly what
 * reverting already does. The whole change is this one function plus its
 * import, so `git revert` restores the steady state in a single step.
 *
 * Prices stay visible: the buyer sees the number, then talks to us. Figures
 * come from the committed plans.ts and do not move.
 *
 * Revert when blocker 2 (Signup) is green and app.zeroroot.ai resolves.
 */
function ctaForTier(t: PricingTierDisplay): {
  label: string;
  href: string;
  variant: "default" | "outline";
} {
  const variant = t.id === FEATURED_TIER_ID ? "default" : "outline";
  return {
    label: "Contact sales",
    href: "/contact-sales?tier=" + encodeURIComponent(t.id),
    variant,
  };
}

function Tier({ t, featured }: { t: PricingTierDisplay; featured: boolean }) {
  const cta = ctaForTier(t);
  return (
    <Card
      className={
        "flex flex-col h-full " +
        (featured ? "border-highlight shadow-md ring-1 ring-highlight/30" : "")
      }
    >
      <CardHeader>
        <div className="flex items-center justify-between gap-2">
          <CardTitle className="font-display text-2xl">{t.name}</CardTitle>
          {featured ? (
            <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded bg-highlight text-primary-foreground">
              Most popular
            </span>
          ) : null}
        </div>
        <CardDescription>{t.tagline}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow space-y-4">
        <div>
          <div
            className={
              "font-display text-3xl font-semibold" +
              (featured ? " text-highlight" : "")
            }
          >
            {t.priceLabel}
          </div>
          {t.priceSubLabel ? (
            <div className="text-sm text-muted-foreground mt-1">{t.priceSubLabel}</div>
          ) : null}
          {t.annualSavings ? (
            <div className="inline-block mt-2 text-xs uppercase tracking-wider px-2 py-0.5 rounded bg-highlight/15 text-highlight">
              {t.annualSavings}
            </div>
          ) : null}
        </div>
        <ul className="space-y-2 text-sm">
          <li>
            <span className="font-medium">{t.concurrentMissionsLabel}</span>
            <div className="text-muted-foreground">in non-terminal execution at any moment</div>
          </li>
          <li>
            <span className="font-medium">{t.concurrentAgentsLabel}</span>
            <div className="text-muted-foreground">bound to in-flight tasks at any moment</div>
          </li>
        </ul>
      </CardContent>
      <CardFooter>
        <Button asChild variant={cta.variant} className="w-full">
          <a href={cta.href}>{cta.label}</a>
        </Button>
      </CardFooter>
    </Card>
  );
}

const onPremFeatures: { title: string; body: string }[] = [
  {
    title: "Deploys into your own Kubernetes",
    body: "Helm chart deploys the full Gibson stack into your Kubernetes cluster. No egress, no telemetry, no callbacks home.",
  },
  {
    title: "Bring your own models",
    body: "Run against your own LLM endpoints, vLLM clusters, or vendor inference deployments. Prompts and results never leave your boundary.",
  },
  {
    title: "Bring your own secrets backend",
    body: "Integrate with HashiCorp Vault, AWS KMS, or your existing PKI. Per-tenant KEK derivation and workload identity built in.",
  },
  {
    title: "SSO and SCIM",
    body: "OIDC and SAML to your IdP (Okta, Entra, PingFederate, Keycloak). SCIM 2.0 user lifecycle. Per-tenant role mapping.",
  },
  {
    title: "Audit log streaming",
    body: "Export every authentication, authorization, and orchestration event to your SIEM via syslog, Kafka, or OpenTelemetry.",
  },
  {
    title: "Capable of GovCloud, IL5 / IL6, and FIPS 140-3 environments",
    body: "Ships against FIPS-validated cryptographic modules. Compatible with AWS GovCloud (US), Azure Government, and on-prem environments accredited to IL5 / IL6. Customer holds the ATO; we provide the artifacts.",
  },
  {
    title: "Custom retention and data residency",
    body: "Pick where mission data, embeddings, and graph state live. Configurable retention windows per data class.",
  },
  {
    title: "Dedicated forward-deployed engineers",
    body: "Direct Slack or Teams channel with the engineers who build Gibson. Defined response times, scheduled office hours, custom SLAs.",
  },
];

function OnPremCard({ t }: { t: PricingTierDisplay }) {
  return (
    <Card className="border-alt/40">
      <CardHeader>
        <div className="flex flex-wrap items-center gap-3">
          <CardTitle className="font-display text-2xl">{t.name}</CardTitle>
          <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded bg-alt/15 text-alt">
            Self-hosted
          </span>
        </div>
        <CardDescription className="text-base">{t.tagline}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-x-8 gap-y-5 md:grid-cols-2">
          {onPremFeatures.map((f) => (
            <div key={f.title}>
              <div className="font-medium text-sm">{f.title}</div>
              <div className="text-sm text-muted-foreground mt-1">{f.body}</div>
            </div>
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-3 pt-2">
          <Button asChild>
            <a href={"/contact-sales?tier=" + encodeURIComponent(t.id)}>
              Talk to the team
            </a>
          </Button>
          <p className="text-sm text-muted-foreground">
            Quotas, pricing, and rollout shape are set per engagement.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

export function PricingTiers() {
  const saasTiers = pricingDisplays.filter((t) => SAAS_TIER_IDS.has(t.id));
  const deployTier = pricingDisplays.find((t) => t.id === DEPLOY_TIER_ID);

  return (
    <>
      <div className="grid gap-6 md:grid-cols-3">
        {saasTiers.map((t) => (
          <Tier key={t.id} t={t} featured={t.id === FEATURED_TIER_ID} />
        ))}
      </div>
      {deployTier ? (
        <div className="mt-10">
          <OnPremCard t={deployTier} />
        </div>
      ) : null}
    </>
  );
}
