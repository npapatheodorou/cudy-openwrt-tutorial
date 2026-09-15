<p align="center">
    <img src="./assets/icons/icon.svg" width="112" alt="Cudy + OpenWrt Tutorial icon"/>
</p>

# 🚀 Cudy + OpenWrt Tutorial

<p>
    <a href="https://cudy-openwrt-tutorial.vercel.app/"><img alt="Website" src="https://img.shields.io/badge/website-open%20the%20guide-0d9488?style=flat-square"></a>
    <a href="./firmware/"><img alt="Firmware packages" src="https://img.shields.io/badge/firmware-18%20packages-2563eb?style=flat-square"></a>
    <a href="./LICENSE"><img alt="MIT License" src="https://img.shields.io/badge/license-MIT-64748b?style=flat-square"></a>
</p>

This guide walks you through upgrading your **Cudy router** to
OpenWrt, enabling LuCI Web UI, blocking ads, setting up WireGuard VPN
(general steps and provider-specific instructions), and managing IPv6.

> 🌐 **Prefer a website?** The same guide is available at **[cudy-openwrt-tutorial.vercel.app](https://cudy-openwrt-tutorial.vercel.app/)**, with copy buttons, progress tracking, screenshot zoom and fill-in helpers for your Wi-Fi and WireGuard values.

# 🛒 Buying Suggestion
Buying Suggestion: Prefer the Cudy WR3000E over other WR3000 variants if you plan to install OpenWrt — it offers significantly more memory, supports Wi-Fi 6, and overall provides excellent value for money (VFM)

------------------------------------------------------------------------

## 📥 Step 1 --- Download Required Files

1.  **OpenWrt Firmware (without recovery TFTP):**
    Select the appropriate firmware according to your router’s model. [Download here](./firmware/)
    <details>
        <summary>📦 Firmware packages (18)</summary>

    | Model | Download | Size | Includes |
    | ----- | -------- | ---- | -------- |
    | **WR3000E V1** ⭐ Recommended | [WR3000E-V1.zip](./firmware/WR3000E-V1.zip) | 10.1 MB | Sysupgrade image |
    | WR3000 V1 | [WR3000-V1.zip](./firmware/WR3000-V1.zip) | 9.5 MB | Sysupgrade image · no TFTP recovery |
    | WR3000H V1 | [WR3000H-V1.zip](./firmware/WR3000H-V1.zip) | 10.1 MB | Sysupgrade image |
    | WR3000S V1 | [WR3000S-V1.zip](./firmware/WR3000S-V1.zip) | 10.1 MB | Sysupgrade image |
    | WR2100 V1 | [WR2100-V1.zip](./firmware/WR2100-V1.zip) | 17.4 MB | Flash image · TFTP recovery kit · developer files |
    | WR1300 V1 | [WR1300-V1.zip](./firmware/WR1300-V1.zip) | 21.6 MB | Flash image (OpenWrt 22.03.2) · TFTP recovery kit · developer files |
    | WR1300 V2 / V3 | [WR1300-V2-V3.zip](./firmware/WR1300-V2-V3.zip) | 10.2 MB | Flash image (OpenWrt 22.03.0) |
    | WR1300 V3.0 (update 2025-06-09) | [WR1300-V3.0-update-20250609.zip](./firmware/WR1300-V3.0-update-20250609.zip) | 7.0 MB | Flash image (OpenWrt 23.05.5) |
    | X6 V1 | [X6-V1.zip](./firmware/X6-V1.zip) | 19.3 MB | Flash image · TFTP recovery kit · developer files |
    | X6 V2 | [X6-V2.zip](./firmware/X6-V2.zip) | 21.4 MB | Flash image (OpenWrt 22.03) · TFTP recovery kit · developer files |
    | M1200 V1 | [M1200-V1.zip](./firmware/M1200-V1.zip) | 6.4 MB | Flash image · LAN/WAN ports may swap after flashing, so try both |
    | M1300 V2 | [M1300-V2.zip](./firmware/M1300-V2.zip) | 7.0 MB | Flash image |
    | M1800 V2 | [M1800-V2.zip](./firmware/M1800-V2.zip) | 21.6 MB | Flash image (OpenWrt 22.03.2) · TFTP recovery kit · developer files |
    | TR1200 V1 | [TR1200-V1.zip](./firmware/TR1200-V1.zip) | 6.0 MB | Flash image |
    | TR3000 V1 | [TR3000-V1.zip](./firmware/TR3000-V1.zip) | 10.1 MB | Sysupgrade image |
    | AP3000 Outdoor V1 | [AP3000-Outdoor-V1.zip](./firmware/AP3000-Outdoor-V1.zip) | 10.1 MB | Sysupgrade image |
    | RE3000 V1 | [RE3000-V1.zip](./firmware/RE3000-V1.zip) | 23.5 MB | Sysupgrade image · TFTP recovery kit |
    | R700 V1 | [R700-V1.zip](./firmware/R700-V1.zip) | 6.0 MB | Flash image |

    Verify your download against [SHA256SUMS.txt](./firmware/SHA256SUMS.txt).
    </details>

2.  **OpenWrt Firmware Finder (SNAPSHOT builds):**
    Select the firmware that matches your router’s model; ensure the version chosen is `SNAPSHOT`.
    <details>
        <summary><a href="https://firmware-selector.openwrt.org/">Download Here</a></summary>
        <p align="center">
            <img src="./assets/images/s1_2.png" width="800"/>
        </p>
    </details>

3.  **PuTTY (SSH client):**
    [Download PuTTY](https://www.putty.org/)

------------------------------------------------------------------------

## ⚡ Step 2 --- Flash OpenWrt

1.  Access router at `192.168.10.1` (Cudy's portal).
2.  <details>
        <summary>Upgrade the firmware using the OpenWrt image downloaded in Step 1.1.</summary>
        <p align="center">
            <img src="./assets/images/s2_1.png" width="800"/>
        </p>
    </details>
3.  After upgrade → visit
    `192.168.1.1 → System → Backup / Flash Firmware`.
4.  <details>
        <summary>Upload new file and start upgrade using the image download in Step 1.2.</summary>
        <p align="center">
            <img src="./assets/images/s2_4.png" width="800"/>
        </p>
    </details>
5.  Since the snapshot has no UI:
    -   Open **PuTTY** and connect to `192.168.1.1` via SSH.
    -   Login as `root` (no password first time).

------------------------------------------------------------------------

> If an error occurs at any stage of the process, you can simply SSH into the system and run `firstboot && reboot`

## 🖥️ Step 3 --- Install LuCI Web Interface

<!-- snippet: luci-install -->
```sh
apk update
apk add luci
apk add luci-ssl
/etc/init.d/uhttpd restart
uci set uhttpd.main.redirect_https=1
uci commit uhttpd
/etc/init.d/uhttpd restart
```

------------------------------------------------------------------------

<details>
<summary><span style="font-size:1.5em;font-weight:600">🐣 Beginners (Setup using Interface)</span></summary>

👉 After restart, log in at `192.168.1.1` via LuCI.
-   Set a new password for root.
-   Go to **Network → Interfaces → LAN**
    -   <details>
            <summary>Image Here</summary>
            <p align="center">
                <img src="./assets/images/s3_2.png" width="800"/>
            </p>
        </details>
    -   <details>
            <summary>Change IPv4 address → `192.168.2.1/24`</summary>
            <p align="center">
                <img src="./assets/images/bg3_2.png" width="800"/>
            </p>
        </details>
    -   **Save & Apply**


### 🛡️ Step 4 --- Adblock (network-wide ad/tracker blocking)

1.  Go to **System → Software**
    -   Update Lists
    -   Install: `adblock`, `luci-app-adblock`
    -   <details>
            <summary>Image Here</summary>
            <p align="center">
                <img src="./assets/images/s4_1.png" width="800"/>
            </p>
        </details>

2.  Configure via **Services → Adblock**:
    - **General Settings**
        -   ✔ TLD Compression
        -   ✔ DNS Report
        -   <details>
                <summary>Images Here</summary>
                <p align="center">
                    <img src="./assets/images/s4_2_1.png" width="800"/>
                </p>
            </details>
    - **Firewall Settings**
        -   Forced Zones → `@lan`, `@wan`, `@wan6`
        -   Forced Ports → `853`, `53`, `5353`
        -   <details>
                <summary>Images Here</summary>
                <p align="center">
                    <img src="./assets/images/s4_2_2.png" width="800"/>
                </p>
            </details>
    - **Advanced DNS Settings**
        - DNS Backend → `dnsmasq`
        - <details>
                <summary>Image Here</summary>
                <p align="center">
                    <img src="./assets/images/s4_2_3.png" width="800"/>
                </p>
            </details>
    - **Feed Selection**
        - Blocklist Feed → `adguard (L, general)`, `adguard_tracking (L, tracking)`, `android_tracking (S, tracking)`, `anti_ad (L, compilation)`, `certpl (L, phishing)`
        - <details>
                <summary>Image Here</summary>
                <p align="center">
                    <img src="./assets/images/s4_2_4.png" width="800"/>
                </p>
            </details>
3.  Restart **dnsmasq** from **System → Startup**.
    <details>
        <summary>Image Here</summary>
        <p align="center">
            <img src="./assets/images/s4_3_1.png" width="800"/>
        </p>
    </details>

------------------------------------------------------------------------

### 🔐 Step 5 --- WireGuard VPN client (route LAN through a VPN provider)

1.  Go to **System → Software**
    -   Update Lists
    -   Install: `luci-proto-wireguard`
    -   Reboot
2.  Go to **Network → Interfaces**
    -   Add new interface
    -   Name → `wg0`
    -   Protocol → **WireGuard VPN**
	-   Create interface
3.  Firewall Setup:
    -   Go to **Network → Firewall**
    -   Add Zone:
        -   Name → `vpn`
        -   ✔ IPv4 Masquerading
        -   ✔ MSS Clamping
        -   Covered Networks → `wg0`
		-   Allow forward from source zones → `lan`
    -   **Lan Forwarding**:
		-   Edit `lan` → Allow forward to destination zones → `wg0`
4.  Go again to **Network → Interfaces**
    -   Edit interface with Name → `wg0`
    -   Go to `Firewall Settings`
    -   Create / Assign firewall-zone → `vpn` (see step 2)
	-   **Save & Apply**
5.  Kill Switch Rule (Optional):
    -   Go to **Traffic Rules**
    -   Add Rule:
        -   Name → `vpn-killswitch`
        -   Source Zone → `lan`
        -   Destination Zone → `wan`
        -   Action → **drop**

------------------------------------------------------------------------

### 🌍 Step 5.2 --- VPN Provider Configuration
<details>
<summary><strong>🛰️ NordVPN</strong></summary>

1.  **Generate Credentials**
    -   Visit [Nord Account Access Tokens](https://my.nordaccount.com/dashboard/nordvpn/access-tokens/)
        → `Generate a token`.
    -   **Copy it**.
    -   <details>
            <summary>Image Here</summary>
            <p align="center">
                <img src="./assets/images/s5_2_1.png" width="800"/>
            </p>
        </details>
2.  **Find Your Recommended Server and Download Configuration**
    -   Visit [nordconf-wg](https://nordconf-wg.netlify.app/#private_key). The tool will automatically recommend the nearest server based on your current location.
    -   Paste your access token into the **NordVPN access token** field
    -   Generate and download the ``.conf`` configuration file.
3.  **Configure WireGuard**
    -   Go to **Network → Interfaces → wg0**
    -   Import your configuration file → **Load configuration...**
    -   In Peers → Edit → ✔ Route Allowed IPs
    -   **Save**

> If you'd rather get your NordLynx private key yourself, try the [NordVPN Private Key Extractor](#-extra-tools).

</details>

------------------------------------------------------------------------

</details>

<details>
<summary><span style="font-size:1.5em;font-weight:600">⚡ Advanced (Setup using SSH Connection)</span></summary>

👉 After restart, open **PuTTY** and connect to `192.168.1.1` via SSH
<!-- snippet: advanced-setup -->
```sh
# Set a new root password
passwd root
# Change IPv4 address to 192.168.2.1/24
uci set network.lan.ipaddr="192.168.2.1"
uci set network.lan.netmask='255.255.255.0'

# Set WiFi
uci set wireless.radio0.cell_density='0'
uci set wireless.default_radio0.ssid='<WIFI_NAME>'
uci set wireless.default_radio0.encryption='sae-mixed'
uci set wireless.default_radio0.key='<WIFI_PASS>'
uci set wireless.default_radio0.ocv='0'
uci delete wireless.default_radio0.disabled

uci set wireless.radio1.cell_density='0'
uci set wireless.default_radio1.ssid='<WIFI_NAME>'
uci set wireless.default_radio1.encryption='sae-mixed'
uci set wireless.default_radio1.key='<WIFI_PASS>'
uci set wireless.default_radio1.ocv='0'
uci delete wireless.default_radio1.disabled

uci commit wireless
uci commit network
wifi reload
/etc/init.d/network restart
```

<details>
<summary><span style="font-size:1.2em;font-weight:600">🛡️ Step 4 --- Adblock (network-wide ad/tracker blocking)</span></summary>

<!-- snippet: advanced-adblock -->
```sh
# 1. Install packages
apk add adblock luci-app-adblock banip luci-app-banip

# 2 & 3. Configure adblock
uci set adblock.global.adb_enabled='1'
uci set adblock.global.adb_report='1'
uci set adblock.global.adb_nftforce='1'
uci set adblock.global.adb_dns='dnsmasq'
uci set adblock.global.adb_fetchcmd='uclient-fetch'
uci set adblock.global.adb_nftdevforce='@lan' '@wan' '@wan6'
uci set adblock.global.adb_nftportforce='853' '53' '5353'
uci set adblock.global.adb_feed='adguard' 'adguard_tracking' 'android_tracking' 'anti_ad' 'certpl'
uci set adblock.global.adb_forcedns='1'
uci set adblock.global.adb_zonelist='wan lan'
uci set adblock.global.adb_portlist='53 853 5353'
uci set adblock.global.adb_tld='1'
uci set adblock.global.adb_fetchutil='uclient-fetch'

uci commit adblock

# 4. Make dnsmasq ignore /etc/resolv.conf
uci delete dhcp.@dnsmasq[0].server
uci set dhcp.@dnsmasq[0].noresolv='1'

uci add_list dhcp.@dnsmasq[0].server='9.9.9.9'
uci add_list dhcp.@dnsmasq[0].server='149.112.112.112'

uci commit dhcp
/etc/init.d/dnsmasq restart
/etc/init.d/adblock enable
/etc/init.d/adblock start

# 5. Block DoH bypass
uci set banip.global.ban_enabled='1'
uci set banip.global.ban_autodetect='1'
uci set banip.global.ban_protov4='1'
uci set banip.global.ban_protov6='1'
uci set banip.global.ban_logprerouting='0'
uci set banip.global.ban_logforwardwan='0'
uci set banip.global.ban_logforwardlan='0'
uci -q delete banip.global.ban_feed
uci set banip.doh=feed
uci set banip.doh.ban_fetchchain='outbound'

uci commit banip
service banip restart
```

</details>

------------------------------------------------------------------------

<details>
<summary><span style="font-size:1.2em;font-weight:600">🔐 Step 5 --- WireGuard VPN client (route LAN through a VPN provider)</span></summary>

1. Install the packages
    <!-- snippet: wg-install -->
    ```sh
    apk update
    apk add wireguard-tools kmod-wireguard luci-proto-wireguard luci-app-wireguard
    reboot
    ```

2. Assumption: you already have a WireGuard `.conf` file in hand. Standard format:
    <!-- snippet: wg-conf-example -->
    ```ini
    [Interface]
    PrivateKey = xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx=
    Address    = 10.64.0.2/32
    DNS        = 10.64.0.1
    
    [Peer]
    PublicKey  = yyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyy=
    Endpoint   = se-mma-wg-001.mullvad.net:51820
    AllowedIPs = 0.0.0.0/0, ::/0
    ```

    You'll copy five values out of that file:
 
    | Placeholder in the snippet | Source in your `.conf`        |
    | -------------------------- | ----------------------------- |
    | `<PRIVATE_KEY>`            | `[Interface] PrivateKey`      |
    | `<ADDRESS>`                | `[Interface] Address`         |
    | `<DNS>`                    | `[Interface] DNS`             |
    | `<PEER_PUBLIC_KEY>`        | `[Peer] PublicKey`            |
    | `<ENDPOINT_HOST>`          | host part of `[Peer] Endpoint`  (everything before `:51820`)|

    > 💡 On the [website](https://cudy-openwrt-tutorial.vercel.app/#advanced-step-5) you can paste your `.conf` and these placeholders fill in automatically (parsed locally in your browser).

    <!-- snippet: wg-interface -->
    ```sh
    # Interface
    uci set network.wg0=interface
    uci set network.wg0.proto='wireguard'
    uci set network.wg0.private_key='<PRIVATE_KEY>'
    uci -q delete network.wg0.addresses
    uci add_list network.wg0.addresses='<ADDRESS>'        
    uci -q delete network.wg0.dns
    uci add_list network.wg0.dns='<DNS>'
    
    uci set network.peer0=wireguard_wg0
    uci set network.peer0.description='VPN provider'
    uci set network.peer0.public_key='<PEER_PUBLIC_KEY>'
    uci set network.peer0.endpoint_host='<ENDPOINT_HOST>'
    uci set network.peer0.endpoint_port='51820'
    uci set network.peer0.route_allowed_ips='1'
    uci set network.peer0.persistent_keepalive='25'
    uci -q delete network.peer0.allowed_ips
    uci add_list network.peer0.allowed_ips='0.0.0.0/0'
    uci add_list network.peer0.allowed_ips='::/0'
    
    uci commit network
    /etc/init.d/network reload
    ```

3. Firewall (kill-switch style)
    One `vpn` zone for `wg0`, with masquerading. We also remove the default `lan → wan` forwarding so traffic *only* leaves through the VPN — if the tunnel drops, nothing leaks to your ISP.

    <!-- snippet: wg-firewall -->
    ```sh
    # Named VPN zone covering wg0
    uci set firewall.vpn=zone
    uci set firewall.vpn.name='vpn'
    uci set firewall.vpn.input='REJECT'
    uci set firewall.vpn.output='ACCEPT'
    uci set firewall.vpn.forward='REJECT'
    uci set firewall.vpn.masq='1'
    uci set firewall.vpn.mtu_fix='1'
    uci -q delete firewall.vpn.network
    uci add_list firewall.vpn.network='wg0'
    
    # Named forwarding lan -> vpn
    uci set firewall.lan_to_vpn=forwarding
    uci set firewall.lan_to_vpn.src='lan'
    uci set firewall.lan_to_vpn.dest='vpn'
    
    # KILL SWITCH: remove the default lan -> wan forwarding
    for fwd in $(uci -q show firewall | sed -n "s/^firewall\.\([^.]*\)=forwarding$/\1/p"); do
        src=$(uci -q get firewall."$fwd".src)
        dest=$(uci -q get firewall."$fwd".dest)
        if [ "$src" = "lan" ] && [ "$dest" = "wan" ]; then
            uci delete firewall."$fwd"
            break
        fi
    done
    
    uci commit firewall
    service firewall restart
    ```

    > **Don't want a kill switch?** Skip the loop that deletes `lan → wan`. With it left in place, if the VPN drops, traffic falls back to your regular ISP (privacy-leaking but no outages).

4.  **Fail-safe: a `killswitch` toggle script**

    The kill switch is great until your VPN config expires (looking at you, NordVPN), your provider has an outage, or you simply mistype an `Endpoint` and the LAN has no internet. You can always SSH into the router from LAN even when the kill switch is on — the router's own input policy isn't affected — so you'll never be fully locked out. But you want a one-line escape hatch.
 
    This script lets you flip the kill switch on and off without remembering UCI syntax in a panic:

    <!-- snippet: killswitch-script -->
    ```sh
    cat > /usr/bin/killswitch <<'EOF'
    #!/bin/sh
    # Toggle the VPN kill switch (lan -> wan forwarding) on or off.
    # Usage: killswitch {on|off|status}
    
    set -e
    
    find_fwd_lan_wan() {
        # Print the section id of the firewall.forwarding entry where src=lan, dest=wan
        for f in $(uci -q show firewall | sed -n "s/^firewall\.\([^.]*\)=forwarding$/\1/p"); do
            [ "$(uci -q get firewall."$f".src)"  = "lan" ] || continue
            [ "$(uci -q get firewall."$f".dest)" = "wan" ] || continue
            echo "$f"; return 0
        done
        return 1
    }
    
    case "$1" in
        off)
            # Restore lan -> wan so LAN reaches the internet directly again
            if find_fwd_lan_wan >/dev/null; then
                echo "Kill switch already OFF (lan -> wan forwarding exists)"
                exit 0
            fi
            uci set firewall.lan_to_wan=forwarding
            uci set firewall.lan_to_wan.src='lan'
            uci set firewall.lan_to_wan.dest='wan'
            uci commit firewall
            service firewall reload
            echo "Kill switch OFF — LAN now has direct internet (no VPN)."
            echo "Optional: 'ifdown wg0' to stop the tunnel entirely."
            ;;
        on)
            # Remove lan -> wan so LAN traffic only leaves via VPN
            f=$(find_fwd_lan_wan) || { echo "Kill switch already ON (no lan -> wan forwarding)"; exit 0; }
            uci delete firewall."$f"
            uci commit firewall
            service firewall reload
            echo "Kill switch ON — LAN traffic only exits through wg0."
            echo "Make sure 'ifup wg0' is up or LAN will have no internet."
            ;;
        status)
            if find_fwd_lan_wan >/dev/null; then
                echo "Kill switch: OFF (lan -> wan forwarding present)"
            else
                echo "Kill switch: ON  (no lan -> wan forwarding)"
            fi
            echo
            echo "wg0:"
            wg show wg0 2>/dev/null || echo "  (interface down or not configured)"
            ;;
        *)
            echo "Usage: killswitch {on|off|status}"
            exit 1
            ;;
    esac
    EOF
    chmod +x /usr/bin/killswitch
    ```

    Use it like this:
    <!-- snippet: killswitch-usage -->
    ```sh
    killswitch status     # see what state you're in
    killswitch off        # disable kill switch — LAN gets direct internet again
    killswitch on         # re-enable kill switch — LAN routes through wg0 only
    ```
    > Even with the kill switch ON and `wg0` down, the router itself can still reach the internet (the kill switch only governs *forwarded* traffic from LAN). That means you can `ssh root@192.168.1.1` from any LAN device, run `killswitch off`, fix your config, and re-enable. You're never truly locked out.

    **A more aggressive fail-safe (optional):** drop a copy of `killswitch off` as `/root/PANIC.sh` so you can run `sh /root/PANIC.sh` blindly:

    <!-- snippet: panic-script -->
    ```sh
    cat > /root/PANIC.sh <<'EOF'
    #!/bin/sh
    # Emergency: disable kill switch and bring wg0 down.
    /usr/bin/killswitch off
    ifdown wg0 2>/dev/null
    echo "Done. You should have normal internet now."
    EOF
    chmod +x /root/PANIC.sh
    ```
4. Verify
    
    Bring up the tunnel and check:
    <!-- snippet: wg-verify-handshake -->
    ```sh
    ifup wg0
    wg show
    # Look for `latest handshake: X seconds ago` — should appear within ~30s
    ```

    Confirm your external IP changed (from a LAN client, or from the router itself):
 
    <!-- snippet: wg-verify-ip -->
    ```sh
    curl ifconfig.co
    curl ifconfig.co/country
    ```

    Check for DNS leaks: <https://dnsleaktest.com> from a LAN client.
    > **NordVPN gotcha:** if the handshake never completes, the config may have expired (Nord rotates keys on manually-extracted configs) or the server may have stopped accepting manual WireGuard. Regenerate the config and try a different server hostname.

</details>

------------------------------------------------------------------------

<details>
<summary><span style="font-size:1.2em;font-weight:600">📄🔓 Step 5.1 --- VPN Whitelisting (Enable Policy-Based Routing)</span></summary>

1. **Install**
   <!-- snippet: pbr-install -->
   ```sh
   opkg update
   opkg install pbr luci-app-pbr
   service rpcd restart
   ```

2. **Enable PBR globally**
   <!-- snippet: pbr-enable -->
   ```sh
   uci set pbr.config.enabled='1'
   uci set pbr.config.strict_enforcement='1'   # drop traffic if a policy's interface is down (no silent fallback)
   uci set pbr.config.resolver_set='nft'       # use nftables (correct for fw4 / OpenWrt 22.03+)
   uci set pbr.config.verbosity='1'            # quieter logs once you trust the setup
   uci commit pbr
   service pbr enable
   service pbr restart
   ```
 
   > **About `strict_enforcement='1'`** — if a policy says "route through `wg0`" and `wg0` is down, the traffic is **dropped** instead of falling back to `wan`. This prevents accidental leaks when the VPN flaps. Set to `'0'` if you'd rather have fallback.

 
3. **Add a bypass policy (one per device or group)**
   3.1 — Bypass VPN by MAC address
   For a smart TV (`AA:BB:CC:DD:EE:FF`) that should use the regular ISP connection:
   <!-- snippet: pbr-bypass-mac -->
   ```sh
   uci set pbr.smart_tv=policy
   uci set pbr.smart_tv.name='Smart TV'
   uci set pbr.smart_tv.src_mac='AA:BB:CC:DD:EE:FF'
   uci set pbr.smart_tv.interface='wan'        # bypass VPN, exit via wan
   uci set pbr.smart_tv.enabled='1'
   uci commit pbr
   service pbr reload
   ```
 
   3.2 — Force a device ONLY through VPN
   For a work laptop (`11:22:33:44:55:66`) that must always use VPN, even if other devices don't:
   <!-- snippet: pbr-force-vpn -->
   ```sh
   uci set pbr.work_laptop=policy
   uci set pbr.work_laptop.name='Work Laptop'
   uci set pbr.work_laptop.src_mac='11:22:33:44:55:66'
   uci set pbr.work_laptop.interface='wg0'     # force through VPN
   uci set pbr.work_laptop.enabled='1'
   uci commit pbr
   service pbr reload
   ```
 
   3.3 — Bypass VPN for specific destination domains/IPs
   For banking sites that block known VPN exits — route them via `wan` for *all* LAN clients:
   <!-- snippet: pbr-bypass-domains -->
   ```sh
   uci set pbr.banking=policy
   uci set pbr.banking.name='Banking sites'
   uci set pbr.banking.dest_addr='chase.com paypal.com revolut.com'
   uci set pbr.banking.interface='wan'
   uci set pbr.banking.enabled='1'
   uci commit pbr
   service pbr reload
   ```
 
   3.4 — Bypass by source IP range
   For a VLAN, subnet, or specific static-IP device:
   <!-- snippet: pbr-bypass-ip-range -->
   ```sh
   uci set pbr.iot_subnet=policy
   uci set pbr.iot_subnet.name='IoT subnet'
   uci set pbr.iot_subnet.src_addr='192.168.1.100-192.168.1.150'
   uci set pbr.iot_subnet.interface='wan'
   uci set pbr.iot_subnet.enabled='1'
   uci commit pbr
   service pbr reload
   ```
 
   > `src_addr` accepts single IPs, ranges (`a-b`), or CIDR (`192.168.1.0/28`).
   3.5 — Bypass a single port (e.g. Steam, Plex)
   <!-- snippet: pbr-bypass-port -->
   ```sh
   uci set pbr.steam=policy
   uci set pbr.steam.name='Steam game traffic'
   uci set pbr.steam.proto='tcp udp'
   uci set pbr.steam.dest_port='27015 27036'
   uci set pbr.steam.interface='wan'
   uci set pbr.steam.enabled='1'
   uci commit pbr
   service pbr reload
   ```
 
   3.6 — Combine criteria
   Fields can be combined within a single policy. For example, *"this MAC, only for these ports, via VPN"*:
   <!-- snippet: pbr-combine -->
   ```sh
   uci set pbr.laptop_torrents=policy
   uci set pbr.laptop_torrents.name='Laptop torrents'
   uci set pbr.laptop_torrents.src_mac='11:22:33:44:55:66'
   uci set pbr.laptop_torrents.proto='tcp'
   uci set pbr.laptop_torrents.dest_port='6881-6889'
   uci set pbr.laptop_torrents.interface='wg0'
   uci set pbr.laptop_torrents.enabled='1'
   uci commit pbr
   service pbr reload
   ```
 
4. **List, edit, disable, delete policies**
   <!-- snippet: pbr-manage -->
   ```sh
   # List all policies
   uci show pbr | grep =policy
 
   # Disable a policy temporarily (without deleting)
   uci set pbr.smart_tv.enabled='0'
   uci commit pbr
   service pbr reload
 
   # Re-enable
   uci set pbr.smart_tv.enabled='1'
   uci commit pbr
   service pbr reload
 
   # Delete a policy
   uci delete pbr.smart_tv
   uci commit pbr
   service pbr reload
 
   # Check what PBR is actually doing
   service pbr status
 
   # Live routing table per interface
   ip rule show
   ip route show table wan
   ip route show table wg0
   ```

 
5. **Kill switch with MAC-based exemptions**
   If you want a kill switch that **doesn't lock out the bypassed devices**, the cleanest approach is a firewall traffic rule using the `!` (NOT) operator on the source MAC. PBR routes the smart TV via `wan`; the kill switch then has to permit that.
   > **Note:** UCI handles `!` natively — only the LuCI web UI strips that character, which is why most online guides tell you to edit `/etc/config/firewall` by hand. From the CLI we don't need that workaround.

   5.1 — Create the rule
   <!-- snippet: pbr-killswitch-rule -->
   ```sh
   # Named traffic rule: REJECT lan -> wan, UNLESS source MAC is exempted
   uci set firewall.vpn_killswitch=rule
   uci set firewall.vpn_killswitch.name='vpn-killswitch'
   uci set firewall.vpn_killswitch.src='lan'
   uci set firewall.vpn_killswitch.dest='wan'
   uci set firewall.vpn_killswitch.proto='all'
   uci set firewall.vpn_killswitch.target='REJECT'
   uci set firewall.vpn_killswitch.enabled='1'
 
   # The exemption list — devices that bypass the kill switch
   uci -q delete firewall.vpn_killswitch.src_mac
   uci add_list firewall.vpn_killswitch.src_mac='!AA:BB:CC:DD:EE:FF'   # smart TV
   # Add more exemptions as needed:
   # uci add_list firewall.vpn_killswitch.src_mac='!11:22:33:44:55:66'
 
   uci commit firewall
   service firewall restart
   ```
 
   The resulting `/etc/config/firewall` entry:
   <!-- snippet: pbr-killswitch-config -->
   ```
   config rule 'vpn_killswitch'
       option name 'vpn-killswitch'
       option src 'lan'
       option dest 'wan'
       option proto 'all'
       option target 'REJECT'
       option enabled '1'
       list src_mac '!AA:BB:CC:DD:EE:FF'
   ```
 
   5.2 — Adding / removing exemptions later
   <!-- snippet: pbr-killswitch-exemptions -->
   ```sh
   # Add another bypass MAC
   uci add_list firewall.vpn_killswitch.src_mac='!11:22:33:44:55:66'
   uci commit firewall
   service firewall restart
 
   # Remove a specific exemption
   uci -q del_list firewall.vpn_killswitch.src_mac='!11:22:33:44:55:66'
   uci commit firewall
   service firewall restart
 
   # Disable kill switch temporarily (e.g. troubleshooting)
   uci set firewall.vpn_killswitch.enabled='0'
   uci commit firewall
   service firewall reload
   ```

   > 🧰 Lots of IPs to exempt? The [PBR Firewall Exceptions Generator](#-extra-tools) writes the policy blocks and `!IP` lines for you.
 
6. **Verification**
   <!-- snippet: pbr-verify -->
   ```sh
   # Status
   service pbr status
   ip rule show
   ip route show table wan
   ip route show table wg0
   uci show pbr
   uci show firewall.vpn_killswitch
 
   # Reload after changes
   service pbr reload
   service firewall reload     # or `restart` for bigger changes
 
   # Disable PBR entirely (without uninstalling)
   uci set pbr.config.enabled='0'
   uci commit pbr
   service pbr restart
   ```

</details>

------------------------------------------------------------------------

<details>
<summary><span style="font-size:1.2em;font-weight:600">🌐 Step 6 --- Manage IPv6</span></summary>

<details>
<summary><strong>Disable IPv6</strong></summary>

1.  Remove WAN6 interface entirely
    <!-- snippet: ipv6-disable-wan6 -->
    ``` bash
    uci delete network.wan6
    ```
2.  Disable IPv6 on LAN
    <!-- snippet: ipv6-disable-lan -->
    ``` bash
    uci set network.lan.ipv6='0'
    uci set network.lan.delegate='0'
    uci set dhcp.lan.dhcpv6='disabled'
    uci set dhcp.lan.ra='disabled'
    ```
3.  Commit changes
4.  Disable odhcpd (not needed without IPv6)
    <!-- snippet: ipv6-disable-odhcpd -->
    ``` bash
    /etc/init.d/odhcpd disable
    /etc/init.d/odhcpd stop
    ```
5.  **Optional:** Kernel-Level Disable
    <!-- snippet: ipv6-disable-kernel -->
    ``` bash
    cat >> /etc/sysctl.conf << 'EOF'
    net.ipv6.conf.all.disable_ipv6=1
    net.ipv6.conf.default.disable_ipv6=1
    EOF
    sysctl -p
    ```
6.  Restart network
    <!-- snippet: ipv6-disable-restart -->
    ``` bash
    /etc/init.d/network restart
    ```
</details>

<details>
<summary><strong>Enable IPv6</strong></summary>

1.  Create WAN6 interface
    <!-- snippet: ipv6-enable-wan6 -->
    ``` bash
    uci set network.wan6=interface
    uci set network.wan6.proto='dhcpv6'
    uci set network.wan6.device='@wan'
    ```
2.  Enable IPv6 on LAN
    <!-- snippet: ipv6-enable-lan -->
    ``` bash
    uci set network.lan.ipv6='1'
    uci set network.lan.delegate='1'
    uci set dhcp.lan.dhcpv6='server'
    uci set dhcp.lan.ra='server'
    ```
3.  Commit changes
    <!-- snippet: ipv6-enable-commit -->
    ``` bash
    uci commit
    ```
4.  Enable odhcpd
    <!-- snippet: ipv6-enable-odhcpd -->
    ``` bash
    /etc/init.d/odhcpd enable
    /etc/init.d/odhcpd start
    ```
5.  **Optional:** Remove Kernel-Level Disable (if previously added)
    <!-- snippet: ipv6-enable-kernel -->
    ``` bash
    sed -i '/net.ipv6.conf.all.disable_ipv6/d' /etc/sysctl.conf
    sed -i '/net.ipv6.conf.default.disable_ipv6/d' /etc/sysctl.conf
    sysctl -w net.ipv6.conf.all.disable_ipv6=0
    sysctl -w net.ipv6.conf.default.disable_ipv6=0
    ```
6.  Restart network
    <!-- snippet: ipv6-enable-restart -->
    ``` bash
    /etc/init.d/network restart
    ```

</details>

</details>
</details>

## 🎉 Done!

You now have:
- ✅ OpenWrt installed
- ✅ LuCI Web UI
- ✅ Adblock filtering
- ✅ WireGuard VPN (general + NordVPN setup)
- ✅ IPv6 control

------------------------------------------------------------------------

## 🧰 Extra Tools

### 🔑 NordVPN Private Key Extractor
[`tools/nordvpn_priv_key_extractor.ps1`](./tools/nordvpn_priv_key_extractor.ps1) · [`.exe`](./tools/nordvpn_priv_key_extractor.exe)

Asks for your NordVPN access token (masked input) and queries NordVPN's credentials API to print your service username, password and NordLynx (WireGuard) private key.

<!-- snippet: tool-nordvpn-run -->
```powershell
powershell -ExecutionPolicy Bypass -File .\nordvpn_priv_key_extractor.ps1
```

> The `.exe` is unsigned, so Windows SmartScreen may warn you. Prefer the `.ps1` if you want to read the code before running it.

### 🧭 PBR Firewall Exceptions Generator
[`tools/pbr_firewall_exceptions_gen.py`](./tools/pbr_firewall_exceptions_gen.py)

Paste IPs (one per line, or separated by commas/spaces) and get `config policy` blocks that route each one via `wan`, plus `list dest_ip '!IP'` lines for your kill-switch rule (Step 5.1).

<!-- snippet: tool-pbr-run -->
```sh
python3 pbr_firewall_exceptions_gen.py
```

Paste the IPs into the terminal, then press Enter on an empty line. An in-browser version is available on the [website](https://cudy-openwrt-tutorial.vercel.app/#pbr-generator).

### 🛡️ Firmware checksums
[`firmware/SHA256SUMS.txt`](./firmware/SHA256SUMS.txt)

Before you flash, make sure the zip downloaded intact. Compute its SHA-256 and compare it with the value in `SHA256SUMS.txt`.

<!-- snippet: tool-checksums -->
```shell
# Windows (PowerShell)
Get-FileHash .\WR3000E-V1.zip -Algorithm SHA256

# Linux / macOS
shasum -a 256 WR3000E-V1.zip
```

------------------------------------------------------------------------

## 📁 Repository Layout

| Path | Contents |
| ---- | -------- |
| [`firmware/`](./firmware/) | Cudy intermediary OpenWrt firmware packages + `SHA256SUMS.txt` |
| [`tools/`](./tools/) | NordVPN key extractor and PBR exceptions generator |
| [`assets/images/`](./assets/images/) | Guide screenshots |
| [`assets/icons/`](./assets/icons/) | App icon, favicons and social preview |
| [`src/`](./src/), [`index.html`](./index.html) | Website (React + TypeScript + Vite), deployed on Vercel |

**Website development:** run `npm install`, then `npm run dev`. Every command block on the website is read straight from this README through the invisible `<!-- snippet: … -->` markers, so edit commands here and the site follows. `npm test` checks that the README, the website and the firmware checksums stay in sync.

------------------------------------------------------------------------

⚠️ **Disclaimer:** Use this at your own risk. Flashing firmware may void
warranty or brick your device.
