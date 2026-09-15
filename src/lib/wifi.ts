/** Problems that would make the README's Wi-Fi `uci` commands fail or be rejected. */
export function wifiIssues(name: string, password: string): string[] {
  const issues: string[] = [];
  if (name.includes("'") || password.includes("'")) {
    issues.push("Avoid single quotes (') — they break the uci command quoting.");
  }
  if (password && password.length < 8) issues.push('Wi-Fi passwords need at least 8 characters.');
  if (password.length > 63) issues.push('Wi-Fi passwords can be at most 63 characters.');
  if (new TextEncoder().encode(name).length > 32) issues.push('Wi-Fi names are limited to 32 bytes.');
  return issues;
}
