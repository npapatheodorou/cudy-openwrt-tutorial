import { describe, expect, it } from 'vitest';
import { extractWireGuardValues, splitEndpoint } from './wireguard';

const PRIVATE_KEY = 'aGVsbG8gd29ybGQgdGhpcyBpcyBhIHRlc3Qga2V5MTI=';
const PUBLIC_KEY = 'cGVlciBwdWJsaWMga2V5IGZvciB0ZXN0aW5nIG9ubHk=';

const CONF = `[Interface]
PrivateKey = ${PRIVATE_KEY}
Address    = 10.64.0.2/32
DNS        = 10.64.0.1

[Peer]
PublicKey  = ${PUBLIC_KEY}
Endpoint   = se-mma-wg-001.mullvad.net:51820
AllowedIPs = 0.0.0.0/0, ::/0`;

describe('extractWireGuardValues', () => {
  it('extracts the five values the README asks for, keeping base64 padding', () => {
    const result = extractWireGuardValues(CONF);
    expect(result.values).toEqual({
      PRIVATE_KEY,
      ADDRESS: '10.64.0.2/32',
      DNS: '10.64.0.1',
      PEER_PUBLIC_KEY: PUBLIC_KEY,
      ENDPOINT_HOST: 'se-mma-wg-001.mullvad.net',
    });
    expect(result.missing).toEqual([]);
    expect(result.notes).toEqual([]);
  });

  it('handles Windows line endings and comments', () => {
    const result = extractWireGuardValues(`# exported\r\n${CONF.replace(/\n/g, '\r\n')}`);
    expect(result.missing).toEqual([]);
  });

  it('uses the first address and DNS server and says so', () => {
    const result = extractWireGuardValues(
      CONF.replace('10.64.0.2/32', '10.5.0.2/32, fd00::2/128').replace('DNS        = 10.64.0.1', 'DNS = 103.86.96.100, 103.86.99.100'),
    );
    expect(result.values.ADDRESS).toBe('10.5.0.2/32');
    expect(result.values.DNS).toBe('103.86.96.100');
    expect(result.notes).toHaveLength(2);
  });

  it('warns when the endpoint port differs from the snippet', () => {
    const result = extractWireGuardValues(CONF.replace(':51820', ':1443'));
    expect(result.values.ENDPOINT_HOST).toBe('se-mma-wg-001.mullvad.net');
    expect(result.notes.join(' ')).toContain("'1443'");
  });

  it('reads only the first [Peer]', () => {
    const result = extractWireGuardValues(`${CONF}\n\n[Peer]\nPublicKey = other=\nEndpoint = other.example:51820`);
    expect(result.values.PEER_PUBLIC_KEY).toBe(PUBLIC_KEY);
    expect(result.values.ENDPOINT_HOST).toBe('se-mma-wg-001.mullvad.net');
  });

  it('lists missing fields', () => {
    expect(extractWireGuardValues(`[Interface]\nPrivateKey = ${PRIVATE_KEY}`).missing).toEqual([
      'ADDRESS',
      'DNS',
      'PEER_PUBLIC_KEY',
      'ENDPOINT_HOST',
    ]);
  });
});

describe('splitEndpoint', () => {
  it('splits host names and IPv4 addresses', () => {
    expect(splitEndpoint('198.51.100.7:51820')).toEqual({ host: '198.51.100.7', port: '51820' });
  });

  it('unwraps bracketed IPv6 endpoints', () => {
    expect(splitEndpoint('[2001:db8::1]:51820')).toEqual({ host: '2001:db8::1', port: '51820' });
  });

  it('keeps a host without a port as-is', () => {
    expect(splitEndpoint('vpn.example.com')).toEqual({ host: 'vpn.example.com' });
  });
});
