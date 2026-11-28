"""Re-classify TW/VN gear cards against the new baselines.

TW: NT$5,000  (twd < 5000 entry / twd >= 5000 pro)
VN: ₫4,000,000 (vnd < 4000000 entry / vnd >= 4000000 pro)
"""
import re
import sys

ART = re.compile(r'<article class="gear-card"[^>]*>.*?</article>', re.S)
PH = re.compile(r'data-price="(\d+)"')
TIER_ATTR = re.compile(r'data-tier="(?:entry|pro)"')
TIER_SPAN = re.compile(r'<span class="tier tier-(?:budget|pro)">[^<]*</span>')

CONF = {
    "tw": dict(threshold=5000,
               entry=('tier-budget', '入門推薦'),
               pro=('tier-pro', '專業錄音室')),
    "vn": dict(threshold=4000000,
               entry=('tier-budget', 'Cơ bản / Nhập môn'),
               pro=('tier-pro', 'Chuyên nghiệp / Studio')),
}


def main(write=False):
    for loc, c in CONF.items():
        path = f"{loc}/index.html"
        html = open(path, encoding="utf-8").read()
        stats = {"entry": 0, "pro": 0, "changed": 0}

        def fix(m):
            block = m.group(0)
            price = int(PH.search(block).group(1))
            tier = "entry" if price < c["threshold"] else "pro"
            cls, label = c[tier]
            new = TIER_ATTR.sub(f'data-tier="{tier}"', block, count=1)
            new = TIER_SPAN.sub(f'<span class="tier {cls}">{label}</span>', new)
            stats[tier] += 1
            if new != block:
                stats["changed"] += 1
            return new

        new_html = ART.sub(fix, html)
        print(loc, stats, "cards:", len(ART.findall(html)))
        if write:
            open(path, "w", encoding="utf-8").write(new_html)
    print("written" if write else "dry run")


if __name__ == "__main__":
    main(write="--write" in sys.argv)
