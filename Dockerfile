# Stage 1: build
FROM node:22-alpine AS builder
WORKDIR /app
# `corepack enable` alone, deliberately: corepack then reads the exact pnpm
# version from package.json's `packageManager` field. The previous
# `corepack prepare pnpm@latest` floated, so the image's package manager
# drifted daily and could differ by a whole major from the one that produced
# the committed lockfile. That is not hypothetical: pnpm 11 enforces a 24h
# `minimumReleaseAge` quarantine that pnpm 10 does not, so a lockfile
# resolved locally on 10 was rejected by the image on 11 — and PR CI never
# caught it, because the docker job only runs on main.
RUN corepack enable
COPY package.json pnpm-lock.yaml .npmrc ./
# pnpm deliberately ignores env-var auth tokens in the project-level .npmrc
# ("environment variables are not expanded in registry credentials that come
# from a project .npmrc"), so the committed .npmrc alone cannot authenticate
# the private @zeroroot-ai/brand fetch from GitHub Packages inside this stage
# (ERR_PNPM_FETCH_401 — issue #3). CI passes the token as a BuildKit secret;
# we write it as a literal user-level ~/.npmrc (which pnpm DOES honor) for the
# install step only, then remove it within the same RUN so the token is never
# baked into a layer. Without the secret (plain local `docker build`) the
# install still runs and succeeds if ambient registry auth exists.
RUN --mount=type=secret,id=npm_token \
    if [ -s /run/secrets/npm_token ]; then \
      printf '//npm.pkg.github.com/:_authToken=%s\n' "$(cat /run/secrets/npm_token)" > "$HOME/.npmrc"; \
    fi \
    && pnpm install --frozen-lockfile --ignore-scripts \
    && rm -f "$HOME/.npmrc"
COPY . .
RUN pnpm build

# Stage 2: serve
#
# nginx-unprivileged (not plain nginx): the deploy chart
# (zeroroot-ai/deploy helm/saas-overlay/www-svc) runs this image as uid 101
# with ALL capabilities dropped, so nginx cannot bind a privileged port and
# cannot write to the stock /var/cache/nginx and /var/run paths. The
# unprivileged variant is built for exactly that, and defaults to :8080.
FROM nginxinc/nginx-unprivileged:alpine AS runner
COPY --from=builder /app/dist /usr/share/nginx/html
# templates/ (not conf.d/): the entrypoint runs envsubst over
# /etc/nginx/templates/*.template, which is what substitutes ${NGINX_PORT} in
# nginx.conf. Copying to conf.d/ would ship the literal, unexpanded directive.
COPY nginx.conf /etc/nginx/templates/default.conf.template
ENV NGINX_PORT=8080
EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]
