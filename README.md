

Premium educational counseling website helping students navigate admission processes for top engineering colleges in India.

## Features

- **18 Pages** — Homepage, 10 college detail pages, about, contact, privacy policy, terms & conditions, disclaimer
- **Premium Design** — Glassmorphism cards, animated gradient meshes, 3D card tilt effects, canvas particle system, gradient text animations
- **Lead Capture** — Timed popup form (10s/30s/2min), contact form, WhatsApp integration
- **Responsive** — Fully mobile-optimized with touch gestures, frosted glass mobile nav, safe-area support
- **Backend** — Express.js + MongoDB Atlas API for lead storage and admin authentication

## Tech Stack

- **Frontend:** Vanilla HTML5, CSS3, JavaScript (ES6+)
- **Fonts:** Space Grotesk (headings), DM Sans (body), JetBrains Mono (stats)
- **Backend:** Express.js + MongoDB (Vercel Serverless Functions)
- **Deployment:** Vercel

## Colleges Covered

1. RV University
2. Ramaiah Institute of Technology
3. BMS College of Engineering
4. Dayananda Sagar College of Engineering
5. Nitte Meenakshi Institute of Technology
6. Sir M. Visvesvaraya Institute of Technology
7. Bangalore Institute of Technology
8. CMR Institute of Technology
9. REVA University
10. Alliance University

## Project Structure

```
├── index.html              # Homepage
├── about.html              # About page
├── contact.html            # Contact page with form
├── colleges/               # 10 college detail pages
├── css/                    # 12 modular CSS files
│   ├── variables.css       # Design tokens
│   ├── base.css            # Reset & typography
│   ├── animations.css      # Keyframes & scroll reveals
│   ├── components.css      # Buttons, cards, forms
│   ├── nav.css             # Frosted glass navbar
│   ├── hero.css            # Hero section
│   ├── sections.css        # Homepage sections
│   └── ...
├── js/                     # 7 JS modules
│   ├── app.js              # Core (nav, scroll, accordion)
│   ├── hero.js             # Canvas mesh & particles
│   ├── cards.js            # 3D tilt effects
│   ├── testimonials.js     # Carousel
│   └── ...
├── api/                    # Vercel serverless functions
│   ├── leads.js            # Lead capture API
│   └── auth/               # Admin authentication
└── images/                 # College backgrounds, avatars, icons
```

## Setup

```bash
npm install
vercel dev
```

## Environment Variables

- `MONGODB_URI` — MongoDB Atlas connection string



