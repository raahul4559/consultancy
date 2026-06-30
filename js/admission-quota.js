/* ============================================================
   ADMISSION QUOTA — reusable section for every college page.
   Inserts after "Courses Offered" (#courses): an animated SVG
   doughnut + legend (left) and three quota cards (right).
   Chart is computed from the data, so it updates automatically.
   Override per page with window.ADMISSION_QUOTA = [{label,value,color,desc}].
   ============================================================ */
(function () {
  function init() {
    var coursesSec = document.getElementById('courses');
    if (!coursesSec || document.getElementById('admission-quota')) return;

    // Actual data if provided, else sensible defaults
    var DATA = (window.ADMISSION_QUOTA && window.ADMISSION_QUOTA.length) ? window.ADMISSION_QUOTA : [
      { label: 'Management', value: 25, color: '#38BDF8', desc: 'Direct management-quota admission.' },
      { label: 'COMEDK',     value: 30, color: '#2563EB', desc: 'All-India entrance via COMEDK UGET.' },
      { label: 'KCET / KEA',  value: 45, color: '#0F172A', desc: 'Karnataka government quota (KCET / KEA).' }
    ];

    var total = DATA.reduce(function (s, d) { return s + d.value; }, 0) || 1;

    // --- doughnut geometry ---
    var SIZE = 220, R = 84, SW = 28, C = 2 * Math.PI * R;
    var cum = 0, segs = '';
    DATA.forEach(function (d, i) {
      var arc = (d.value / total) * C;
      var off = -cum; // start where the previous segment ended
      segs +=
        '<circle class="quota-seg" cx="' + (SIZE / 2) + '" cy="' + (SIZE / 2) + '" r="' + R + '" fill="none" ' +
        'stroke="' + d.color + '" stroke-width="' + SW + '" stroke-linecap="butt" ' +
        'data-arc="' + arc.toFixed(2) + '" data-rest="' + (C - arc).toFixed(2) + '" ' +
        'style="stroke-dasharray:0 ' + C.toFixed(2) + ';stroke-dashoffset:' + off.toFixed(2) + ';transition-delay:' + (i * 0.18) + 's"></circle>';
      cum += arc;
    });

    var legend = DATA.map(function (d) {
      return '<li><span class="ql-dot" style="background:' + d.color + '"></span>' +
        '<span class="ql-name">' + d.label + '</span><span class="ql-val">' + d.value + '%</span></li>';
    }).join('');

    var cards = DATA.map(function (d) {
      return '<div class="quota-card" style="--qc:' + d.color + '">' +
        '<div class="quota-card-bar"></div>' +
        '<div class="quota-card-body">' +
          '<div class="quota-card-top"><span class="quota-card-label">' + d.label + ' Quota</span>' +
          '<span class="quota-card-val">' + d.value + '%</span></div>' +
          '<p class="quota-card-desc">' + d.desc + '</p>' +
        '</div></div>';
    }).join('');

    var section = document.createElement('section');
    section.className = 'srm-sec alt';
    section.id = 'admission-quota';
    section.innerHTML =
      '<div class="container">' +
        '<div class="text-center mb-5">' +
          '<div class="srm-sec-label">Seat Matrix</div>' +
          '<h2 class="srm-sec-title">Admission Quota</h2>' +
          '<p class="srm-sec-sub">How B.Tech seats are typically split across admission channels. Exact figures vary each cycle — our advisors share the latest matrix on enquiry.</p>' +
        '</div>' +
        '<div class="quota-layout">' +
          '<div class="quota-chart-col">' +
            '<div class="quota-chart" aria-hidden="true">' +
              '<svg viewBox="0 0 ' + SIZE + ' ' + SIZE + '">' +
                '<circle cx="' + (SIZE / 2) + '" cy="' + (SIZE / 2) + '" r="' + R + '" fill="none" stroke="#E2E8F0" stroke-width="' + SW + '"></circle>' +
                '<g transform="rotate(-90 ' + (SIZE / 2) + ' ' + (SIZE / 2) + ')">' + segs + '</g>' +
              '</svg>' +
              '<div class="quota-chart-center"><strong>100%</strong><span>Seat Split</span></div>' +
            '</div>' +
            '<ul class="quota-legend">' + legend + '</ul>' +
          '</div>' +
          '<div class="quota-cards">' + cards + '</div>' +
        '</div>' +
      '</div>';

    coursesSec.insertAdjacentElement('afterend', section);

    // animate the doughnut when it scrolls into view
    var chart = section.querySelector('.quota-chart');
    function draw() {
      section.querySelectorAll('.quota-seg').forEach(function (s) {
        s.style.strokeDasharray = s.getAttribute('data-arc') + ' ' + s.getAttribute('data-rest');
      });
    }
    if (!('IntersectionObserver' in window) || matchMedia('(prefers-reduced-motion: reduce)').matches) {
      draw();
    } else {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) { if (e.isIntersecting) { draw(); io.disconnect(); } });
      }, { threshold: 0.3 });
      io.observe(chart);
    }
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
