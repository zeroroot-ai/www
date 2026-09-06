# ============================================================================
# ZeroRoot www (marketing site) — uniform Makefile contract
# ============================================================================
# Implements the org-wide target contract (gibson#171 slice 1.4, enforced by
# the makefile-contract workflow in zeroroot-ai/.github):
#
#     make bootstrap | build | test | check | image
#
# This is a static Astro site with no unit-test suite: the production build is
# the CI gate (see .github/workflows/ci.yml), so `check` runs the build and
# `test` is an explicit no-op rather than a silent lie.
#
# @zeroroot-ai/brand resolves from registry.npmjs.org; no token is needed
# anywhere (attic#17).
# ============================================================================

PNPM ?= pnpm

IMAGE_NAME ?= ghcr.io/zeroroot-ai/www
IMAGE_TAG  ?= dev

.PHONY: all bootstrap build test check image help

all: check ## Default: run the full CI-equivalent gate

bootstrap: ## Install dependencies reproducibly from the committed pnpm lockfile
	$(PNPM) install --frozen-lockfile

build: ## Production Astro build (dist/)
	$(PNPM) build

test: ## No unit-test suite (static site) — the build is the gate; see `check`
	@echo "www has no unit-test suite; 'make check' (the production build) is the gate"

check: build ## CI-equivalent gate (mirrors ci.yml: the production build)

image: ## Build the production container image (nginx serving dist/)
	docker build -t $(IMAGE_NAME):$(IMAGE_TAG) .

help: ## List available targets
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | \
		awk 'BEGIN {FS = ":.*?## "}; {printf "  %-12s %s\n", $$1, $$2}'
