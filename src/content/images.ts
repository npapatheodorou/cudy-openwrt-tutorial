export interface GuideImage {
  /** File name inside `assets/images/`. */
  file: string;
  width: number;
  height: number;
  /** Short label shown on the collapsed screenshot. */
  label: string;
  alt: string;
}

export const IMAGES = {
  firmwareSelector: {
    file: 's1_2.png',
    width: 1103,
    height: 690,
    label: 'Firmware Selector: pick your model, choose SNAPSHOT, download SYSUPGRADE',
    alt: 'OpenWrt Firmware Selector: type the model (Cudy WR3000 v1), select SNAPSHOT, then click SYSUPGRADE',
  },
  cudyUpgrade: {
    file: 's2_1.png',
    width: 1252,
    height: 643,
    label: 'Cudy portal: firmware upgrade page',
    alt: 'Cudy web portal at 192.168.10.1: General Settings, then Firmware, then browse for the local firmware file',
  },
  flashImage: {
    file: 's2_4.png',
    width: 1398,
    height: 846,
    label: 'OpenWrt: System → Backup / Flash Firmware → Flash image',
    alt: 'OpenWrt System menu, Backup / Flash Firmware, then the Flash image button under Flash new firmware image',
  },
  interfacesLan: {
    file: 's3_2.png',
    width: 1392,
    height: 679,
    label: 'Network → Interfaces → Edit on lan',
    alt: 'LuCI Network menu, Interfaces, then the Edit button on the lan interface',
  },
  lanAddress: {
    file: 'bg3_2.png',
    width: 1029,
    height: 941,
    label: 'Set IPv4 address 192.168.2.1 and netmask 255.255.255.0',
    alt: 'Interfaces » lan dialog: IPv4 address 192.168.2.1 and IPv4 netmask 255.255.255.0',
  },
  software: {
    file: 's4_1.png',
    width: 1080,
    height: 232,
    label: 'System → Software → Update lists, then filter & install',
    alt: 'LuCI Software page: Update lists button and the package filter box',
  },
  adblockGeneral: {
    file: 's4_2_1.png',
    width: 1159,
    height: 899,
    label: 'General Settings',
    alt: 'Adblock General Settings tab with TLD Compression and DNS Report checked',
  },
  adblockFirewall: {
    file: 's4_2_2.png',
    width: 1137,
    height: 557,
    label: 'Firewall Settings',
    alt: 'Adblock Firewall Settings tab: Force Local DNS on, forced devices @lan @wan @wan6, forced ports 853, 53, 5353',
  },
  adblockDns: {
    file: 's4_2_3.png',
    width: 1011,
    height: 214,
    label: 'Advanced DNS Settings',
    alt: 'Adblock Advanced DNS Settings tab with DNS Backend set to dnsmasq',
  },
  adblockFeeds: {
    file: 's4_2_4.png',
    width: 1100,
    height: 437,
    label: 'Feed Selection',
    alt: 'Adblock Feed Selection tab with adguard, adguard_tracking, android_tracking, anti_ad and certpl selected',
  },
  restartDnsmasq: {
    file: 's4_3_1.png',
    width: 1134,
    height: 319,
    label: 'System → Startup → Restart dnsmasq',
    alt: 'LuCI System, Startup page with the Restart button for dnsmasq',
  },
  nordAccessToken: {
    file: 's5_2_1.png',
    width: 1167,
    height: 370,
    label: 'Nord Account → NordVPN → Access token',
    alt: 'Nord Account dashboard, NordVPN, Access token page with the Get Access token link',
  },
} satisfies Record<string, GuideImage>;
