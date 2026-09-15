export type GuidePath = 'beginner' | 'advanced';

export interface StepMeta {
  id: string;
  badge: string;
  label: string;
}

export const COMMON_STEPS: StepMeta[] = [
  { id: 'step-1', badge: '1', label: 'Download required files' },
  { id: 'step-2', badge: '2', label: 'Flash OpenWrt' },
  { id: 'step-3', badge: '3', label: 'Install LuCI web interface' },
];

export const PATH_STEPS: Record<GuidePath, StepMeta[]> = {
  beginner: [
    { id: 'beginner-setup', badge: 'B', label: 'First login & LAN address' },
    { id: 'beginner-step-4', badge: '4', label: 'Adblock' },
    { id: 'beginner-step-5', badge: '5', label: 'WireGuard VPN client' },
    { id: 'beginner-step-5-2', badge: '5.2', label: 'VPN provider configuration' },
  ],
  advanced: [
    { id: 'advanced-setup', badge: 'A', label: 'Password, LAN & Wi-Fi' },
    { id: 'advanced-step-4', badge: '4', label: 'Adblock' },
    { id: 'advanced-step-5', badge: '5', label: 'WireGuard VPN client' },
    { id: 'advanced-step-5-1', badge: '5.1', label: 'VPN whitelisting (PBR)' },
    { id: 'advanced-step-6', badge: '6', label: 'Manage IPv6' },
  ],
};

export const PATHS: Record<GuidePath, { emoji: string; title: string; subtitle: string }> = {
  beginner: { emoji: '🐣', title: 'Beginners', subtitle: 'Setup using Interface' },
  advanced: { emoji: '⚡', title: 'Advanced', subtitle: 'Setup using SSH Connection' },
};

export const ALL_STEP_IDS: string[] = [...COMMON_STEPS, ...PATH_STEPS.beginner, ...PATH_STEPS.advanced].map((s) => s.id);

export const isGuidePath = (value: string | null): value is GuidePath => value === 'beginner' || value === 'advanced';

/** Which path a section id belongs to, if it lives inside one of the two paths. */
export function pathForId(id: string): GuidePath | undefined {
  if (id.startsWith('beginner-')) return 'beginner';
  if (id.startsWith('advanced-')) return 'advanced';
  return undefined;
}
