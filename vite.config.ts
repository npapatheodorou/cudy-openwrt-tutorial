import { cpSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';
import react from '@vitejs/plugin-react';
import type { Plugin } from 'vite';
import { defineConfig } from 'vitest/config';

/**
 * Repository content the website links to directly (screenshots, icons, firmware
 * downloads, tools). It stays at the repo root so README links keep working, and is
 * copied next to the built site. The dev server already serves it from the root.
 */
const REPO_CONTENT = ['assets', 'firmware', 'tools', 'LICENSE'];

function copyRepoContent(): Plugin {
  let root = process.cwd();
  let outDir = 'dist';
  return {
    name: 'copy-repo-content',
    apply: 'build',
    configResolved(config) {
      root = config.root;
      outDir = resolve(config.root, config.build.outDir);
    },
    closeBundle() {
      for (const entry of REPO_CONTENT) {
        const source = resolve(root, entry);
        if (existsSync(source)) cpSync(source, resolve(outDir, entry), { recursive: true });
      }
    },
  };
}

/**
 * Absolute site URL for canonical and Open Graph tags. Set SITE_URL for a custom domain;
 * on Vercel the production domain is picked up automatically.
 */
function siteUrl(): string {
  const vercelDomain = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  const url = process.env.SITE_URL ?? (vercelDomain ? `https://${vercelDomain}` : 'https://cudy-openwrt-tutorial.vercel.app');
  return url.replace(/\/+$/, '');
}

function injectSiteUrl(): Plugin {
  return {
    name: 'inject-site-url',
    transformIndexHtml: (html) => html.replaceAll('__SITE_URL__', siteUrl()),
  };
}

export default defineConfig({
  // Relative base so the build also works when served from a sub-path or opened from disk.
  base: './',
  plugins: [react(), injectSiteUrl(), copyRepoContent()],
  build: {
    // Keep bundled files apart from the copied repo `assets/` folder.
    assetsDir: '_app',
  },
  test: {
    environment: 'node',
  },
});
