import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';

// The landing page is the real design, ported back out of the dashboard.
// dashboard#911 deleted it there on 2026-06-29 without porting it here, so
// this site served a scaffold instead for five weeks.
//
// The design is React + Tailwind v4 on the shared @zeroroot-ai/brand tokens.
// Astro renders those components to static HTML at build time; only the
// Typewriter needs client JS, so only the hero it lives in is hydrated.
export default defineConfig({
  output: 'static',
  integrations: [mdx(), react()],
  vite: {
    plugins: [tailwindcss()],
  },
});
