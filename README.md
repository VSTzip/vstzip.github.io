# VSTzip — vstzip.github.io

매일 한시 무료로 풀리는 플러그인·가상악기와 작업실 추천 장비를 한 페이지에 정리한 **VSTzip 공식 허브**입니다.

- 사이트: https://vstzip.github.io
- 유튜브: https://www.youtube.com/@VSTzip

## 구성

| 경로 | 내용 |
| --- | --- |
| `index.html` | 전체 페이지 (히어로 · 무료 플러그인 · 추천 장비 · 푸터) |
| `style.css` | 다크 스튜디오 테마 (배경 `#0E1118`, 민트 `#00E5A3`, 앰버 `#FFD666`) |
| `script.js` | 장비 3단 필터 (카테고리 → 등급 → 가격대), 개수 표시, 빈 결과 안내 |
| `assets/logo.png` | 채널 테이프 머신 로고 (512px) |

## 장비 카드 구조 (3단 필터)

카드는 `#gear-grid` 안에 `<article class="gear-card">`로 두고, 필터가 읽는 속성 3개를 반드시 채웁니다.

```html
<article class="gear-card" data-category="headphone" data-tier="entry" data-price="128000" data-band="e1">
```

- `data-category`: `headphone` / `speaker` / `mic` / `keys` / `interface`
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

## 고지

- 장비 구매 링크는 **쿠팡 파트너스 승인 후** 연결 예정이며, 현재 버튼은 `파트너스 링크 준비 중` 상태로 비활성입니다.
- 장비 가격은 2026-11-19 쿠팡 판매가 기준이며 수시로 변동합니다.
- 무료 배포 정보는 각 제작사 공식 페이지를 기준으로 정리하며, 기간은 업체 사정으로 조기 종료될 수 있습니다.
