// VSTzip — 3단 장비 필터: 카테고리 → 등급(입문/프로) → 세부 가격대
(function () {
  var tabs = Array.prototype.slice.call(document.querySelectorAll('.tab'));
  var tierBtns = Array.prototype.slice.call(document.querySelectorAll('.tier-btn'));
  var chips = Array.prototype.slice.call(document.querySelectorAll('.chip'));
  var chipWrap = document.querySelector('.chips');
  var cards = Array.prototype.slice.call(document.querySelectorAll('.gear-card'));
  var grid = document.getElementById('gear-grid');
  var countEl = document.getElementById('gear-count');
  var emptyEl = document.getElementById('gear-empty');
  var resetBtns = Array.prototype.slice.call(document.querySelectorAll('[data-reset]'));

  if (!grid || !cards.length) return;

  // 가격 구간(원). 상한은 미포함.
  var BANDS = {
    all: { tier: null, min: -1, max: Infinity },
    e1: { tier: 'entry', min: 0, max: 200000 },
    e2: { tier: 'entry', min: 200000, max: 500000 },
    e3: { tier: 'entry', min: 500000, max: 1000000 },
    p1: { tier: 'pro', min: 1000000, max: 1500000 },
    p2: { tier: 'pro', min: 1500000, max: 2000000 },
    p3: { tier: 'pro', min: 2000000, max: Infinity }
  };

  var state = { category: 'all', tier: 'all', band: 'all' };

  function priceOf(card) {
    return parseInt(card.getAttribute('data-price'), 10) || 0;
  }

  function setPressed(list, activeEl) {
    list.forEach(function (el) {
      var on = el === activeEl;
      el.classList.toggle('is-active', on);
      if (el.hasAttribute('aria-pressed')) el.setAttribute('aria-pressed', on ? 'true' : 'false');
    });
  }

  function syncChips() {
    // 등급에 따라 어울리는 가격대 칩만 남긴다.
    if (chipWrap) chipWrap.setAttribute('data-active-tier', state.tier);
    chips.forEach(function (chip) {
      var bandTier = chip.getAttribute('data-band-tier');
      var visible = state.tier === 'all' || !bandTier || bandTier === state.tier;
      var active = chip.getAttribute('data-band') === state.band;
      chip.classList.toggle('is-active', active);
      chip.setAttribute('aria-pressed', active ? 'true' : 'false');
      chip.classList.toggle('is-band-hidden', !visible);
      // 숨긴 칩은 탭 순서에서도 빼 둔다.
      if (!visible) chip.setAttribute('tabindex', '-1');
      else chip.removeAttribute('tabindex');
    });
  }

  function render() {
    var band = BANDS[state.band] || BANDS.all;
    var visible = [];

    cards.forEach(function (card) {
      var price = priceOf(card);
      var okCat = state.category === 'all' || card.getAttribute('data-category') === state.category;
      var okTier = state.tier === 'all' || card.getAttribute('data-tier') === state.tier;
      var okBand = state.band === 'all' || (price >= band.min && price < band.max);
      var show = okCat && okTier && okBand;
      card.classList.toggle('is-hidden', !show);
      if (show) visible.push(card);
    });

    // 보이는 카드만 가격 오름차순으로 정렬(같은 가격이면 원래 순서 유지).
    // style.order가 아니라 DOM 순서를 바꿔 화면 순서와 낭독 순서를 맞춘다.
    visible.sort(function (a, b) {
      var d = priceOf(a) - priceOf(b);
      return d !== 0 ? d : cards.indexOf(a) - cards.indexOf(b);
    });
    visible.forEach(function (card) { grid.appendChild(card); });

    if (countEl) countEl.textContent = '총 ' + visible.length + '개 장비';
    if (emptyEl) emptyEl.hidden = visible.length !== 0;
    grid.classList.toggle('is-empty', visible.length === 0);

    var dirty = state.category !== 'all' || state.tier !== 'all' || state.band !== 'all';
    resetBtns.forEach(function (btn) { btn.hidden = !dirty; });
  }

  tabs.forEach(function (tab) {
    tab.addEventListener('click', function () {
      state.category = tab.getAttribute('data-filter');
      tabs.forEach(function (t) {
        var on = t === tab;
        t.classList.toggle('is-active', on);
        t.setAttribute('aria-selected', on ? 'true' : 'false');
      });
      render();
    });
  });

  tierBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var next = btn.getAttribute('data-tier');
      if (next === state.tier) return;
      state.tier = next;
      // 등급을 바꾸면 그 등급에 없는 가격대 선택은 풀어 준다.
      var bandTier = BANDS[state.band] && BANDS[state.band].tier;
      if (next !== 'all' && bandTier && bandTier !== next) state.band = 'all';
      setPressed(tierBtns, btn);
      syncChips();
      render();
    });
  });

  chips.forEach(function (chip) {
    chip.addEventListener('click', function () {
      var key = chip.getAttribute('data-band');
      var band = BANDS[key];
      state.band = key;
      // 가격대 칩을 고르면 등급도 그 구간에 맞춰 준다(전체 가격은 등급 유지).
      if (band && band.tier && band.tier !== state.tier) {
        state.tier = band.tier;
        var target = tierBtns.filter(function (b) { return b.getAttribute('data-tier') === state.tier; })[0];
        if (target) setPressed(tierBtns, target);
      }
      syncChips();
      render();
    });
  });

  resetBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      state = { category: 'all', tier: 'all', band: 'all' };
      var firstTab = tabs.filter(function (t) { return t.getAttribute('data-filter') === 'all'; })[0];
      if (firstTab) {
        tabs.forEach(function (t) {
          var on = t === firstTab;
          t.classList.toggle('is-active', on);
          t.setAttribute('aria-selected', on ? 'true' : 'false');
        });
      }
      var allTier = tierBtns.filter(function (b) { return b.getAttribute('data-tier') === 'all'; })[0];
      if (allTier) setPressed(tierBtns, allTier);
      syncChips();
      render();
    });
  });

  // 탭에 카드가 없는 카테고리는 숨긴다(현재는 5개 모두 카드가 있음).
  var counts = {};
  cards.forEach(function (c) {
    var k = c.getAttribute('data-category');
    counts[k] = (counts[k] || 0) + 1;
  });
  tabs.forEach(function (t) {
    var f = t.getAttribute('data-filter');
    if (f !== 'all' && !counts[f]) t.classList.add('is-hidden');
  });

  syncChips();
  render();
})();
