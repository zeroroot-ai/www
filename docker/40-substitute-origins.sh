#!/bin/sh
# Substitute the build-time origin sentinels with this environment's origins
# (www#15, epic env-derived-links).
#
# The Astro build bakes __DOCS_ORIGIN__ into dist (see Dockerfile), so one
# image serves every environment: the chart sets DOCS_ORIGIN per environment
# and this script rewrites the static files once, before nginx starts (the
# stock entrypoint runs /docker-entrypoint.d/*.sh first). No env means prod:
# a bare `docker run` of this image serves the production links.
#
# Fails the container start if any sentinel survives, so a broken
# substitution shows up as a red startup probe, never as silently-wrong
# links.
set -eu

: "${DOCS_ORIGIN:=https://docs.zeroroot.ai}"

html_root=/usr/share/nginx/html

find "$html_root" -type f \
  \( -name '*.html' -o -name '*.js' -o -name '*.css' -o -name '*.json' -o -name '*.txt' -o -name '*.xml' \) \
  -exec sed -i \
    -e "s|__DOCS_ORIGIN__|${DOCS_ORIGIN}|g" {} +

leftovers="$(grep -rl -e '__DOCS_ORIGIN__' "$html_root" || true)"
if [ -n "$leftovers" ]; then
  echo "40-substitute-origins: origin sentinels survived substitution in:" >&2
  echo "$leftovers" >&2
  exit 1
fi

echo "40-substitute-origins: DOCS_ORIGIN=${DOCS_ORIGIN}"
