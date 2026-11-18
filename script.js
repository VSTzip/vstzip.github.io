// VSTzip — category tab filtering for the gear section
(function () {
  var tabs = Array.prototype.slice.call(document.querySelectorAll('.tab'));
  var cards = Array.prototype.slice.call(document.querySelectorAll('.gear-card'));

  function apply(filter) {
    cards.forEach(function (card) {
      var match = filter === 'all' || card.getAttribute('data-cat') === filter;
      card.classList.toggle('is-hidden', !match);
    });
  }

  tabs.forEach(function (tab) {
    tab.addEventListener('click', function () {
      tabs.forEach(function (t) {
        t.classList.remove('is-active');
        t.setAttribute('aria-selected', 'false');
      });
      tab.classList.add('is-active');
      tab.setAttribute('aria-selected', 'true');
      apply(tab.getAttribute('data-filter'));
    });
  });

  // count of cards per category, used only to skip empty filters
  var count = {};
  cards.forEach(function (c) {
    var k = c.getAttribute('data-cat');
    count[k] = (count[k] || 0) + 1;
  });
  tabs.forEach(function (t) {
    var f = t.getAttribute('data-filter');
    if (f !== 'all' && !count[f]) t.style.display = 'none';
  });
})();
