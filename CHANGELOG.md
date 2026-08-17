# Changelog

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
