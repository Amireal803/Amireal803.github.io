/**
 * Lightweight sparkle scheduler — 8 dots, each:
 *   1. Picks a random position
 *   2. Fades in over ~0.2s
 *   3. Stays bright for 1–2s
 *   4. Fades out over ~0.35s
 *   5. Sleeps 4s
 *   6. Repeats
 *
 * At any moment at most ~2–3 dots are visible → near-zero GPU cost.
 */
;(function () {
  'use strict';

  var COUNT = 14;
  var ON_MIN = 1000;   // 1s
  var ON_MAX = 2000;   // 2s
  var OFF_GAP = 4000;  // 4s between cycles

  var dots = [];

  function rand(min, max) {
    return min + Math.random() * (max - min);
  }

  // Create all dots once, hidden
  for (var i = 0; i < COUNT; i++) {
    var dot = document.createElement('div');
    dot.className = 'sparkle-dot';
    document.body.appendChild(dot);
    dots.push(dot);
  }

  function cycle(dot) {
    // Random position (keep a small margin from edges)
    var x = rand(2, 96);
    var y = rand(2, 93);
    // Slightly vary the size
    var size = rand(3, 7);
    dot.style.left = x + '%';
    dot.style.top = y + '%';
    dot.style.width = size + 'px';
    dot.style.height = size + 'px';

    // Fade in
    dot.classList.add('on');

    // Schedule fade-out after random 1–2s
    var visibleDuration = rand(ON_MIN, ON_MAX);
    setTimeout(function () {
      dot.classList.remove('on');

      // After the CSS transition finishes + 4s gap, cycle again
      // transition is 0.35s → wait 400ms to be safe, then + 4s
      setTimeout(function () {
        cycle(dot);
      }, 400 + OFF_GAP);
    }, visibleDuration);
  }

  // Kick off each dot with a staggered delay so they never sync
  for (var i = 0; i < dots.length; i++) {
    (function (dot) {
      var stagger = rand(0, 6000); // spread initial launches over 0–6s
      setTimeout(function () {
        cycle(dot);
      }, stagger);
    })(dots[i]);
  }
})();
