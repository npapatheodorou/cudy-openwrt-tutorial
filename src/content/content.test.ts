import { createHash } from 'node:crypto';
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import { FIRMWARE, formatSize } from './firmware';
import { IMAGES } from './images';
import { parseCodeBlocks, SNIPPET_IDS } from './snippets';

const ROOT = fileURLToPath(new URL('../../', import.meta.url));
const readme = readFileSync(join(ROOT, 'README.md'), 'utf8');
const blocks = parseCodeBlocks(readme);

const listFiles = (dir: string, pattern: RegExp) =>
  readdirSync(join(ROOT, dir))
    .filter((name) => pattern.test(name))
    .sort();

const siteSources = readdirSync(join(ROOT, 'src'), { recursive: true, withFileTypes: true })
  .filter((entry) => entry.isFile() && entry.name.endsWith('.tsx'))
  .map((entry) => readFileSync(join(entry.parentPath, entry.name), 'utf8'))
  .join('\n');

describe('README ↔ website commands', () => {
  it('marks every README code block with a snippet id', () => {
    const unmarked = blocks.filter((block) => !block.id).map((block) => block.code.split('\n')[0]);
    expect(unmarked).toEqual([]);
  });

  it('uses each snippet id exactly once and matches the list the site knows', () => {
    const ids = blocks.map((block) => block.id);
    expect(new Set(ids).size).toBe(ids.length);
    expect([...ids].sort()).toEqual([...SNIPPET_IDS].sort());
  });

  it('renders every README snippet somewhere on the website', () => {
    const unused = SNIPPET_IDS.filter((id) => !siteSources.includes(`"${id}"`));
    expect(unused).toEqual([]);
  });

  it('dedents indented README blocks', () => {
    const install = blocks.find((block) => block.id === 'wg-install');
    expect(install?.code).toBe(
      'apk update\napk add wireguard-tools kmod-wireguard luci-proto-wireguard luci-app-wireguard\nreboot',
    );
  });
});

describe('firmware downloads', () => {
  const zips = listFiles('firmware', /\.zip$/);

  it('lists every firmware zip exactly once', () => {
    expect(FIRMWARE.map((pkg) => pkg.file).sort()).toEqual(zips);
  });

  it.each(FIRMWARE)('$file has the recorded size and SHA-256', (pkg) => {
    const data = readFileSync(join(ROOT, 'firmware', pkg.file));
    expect(data.length).toBe(pkg.bytes);
    expect(createHash('sha256').update(data).digest('hex')).toBe(pkg.sha256);
  });

  it('agrees with firmware/SHA256SUMS.txt', () => {
    const sums = readFileSync(join(ROOT, 'firmware', 'SHA256SUMS.txt'), 'utf8')
      .trim()
      .split('\n')
      .map((line) => line.split(/\s+/))
      .map(([sha, file]) => ({ file, sha }));
    expect(sums).toEqual(FIRMWARE.map((pkg) => ({ file: pkg.file, sha: pkg.sha256 })).sort((a, b) => a.file.localeCompare(b.file)));
  });

  it('is linked from the README with the same size', () => {
    for (const pkg of FIRMWARE) {
      const row = readme.split('\n').find((line) => line.includes(`(./firmware/${pkg.file})`));
      expect(row, pkg.file).toBeDefined();
      expect(row).toContain(formatSize(pkg.bytes));
    }
  });
});

describe('screenshots and tools', () => {
  it('covers every screenshot on the website and in the README', () => {
    const pngs = listFiles('assets/images', /\.png$/);
    expect(Object.values(IMAGES).map((image) => image.file).sort()).toEqual(pngs);
    for (const png of pngs) expect(readme).toContain(`./assets/images/${png}`);
  });

  it('only links to tools that exist', () => {
    const links = [...readme.matchAll(/\(\.\/(tools\/[^)]+)\)/g)].map((match) => match[1] ?? '');
    expect(links.length).toBeGreaterThan(0);
    for (const link of links) expect(existsSync(join(ROOT, link)), link).toBe(true);
  });
});
