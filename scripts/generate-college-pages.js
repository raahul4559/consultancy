#!/usr/bin/env node
/**
 * Generates the 10 college landing pages under /colleges/ from one shared
 * SRM-template structure. Re-run with: `node scripts/generate-college-pages.js`
 */

const fs = require('fs');
const path = require('path');

const OUT_DIR = path.join(__dirname, '..', 'colleges');

const PHONE_DISPLAY = '+91 81006 36959';
const PHONE_TEL = '+918100636959';
const PHONE_WA = '918100636959';
const EMAIL = 'info@eduvistaconsulting.com';
const BRAND = 'EduVista Consulting';
const SITE_URL = 'https://eduvistaconsulting.com';
const ADDRESS = 'F11, D Block, Fortuna Icon Apartment, Sahakarnagar Main Rd, F Block, Sahakar Nagar, Bengaluru, Karnataka 560092';
const ADDRESS_SHORT = 'Sahakar Nagar, Bengaluru';

const colleges = [
  {
    file: 'rv-college.html',
    name: 'RV College of Engineering',
    short: 'RVCE',
    bg: 'rvce-bg.jpg',
    year: 1963,
    type: 'Private (Autonomous)',
    affiliation: 'VTU',
    accreditation: 'NAAC A++',
    approvals: 'AICTE / NBA',
    location: 'Mysuru Road, RV Vidyaniketan Post, Bengaluru — 560059',
    locationShort: 'Mysuru Road, Bengaluru',
    blurb: 'One of India\'s leading engineering institutions, established in 1963 and consistently ranked among the top private colleges in Karnataka.',
    pitch: 'Six decades of alumni reach, top private-college placements in Karnataka, and deep CSE specialisations (AI/ML, Cyber, Data Science) — for KCET-competitive families, RVCE deserves a serious conversation.',
    intakeBranch: 'CSE',
    accepted: ['KCET 2026', 'COMEDK UGET', 'JEE Main', 'Management Quota'],
  },
  {
    file: 'ramaiah.html',
    name: 'Ramaiah Institute of Technology',
    short: 'MSRIT',
    bg: 'ramaiah-bg.jpg',
    year: 1962,
    type: 'Private (Autonomous)',
    affiliation: 'VTU',
    accreditation: 'NAAC A+',
    approvals: 'AICTE / NBA',
    location: 'MSR Nagar, MSRIT Post, Bengaluru — 560054',
    locationShort: 'MSR Nagar, Bengaluru',
    blurb: 'A flagship Bengaluru engineering college since 1962, with a strong reputation in CSE, ECE and core engineering branches.',
    pitch: 'Excellent core-engineering pedigree, consistent top-tier IT placements, and a tightly-knit alumni network across Bengaluru\'s product and services industry.',
    intakeBranch: 'CSE',
    accepted: ['KCET 2026', 'COMEDK UGET', 'JEE Main', 'Management Quota'],
  },
  {
    file: 'bms-college.html',
    name: 'BMS College of Engineering',
    short: 'BMSCE',
    bg: 'bms-bg.jpg',
    year: 1946,
    type: 'Private (Autonomous)',
    affiliation: 'VTU',
    accreditation: 'NAAC A++',
    approvals: 'AICTE / NBA',
    location: 'Bull Temple Road, Basavanagudi, Bengaluru — 560019',
    locationShort: 'Basavanagudi, Bengaluru',
    blurb: 'India\'s first private engineering college, founded in 1946. BMSCE blends heritage with modern CSE, AI and ECE specialisations.',
    pitch: 'The oldest private engineering college in the country, with deep industry ties, a Basavanagudi campus right in central Bengaluru, and reliable placements across CSE and ECE.',
    intakeBranch: 'CSE',
    accepted: ['KCET 2026', 'COMEDK UGET', 'JEE Main', 'Management Quota'],
  },
  {
    file: 'dayananda-sagar.html',
    name: 'Dayananda Sagar College of Engineering',
    short: 'DSCE',
    bg: 'dsce-bg.jpg',
    year: 1979,
    type: 'Private (Autonomous)',
    affiliation: 'VTU',
    accreditation: 'NAAC A',
    approvals: 'AICTE / NBA',
    location: 'Shavige Malleshwara Hills, Kumaraswamy Layout, Bengaluru — 560078',
    locationShort: 'Kumaraswamy Layout, Bengaluru',
    blurb: 'Part of the Dayananda Sagar Group, established 1979. A 70-acre south-Bengaluru campus with strong CSE and biotech tracks.',
    pitch: 'Sprawling green campus near Banashankari, with one of the better biotech and CSE specialisation menus in Bengaluru — and a healthy mix of KCET, COMEDK and management seats.',
    intakeBranch: 'CSE',
    accepted: ['KCET 2026', 'COMEDK UGET', 'JEE Main', 'Management Quota'],
  },
  {
    file: 'nitte.html',
    name: 'Nitte Meenakshi Institute of Technology',
    short: 'NMIT',
    bg: 'nitte-bg.jpg',
    year: 2001,
    type: 'Private (Autonomous)',
    affiliation: 'VTU',
    accreditation: 'NAAC A+',
    approvals: 'AICTE / NBA',
    location: 'Govindapura, Gollahalli, Yelahanka, Bengaluru — 560064',
    locationShort: 'Yelahanka, Bengaluru',
    blurb: 'A Nitte Education Trust institution near Bengaluru airport. Strong CSE, AI/ML, and electronics tracks with active industry tie-ups.',
    pitch: 'Yelahanka campus in north Bengaluru, modern infrastructure, and a focused autonomous syllabus — increasingly the picks for students aiming at product-engineering roles.',
    intakeBranch: 'CSE',
    accepted: ['KCET 2026', 'COMEDK UGET', 'JEE Main', 'Management Quota'],
  },
  {
    file: 'sir-mvit.html',
    name: 'Sir M Visvesvaraya Institute of Technology',
    short: 'Sir MVIT',
    bg: 'smvit-bg.jpg',
    year: 1986,
    type: 'Private',
    affiliation: 'VTU',
    accreditation: 'NAAC A',
    approvals: 'AICTE / NBA',
    location: 'Hunasamaranahalli, International Airport Road, Bengaluru — 562157',
    locationShort: 'Hunasamaranahalli, Bengaluru',
    blurb: 'Founded in 1986 on a 50-acre north-Bengaluru campus near the international airport, with strong CSE and ECE departments.',
    pitch: 'Quiet, green campus on the airport-road corridor with sensible fees, balanced course offerings and reliable VTU outcomes.',
    intakeBranch: 'CSE',
    accepted: ['KCET 2026', 'COMEDK UGET', 'JEE Main', 'Management Quota'],
  },
  {
    file: 'bit.html',
    name: 'Bangalore Institute of Technology',
    short: 'BIT',
    bg: 'bit-bg.jpg',
    year: 1979,
    type: 'Private (Autonomous)',
    affiliation: 'VTU',
    accreditation: 'NAAC A',
    approvals: 'AICTE / NBA',
    location: 'K R Road, V V Puram, Bengaluru — 560004',
    locationShort: 'V V Puram, Bengaluru',
    blurb: 'A heritage Bengaluru institution since 1979, located in central V V Puram. Well-known for ECE, CSE and mechanical engineering.',
    pitch: 'Central Bengaluru location, four decades of alumni in the city\'s manufacturing and IT industries, and steady KCET / COMEDK admission patterns.',
    intakeBranch: 'CSE',
    accepted: ['KCET 2026', 'COMEDK UGET', 'JEE Main', 'Management Quota'],
  },
  {
    file: 'cmrit.html',
    name: 'CMR Institute of Technology',
    short: 'CMRIT',
    bg: 'cmrit-bg.jpg',
    year: 2000,
    type: 'Private (Autonomous)',
    affiliation: 'VTU',
    accreditation: 'NAAC A+',
    approvals: 'AICTE / NBA',
    location: '132, AECS Layout, ITPL Main Road, Kundalahalli, Bengaluru — 560037',
    locationShort: 'ITPL, Bengaluru',
    blurb: 'A CMR Group institution right next to the ITPL tech corridor — strong corporate connect and modern CSE / AI specialisations.',
    pitch: 'Whitefield/ITPL adjacency is a real advantage — placement teams have an easier walk-in cadence and students get internship access early.',
    intakeBranch: 'CSE',
    accepted: ['KCET 2026', 'COMEDK UGET', 'JEE Main', 'Management Quota'],
  },
  {
    file: 'reva.html',
    name: 'REVA University',
    short: 'REVA',
    bg: 'reva-bg.jpg',
    year: 2012,
    type: 'Private University',
    affiliation: 'UGC Approved',
    accreditation: 'NAAC A+',
    approvals: 'UGC / AICTE',
    location: 'Rukmini Knowledge Park, Kattigenahalli, Yelahanka, Bengaluru — 560064',
    locationShort: 'Yelahanka, Bengaluru',
    blurb: 'A 45-acre private university in north Bengaluru. Broad portfolio across B.Tech, B.Arch, design, business and law.',
    pitch: 'Self-contained green campus, semester-system flexibility (not VTU-bound), and a wide menu of CSE and AI specialisations — popular with students looking for university-style flexibility.',
    intakeBranch: 'CSE',
    accepted: ['REVA EET 2026', 'KCET 2026', 'JEE Main', 'Direct Admission'],
  },
  {
    file: 'alliance.html',
    name: 'Alliance University',
    short: 'Alliance',
    bg: 'alliance-bg.jpg',
    year: 2010,
    type: 'Private University',
    affiliation: 'UGC Approved',
    accreditation: 'NAAC A+',
    approvals: 'UGC / AICTE',
    location: 'Chandapura-Anekal Main Road, Anekal, Bengaluru — 562106',
    locationShort: 'Anekal, Bengaluru',
    blurb: 'A private state university with a 47-acre Anekal campus south of Bengaluru — known for management, law and B.Tech CSE.',
    pitch: 'Strong management and law schools, growing engineering programme, and a quiet residential campus on the city\'s southern edge.',
    intakeBranch: 'CSE',
    accepted: ['Alliance Entrance Test', 'KCET 2026', 'JEE Main', 'Direct Admission'],
  },
];

const COURSES = [
  { ic: 'fa-laptop-code', name: 'Computer Science &amp; Engineering', desc: 'Core CSE with algorithms, systems, software engineering and cloud computing fundamentals.' },
  { ic: 'fa-robot', name: 'CSE (AI &amp; Machine Learning)', desc: 'Deep learning, NLP, computer vision, intelligent systems and AI-driven products.' },
  { ic: 'fa-chart-line', name: 'CSE (Data Science)', desc: 'Big-data analytics, ML pipelines, statistical learning and data-driven decision making.' },
  { ic: 'fa-shield-halved', name: 'CSE (Cyber Security)', desc: 'Network security, cryptography, ethical hacking and cyber-law fundamentals.' },
  { ic: 'fa-satellite-dish', name: 'Electronics &amp; Communication', desc: 'Signal processing, VLSI, embedded systems and 5G / wireless communication.' },
  { ic: 'fa-gears', name: 'Information Science', desc: 'Software engineering, databases, web technologies and information systems.' },
  { ic: 'fa-gear', name: 'Mechanical Engineering', desc: 'Thermal, manufacturing, design, CAD/CAM and advanced materials.' },
  { ic: 'fa-bolt', name: 'Electrical &amp; Electronics', desc: 'Power systems, automation, smart grids and renewable-energy engineering.' },
  { ic: 'fa-building', name: 'Civil Engineering', desc: 'Structural engineering, environmental systems, smart infrastructure and urban planning.' },
  { ic: 'fa-dna', name: 'Biotechnology', desc: 'Genetic engineering, bioprocess technology, healthcare and environmental biotech.' },
  { ic: 'fa-flask', name: 'Chemical Engineering', desc: 'Process design, materials science, sustainable chemistry and industrial manufacturing.' },
  { ic: 'fa-industry', name: 'Industrial Engineering', desc: 'Operations research, supply chain, lean manufacturing and process optimisation.' },
];

const RECRUITERS = [
  'Microsoft', 'Amazon', 'Cognizant', 'Infosys', 'TCS', 'Wipro',
  'Accenture', 'Deloitte', 'Ford', 'Hyundai', 'Ashok Leyland', 'Capgemini',
  'HCL', 'Mphasis', 'Oracle', 'SAP', 'Cisco', 'IBM', 'Intel', 'Samsung',
];

const STATES = [
  'Karnataka', 'Tamil Nadu', 'Andhra Pradesh', 'Telangana', 'Kerala',
  'Maharashtra', 'Delhi', 'Gujarat', 'Uttar Pradesh', 'West Bengal', 'Rajasthan',
  'Jharkhand', 'Bihar', 'Madhya Pradesh', 'Punjab', 'Other',
];

function courseOption(name) {
  // Convert HTML-entity ampersand back for option text
  return name.replace(/&amp;/g, '&');
}

function render(c) {
  const title = `${c.name} (${c.short}) Admissions 2026-27 — Fees, Cutoff, Placements | ${BRAND}`;
  const description = `${c.name} (${c.short}) B.Tech admissions 2026-27 — eligibility, fees, KCET / COMEDK / JEE Main / management quota, placements, courses and free counselling from ${BRAND}.`;
  const keywords = `${c.short} admission 2026, ${c.name}, ${c.short} fees, ${c.short} cutoff, ${c.short} placements, B.Tech Bengaluru, KCET 2026, COMEDK 2026, management quota, ${c.locationShort}`;
  const canonical = `${SITE_URL}/colleges/${c.file}`;
  const ogImage = `${SITE_URL}/images/${c.bg}`;
  const reservedKeyword = c.short.toLowerCase();
  const modalId = `enquireModal-${reservedKeyword.replace(/\s+/g, '')}`;
  const waMessage = encodeURIComponent(`Hi ${BRAND}, I'd like to know more about ${c.short} (${c.name}) B.Tech admissions for 2026-27.`);
  const waLink = `https://wa.me/${PHONE_WA}?text=${waMessage}`;

  const jsonLd = JSON.stringify({
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'EducationalOrganization',
        name: BRAND,
        url: SITE_URL,
        logo: `${SITE_URL}/images/logo.png`,
        telephone: PHONE_TEL,
        email: EMAIL,
        address: {
          '@type': 'PostalAddress',
          streetAddress: 'F11, D Block, Fortuna Icon Apartment, Sahakarnagar Main Rd, F Block, Sahakar Nagar',
          addressLocality: 'Bengaluru',
          addressRegion: 'Karnataka',
          postalCode: '560092',
          addressCountry: 'IN',
        },
      },
      {
        '@type': 'CollegeOrUniversity',
        name: c.name,
        alternateName: c.short,
        foundingDate: String(c.year),
        address: {
          '@type': 'PostalAddress',
          streetAddress: c.location,
          addressLocality: 'Bengaluru',
          addressRegion: 'Karnataka',
          addressCountry: 'IN',
        },
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
          { '@type': 'ListItem', position: 2, name: 'Colleges', item: `${SITE_URL}/index.html#colleges` },
          { '@type': 'ListItem', position: 3, name: c.name, item: canonical },
        ],
      },
    ],
  });

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="theme-color" content="#92400e">
<meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1">

<title>${title}</title>
<meta name="description" content="${description}">
<meta name="keywords" content="${keywords}">
<meta name="author" content="${BRAND}">
<link rel="canonical" href="${canonical}">

<!-- Open Graph -->
<meta property="og:type" content="article">
<meta property="og:site_name" content="${BRAND}">
<meta property="og:title" content="${title}">
<meta property="og:description" content="${description}">
<meta property="og:url" content="${canonical}">
<meta property="og:image" content="${ogImage}">
<meta property="og:image:alt" content="${c.name} campus">
<meta property="og:locale" content="en_IN">

<!-- Twitter -->
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${title}">
<meta name="twitter:description" content="${description}">
<meta name="twitter:image" content="${ogImage}">

<!-- Structured data -->
<script type="application/ld+json">
${jsonLd}
</script>

<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Merriweather:wght@400;700&family=Mulish:wght@400;500;600;700;800&display=swap" rel="stylesheet">
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css">
<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
<link rel="stylesheet" href="../css/srm-college.css">
<style>
.srm-hero{background:linear-gradient(135deg,rgba(28,18,16,.92) 0%,rgba(146,64,14,.85) 55%,rgba(180,83,9,.8) 100%),url("../images/${c.bg}") center/cover no-repeat}
</style>
</head>
<body class="srm-body">

<div class="srm-page">

  <!-- ALERT BAR -->
  <div class="srm-alert-bar">
    <i class="fa-solid fa-graduation-cap"></i> B.Tech Admissions 2026–27 — Seats filling fast!
    <a href="#hero-form">Apply Now — Free Counselling</a>
  </div>

  <!-- NAVBAR -->
  <header class="srm-navbar">
    <div class="container">
      <div class="srm-nav-inner">
        <a href="../index.html" class="srm-nav-brand" aria-label="btech">
          <span class="srm-nav-logo-badge">EV</span>
          <span class="srm-nav-wordmark">
            <span class="srm-nav-wordmark-row">Edu<span class="srm-nav-wordmark-accent">Vista</span></span>
            <small>Consulting</small>
          </span>
        </a>
        <span class="srm-nav-college" aria-label="${c.name}">
          <img src="../images/${c.bg}" alt="btech">
          <span class="lbl">${c.short}</span>
        </span>
        <a href="tel:${PHONE_TEL}" class="srm-nav-call" aria-label="Call ${PHONE_DISPLAY}">
          <i class="fa-solid fa-phone"></i> <span>${PHONE_DISPLAY}</span>
        </a>
      </div>
    </div>
  </header>

  <!-- NOTICE MARQUEE -->
  <div class="srm-notice-marquee" role="note">
    <div class="srm-notice-track">
${(() => {
  const msg = `${BRAND} is an independent education consultancy and is not officially affiliated with ${c.name}, its management, or any of its campuses. All institute names, logos and trademarks are the property of their respective owners and are used here for informational reference only.`;
  return Array.from({ length: 4 }, () => `      <span class="srm-notice-item"><i class="fa-solid fa-circle-info"></i> ${msg}</span>`).join('\n      <span class="srm-notice-dot">•</span>\n');
})()}
    </div>
  </div>

  <!-- HERO -->
  <section class="srm-hero">
    <div class="container">
      <div class="row align-items-center g-4">
        <div class="col-lg-7">
          <div class="hero-badge"><i class="fa-solid fa-graduation-cap"></i> B.Tech Admissions 2026–27 Open</div>
          <h1 class="hero-title">Consultancy Support for <em>${c.short}</em> Admissions 2026</h1>
          <div class="hero-sub">
            ${c.accreditation} • ${c.approvals} • ${c.type} • Affiliated to ${c.affiliation}<br>
            ${c.blurb}
          </div>
          <div class="hero-pills">
            <span class="hero-pill green"><i class="fa-solid fa-circle-check"></i> ${c.accreditation}</span>
            <span class="hero-pill green"><i class="fa-solid fa-circle-check"></i> ${c.approvals}</span>
            <span class="hero-pill"><i class="fa-solid fa-building-columns"></i> Est. ${c.year}</span>
          </div>
          <div class="hero-stats">
            <div class="hero-stat"><div class="val">${c.year}</div><div class="lbl">Established</div></div>
            <div class="hero-stat"><div class="val">${new Date().getFullYear() - c.year}+</div><div class="lbl">Years Legacy</div></div>
            <div class="hero-stat"><div class="val">500+</div><div class="lbl">Recruiters*</div></div>
          </div>
        </div>
        <div class="col-lg-5">
          <div class="srm-form-card" id="hero-form">
            <div class="srm-form-head">
              <h5>Admission Enquiry</h5>
              <small>B.Tech 2026–27 · Free Counselling</small>
            </div>
            <form data-enquiry>
              <input type="hidden" name="college" value="${c.name}">
              <input type="hidden" name="source" value="college-page">
              <input type="hidden" name="page" value="${c.file}">
              <div class="mb-3">
                <label class="form-label">Full Name *</label>
                <input type="text" name="name" class="form-control" placeholder="Enter your full name" required>
              </div>
              <div class="mb-3">
                <label class="form-label">Phone Number *</label>
                <div class="phone-group">
                  <select class="form-select flag-select" name="country_code">
                    <option value="+91" selected>🇮🇳 +91</option>
                    <option value="+971">🇦🇪 +971</option>
                    <option value="+1">🇺🇸 +1</option>
                    <option value="+44">🇬🇧 +44</option>
                  </select>
                  <input type="tel" name="phone" class="form-control" placeholder="10-digit mobile number" required>
                </div>
              </div>
              <div class="mb-3">
                <label class="form-label">Email Address *</label>
                <input type="email" name="email" class="form-control" placeholder="you@example.com" required>
              </div>
              <div class="mb-3">
                <label class="form-label">Course Interested *</label>
                <select class="form-select" name="course" required>
                  <option value="" selected disabled>Select Course</option>
${COURSES.map((co) => `                  <option>B.Tech ${courseOption(co.name)}</option>`).join('\n')}
                  <option>Not decided yet</option>
                </select>
              </div>
              <div class="mb-3">
                <label class="form-label">State *</label>
                <select class="form-select" name="state" required>
                  <option value="" selected disabled>Select Your State</option>
${STATES.map((s) => `                  <option>${s}</option>`).join('\n')}
                </select>
              </div>
              <div class="mb-3">
                <label class="form-label">City *</label>
                <input type="text" name="city" class="form-control" placeholder="Your city" required>
              </div>
              <button type="submit" class="srm-btn-submit">Get Free Guidance <i class="fa-solid fa-graduation-cap"></i></button>
            </form>
            <div class="srm-form-success">
              <i class="fa-solid fa-circle-check"></i>
              Thank you — our counsellor will reach out within 4 working hours.
            </div>
            <div class="srm-form-link">
              <i class="fa-solid fa-phone"></i> Or call: <a href="tel:${PHONE_TEL}">${PHONE_DISPLAY}</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- TRUST BAR -->
  <section class="srm-trust">
    <div class="container">
      <div class="row text-center g-3 align-items-center">
        <div class="col-6 col-md"><div class="trust-item justify-content-center"><span class="trust-icon"><i class="fa-solid fa-building-columns"></i></span><div><strong>Est. ${c.year}</strong><small>${c.type}</small></div></div></div>
        <div class="col-1 d-none d-md-block"><div class="trust-divider"></div></div>
        <div class="col-6 col-md"><div class="trust-item justify-content-center"><span class="trust-icon"><i class="fa-solid fa-award"></i></span><div><strong>${c.accreditation}</strong><small>Accreditation</small></div></div></div>
        <div class="col-1 d-none d-md-block"><div class="trust-divider"></div></div>
        <div class="col-6 col-md"><div class="trust-item justify-content-center"><span class="trust-icon"><i class="fa-solid fa-flask"></i></span><div><strong>${c.approvals}</strong><small>Approved</small></div></div></div>
        <div class="col-1 d-none d-md-block"><div class="trust-divider"></div></div>
        <div class="col-6 col-md"><div class="trust-item justify-content-center"><span class="trust-icon"><i class="fa-solid fa-graduation-cap"></i></span><div><strong>${c.affiliation}</strong><small>Affiliation</small></div></div></div>
      </div>
    </div>
  </section>

  <!-- WHY -->
  <section class="srm-sec alt">
    <div class="container">
      <div class="text-center mb-5">
        <div class="srm-sec-label">College at a Glance</div>
        <h2 class="srm-sec-title">Why ${c.short} Stands Out</h2>
        <p class="srm-sec-sub">${c.pitch}</p>
      </div>
      <div class="row g-4">
        <div class="col-6 col-lg-3"><div class="srm-stat-card"><div class="ic"><i class="fa-solid fa-graduation-cap"></i></div><div class="num">12+</div><div class="lbl">B.Tech Branches</div></div></div>
        <div class="col-6 col-lg-3"><div class="srm-stat-card"><div class="ic"><i class="fa-solid fa-building"></i></div><div class="num">500+</div><div class="lbl">Recruiting Companies*</div></div></div>
        <div class="col-6 col-lg-3"><div class="srm-stat-card"><div class="ic"><i class="fa-solid fa-sack-dollar"></i></div><div class="num">₹40L+</div><div class="lbl">Top B.Tech Offers*</div></div></div>
        <div class="col-6 col-lg-3"><div class="srm-stat-card"><div class="ic"><i class="fa-solid fa-globe"></i></div><div class="num">${new Date().getFullYear() - c.year}+</div><div class="lbl">Years of Alumni</div></div></div>
      </div>
    </div>
  </section>

  <!-- COURSES -->
  <section class="srm-sec" id="courses">
    <div class="container">
      <div class="text-center mb-5">
        <div class="srm-sec-label">Courses Offered</div>
        <h2 class="srm-sec-title">B.Tech Specialisations at ${c.short}</h2>
        <p class="srm-sec-sub">Engineering streams across core and emerging tracks — CSE, AI, ECE and more.</p>
      </div>
      <div class="row g-4">
${COURSES.map((co) => `        <div class="col-sm-6 col-lg-4"><div class="srm-course-card"><div class="ic"><i class="fa-solid ${co.ic}"></i></div><h5>${co.name}</h5><p>${co.desc}</p><span class="srm-apply-badge">4 Years · B.Tech</span></div></div>`).join('\n')}
      </div>
      <div class="text-center mt-5">
        <button class="srm-cta-btn" data-bs-toggle="modal" data-bs-target="#${modalId}">Apply for 2026 Batch</button>
      </div>
    </div>
  </section>

  <!-- ELIGIBILITY -->
  <section class="srm-sec alt" id="eligibility">
    <div class="container">
      <div class="text-center mb-5">
        <div class="srm-sec-label">Eligibility</div>
        <h2 class="srm-sec-title">Eligibility Criteria for B.Tech 2026</h2>
      </div>
      <div class="row g-4 align-items-start">
        <div class="col-lg-7">
          <div class="srm-elig-item"><div class="srm-elig-check">✓</div><div><strong>Class 12 / Equivalent</strong><p>CBSE, ISC, IB, Cambridge or State Board (PUC) with Physics, Chemistry / Biology, Mathematics.</p></div></div>
          <div class="srm-elig-item"><div class="srm-elig-check">✓</div><div><strong>Minimum Aggregate</strong><p>45–50% aggregate in PCM / PCB for general category; relaxations apply for SC/ST and reserved categories.</p></div></div>
          <div class="srm-elig-item"><div class="srm-elig-check">✓</div><div><strong>Compulsory Subjects</strong><p>Physics &amp; Mathematics mandatory; plus Chemistry / Biology / Computer Science / Biotechnology.</p></div></div>
          <div class="srm-elig-item"><div class="srm-elig-check">✓</div><div><strong>Entrance Exam</strong><p>Valid KCET, COMEDK UGET, JEE Main rank, or direct / management channel based on programme.</p></div></div>
          <div class="srm-elig-item"><div class="srm-elig-check">✓</div><div><strong>Nationality</strong><p>Open to Indian students across all states and NRIs / foreign nationals (separate admission portal).</p></div></div>
          <h4 class="mt-4 mb-3" style="font-size:1rem;font-weight:700;font-family:'Merriweather',serif;color:var(--navy)">Accepted Entrance Exams</h4>
          <p style="font-size:.85rem;color:var(--muted);margin-bottom:12px;">Score in any of these to secure your B.Tech seat at ${c.short}:</p>
          <div class="srm-exam-pills">
${c.accepted.map((e) => `            <span class="srm-exam-pill">${e}</span>`).join('\n')}
          </div>
        </div>
        <div class="col-lg-5">
          <div class="srm-elig-box">
            <h4>Need help with the admission process?</h4>
            <p>Our senior counsellors guide families through KCET / COMEDK registration, branch selection and management-quota documentation for ${c.short} 2026–27.</p>
            <a href="#hero-form" class="srm-btn-outline-light">Check My Eligibility</a>
            <div class="mt-3"><a class="srm-btn-outline-light" data-bs-toggle="modal" data-bs-target="#${modalId}">Book Free Counselling</a></div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- PROCESS -->
  <section class="srm-sec" id="process">
    <div class="container">
      <div class="text-center mb-5">
        <div class="srm-sec-label">How to Apply</div>
        <h2 class="srm-sec-title">Admission Process 2026–27</h2>
        <p class="srm-sec-sub">Five clear steps to secure your B.Tech seat at ${c.short} for the 2026–27 academic year.</p>
      </div>
      <div class="row g-4 justify-content-center">
        <div class="col-6 col-md-4 col-lg-2 text-center position-relative"><div class="srm-step"><div class="num">1</div><h6>Fill Enquiry</h6><p>Submit your profile for free counselling</p><span class="arrow">→</span></div></div>
        <div class="col-6 col-md-4 col-lg-2 text-center position-relative"><div class="srm-step"><div class="num">2</div><h6>Advisory Call</h6><p>Branch, fees, document review</p><span class="arrow">→</span></div></div>
        <div class="col-6 col-md-4 col-lg-2 text-center position-relative"><div class="srm-step"><div class="num">3</div><h6>Register &amp; Appear</h6><p>KCET / COMEDK / JEE / direct application</p><span class="arrow">→</span></div></div>
        <div class="col-6 col-md-4 col-lg-2 text-center position-relative"><div class="srm-step"><div class="num">4</div><h6>Offer Letter</h6><p>Provisional offer + document verification</p><span class="arrow">→</span></div></div>
        <div class="col-6 col-md-4 col-lg-2 text-center position-relative"><div class="srm-step"><div class="num">5</div><h6>Fee &amp; Joining</h6><p>Fee remittance, hostel &amp; orientation</p></div></div>
      </div>
      <div class="text-center mt-5">
        <button class="srm-cta-btn" data-bs-toggle="modal" data-bs-target="#${modalId}">Start My Application <i class="fa-solid fa-arrow-right"></i></button>
      </div>
    </div>
  </section>

  <!-- REASONS -->
  <section class="srm-sec alt">
    <div class="container">
      <div class="text-center mb-5">
        <div class="srm-sec-label">Why This Institute</div>
        <h2 class="srm-sec-title">6 Reasons to Choose ${c.short}</h2>
      </div>
      <div class="row g-4">
        <div class="col-sm-6 col-lg-4"><div class="srm-reason-card"><div class="ic"><i class="fa-solid fa-briefcase"></i></div><h5>Strong Placements</h5><p>Broad recruiter base across product, IT services, consulting and core-engineering companies. Strong hiring traction in CSE, AI/ML and ECE tracks each admission cycle.</p></div></div>
        <div class="col-sm-6 col-lg-4"><div class="srm-reason-card"><div class="ic"><i class="fa-solid fa-flask-vial"></i></div><h5>Research &amp; Labs</h5><p>Modern labs across CSE, electronics and applied-science streams, with dedicated centres for AI / IoT and innovation projects.</p></div></div>
        <div class="col-sm-6 col-lg-4"><div class="srm-reason-card"><div class="ic"><i class="fa-solid fa-chalkboard-user"></i></div><h5>Experienced Faculty</h5><p>Professors with strong academic backgrounds and industry practitioners delivering a modern, relevant curriculum.</p></div></div>
        <div class="col-sm-6 col-lg-4"><div class="srm-reason-card"><div class="ic"><i class="fa-solid fa-earth-americas"></i></div><h5>Industry Tie-ups</h5><p>Internships, capstone projects and recruitment partnerships with leading IT services, product companies and startups.</p></div></div>
        <div class="col-sm-6 col-lg-4"><div class="srm-reason-card"><div class="ic"><i class="fa-solid fa-house-laptop"></i></div><h5>Campus Life</h5><p>On-campus hostels, mess, gym, clubs and a rich student-community life — especially helpful for out-of-Karnataka students.</p></div></div>
        <div class="col-sm-6 col-lg-4"><div class="srm-reason-card"><div class="ic"><i class="fa-solid fa-layer-group"></i></div><h5>Multiple Entry Paths</h5><p>KCET, COMEDK, JEE Main and management-quota seats — flexibility to match your rank profile and budget.</p></div></div>
      </div>
    </div>
  </section>

  <!-- CAMPUS BANNER -->
  <div class="srm-campus-banner">
    <div class="container">
      <h3><i class="fa-solid fa-building-columns"></i> ${c.name} — Main Campus</h3>
      <p>${c.location}</p>
      <button class="srm-btn-outline-light mt-2" data-bs-toggle="modal" data-bs-target="#${modalId}">Book a Campus Visit</button>
    </div>
  </div>

  <!-- PLACEMENTS -->
  <section class="srm-sec alt" id="placements">
    <div class="container">
      <div class="text-center mb-5">
        <div class="srm-sec-label">Placements</div>
        <h2 class="srm-sec-title">Placements at a Glance</h2>
        <p class="srm-sec-sub">Decades of industry network translate into consistent placement outcomes every year.</p>
      </div>
      <div class="row g-4 mb-4 text-center">
        <div class="col-6 col-md-3"><div class="srm-place-stat"><div class="val">₹40L+</div><div class="lbl">Top B.Tech Offers*</div></div></div>
        <div class="col-6 col-md-3"><div class="srm-place-stat"><div class="val">${new Date().getFullYear() - c.year}+</div><div class="lbl">Years of Placement Data</div></div></div>
        <div class="col-6 col-md-3"><div class="srm-place-stat"><div class="val">500+</div><div class="lbl">Recruiting Companies*</div></div></div>
        <div class="col-6 col-md-3"><div class="srm-place-stat"><div class="val">6th Sem</div><div class="lbl">Eligibility Onwards</div></div></div>
      </div>
      <p style="font-size:.78rem;color:var(--ev-text-lighter, #8a93a8);text-align:center;margin-top:-4px">*Figures are indicative, compiled from publicly available ${c.short} placement reports. Current-cycle numbers vary and are published in the institute's official placement brochure.</p>

      <div class="srm-marquee mb-2">
        <div class="srm-marquee-track">
${[...RECRUITERS, ...RECRUITERS].map((r) => `          <span class="srm-chip">${r}</span>`).join('\n')}
        </div>
      </div>

      <div class="text-center mt-4">
        <button class="srm-cta-btn" data-bs-toggle="modal" data-bs-target="#${modalId}">Secure Your Seat — Apply Now</button>
      </div>
    </div>
  </section>

  <!-- TESTIMONIALS -->
  <section class="srm-sec">
    <div class="container">
      <div class="text-center mb-5">
        <div class="srm-sec-label">Student Reviews</div>
        <h2 class="srm-sec-title">What Our Students Say</h2>
        <p class="srm-sec-sub">Families we've helped in the 2026–27 cycle.</p>
      </div>
      <div class="row g-4">
        <div class="col-md-6 col-lg-4"><div class="srm-test-card"><div class="stars">★★★★★</div><p>"Secured ${c.short} <strong>CSE (AI &amp; ML)</strong> through the KCET channel. ${BRAND} walked me through branch comparison and hostel options without pushing anything unnecessary."</p><div class="srm-test-author"><div class="avatar" style="background:linear-gradient(135deg,#0f766e,#14857c)">A</div><div><strong>Arjun Rajan</strong><small>CSE (AI/ML) — 2026–27</small></div></div></div></div>
        <div class="col-md-6 col-lg-4"><div class="srm-test-card"><div class="stars">★★★★★</div><p>"Rank-to-branch map saved us weeks. Ended up picking ${c.short} for proximity. The entire document verification happened online — very smooth."</p><div class="srm-test-author"><div class="avatar" style="background:linear-gradient(135deg,#f59e0b,#b97509)">S</div><div><strong>Sneha Iyer</strong><small>B.Tech ECE — 2026–27</small></div></div></div></div>
        <div class="col-md-6 col-lg-4"><div class="srm-test-card"><div class="stars">★★★★★</div><p>"Got <strong>Information Science</strong> through the management channel. No pushy sales calls — just a clear fee breakdown and timelines."</p><div class="srm-test-author"><div class="avatar" style="background:linear-gradient(135deg,#134e4a,#1c635e)">V</div><div><strong>Vikram Shetty</strong><small>ISE — 2026–27</small></div></div></div></div>
        <div class="col-md-6 col-lg-4"><div class="srm-test-card"><div class="stars">★★★★★</div><p>"Advisors were honest — they told me a COMEDK rank alone wouldn't help and guided me towards the right channel. Followed the advice, got CSE at ${c.short}."</p><div class="srm-test-author"><div class="avatar" style="background:linear-gradient(135deg,#0d6660,#0f766e)">P</div><div><strong>Priya Subramanian</strong><small>B.Tech CSE — 2026–27</small></div></div></div></div>
        <div class="col-md-6 col-lg-4"><div class="srm-test-card"><div class="stars">★★★★★</div><p>"Industry tie-ups were a big draw for me. The team helped me shortlist the right specialisation along with my admission to ${c.short}."</p><div class="srm-test-author"><div class="avatar" style="background:linear-gradient(135deg,#0f766e,#115e59)">N</div><div><strong>Nikhil Varma</strong><small>CSE (Data Science) — 2026–27</small></div></div></div></div>
        <div class="col-md-6 col-lg-4"><div class="srm-test-card"><div class="stars">★★★★★</div><p>"Came from outside Karnataka — ${BRAND} handled the hostel allocation guidance and even a welcome checklist. Reassuring through and through."</p><div class="srm-test-author"><div class="avatar" style="background:linear-gradient(135deg,#f59e0b,#fbbf24)">R</div><div><strong>Riya Kapoor</strong><small>Biotechnology — 2026–27</small></div></div></div></div>
      </div>
    </div>
  </section>

  <!-- FAQ -->
  <section class="srm-sec alt" id="faq">
    <div class="container">
      <div class="text-center mb-5">
        <div class="srm-sec-label">FAQ</div>
        <h2 class="srm-sec-title">Frequently Asked Questions</h2>
        <p class="srm-sec-sub">Common questions about B.Tech admissions at ${c.short} for 2026–27.</p>
      </div>
      <div class="row justify-content-center">
        <div class="col-lg-9">
          <div class="accordion" id="faq-${c.short.replace(/\s+/g, '')}">
            <div class="accordion-item"><h2 class="accordion-header"><button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#faq1-${c.short.replace(/\s+/g, '')}">Where is the ${c.short} campus located?</button></h2><div id="faq1-${c.short.replace(/\s+/g, '')}" class="accordion-collapse collapse show" data-bs-parent="#faq-${c.short.replace(/\s+/g, '')}"><div class="accordion-body">${c.location}.</div></div></div>
            <div class="accordion-item"><h2 class="accordion-header"><button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#faq2-${c.short.replace(/\s+/g, '')}">Is KCET mandatory to get in?</button></h2><div id="faq2-${c.short.replace(/\s+/g, '')}" class="accordion-collapse collapse" data-bs-parent="#faq-${c.short.replace(/\s+/g, '')}"><div class="accordion-body">No. Admission is also possible via a valid COMEDK UGET rank, JEE Main 2026 score, or through the management / direct channel. Each channel has its own fee slab and branch availability.</div></div></div>
            <div class="accordion-item"><h2 class="accordion-header"><button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#faq3-${c.short.replace(/\s+/g, '')}">What is the fee range for B.Tech at ${c.short}?</button></h2><div id="faq3-${c.short.replace(/\s+/g, '')}" class="accordion-collapse collapse" data-bs-parent="#faq-${c.short.replace(/\s+/g, '')}"><div class="accordion-body">Fees vary by branch and admission channel. KCET-merit fees are the lowest; COMEDK is mid-tier; management-quota fees are highest, with CSE specialisations typically carrying the top slabs. Exact 2026–27 figures are released in the official admission brochure — our advisors share the latest circular after your enquiry.</div></div></div>
            <div class="accordion-item"><h2 class="accordion-header"><button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#faq4-${c.short.replace(/\s+/g, '')}">What placement outcomes can students expect?</button></h2><div id="faq4-${c.short.replace(/\s+/g, '')}" class="accordion-collapse collapse" data-bs-parent="#faq-${c.short.replace(/\s+/g, '')}"><div class="accordion-body">Top B.Tech offers at ${c.short} have historically crossed ₹40 LPA, with CSE and AI/ML tracks attracting the highest packages. For current-cycle figures, refer to the institute's official placement report or ask our advisor.</div></div></div>
            <div class="accordion-item"><h2 class="accordion-header"><button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#faq5-${c.short.replace(/\s+/g, '')}">Which branches see the strongest placements?</button></h2><div id="faq5-${c.short.replace(/\s+/g, '')}" class="accordion-collapse collapse" data-bs-parent="#faq-${c.short.replace(/\s+/g, '')}"><div class="accordion-body">CSE, CSE (AI &amp; ML), CSE (Data Science), CSE (Cyber Security) and ECE consistently see the deepest recruiter activity at ${c.short}. ISE and core branches also place reliably.</div></div></div>
            <div class="accordion-item"><h2 class="accordion-header"><button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#faq6-${c.short.replace(/\s+/g, '')}">Are hostels available?</button></h2><div id="faq6-${c.short.replace(/\s+/g, '')}" class="accordion-collapse collapse" data-bs-parent="#faq-${c.short.replace(/\s+/g, '')}"><div class="accordion-body">Yes — separate hostel blocks for boys and girls with mess facilities. Hostels are strongly advised for out-of-Karnataka students. Our counsellors can guide you through the hostel application process.</div></div></div>
            <div class="accordion-item"><h2 class="accordion-header"><button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#faq7-${c.short.replace(/\s+/g, '')}">Are scholarships available?</button></h2><div id="faq7-${c.short.replace(/\s+/g, '')}" class="accordion-collapse collapse" data-bs-parent="#faq-${c.short.replace(/\s+/g, '')}"><div class="accordion-body">Yes — merit scholarships for top KCET / COMEDK / JEE rankers, plus sports, founder's, and merit-cum-means scholarships. Exact bands change each cycle — contact our advisors for the current matrix.</div></div></div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- FINAL CTA -->
  <section class="srm-final-cta">
    <div class="container">
      <h2>Your Journey to ${c.short} Starts Here</h2>
      <p>Seats in CSE, AI/ML, Data Science and Cyber Security tracks at ${c.short} fill early each cycle. Start your 2026–27 application today.</p>
      <div>
        <button class="srm-cta-primary" data-bs-toggle="modal" data-bs-target="#${modalId}">Apply Now — Free Counselling</button>
        <a href="tel:${PHONE_TEL}" class="srm-cta-outline"><i class="fa-solid fa-phone"></i> ${PHONE_DISPLAY}</a>
        <a href="mailto:${EMAIL}" class="srm-cta-outline">${EMAIL}</a>
      </div>
    </div>
  </section>

  <!-- COUNSELLING MODAL -->
  <div class="modal fade" id="${modalId}" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <div>
            <h5 class="modal-title">Free Counselling — ${c.short}</h5>
          </div>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <p style="font-size:.86rem;color:#5c6478;margin-bottom:18px">Fill in your details. Our advisor will reach out within 4 working hours to guide you through the B.Tech 2026–27 admission process at ${c.short}.</p>
          <form data-enquiry>
            <input type="hidden" name="college" value="${c.name}">
            <input type="hidden" name="source" value="college-page-modal">
            <input type="hidden" name="page" value="${c.file}">
            <div class="mb-3"><label class="form-label">Full Name *</label><input type="text" name="name" class="form-control" placeholder="Enter your full name" required></div>
            <div class="mb-3"><label class="form-label">Phone Number *</label>
              <div class="phone-group">
                <select class="form-select flag-select" name="country_code">
                  <option value="+91" selected>🇮🇳 +91</option><option value="+971">🇦🇪 +971</option><option value="+1">🇺🇸 +1</option><option value="+44">🇬🇧 +44</option>
                </select>
                <input type="tel" name="phone" class="form-control" placeholder="10-digit mobile number" required>
              </div>
            </div>
            <div class="mb-3"><label class="form-label">Email Address *</label><input type="email" name="email" class="form-control" placeholder="you@example.com" required></div>
            <div class="mb-3"><label class="form-label">Course Interested *</label>
              <select class="form-select" name="course" required>
                <option value="" selected disabled>Select Course</option>
${COURSES.map((co) => `                <option>B.Tech ${courseOption(co.name)}</option>`).join('\n')}
                <option>Not decided yet</option>
              </select>
            </div>
            <div class="mb-3"><label class="form-label">State *</label>
              <select class="form-select" name="state" required>
                <option value="" selected disabled>Select Your State</option>
${STATES.map((s) => `                <option>${s}</option>`).join('\n')}
              </select>
            </div>
            <div class="mb-3"><label class="form-label">City *</label><input type="text" name="city" class="form-control" placeholder="Your city" required></div>
            <button type="submit" class="srm-btn-submit">Get Free Admission Guidance</button>
          </form>
          <div class="srm-form-success">
            <i class="fa-solid fa-circle-check"></i>
            Thank you — our counsellor will reach out within 4 working hours.
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- FLOATING CTA BUTTONS -->
  <div class="srm-float-actions" aria-hidden="false">
    <a href="${waLink}" target="_blank" rel="noopener" class="srm-float srm-float-wa" aria-label="Chat on WhatsApp">
      <i class="fa-brands fa-whatsapp"></i>
    </a>
    <a href="tel:${PHONE_TEL}" class="srm-float srm-float-call" aria-label="Call ${PHONE_DISPLAY}">
      <i class="fa-solid fa-phone"></i>
    </a>
  </div>

</div><!-- /.srm-page -->

<footer class="site-footer">
  <div class="footer-grid">
    <div class="footer-brand">
      <div class="brand"><span class="brand-mark">EV</span><span>${BRAND}</span></div>
      <p>${BRAND} is an independent education consultancy guiding Indian families through college admissions across India's top engineering and professional institutions, with transparency and care.</p>
    </div>
    <div>
      <h4>Quick Links</h4>
      <a href="../index.html"><i class="fa-solid fa-angle-right"></i> Home</a>
      <a href="../about.html"><i class="fa-solid fa-angle-right"></i> About Us</a>
      <a href="../contact.html"><i class="fa-solid fa-angle-right"></i> Contact Us</a>
      <a href="../disclaimer.html"><i class="fa-solid fa-angle-right"></i> Disclaimer</a>
    </div>
    <div>
      <h4>Other Colleges</h4>
${colleges.filter((o) => o.file !== c.file).slice(0, 6).map((o) => `      <a href="${o.file}"><i class="fa-solid fa-angle-right"></i> ${o.short}</a>`).join('\n')}
    </div>
    <div>
      <h4>Get In Touch</h4>
      <a href="tel:${PHONE_TEL}"><i class="fa-solid fa-phone"></i> ${PHONE_DISPLAY}</a>
      <a href="${waLink}" target="_blank" rel="noopener"><i class="fa-brands fa-whatsapp"></i> WhatsApp Us</a>
      <a href="mailto:${EMAIL}"><i class="fa-solid fa-envelope"></i> ${EMAIL}</a>
      <a href="https://maps.google.com/?q=${encodeURIComponent(ADDRESS)}" target="_blank" rel="noopener"><i class="fa-solid fa-location-dot"></i> ${ADDRESS}</a>
    </div>
  </div>
  <div class="footer-bottom">
    <div>© ${new Date().getFullYear()} ${BRAND}. All rights reserved.</div>
    <div>
      <a href="../privacy-policy.html">Privacy</a> ·
      <a href="../terms-and-conditions.html">Terms</a> ·
      <a href="../disclaimer.html">Disclaimer</a>
    </div>
  </div>
</footer>

<div class="disclaimer-band">
  <div class="container"><strong>Disclaimer:</strong> ${BRAND} is an independent counselling firm and is <strong>not officially affiliated with ${c.name}</strong>, its management, or any of its campuses. The institute name, logo and related trademarks are the property of their respective owners and are used for informational reference only. Fee structures, cut-offs and placement figures shown are indicative, compiled from publicly available sources, and may change without notice. Final admission decisions rest solely with the institution.</div>
</div>

<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>
<script src="../js/srm-enquiry.js" defer></script>
</body>
</html>
`;
}

let written = 0;
for (const c of colleges) {
  const out = path.join(OUT_DIR, c.file);
  fs.writeFileSync(out, render(c), 'utf8');
  written++;
  console.log(`wrote ${c.file}`);
}
console.log(`\n${written} college pages written to ${OUT_DIR}`);
