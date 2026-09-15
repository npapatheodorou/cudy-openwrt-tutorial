export type FirmwareSeries = 'wr' | 'x6' | 'mesh' | 'travel' | 'other';

export type FirmwareContent = 'sysupgrade' | 'flash' | 'recovery' | 'developer' | 'no-recovery';

export interface FirmwarePackage {
  model: string;
  /** File name inside `firmware/`. */
  file: string;
  bytes: number;
  sha256: string;
  series: FirmwareSeries;
  contents: FirmwareContent[];
  /** OpenWrt base version, when the image name states it. */
  openwrt?: string;
  recommended?: boolean;
  badge?: string;
  note?: string;
  keywords?: string;
}

export const SERIES_FILTERS: { id: FirmwareSeries | 'all'; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'wr', label: 'WR' },
  { id: 'x6', label: 'X6' },
  { id: 'mesh', label: 'Mesh (M)' },
  { id: 'travel', label: 'Travel (TR)' },
  { id: 'other', label: 'AP · RE · R' },
];

export const CONTENT_LABELS: Record<FirmwareContent, { label: string; tone?: 'blue' | 'warn' }> = {
  sysupgrade: { label: 'Sysupgrade image' },
  flash: { label: 'Flash image' },
  recovery: { label: 'TFTP recovery kit', tone: 'blue' },
  developer: { label: 'Developer files' },
  'no-recovery': { label: 'No TFTP recovery', tone: 'warn' },
};

export const FIRMWARE: FirmwarePackage[] = [
  {
    model: 'WR3000E V1',
    file: 'WR3000E-V1.zip',
    bytes: 10132042,
    sha256: '833854ba7136ca18910c0474270c289ab94d4ebd6f4fbf77060d12bda3273cf2',
    series: 'wr',
    contents: ['sysupgrade'],
    recommended: true,
    keywords: 'recommended wifi 6',
  },
  {
    model: 'WR3000 V1',
    file: 'WR3000-V1.zip',
    bytes: 9515597,
    sha256: '7ce5a5ec2008251a43ac8d446e14391cdfb672807bc2c2a1d7905cc53f94693e',
    series: 'wr',
    contents: ['sysupgrade', 'no-recovery'],
    keywords: 'without recovery tftp',
  },
  {
    model: 'WR3000H V1',
    file: 'WR3000H-V1.zip',
    bytes: 10132056,
    sha256: '06b604940c802548f893831608fcca1f92e33c1ac7c3d3e6f833fa5fd5980a57',
    series: 'wr',
    contents: ['sysupgrade'],
  },
  {
    model: 'WR3000S V1',
    file: 'WR3000S-V1.zip',
    bytes: 10131876,
    sha256: 'd869463d47df515ef02283bcbee2c56c6d59e52ce1f8dcb741d7c52519516429',
    series: 'wr',
    contents: ['sysupgrade'],
  },
  {
    model: 'WR2100 V1',
    file: 'WR2100-V1.zip',
    bytes: 17397101,
    sha256: 'd583dbd23698fa110b64056332ff5aaeff0df0d15807bd2643ae20989aebd8ed',
    series: 'wr',
    contents: ['flash', 'recovery', 'developer'],
  },
  {
    model: 'WR1300 V1',
    file: 'WR1300-V1.zip',
    bytes: 21594302,
    sha256: '3be9190a1ea870d7024895a3fde67b6d96cbc239b2a45f48be704be2e97d0172',
    series: 'wr',
    contents: ['flash', 'recovery', 'developer'],
    openwrt: '22.03.2',
  },
  {
    model: 'WR1300 V2 / V3',
    file: 'WR1300-V2-V3.zip',
    bytes: 10202983,
    sha256: 'b5a9a2aeeea37c9df79fe3521c506a549c77a102c443a47b86d3adefca9844ca',
    series: 'wr',
    contents: ['flash'],
    openwrt: '22.03.0',
  },
  {
    model: 'WR1300 V3.0',
    file: 'WR1300-V3.0-update-20250609.zip',
    bytes: 7019669,
    sha256: '7a4f25fae9a6991f3c5b35b354c0fade05563a3fbdec00b0597d696085ffac59',
    series: 'wr',
    contents: ['flash'],
    openwrt: '23.05.5',
    badge: 'Update 2025-06-09',
    keywords: 'v3 update 20250609',
  },
  {
    model: 'X6 V1',
    file: 'X6-V1.zip',
    bytes: 19325214,
    sha256: '202fe9a98d116b180db8f13a16a845c9c4c054d8f5a2408599b4ad99ff866cb6',
    series: 'x6',
    contents: ['flash', 'recovery', 'developer'],
  },
  {
    model: 'X6 V2',
    file: 'X6-V2.zip',
    bytes: 21365617,
    sha256: 'e1d6d151993cad7b2e8e242defea00aefdb14b638502bd86181d82576185587a',
    series: 'x6',
    contents: ['flash', 'recovery', 'developer'],
    openwrt: '22.03',
  },
  {
    model: 'M1200 V1',
    file: 'M1200-V1.zip',
    bytes: 6390109,
    sha256: 'a7e3d86ac92cf926c7891aabf77737edd82be01e9d9f3f461a5bb54728fd9505',
    series: 'mesh',
    contents: ['flash'],
    note: 'The LAN/WAN ports may swap after flashing. LAN is the upper port on the intermediate firmware and the lower port on the final OpenWrt firmware, so try both.',
  },
  {
    model: 'M1300 V2',
    file: 'M1300-V2.zip',
    bytes: 7021306,
    sha256: '226ea49ac1c5c60d4e784a4310b4dd7aa6117864e6e110145b54da8d6d3a251b',
    series: 'mesh',
    contents: ['flash'],
  },
  {
    model: 'M1800 V2',
    file: 'M1800-V2.zip',
    bytes: 21616045,
    sha256: 'c2d2eaa960d68cdf4e6a91c30511c9a00c4ef167271f9cca8d914fed3bd32105',
    series: 'mesh',
    contents: ['flash', 'recovery', 'developer'],
    openwrt: '22.03.2',
  },
  {
    model: 'TR1200 V1',
    file: 'TR1200-V1.zip',
    bytes: 5974935,
    sha256: '2208375f901c4987e1f4fa3ee0b1260ab3faa2fe54e1eda5a7eab13235a55887',
    series: 'travel',
    contents: ['flash'],
  },
  {
    model: 'TR3000 V1',
    file: 'TR3000-V1.zip',
    bytes: 10131624,
    sha256: '0875334895cb35c5bbc3195093b24f0d552b6d94fd3361d24e1661b85d91047b',
    series: 'travel',
    contents: ['sysupgrade'],
  },
  {
    model: 'AP3000 Outdoor V1',
    file: 'AP3000-Outdoor-V1.zip',
    bytes: 10132512,
    sha256: 'c9c54a83b194a694edd01435b65b5aca141b3a218634b796492611bd6c7ee013',
    series: 'other',
    contents: ['sysupgrade'],
    keywords: 'access point',
  },
  {
    model: 'RE3000 V1',
    file: 'RE3000-V1.zip',
    bytes: 23471777,
    sha256: '311a8acf404f6337d564cbbe8a8811d706440ea748b3d63b8dbd4827b4b4dcd2',
    series: 'other',
    contents: ['sysupgrade', 'recovery'],
    keywords: 'range extender',
  },
  {
    model: 'R700 V1',
    file: 'R700-V1.zip',
    bytes: 5984475,
    sha256: '9cfbab2fe25885079957483e811a917ec955633bd73450baf1877b5932cb350c',
    series: 'other',
    contents: ['flash'],
  },
];

export const formatSize = (bytes: number): string => `${(bytes / 1_000_000).toFixed(1)} MB`;

export const shortHash = (sha256: string): string => `${sha256.slice(0, 8)}…${sha256.slice(-4)}`;

export function contentLabel(pkg: FirmwarePackage, content: FirmwareContent): string {
  const { label } = CONTENT_LABELS[content];
  return content === 'flash' || content === 'sysupgrade'
    ? pkg.openwrt ? `${label} (OpenWrt ${pkg.openwrt})` : label
    : label;
}

/** Lower-cased text the download search matches against. */
export function searchText(pkg: FirmwarePackage): string {
  return [pkg.model, pkg.file, pkg.openwrt, pkg.badge, pkg.keywords, ...pkg.contents]
    .filter(Boolean)
    .join(' ')
    .toLowerCase()
    .replace(/[_+\-/.]+/g, ' ');
}
