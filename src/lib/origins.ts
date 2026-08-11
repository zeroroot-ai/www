/**
 * Canonical cross-surface origins (www#15, epic env-derived-links).
 *
 * The ONLY module under src/ allowed to name the app and docs hosts.
 * Every functional link imports from here;
 * scripts/check-no-hardcoded-origins.mjs enforces it in CI.
 *
 * Resolution order:
 *   1. PUBLIC_APP_ORIGIN / PUBLIC_DOCS_ORIGIN at build time. The Docker
 *      build sets these to the __APP_ORIGIN__ / __DOCS_ORIGIN__ sentinels,
 *      which docker/40-substitute-origins.sh replaces with the environment's
 *      real origins (APP_ORIGIN / DOCS_ORIGIN env) at container start. That
 *      keeps one image serving every environment (staging links were
 *      hardcoded to prod before this module existed).
 *   2. The prod origins, so `pnpm dev` and a plain `pnpm build` render
 *      exactly what production serves.
 *
 * Display copy (marketing prose, terminal art) deliberately does NOT go
 * through this module — it is owner-controlled writing, not a link.
 */
export const APP_ORIGIN: string =
  import.meta.env.PUBLIC_APP_ORIGIN ?? "https://app.zeroroot.ai";
export const DOCS_ORIGIN: string =
  import.meta.env.PUBLIC_DOCS_ORIGIN ?? "https://docs.zeroroot.ai";
