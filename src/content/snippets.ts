/**
 * README.md is the single source of truth for every command on the website.
 * Each fenced block in the README is preceded by an invisible marker:
 *
 *   <!-- snippet: wg-install -->
 *   ```sh
 *   ...
 *   ```
 *
 * The site renders blocks by id, and the tests fail if a README block lacks a marker
 * or a marker is not used by the site.
 */
export const SNIPPET_IDS = [
  'luci-install',
  'advanced-setup',
  'advanced-adblock',
  'wg-install',
  'wg-conf-example',
  'wg-interface',
  'wg-firewall',
  'killswitch-script',
  'killswitch-usage',
  'panic-script',
  'wg-verify-handshake',
  'wg-verify-ip',
  'pbr-install',
  'pbr-enable',
  'pbr-bypass-mac',
  'pbr-force-vpn',
  'pbr-bypass-domains',
  'pbr-bypass-ip-range',
  'pbr-bypass-port',
  'pbr-combine',
  'pbr-manage',
  'pbr-killswitch-rule',
  'pbr-killswitch-config',
  'pbr-killswitch-exemptions',
  'pbr-verify',
  'ipv6-disable-wan6',
  'ipv6-disable-lan',
  'ipv6-disable-odhcpd',
  'ipv6-disable-kernel',
  'ipv6-disable-restart',
  'ipv6-enable-wan6',
  'ipv6-enable-lan',
  'ipv6-enable-commit',
  'ipv6-enable-odhcpd',
  'ipv6-enable-kernel',
  'ipv6-enable-restart',
  'tool-nordvpn-run',
  'tool-pbr-run',
  'tool-checksums',
] as const;

export type SnippetId = (typeof SNIPPET_IDS)[number];

export interface CodeBlockSource {
  id: string | undefined;
  lang: string;
  code: string;
}

const MARKER = /^\s*<!--\s*snippet:\s*([\w-]+)\s*-->\s*$/;
const FENCE_OPEN = /^(\s*)```\s*([\w-]*)\s*$/;
const FENCE_CLOSE = /^\s*```\s*$/;

function tidy(lines: string[]): string {
  const out = lines.map((line) => line.trimEnd());
  while (out.length && !out[0]) out.shift();
  while (out.length && !out[out.length - 1]) out.pop();
  return out.join('\n');
}

/** Every fenced code block in a Markdown document, dedented, with its snippet id if marked. */
export function parseCodeBlocks(markdown: string): CodeBlockSource[] {
  const lines = markdown.split(/\r?\n/);
  const blocks: CodeBlockSource[] = [];
  let pendingId: string | undefined;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i] ?? '';
    const marker = MARKER.exec(line);
    if (marker) {
      pendingId = marker[1];
      continue;
    }
    const open = FENCE_OPEN.exec(line);
    if (!open) {
      if (line.trim()) pendingId = undefined;
      continue;
    }

    const indent = (open[1] ?? '').length;
    const body: string[] = [];
    for (i++; i < lines.length && !FENCE_CLOSE.test(lines[i] ?? ''); i++) {
      const bodyLine = lines[i] ?? '';
      const leading = bodyLine.length - bodyLine.trimStart().length;
      body.push(bodyLine.slice(Math.min(indent, leading)));
    }
    blocks.push({ id: pendingId, lang: open[2] || 'text', code: tidy(body) });
    pendingId = undefined;
  }
  return blocks;
}
