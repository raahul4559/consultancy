/* =====================================================================
   COLLEGE PREMIUM — shared interactions for every college page.
   Adapted from the rvce3 reference design system, made data-driven so a
   single script powers all college pages. Each page defines its own data
   via `window.COLLEGE = { shortName, fullName, address }` before this
   script loads; everything else (course matrix, quota split, FAQ copy) is
   derived here so the pages stay in sync.

   NOTE: form submission is intentionally NOT handled here — that stays in
   srm-enquiry.js, which POSTs to /api/leads with a localStorage fallback.
   ===================================================================== */
(function () {
  var CO = window.COLLEGE || {};
  var SHORT = CO.shortName || 'this college';
  var ADDR  = CO.address || '';

  // Brand gradient used on branch/course cards (indigo -> teal).
  var CARD_GRAD = 'linear-gradient(135deg,#1F4E5F,#8AB9B5)';
  var CARD_ICON_BG = '#EAF2F1';
  var CARD_ICON_FG = '#1F4E5F';

  // ---------- DATA ----------
  var _cssRoot = getComputedStyle(document.documentElement);
  var _quotaColor = function (name, fallback) {
    return (_cssRoot.getPropertyValue('--quota-' + name).trim() || fallback);
  };

  var QUOTAS = [
    { name: 'MANAGEMENT', value: 25, color: _quotaColor('management', '#3E8E86'), dark: '#2E6D66' },
    { name: 'COMEDK',     value: 30, color: _quotaColor('comedk',     '#2C6C7E'), dark: '#16414F' },
    { name: 'KCET',       value: 45, color: _quotaColor('kcet',       '#1F4E5F'), dark: '#123039' },
  ];

  // The 12 B.Tech specialisations, grouped into the four category banners.
  var CSE_BRANCHES = [
    { title: 'Computer Science & Engineering', sub: 'Algorithms, systems, software engineering and cloud computing.', icon: '💻' },
    { title: 'CSE (AI & Machine Learning)',    sub: 'Deep learning, NLP, computer vision and intelligent systems.',    icon: '🤖' },
    { title: 'CSE (Data Science)',             sub: 'Big-data analytics, ML pipelines and statistical learning.',     icon: '📊' },
    { title: 'CSE (Cyber Security)',           sub: 'Network security, cryptography and ethical hacking.',            icon: '🔒' },
    { title: 'Information Science',            sub: 'Software engineering, databases and web technologies.',          icon: '🗄️' },
  ];
  var CIRCUIT_BRANCHES = [
    { title: 'Electronics & Communication', sub: 'Signal processing, VLSI, embedded systems and 5G.', icon: '📡' },
    { title: 'Electrical & Electronics',    sub: 'Power systems, automation and smart grids.',        icon: '⚡' },
  ];
  var CORE_BRANCHES = [
    { title: 'Mechanical Engineering', sub: 'Thermal, manufacturing, design and CAD/CAM.',      icon: '⚙️' },
    { title: 'Civil Engineering',      sub: 'Structural, environmental and smart infrastructure.', icon: '🏗️' },
    { title: 'Industrial Engineering', sub: 'Operations research, supply chain and lean systems.', icon: '📈' },
  ];
  var OTHER_BRANCHES = [
    { title: 'Biotechnology',        sub: 'Genetic engineering, bioprocess and healthcare biotech.', icon: '🧬' },
    { title: 'Chemical Engineering', sub: 'Process design, materials science and sustainable chemistry.', icon: '⚗️' },
  ];

  var FAQS = [
    { q: 'Where is the ' + SHORT + ' campus located?',
      a: ADDR + '.' },
    { q: 'Is KCET mandatory to get in?',
      a: 'No. Admission is also possible via a valid COMEDK UGET rank, JEE Main 2026 score, or through the management / direct channel. Each channel has its own fee slab and branch availability.' },
    { q: 'What is the fee range for B.Tech at ' + SHORT + '?',
      a: 'Fees vary by branch and admission channel. KCET-merit fees are the lowest; COMEDK is mid-tier; management-quota fees are highest, with CSE specialisations typically carrying the top slabs. Exact 2026–27 figures are released in the official admission brochure — our advisors share the latest circular after your enquiry.' },
    { q: 'What placement outcomes can students expect?',
      a: 'Top B.Tech offers at ' + SHORT + ' have historically crossed ₹40 LPA, with CSE and AI/ML tracks attracting the highest packages. For current-cycle figures, refer to the institute’s official placement report or ask our advisor.' },
    { q: 'Which branches see the strongest placements?',
      a: 'CSE, CSE (AI & ML), CSE (Data Science), CSE (Cyber Security) and ECE consistently see the deepest recruiter activity at ' + SHORT + '. ISE and core branches also place reliably.' },
    { q: 'Are hostels available?',
      a: 'Yes — separate hostel blocks for boys and girls with mess facilities. Hostels are strongly advised for out-of-Karnataka students. Our counsellors can guide you through the hostel application process.' },
    { q: 'Are scholarships available?',
      a: 'Yes — merit scholarships for top KCET / COMEDK / JEE rankers, plus sports, founder’s, and merit-cum-means scholarships. Exact bands change each cycle — contact our advisors for the current matrix.' },
  ];

  // ---------- NAVBAR / SCROLL ----------
  function smoothTo(id) {
    var el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  }

  document.querySelectorAll('[data-target]').forEach(function (el) {
    el.addEventListener('click', function () {
      var t = el.getAttribute('data-target');
      if (!t) return;
      smoothTo(t);
      var mm = document.getElementById('mobileMenu');
      var hb = document.getElementById('hamburgerBtn');
      if (mm) mm.classList.remove('visible');
      if (hb) hb.classList.remove('open');
    });
  });

  document.querySelectorAll('.nav-links li').forEach(function (li) {
    li.addEventListener('click', function () {
      document.querySelectorAll('.nav-links li').forEach(function (x) { x.classList.remove('active'); });
      li.classList.add('active');
    });
  });

  var hamb = document.getElementById('hamburgerBtn');
  var mobMenu = document.getElementById('mobileMenu');
  if (hamb && mobMenu) {
    hamb.addEventListener('click', function () {
      hamb.classList.toggle('open');
      mobMenu.classList.toggle('visible');
    });
  }

  // ---------- PIE CHART ----------
  function buildPie() {
    var svg = document.getElementById('seatPie');
    if (!svg) return;
    var cx = 100, cy = 100, r = 80, ir = 38;
    var start = -Math.PI / 2;
    var total = QUOTAS.reduce(function (s, q) { return s + q.value; }, 0);

    var arc = function (a0, a1, ro, ri) {
      var x0 = cx + ro * Math.cos(a0), y0 = cy + ro * Math.sin(a0);
      var x1 = cx + ro * Math.cos(a1), y1 = cy + ro * Math.sin(a1);
      var x2 = cx + ri * Math.cos(a1), y2 = cy + ri * Math.sin(a1);
      var x3 = cx + ri * Math.cos(a0), y3 = cy + ri * Math.sin(a0);
      var large = (a1 - a0) > Math.PI ? 1 : 0;
      return 'M' + x0 + ' ' + y0 + ' A' + ro + ' ' + ro + ' 0 ' + large + ' 1 ' + x1 + ' ' + y1 +
             ' L' + x2 + ' ' + y2 + ' A' + ri + ' ' + ri + ' 0 ' + large + ' 0 ' + x3 + ' ' + y3 + ' Z';
    };

    QUOTAS.forEach(function (q) {
      var angle = (q.value / total) * Math.PI * 2;
      var path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      path.setAttribute('d', arc(start, start + angle, r, ir));
      path.setAttribute('fill', q.color);
      path.setAttribute('stroke', '#fff');
      path.setAttribute('stroke-width', '2');
      path.style.transition = 'transform .25s, filter .25s';
      path.style.transformOrigin = cx + 'px ' + cy + 'px';
      path.style.cursor = 'pointer';
      path.dataset.key = q.name;
      path.addEventListener('mouseenter', function () {
        path.setAttribute('fill', q.dark);
        path.style.transform = 'scale(1.06)';
        path.style.filter = 'drop-shadow(0 4px 10px rgba(0,0,0,.25))';
        var cc = document.getElementById('centerCircle');
        cc.classList.add('active');
        cc.querySelector('span').textContent = q.name;
        cc.querySelector('strong').textContent = q.value + '%';
        document.querySelectorAll('.legend-item').forEach(function (li) {
          li.classList.toggle('active', li.dataset.key === q.name);
        });
        document.querySelectorAll('.quota-card').forEach(function (c) {
          c.classList.toggle('active', c.dataset.key === q.name);
        });
      });
      path.addEventListener('mouseleave', function () {
        path.setAttribute('fill', q.color);
        path.style.transform = '';
        path.style.filter = '';
        var cc = document.getElementById('centerCircle');
        cc.classList.remove('active');
        cc.querySelector('span').textContent = 'SEATS';
        cc.querySelector('strong').textContent = '100%';
        document.querySelectorAll('.legend-item').forEach(function (li) { li.classList.remove('active'); });
        document.querySelectorAll('.quota-card').forEach(function (c) { c.classList.remove('active'); });
      });
      svg.appendChild(path);
      start += angle;
    });
  }
  buildPie();

  // hover sync from cards/legend -> highlight slice
  document.querySelectorAll('.quota-card, .legend-item').forEach(function (el) {
    el.addEventListener('mouseenter', function () {
      var key = el.dataset.key;
      var q = QUOTAS.find(function (x) { return x.name === key; });
      if (!q) return;
      var cc = document.getElementById('centerCircle');
      cc.classList.add('active');
      cc.querySelector('span').textContent = q.name;
      cc.querySelector('strong').textContent = q.value + '%';
      document.querySelectorAll('#seatPie path').forEach(function (p) {
        if (p.dataset.key === key) {
          p.setAttribute('fill', q.dark);
          p.style.transform = 'scale(1.06)';
        }
      });
    });
    el.addEventListener('mouseleave', function () {
      var cc = document.getElementById('centerCircle');
      cc.classList.remove('active');
      cc.querySelector('span').textContent = 'SEATS';
      cc.querySelector('strong').textContent = '100%';
      document.querySelectorAll('#seatPie path').forEach(function (p) {
        var q = QUOTAS.find(function (x) { return x.name === p.dataset.key; });
        if (q) { p.setAttribute('fill', q.color); p.style.transform = ''; }
      });
    });
  });

  // ---------- BRANCH / COURSE CARDS ----------
  function renderBranchCard(b) {
    return '' +
      '<div class="branch-card">' +
        '<div class="bc-accent-bar" style="background:' + CARD_GRAD + ';width:100%"></div>' +
        '<div class="bc-top">' +
          '<div class="bc-icon" style="background:' + CARD_ICON_BG + ';color:' + CARD_ICON_FG + '">' + b.icon + '</div>' +
          '<div class="bc-title-wrap">' +
            '<p class="bc-name">' + b.title + '</p>' +
            '<span class="bc-sub">' + b.sub + '</span>' +
          '</div>' +
        '</div>' +
        '<div class="bc-course-foot">' +
          '<span class="bc-course-tag">4 Years · B.Tech</span>' +
        '</div>' +
      '</div>';
  }

  function fillGrid(id, data) {
    var grid = document.getElementById(id);
    if (grid) grid.innerHTML = data.map(renderBranchCard).join('');
  }
  fillGrid('cseGrid', CSE_BRANCHES);
  fillGrid('circuitGrid', CIRCUIT_BRANCHES);
  fillGrid('coreGrid', CORE_BRANCHES);
  fillGrid('otherGrid', OTHER_BRANCHES);

  // ---------- FAQ ACCORDION ----------
  var faqList = document.getElementById('faqList');
  if (faqList) {
    faqList.innerHTML = FAQS.map(function (f, i) {
      return '' +
        '<div class="faq-item' + (i === 0 ? ' open' : '') + '">' +
          '<button class="faq-question" type="button">' +
            '<span class="faq-q-text">' + f.q + '</span>' +
            '<span class="faq-icon">' + (i === 0 ? '−' : '+') + '</span>' +
          '</button>' +
          '<div class="faq-answer" style="' + (i === 0 ? '' : 'display:none') + '">' + f.a + '</div>' +
        '</div>';
    }).join('');

    faqList.querySelectorAll('.faq-question').forEach(function (btn, idx) {
      btn.addEventListener('click', function () {
        var items = faqList.querySelectorAll('.faq-item');
        items.forEach(function (it, i) {
          var ans = it.querySelector('.faq-answer');
          var icon = it.querySelector('.faq-icon');
          if (i === idx) {
            var isOpen = it.classList.toggle('open');
            ans.style.display = isOpen ? '' : 'none';
            icon.textContent = isOpen ? '−' : '+';
          } else {
            it.classList.remove('open');
            ans.style.display = 'none';
            icon.textContent = '+';
          }
        });
      });
    });
  }

  // ---------- SCROLL SPY (active nav link) ----------
  (function () {
    var sections = ['admission', 'placement', 'review', 'contact']
      .map(function (id) { return document.getElementById(id); })
      .filter(Boolean);
    if (!sections.length) return;
    var navItems = document.querySelectorAll('.nav-links li, .mobile-links li');
    var ticking = false;
    function update() {
      var y = window.scrollY + 120;
      var current = sections[0].id;
      for (var i = 0; i < sections.length; i++) if (sections[i].offsetTop <= y) current = sections[i].id;
      navItems.forEach(function (li) { li.classList.toggle('active', li.dataset.target === current); });
      ticking = false;
    }
    window.addEventListener('scroll', function () {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(update);
    }, { passive: true });
    update();
  })();

  // =========================================================
  // SECTION-IMAGE TITLE LETTER SPLIT
  // =========================================================
  (function () {
    var titles = document.querySelectorAll('.section-image__title h2[data-letters]');
    titles.forEach(function (h2) {
      if (h2.dataset.lettersBuilt) return;
      var out = [];
      var i = 0;
      var wrapText = function (text) {
        var html = '';
        for (var c = 0; c < text.length; c++) {
          var ch = text[c];
          if (/\s/.test(ch)) { html += ' '; }
          else { html += '<span class="letter" style="--i:' + i + '">' + ch + '</span>'; i++; }
        }
        return html;
      };
      Array.prototype.forEach.call(h2.childNodes, function (node) {
        if (node.nodeType === Node.TEXT_NODE) {
          out.push(wrapText(node.textContent));
        } else if (node.nodeType === Node.ELEMENT_NODE && node.tagName.toLowerCase() === 'span') {
          out.push('<span class="title-accent">' + wrapText(node.textContent) + '</span>');
        } else {
          out.push(node.outerHTML || '');
        }
      });
      h2.innerHTML = out.join('');
      h2.dataset.lettersBuilt = '1';
    });

    var banners = document.querySelectorAll('.section-image');
    if (!banners.length) return;
    var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce || !('IntersectionObserver' in window)) {
      banners.forEach(function (el) { el.classList.add('is-visible'); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { e.target.classList.toggle('is-visible', e.isIntersecting); });
    }, { threshold: [0, 0.2, 0.5], rootMargin: '0px 0px -5% 0px' });
    banners.forEach(function (el) { io.observe(el); });
  })();

  // =========================================================
  // SECTION HEADING ACCENT LINE
  // =========================================================
  (function () {
    var ACCENT_HOSTS = ['.admission-header', '.eligibility-header', '.institute-header', '.fee-header', '.faq-header'];
    ACCENT_HOSTS.forEach(function (sel) {
      document.querySelectorAll(sel).forEach(function (host) {
        if (host.querySelector('.section-accent')) return;
        var h = host.querySelector('h2');
        if (!h) return;
        var accent = document.createElement('span');
        accent.className = 'section-accent';
        h.insertAdjacentElement('afterend', accent);
      });
    });
  })();

  // ---------- NAV SEARCH ----------
  (function () {
    var form = document.getElementById('navSearch');
    if (!form) return;
    var input = form.querySelector('input');
    var clear = form.querySelector('.nav-search-clear');
    var sync = function () { form.classList.toggle('has-value', input.value.trim().length > 0); };
    input.addEventListener('input', sync);
    sync();
    if (clear) clear.addEventListener('click', function () { input.value = ''; sync(); input.focus(); });

    var SECTIONS = [
      { id: 'admission', keys: ['admission', 'apply', 'enroll'] },
      { id: 'placement', keys: ['placement', 'fee', 'fees', 'branch', 'course'] },
      { id: 'review',    keys: ['review', 'consultation', 'consult', 'book'] },
      { id: 'contact',   keys: ['contact', 'faq', 'question', 'help', 'enquiry', 'inquiry'] },
    ];
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var q = input.value.trim().toLowerCase();
      if (!q) return;
      var target = null;
      for (var i = 0; i < SECTIONS.length; i++) {
        var s = SECTIONS[i];
        if (s.keys.some(function (k) { return k.indexOf(q) !== -1 || q.indexOf(k) !== -1; })) {
          target = document.getElementById(s.id);
          break;
        }
      }
      if (!target) {
        var all = document.querySelectorAll('h1,h2,h3,h4,p,li,strong,span');
        for (var j = 0; j < all.length; j++) {
          if ((all[j].textContent || '').toLowerCase().indexOf(q) !== -1) {
            target = all[j].closest('section') || all[j];
            break;
          }
        }
      }
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        target.style.transition = 'box-shadow .4s';
        var prevShadow = target.style.boxShadow;
        target.style.boxShadow = 'inset 0 0 0 3px rgba(31,78,95,.25)';
        setTimeout(function () { target.style.boxShadow = prevShadow; }, 1400);
      }
      input.blur();
    });
  })();
})();
