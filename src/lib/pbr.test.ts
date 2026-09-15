import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import { firewallLines, parseIpList, policyBlocks } from './pbr';

const SCRIPT = fileURLToPath(new URL('../../tools/pbr_firewall_exceptions_gen.py', import.meta.url));
const python = ['python3', 'python'].find((command) => spawnSync(command, ['--version']).status === 0);

describe('parseIpList', () => {
  it('splits on commas and whitespace and removes duplicates in order', () => {
    expect(parseIpList('1.1.1.1, 2.2.2.2\n1.1.1.1   3.3.3.3,')).toEqual(['1.1.1.1', '2.2.2.2', '3.3.3.3']);
  });

  it('returns nothing for blank input', () => {
    expect(parseIpList(' \n ')).toEqual([]);
  });
});

describe('output format', () => {
  it('builds PBR policy blocks', () => {
    expect(policyBlocks(['1.1.1.1', '2.2.2.2'])).toBe(
      "config policy\n\toption name '1.1.1.1'\n\toption dest_addr '1.1.1.1'\n\toption interface 'wan'\n\n" +
        "config policy\n\toption name '2.2.2.2'\n\toption dest_addr '2.2.2.2'\n\toption interface 'wan'",
    );
  });

  it('builds firewall exemption lines', () => {
    expect(firewallLines(['1.1.1.1', '10.0.0.0/8'])).toBe("list dest_ip '!1.1.1.1'\nlist dest_ip '!10.0.0.0/8'");
  });

  it.skipIf(!python)('matches tools/pbr_firewall_exceptions_gen.py', () => {
    const ips = ['1.1.1.1', '8.8.8.8', '203.0.113.0/24'];
    const run = spawnSync(python ?? 'python3', [SCRIPT], { input: `${ips[0]}, ${ips[1]}\n${ips[2]}\n${ips[0]}\n\n`, encoding: 'utf8' });
    expect(run.status).toBe(0);
    const stdout = run.stdout.replace(/\r\n/g, '\n');
    expect(stdout).toContain(policyBlocks(ips));
    expect(stdout).toContain(firewallLines(ips));
  });
});
