import { describe, expect, it } from 'vitest';
import { wifiIssues } from './wifi';

describe('wifiIssues', () => {
  it('accepts a normal name and password', () => {
    expect(wifiIssues('MyHome', 'correct horse battery')).toEqual([]);
  });

  it('accepts empty fields while the user has not typed yet', () => {
    expect(wifiIssues('', '')).toEqual([]);
  });

  it('flags single quotes, short passwords and long names', () => {
    expect(wifiIssues("Bob's wifi", 'short')).toHaveLength(2);
    expect(wifiIssues('x'.repeat(33), 'longenough')).toEqual(['Wi-Fi names are limited to 32 bytes.']);
  });

  it('counts SSID length in bytes, not characters', () => {
    expect(wifiIssues('Ω'.repeat(17), 'longenough')).toHaveLength(1);
  });
});
