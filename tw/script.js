// VSTzip 繁體中文版 — 器材篩選：等級（入門推薦／專業錄音室）→ 類別
(function () {
  var tabs = Array.prototype.slice.call(document.querySelectorAll('.tab'));
  var tierBtns = Array.prototype.slice.call(document.querySelectorAll('.tier-btn'));
  var cards = Array.prototype.slice.call(document.querySelectorAll('.gear-card'));
  var grid = document.getElementById('gear-grid');
  var countEl = document.getElementById('gear-count');
  var emptyEl = document.getElementById('gear-empty');
  var resetBtns = Array.prototype.slice.call(document.querySelectorAll('[data-reset]'));

  if (!grid || !cards.length) return;

  var state = { category: 'all', tier: 'all' };

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

  function render() {
    var visible = [];

    cards.forEach(function (card) {
      var okCat = state.category === 'all' || card.getAttribute('data-category') === state.category;
      var okTier = state.tier === 'all' || card.getAttribute('data-tier') === state.tier;
      var show = okCat && okTier;
      card.classList.toggle('is-hidden', !show);
      if (show) visible.push(card);
    });

    // 「全部」時保留原稿的分類順序；選了類別才按價格排列
    if (state.category !== 'all') visible.sort(function (a, b) {
      var d = priceOf(a) - priceOf(b);
      return d !== 0 ? d : cards.indexOf(a) - cards.indexOf(b);
    });
    visible.forEach(function (card) { grid.appendChild(card); });

    if (countEl) countEl.textContent = '共 ' + visible.length + ' 項器材';
    if (emptyEl) emptyEl.hidden = visible.length !== 0;
    grid.classList.toggle('is-empty', visible.length === 0);

    var dirty = state.category !== 'all' || state.tier !== 'all';
    resetBtns.forEach(function (btn) { btn.hidden = !dirty; });
  }

  tierBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      state.tier = btn.getAttribute('data-tier');
      setPressed(tierBtns, btn);
      render();
    });
  });

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

  resetBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      state = { category: 'all', tier: 'all' };
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
      render();
    });
  });

  // 沒有卡片的類別分頁就藏起來
  var counts = {};
  cards.forEach(function (c) {
    var k = c.getAttribute('data-category');
    counts[k] = (counts[k] || 0) + 1;
  });
  tabs.forEach(function (t) {
    var f = t.getAttribute('data-filter');
    if (f !== 'all' && !counts[f]) t.classList.add('is-hidden');
  });

  render();
})();
