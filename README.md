# VSTzip — vstzip.github.io

매일 한시 무료로 풀리는 플러그인·가상악기와 작업실 추천 장비를 한 페이지에 정리한 **VSTzip 공식 허브**입니다.

- 사이트: https://vstzip.github.io
- 유튜브: https://www.youtube.com/@VSTzip

## 구성

| 경로 | 내용 |
| --- | --- |
| `index.html` | 한국어 전체 페이지 (히어로 · 무료 플러그인 · 추천 장비 · 푸터) |
| `style.css` | 공통 테마 (화이트 종이 + 흑연 + VU 앰버) |
| `script.js` | 장비 3단 필터 (카테고리 → 등급 → 가격대), 개수 표시, 빈 결과 안내 |
| `tw/` | 繁體中文 페이지 (`/tw/`) — `index.html`·`style.css`·`script.js`, 무료 플러그인 3종 + 장비 241종(12개 카테고리), 등급 기준 `entry`(NT$5,000 미만) / `pro`(NT$5,000 이상), 알리익스프레스 제휴 링크 241개 |
| `en/` | 영문(미국·유럽) 페이지 (`/en/`) — 무료 플러그인 2종 + 장비 227종(12개 카테고리), 등급 기준 `entry`(US$1,000 미만) / `pro`(US$1,000 이상), 아마존 US `?tag=vstzip-20` 제휴 링크 227개 |
| `jp/` | 일본어 페이지 (`/jp/`) — 무료 플러그인 2종 + 장비 25종, 등급 기준 `entry`(¥100,000 미만) / `pro`(¥100,000 이상), 12개 카테고리 전체 |
| `vn/` | 베트남어 페이지 (`/vn/`) — 무료 플러그인 3종 + 장비 241종(12개 카테고리), 등급 기준 `entry`(₫4,000,000 미만) / `pro`(₫4,000,000 이상), 가격은 베트남 참고 시세(₫), 알리익스프레스 제휴 링크 241개 |
| `es/` | 스페인어 페이지 (`/es/`) — 무료 플러그인 2종 + 장비 227종(12개 카테고리), 등급 기준 `entry`(US$1,000 미만) / `pro`(US$1,000 이상), 아마존 US `?tag=vstzip-20` 제휴 링크 227개 |
| `assets/logo.png` | 채널 테이프 머신 로고 (512px) |
| `assets/products/` | 장비·플러그인 상품 사진 (400px JPEG) |

언어별 페이지는 서로 `hreflang`(`ko` · `zh-Hant` · `en` · `ja` · `vi` · `es`, `x-default`→한국어)으로 연결되어 있고, 각 페이지 푸터에 언어 링크가 있습니다. `tw/`·`en/`·`jp/`은 `../style.css`를 먼저 불러오고 자기 `style.css`로 폰트·페이지 전용 스타일만 덮어씁니다. 장비 카드 속성 규칙은 아래와 같되, `en/`은 `data-category`가 `headphone` / `monitor` / `mic` / `interface` / `keys` / `dac`, `data-price`는 달러이고, `jp/`는 `data-category`가 `headphone` / `tw` / `twd` / `speaker` / `mic` / `headamp` / `dac` / `keys` / `piano` / `interface` / `pc` / `desk` 12종, `data-price`는 엔화입니다.

## 장비 카드 구조 (3단 필터)

카드는 `#gear-grid` 안에 `<article class="gear-card">`로 두고, 필터가 읽는 속성 3개를 반드시 채웁니다.

```html
<article class="gear-card" data-category="headphone" data-tier="entry" data-price="128000" data-band="e1">
```

- `data-category`: `headphone` / `tw`(무선 이어폰) / `twd`(유선 이어폰) / `speaker` / `mic` / `keys` / `piano` / `interface` / `headamp` / `dac` / `desk` / `pc`
- `data-tier`: `entry`(100만 원 미만) / `pro`(100만 원 이상)
- `data-price`: 숫자만 (원). 표시 가격·정렬·가격대 판정에 함께 쓰입니다.
- `data-band`: `e1`(~20만) · `e2`(20~50만) · `e3`(50~100만) · `p1`(100~150만) · `p2`(150~200만) · `p3`(200만+)

필터 상태(카테고리/등급/가격대)를 바꾸면 `script.js`가 카드를 숨기거나 보이고, 보이는 카드만 가격 오름차순으로 재정렬하며 `#gear-count`에 `총 N개 장비`를 씁니다. 결과가 0개면 `#gear-empty`가 대신 나옵니다.

## 갱신 방법

1. `index.html`의 무료 플러그인 카드(`article.plugin-card`)를 고치거나 복사해 추가합니다.
2. 마감이 지난 카드는 지우고, 새로 풀린 플러그인을 맨 앞에 넣습니다.
3. 푸터의 기준일(`time`)도 함께 갱신합니다.
4. 장비 가격이 바뀌면 해당 카드의 `data-price`와 표시 가격을 같이 고칩니다(`data-band`도 함께).
5. `git commit && git push` 하면 GitHub Pages가 자동으로 다시 배포합니다.

무료 플러그인 카드를 `tw/`·`en/`·`jp/`·`vn/`·`es/`에도 같이 넣을 때는 각 페이지 언어로 문구를 옮기고, 이미지는 `../assets/products/`의 같은 파일을 재사용합니다. `en/`·`es/` 장비 카드는 아마존 어소시에이트(`?tag=vstzip-20`) 링크이므로 가격 변동 시 `data-price`와 표시 가격을 함께 고칩니다.

`en/`·`es/`의 장비 목록은 `scratch/global-catalog-250.json`(아마존 US 상품 페이지에서 2026-11-20 검증한 227종)을 원본으로 씁니다. `/tw/`·`/jp/`·`/vn/` 확장도 같은 파일을 그대로 이어받습니다. `vn/`는 `tools/build_vn_es.py`가 `scratch/catalog.json`(검증된 45종)에서 생성합니다. 문구·가격은 스크립트 안의 `VI_DESC`/`ES_DESC`, `VI_PRICE`(베트남 실사 가격)를 고친 뒤 `python3 tools/build_vn_es.py`로 다시 만들고, `vn/style.css`·`es/style.css`는 `en/style.css`를 복사해 생성되므로 페이지 전용 스타일은 스크립트 끝의 CSS 블록에 추가합니다.

## 고지

- 장비 구매 링크는 모두 쿠팡 파트너스 단축 링크(`link.coupang.com/a/...`)이며, 파트너스 링크 생성이 제한된 상품(법적 사유·판매자 요청)은 목록에서 제외했습니다.
- 장비 가격은 2026-11-19 쿠팡 판매가 기준이며 수시로 변동합니다.
- 무료 배포 정보는 각 제작사 공식 페이지를 기준으로 정리하며, 기간은 업체 사정으로 조기 종료될 수 있습니다.
- `en/`·`es/` 장비 링크는 아마존 어소시에이트(태그 `vstzip-20`)이고, `tw/`는 AliExpress 제휴 승인 대기, `vn/`은 Involve Asia(Shopee·Lazada VN)와 AliExpress 승인 대기입니다.
- `vn/` 가격은 확인된 베트남 소매가와 국제 정가 환율(1 US$ ≈ 25.700 ₫, 부가세·수입세 추정 포함) 환산값을 섞은 참고가이며, 매장·행사에 따라 달라집니다.
