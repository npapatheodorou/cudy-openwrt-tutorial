/* Browser port of tools/pbr_firewall_exceptions_gen.py. Keep the output formats identical. */

/** Split pasted input on commas and whitespace, dropping empties and duplicates (order kept). */
export function parseIpList(text: string): string[] {
  return [...new Set(text.split(/[\s,]+/).filter(Boolean))];
}

export function policyBlocks(ips: readonly string[]): string {
  return ips
    .map((ip) => `config policy\n\toption name '${ip}'\n\toption dest_addr '${ip}'\n\toption interface 'wan'`)
    .join('\n\n');
}

export function firewallLines(ips: readonly string[]): string {
  return ips.map((ip) => `list dest_ip '!${ip}'`).join('\n');
}
