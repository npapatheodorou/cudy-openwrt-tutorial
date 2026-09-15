import type { Placeholder } from './highlight';

/** The five values the README tells you to copy out of a WireGuard `.conf`. */
export const WIREGUARD_FIELDS = [
  'PRIVATE_KEY',
  'ADDRESS',
  'DNS',
  'PEER_PUBLIC_KEY',
  'ENDPOINT_HOST',
] as const satisfies readonly Placeholder[];

export type WireGuardField = (typeof WIREGUARD_FIELDS)[number];

/** Port hard-coded in the README's `uci set network.peer0.endpoint_port` line. */
export const SNIPPET_ENDPOINT_PORT = '51820';

type Section = Record<string, string>;

export function parseWireGuardConfig(text: string): { interface?: Section; peer?: Section } {
  const sections: Record<string, Section> = {};
  let current: Section | null = null;
  for (const raw of text.split(/\r?\n/)) {
    const line = raw.trim();
    if (!line || line.startsWith('#') || line.startsWith(';')) continue;
    const header = /^\[(\w+)\]$/.exec(line);
    if (header) {
      const name = (header[1] ?? '').toLowerCase();
      // Only the first section of each kind is used (e.g. the first [Peer]).
      current = sections[name] ? null : (sections[name] = {});
      continue;
    }
    const pair = /^([A-Za-z]+)\s*=\s*(.+)$/.exec(line);
    if (pair && current) current[(pair[1] ?? '').toLowerCase()] = (pair[2] ?? '').trim();
  }
  return { interface: sections.interface, peer: sections.peer };
}

export function splitEndpoint(endpoint: string): { host: string; port?: string } {
  const match = /^\[([^\]]+)\]:(\d+)$/.exec(endpoint) ?? /^(.+):(\d+)$/.exec(endpoint);
  return match ? { host: match[1] ?? '', port: match[2] } : { host: endpoint };
}

export interface WireGuardExtraction {
  values: Partial<Record<WireGuardField, string>>;
  missing: WireGuardField[];
  notes: string[];
}

const splitList = (value: string | undefined): string[] =>
  (value ?? '').split(',').map((item) => item.trim()).filter(Boolean);

export function extractWireGuardValues(text: string): WireGuardExtraction {
  const { interface: iface = {}, peer = {} } = parseWireGuardConfig(text);
  const addresses = splitList(iface.address);
  const dns = splitList(iface.dns);
  const endpoint = peer.endpoint ? splitEndpoint(peer.endpoint) : undefined;

  const values: Partial<Record<WireGuardField, string>> = {};
  const found: Record<WireGuardField, string | undefined> = {
    PRIVATE_KEY: iface.privatekey,
    ADDRESS: addresses[0],
    DNS: dns[0],
    PEER_PUBLIC_KEY: peer.publickey,
    ENDPOINT_HOST: endpoint?.host,
  };
  for (const field of WIREGUARD_FIELDS) {
    const value = found[field];
    if (value) values[field] = value;
  }

  const notes: string[] = [];
  if (addresses.length > 1) notes.push(`Your file lists ${addresses.length} addresses; the first (${addresses[0]}) was used.`);
  if (dns.length > 1) notes.push(`Your file lists ${dns.length} DNS servers; the first (${dns[0]}) was used.`);
  if (endpoint?.port && endpoint.port !== SNIPPET_ENDPOINT_PORT) {
    notes.push(
      `Your endpoint uses port ${endpoint.port}, but the snippet sets endpoint_port='${SNIPPET_ENDPOINT_PORT}'. Change that line to '${endpoint.port}'.`,
    );
  }

  return { values, missing: WIREGUARD_FIELDS.filter((field) => !values[field]), notes };
}
