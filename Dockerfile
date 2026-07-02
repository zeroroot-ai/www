# Stage 1: build
FROM node:22-alpine AS builder
WORKDIR /app
RUN corepack enable && corepack prepare pnpm@latest --activate
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
FROM nginx:alpine AS runner
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
