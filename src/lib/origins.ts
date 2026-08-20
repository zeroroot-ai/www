/**
 * Canonical cross-surface origins (www#15, epic env-derived-links).
 *
 * The ONLY module under src/ allowed to name the docs host.
 * Every functional link imports from here;
 * scripts/check-no-hardcoded-origins.mjs enforces it in CI.
 *
 * Resolution order:
 *   1. PUBLIC_DOCS_ORIGIN at build time. The Docker build sets it to the
 *      __DOCS_ORIGIN__ sentinel, which docker/40-substitute-origins.sh
 *      replaces with the environment's real origin (DOCS_ORIGIN env) at
 *      container start. That keeps one image serving every environment
 *      (staging links were hardcoded to prod before this module existed).
 *   2. The prod origin, so `pnpm dev` and a plain `pnpm build` render
 *      exactly what production serves.
 *
 * There is no APP_ORIGIN. The app host had exactly one consumer, the nav's
 * "Sign in" link, and app.zeroroot.ai does not resolve, so that link was dead
 * and now points at /pricing. An origin, a build sentinel, a substitution and
 * a smoke assertion kept alive for nothing is a dead path shipped disabled
 * (ADR-0027). It comes back the day a login exists to link to, together with
 * its consumer and its test, in one change.
 *
 * Display copy (marketing prose, terminal art) deliberately does NOT go
 * through this module: it is owner-controlled writing, not a link.
 */
export const DOCS_ORIGIN: string =
  import.meta.env.PUBLIC_DOCS_ORIGIN ?? "https://docs.zeroroot.ai";
