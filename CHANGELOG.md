# Changelog

## [1.3.0](https://github.com/zeroroot-ai/www/compare/v1.2.3...v1.3.0) (2026-08-18)


### Features

* **copy:** rewrite the hero line and make the flagship pillars specific ([#46](https://github.com/zeroroot-ai/www/issues/46)) ([80ea714](https://github.com/zeroroot-ai/www/commit/80ea714882f9ce6e74784ba79eaeceff1d9fdf0a))

## [1.2.3](https://github.com/zeroroot-ai/www/compare/v1.2.2...v1.2.3) (2026-08-18)


### Reverts

* **copy:** restore the landing copy from before the repositioning batch ([#44](https://github.com/zeroroot-ai/www/issues/44)) ([e7351c8](https://github.com/zeroroot-ai/www/commit/e7351c8f09b9b22e7f23160d51a716391e06630c))

## [1.2.2](https://github.com/zeroroot-ai/www/compare/v1.2.1...v1.2.2) (2026-08-18)


### Bug Fixes

* **contact:** post the lead to the same-origin endpoint ([#42](https://github.com/zeroroot-ai/www/issues/42)) ([e221709](https://github.com/zeroroot-ai/www/commit/e2217093ffe6158317dc79a417c8173f7f17d8ee))

## [1.2.1](https://github.com/zeroroot-ai/www/compare/v1.2.0...v1.2.1) (2026-08-18)


### Bug Fixes

* **ci:** pin the real configure-aws-credentials sha ([#40](https://github.com/zeroroot-ai/www/issues/40)) ([ada7b3a](https://github.com/zeroroot-ai/www/commit/ada7b3a1539d70989e8f23433e30b8f4e66888fc))

## [1.2.0](https://github.com/zeroroot-ai/www/compare/v1.1.0...v1.2.0) (2026-08-18)


### Features

* **ci:** publish the marketing site to s3 on a release tag ([#39](https://github.com/zeroroot-ai/www/issues/39)) ([5c89ad1](https://github.com/zeroroot-ai/www/commit/5c89ad16db2b6ede76109fdf3779e67b2031a915))


### Bug Fixes

* **404:** add a 404 page so unknown paths do not answer 403 ([#37](https://github.com/zeroroot-ai/www/issues/37)) ([3752566](https://github.com/zeroroot-ai/www/commit/37525669c19654082878c0e50018789c0bbed9a4))

## [1.1.0](https://github.com/zeroroot-ai/www/compare/v1.0.1...v1.1.0) (2026-08-18)


### Features

* **copy:** add the primitives section and widen the examples ([#34](https://github.com/zeroroot-ai/www/issues/34)) ([2090744](https://github.com/zeroroot-ai/www/commit/209074478775b36def4c2546e896d516d8d129e2)), closes [#28](https://github.com/zeroroot-ai/www/issues/28)
* **copy:** move contact to consulting and state the FDE path ([#31](https://github.com/zeroroot-ai/www/issues/31)) ([bd9bf8a](https://github.com/zeroroot-ai/www/commit/bd9bf8adab4f62459415f54daafd722ae526b82a)), closes [#29](https://github.com/zeroroot-ai/www/issues/29)
* **copy:** reposition Gibson as the ADK and runtime ([#30](https://github.com/zeroroot-ai/www/issues/30)) ([54d5f30](https://github.com/zeroroot-ai/www/commit/54d5f304e86296f5a22e4e14681ce94b9ba29bf8))
* **pricing:** route every tier to contact-sales while app is down ([#36](https://github.com/zeroroot-ai/www/issues/36)) ([a7d28d8](https://github.com/zeroroot-ai/www/commit/a7d28d87baf1edc167ba5b3ff0357142929662e7))


### Bug Fixes

* **copy:** correct the isolation claims in TrustBar and WhyBlocked ([#32](https://github.com/zeroroot-ai/www/issues/32)) ([15c60a2](https://github.com/zeroroot-ai/www/commit/15c60a224822fe660a21c2766d3c83a2822399d5)), closes [#27](https://github.com/zeroroot-ai/www/issues/27)
* **links:** point the hero quickstart at the docs host, and gate dead links ([#35](https://github.com/zeroroot-ai/www/issues/35)) ([bd42889](https://github.com/zeroroot-ai/www/commit/bd42889688c5c7a5f5d32c7fc436f3e942847961))

## [1.0.1](https://github.com/zeroroot-ai/www/compare/v1.0.0...v1.0.1) (2026-08-17)


### Bug Fixes

* **release:** reset www to 0.x and restore the pre-1.0 guardrail ([#24](https://github.com/zeroroot-ai/www/issues/24)) ([850edca](https://github.com/zeroroot-ai/www/commit/850edcadcfd4a87074112174984bef7f03e8a2e0)), closes [#23](https://github.com/zeroroot-ai/www/issues/23)

## 0.1.0 (2026-08-15)


### Features

* consume @zeroroot-ai/brand tokens (drop inlined CSS vars) ([#2](https://github.com/zeroroot-ai/www/issues/2)) ([f43d130](https://github.com/zeroroot-ai/www/commit/f43d130659052eff399add05bbe44201bdd51153))
* initial marketing site scaffold ([17eaced](https://github.com/zeroroot-ai/www/commit/17eaced817840440d9717ef5d1dcfbb7d8678534))
* **landing:** restore the real landing page, delete the scaffold copy ([#10](https://github.com/zeroroot-ai/www/issues/10)) ([81921c8](https://github.com/zeroroot-ai/www/commit/81921c824d03233b6af60ed9ea4ce7c55011ca84))
* **www:** add pnpm lockfile and drop unpublished @zeroroot/brand dep ([#1](https://github.com/zeroroot-ai/www/issues/1)) ([4c6ae11](https://github.com/zeroroot-ai/www/commit/4c6ae110bba1d074366a9050b295bb29ec963b10))


### Bug Fixes

* **docker:** authenticate GH Packages for @zeroroot-ai/brand in image build ([#4](https://github.com/zeroroot-ai/www/issues/4)) ([93f283b](https://github.com/zeroroot-ai/www/commit/93f283bb6422347364f4c2810be385579a62e807)), closes [#3](https://github.com/zeroroot-ai/www/issues/3)
* **docker:** make the html tree writable by uid 101 so origin substitution can run ([#17](https://github.com/zeroroot-ai/www/issues/17)) ([#18](https://github.com/zeroroot-ai/www/issues/18)) ([ff618a7](https://github.com/zeroroot-ai/www/commit/ff618a792cacadcc7b4ad5189f88ecafba85d67c))
* **docker:** serve from nginx-unprivileged on :8080 ([#9](https://github.com/zeroroot-ai/www/issues/9)) ([fedd6bb](https://github.com/zeroroot-ai/www/commit/fedd6bbf2e8c645a30726c05f135d83909124128)), closes [#8](https://github.com/zeroroot-ai/www/issues/8)
* **links:** derive app/docs origins from the environment ([#15](https://github.com/zeroroot-ai/www/issues/15)) ([#16](https://github.com/zeroroot-ai/www/issues/16)) ([78a395b](https://github.com/zeroroot-ai/www/commit/78a395bce7dadad438464cd9dd85972f2d9bd2b0))


### Reverts

* **hero:** restore the copy from before dashboard[#889](https://github.com/zeroroot-ai/www/issues/889) ([#14](https://github.com/zeroroot-ai/www/issues/14)) ([1584262](https://github.com/zeroroot-ai/www/commit/1584262ce64c7cea70ebf8e7a53eb6879d7f734d))
