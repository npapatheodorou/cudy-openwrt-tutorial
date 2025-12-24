# 🚀 Cudy + OpenWrt Tutorial

This guide walks you through upgrading your **Cudy router** to
OpenWrt, enabling LuCI Web UI, blocking ads, setting up WireGuard VPN
(general steps and provider-specific instructions), and managing IPv6.

# 🛒 Buying Suggestion
Buying Suggestion: Prefer the Cudy WR3000E over other WR3000 variants if you plan to install OpenWrt — it offers significantly more memory, supports Wi-Fi 6, and overall provides excellent value for money (VFM)

------------------------------------------------------------------------

## 📥 Step 1 --- Download Required Files

1.  **OpenWrt Firmware (without recovery TFTP):**
    [Download
    here](https://drive.google.com/drive/folders/1BKVarlwlNxf7uJUtRhuMGUqeCa5KpMnj?usp=sharing)

2.  **OpenWrt Firmware Finder (SNAPSHOT builds):**
    [Visit firmware selector](https://firmware-selector.openwrt.org/)

3.  **PuTTY (SSH client):**
    [Download PuTTY](https://www.putty.org/)

------------------------------------------------------------------------

## ⚡ Step 2 --- Flash OpenWrt

1.  Access router at `192.168.10.1` (Cudy's portal).
2.  Upgrade firmware with the OpenWrt image.
3.  After upgrade → go to
    `192.168.1.1 → System → Backup / Flash Firmware`.
4.  Upload new file and start upgrade.
5.  Since the snapshot has no UI:
    -   Open **PuTTY** and connect to `192.168.1.1` via SSH.
    -   Login as `root` (no password first time).

------------------------------------------------------------------------

## 🖥️ Step 3 --- Install LuCI Web Interface

``` bash
apk update
apk add luci
apk add luci-ssl
/etc/init.d/uhttpd restart
uci set uhttpd.main.redirect_https=1
uci commit uhttpd
service uhttpd reload
```

👉 After restart, log in at `192.168.1.1` via LuCI.

-   Set a new password for root.
-   Go to **Network → Interfaces → LAN**
    -   Change IPv4 address → `192.168.2.1/24`
    -   **Save & Apply**

------------------------------------------------------------------------

## 🛡️ Step 4 --- Block Ads (Adblock Plugin)

1.  Go to **System → Software**
    -   Update Lists
    -   Install: `adblock`, `luci-app-adblock` and `stubby`
2.  Configure via **Services → Adblock**:
    -   ✔ Force Local DNS
    -   ✔ Forced Zones → WAN & LAN
    -   ✔ Forced Ports → all
    -   ✔ TLD Compression
    -   ✔ DNS Report
3.  Additional settings:
    -   Download Utility → `uclient-fetch`
    -   DNS Backend → `dnsmasq`
    -   Feed Selection → `android_tracking`, `anti_ad` and `smarttv_tracking`
4.  Go to **Network → DNS** 
    - **Forwards → DNS Forwards** → `127.0.0.1#5453` and `0::1#5453`
    - **Resolv & Hosts Files → Ignore resolv file** `✔`
5.  Restart **dnsmasq** from **System → Startup**.

------------------------------------------------------------------------

## 🔐 Step 5 --- VPN Setup (General)

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

## 🌍 Step 5.1.1 --- NordVPN Setup (Provider-Specific)

1.  **Generate Credentials**
    -   Go to [Nord Account Access
        Tokens](https://my.nordaccount.com/dashboard/nordvpn/access-tokens/)
        → Generate a token.
    -   Use [Nord Key Generator](https://wg-nord.pages.dev/key) or the
        provided PowerShell script `./wireguard.ps1` to generate a **private key**.
2.  **Find Your Recommended Server**
    -   Go to [NordVPN Manual
        Configuration](https://my.nordaccount.com/dashboard/nordvpn/manual-configuration/server-recommendation/).
3.  **Download Configuration**
    -   From [Nord Key Generator](https://wg-nord.pages.dev/)
    -   Open the downloaded `.conf` file and insert your **private
        key**.
4.  **Configure WireGuard**
    -   Go to **Network → Interfaces → wg0**
    -   Import your configuration file → **Load configuration...**
    -   In Peers → Edit → ✔ Route Allowed IPs
    -   **Save**

------------------------------------------------------------------------

## 📄🔓 Step 5.2 --- VPN Whitelisting (Enable Policy-Based Routing)

1.  Go to **System → Software**
    -   Update Lists
    -   Install: `luci-app-pbr`

2.  Go to **Services → Policy-Based Routing**
    -   Under “Policies,” click Add for each device you want to bypass the VPN
        -   Name: any description, e.g. `Smart TV`
        -   Source MAC address: `AA:BB:CC:DD:EE:FF`
        -   Interface: `wan`
        -   **Leave others blank**

3.  Kill Switch Rule (If enabled -- Optional)
    -   Go to **Network → Firewall → Traffic Rules**
    -   Edit your rule named `vpn-killswitch`
    -   Under Advanced Settings:
    -   Find Source MAC address
    -   Add `36:17:CD:F0:FF:FC`
        - To use the “!” (NOT) operator in the killswitch rule, we need to edit the firewall configuration file directly via SSH, since LuCI sanitizes that character out
            -   ``ssh root@192.168.2.1``
            -   ``vi /etc/config/firewall``
            -   Locate your ``vpn-killswitch`` rule and find the line starting with ``list src_mac``
                -   Press ``i`` to enter ``insert mode``, then add “!” before your MAC address.
                -   ``list src_mac '!36:17:CD:F0:FF:FC'``
                -   Press ``Esc``, then type ``:wq`` and hit ``Enter`` to save and exit.
                -   Restart the firewall to apply changes: ``/etc/init.d/firewall restart``
    -   Click **Save & Apply**

------------------------------------------------------------------------

## 🌐 Step 6 --- Manage IPv6

### Disable IPv6
1.  Remove WAN6 interface entirely
    ``` bash
    uci delete network.wan6
    ```
2.  Disable IPv6 on LAN
    ``` bash
    uci set network.lan.ipv6='0'
    uci set network.lan.delegate='0'
    uci set dhcp.lan.dhcpv6='disabled'
    uci set dhcp.lan.ra='disabled'
    ```
3.  Commit changes
4.  Disable odhcpd (not needed without IPv6)
    ``` bash
    /etc/init.d/odhcpd disable
    /etc/init.d/odhcpd stop
    ```
5.  **Optional:** Kernel-Level Disable
    ``` bash
    cat >> /etc/sysctl.conf << 'EOF'
    net.ipv6.conf.all.disable_ipv6=1
    net.ipv6.conf.default.disable_ipv6=1
    EOF
    sysctl -p
    ```
6.  Restart network
    ``` bash
    /etc/init.d/network restart
    ```

### Enable IPv6
1.  Create WAN6 interface
    ``` bash
    uci set network.wan6=interface
    uci set network.wan6.proto='dhcpv6'
    uci set network.wan6.device='@wan'
    ```
2.  Enable IPv6 on LAN
    ``` bash
    uci set network.lan.ipv6='1'
    uci set network.lan.delegate='1'
    uci set dhcp.lan.dhcpv6='server'
    uci set dhcp.lan.ra='server'
    ```
3.  Commit changes
    ``` bash
    uci commit
    ```
4.  Enable odhcpd
    ``` bash
    /etc/init.d/odhcpd enable
    /etc/init.d/odhcpd start
    ```
5.  **Optional:** Remove Kernel-Level Disable (if previously added)
    ``` bash
    sed -i '/net.ipv6.conf.all.disable_ipv6/d' /etc/sysctl.conf
    sed -i '/net.ipv6.conf.default.disable_ipv6/d' /etc/sysctl.conf
    sysctl -w net.ipv6.conf.all.disable_ipv6=0
    sysctl -w net.ipv6.conf.default.disable_ipv6=0
    ```
6.  Restart network
    ``` bash
    /etc/init.d/network restart
    ```
------------------------------------------------------------------------

## 🎉 Done!

You now have:
✅ OpenWrt installed
✅ LuCI Web UI
✅ Adblock filtering
✅ WireGuard VPN (general + NordVPN setup)
✅ IPv6 control

------------------------------------------------------------------------

⚠️ **Disclaimer:** Use this at your own risk. Flashing firmware may void
warranty or brick your device.
