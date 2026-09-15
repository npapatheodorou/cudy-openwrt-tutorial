#!/usr/bin/env python3
# generate_policies_interactive.py
# Paste IPs (one per line). Finish by entering an empty line (or EOF).
# Run in VS Code: press Run, paste the IPs into the terminal, then press Enter on an empty line.

def read_ips_from_input(prompt="Paste IPs (one per line). End with an empty line):\n"):
    print(prompt)
    ips = []
    try:
        while True:
            line = input().strip()
            # stop on empty line
            if line == "":
                break
            # allow comma-separated or space-separated input on a single line
            # split and extend
            parts = [p.strip() for p in line.replace(',', ' ').split() if p.strip()]
            ips.extend(parts)
    except EOFError:
        # user sent EOF (Ctrl+D / Ctrl+Z)
        pass
    return ips

def generate_policy_block(ip: str) -> str:
    return (
        "config policy\n"
        f"\toption name '{ip}'\n"
        f"\toption dest_addr '{ip}'\n"
        "\toption interface 'wan'\n"
    )

def generate_firewall_block(ip: str) -> str:
    return (f"list dest_ip '!{ip}'\n")

def main():
    ips = read_ips_from_input()
    # filter out any empty items and duplicates while keeping order
    seen = set()
    cleaned = []
    for ip in ips:
        if not ip:
            continue
        if ip in seen:
            continue
        seen.add(ip)
        cleaned.append(ip)

    if not cleaned:
        print("\nNo IPs entered. Exiting.")
        return

    # print blocks separated by a blank line
    out_policy_blocks = []
    out_firewall_blocks = []
    for ip in cleaned:
        out_policy_blocks.append(generate_policy_block(ip).rstrip())
        out_firewall_blocks.append(generate_firewall_block(ip).rstrip())

    print("-----------------")
    print("\n" + "\n\n".join(out_policy_blocks) + "\n")
    print("-----------------")
    print("\n" + "\n".join(out_firewall_blocks) + "\n")

if __name__ == "__main__":
    main()