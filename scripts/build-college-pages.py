#!/usr/bin/env python3
"""Generate every college page from the shared rvce3-derived premium template.
Run from the campuspathway/ directory:  python3 scripts/build-college-pages.py
Each page shares one design system (css/college-premium.css + js/college-premium.js);
only the college data changes."""
import os

PHONE = "+919765785479"
PHONE_DISP = "+91 97657 85479"
EMAIL = "info@binayak.com"

COLLEGES = [
    dict(file="bit.html", full="Bangalore Institute of Technology", alias="BIT", short="BIT",
         bg="bit-bg.jpg", year="1979", legacy="47+", naac="A", type="Private (Autonomous)",
         address="K R Road, V V Puram, Bengaluru — 560004",
         hero="A heritage Bengaluru institution since 1979, located in central V V Puram. Well-known for ECE, CSE and mechanical engineering.",
         why="Central Bengaluru location, four decades of alumni in the city's manufacturing and IT industries, and steady KCET / COMEDK admission patterns."),
    dict(file="bms-college.html", full="BMS College of Engineering", alias="BMSCE", short="BMSCE",
         bg="bms-bg.jpg", year="1946", legacy="80+", naac="A++", type="Private (Autonomous)",
         address="Bull Temple Road, Basavanagudi, Bengaluru — 560019",
         hero="India's first private engineering college, founded in 1946. BMSCE blends heritage with modern CSE, AI and ECE specialisations.",
         why="The oldest private engineering college in the country, with deep industry ties, a Basavanagudi campus right in central Bengaluru, and reliable placements across CSE and ECE."),
    dict(file="cmrit.html", full="CMR Institute of Technology", alias="CMRIT", short="CMRIT",
         bg="cmrit-bg.jpg", year="2000", legacy="26+", naac="A+", type="Private (Autonomous)",
         address="132, AECS Layout, ITPL Main Road, Kundalahalli, Bengaluru — 560037",
         hero="A CMR Group institution right next to the ITPL tech corridor — strong corporate connect and modern CSE / AI specialisations.",
         why="Whitefield/ITPL adjacency is a real advantage — placement teams have an easier walk-in cadence and students get internship access early."),
    dict(file="dayananda-sagar.html", full="Dayananda Sagar College of Engineering", alias="DSCE", short="DSCE",
         bg="dsce-bg.jpg", year="1979", legacy="47+", naac="A", type="Private (Autonomous)",
         address="Shavige Malleshwara Hills, Kumaraswamy Layout, Bengaluru — 560078",
         hero="Part of the Dayananda Sagar Group, established 1979. A 70-acre south-Bengaluru campus with strong CSE and biotech tracks.",
         why="Sprawling green campus near Banashankari, with one of the better biotech and CSE specialisation menus in Bengaluru — and a healthy mix of KCET, COMEDK and management seats."),
    dict(file="nitte.html", full="Nitte Meenakshi Institute of Technology", alias="NMIT", short="NMIT",
         bg="nitte-bg.jpg", year="2001", legacy="25+", naac="A+", type="Private (Autonomous)",
         address="Govindapura, Gollahalli, Yelahanka, Bengaluru — 560064",
         hero="A Nitte Education Trust institution near Bengaluru airport. Strong CSE, AI/ML, and electronics tracks with active industry tie-ups.",
         why="Yelahanka campus in north Bengaluru, modern infrastructure, and a focused autonomous syllabus — increasingly the picks for students aiming at product-engineering roles."),
    dict(file="ramaiah.html", full="Ramaiah Institute of Technology", alias="MSRIT", short="MSRIT",
         bg="ramaiah-bg.jpg", year="1962", legacy="64+", naac="A+", type="Private (Autonomous)",
         address="MSR Nagar, MSRIT Post, Bengaluru — 560054",
         hero="A flagship Bengaluru engineering college since 1962, with a strong reputation in CSE, ECE and core engineering branches.",
         why="Excellent core-engineering pedigree, consistent top-tier IT placements, and a tightly-knit alumni network across Bengaluru's product and services industry."),
    dict(file="rv-college.html", full="RV University", alias="RV University", short="RV University",
         bg="rvce-bg.jpg", year="1963", legacy="63+", naac="A++", type="Private (Autonomous)",
         address="Mysuru Road, RV Vidyaniketan Post, Bengaluru — 560059",
         hero="One of India's leading engineering institutions, established in 1963 and consistently ranked among the top private colleges in Karnataka.",
         why="Six decades of alumni reach, top private-college placements in Karnataka, and deep CSE specialisations (AI/ML, Cyber, Data Science) — for KCET-competitive families, RV University deserves a serious conversation."),
    dict(file="sir-mvit.html", full="Sir M Visvesvaraya Institute of Technology", alias="Sir MVIT", short="Sir MVIT",
         bg="smvit-bg.jpg", year="1986", legacy="40+", naac="A", type="Private",
         address="Hunasamaranahalli, International Airport Road, Bengaluru — 562157",
         hero="Founded in 1986 on a 50-acre north-Bengaluru campus near the international airport, with strong CSE and ECE departments.",
         why="Quiet, green campus on the airport-road corridor with sensible fees, balanced course offerings and reliable VTU outcomes."),
]

# "Other colleges" footer links (all except current)
def other_links(cur):
    out = []
    for c in COLLEGES:
        if c["file"] == cur["file"]:
            continue
        out.append('      <a href="{f}"><span class="fa">›</span> {a}</a>'.format(f=c["file"], a=c["alias"]))
    return "\n".join(out)

RECRUITERS = ["Microsoft","Amazon","Cognizant","Infosys","TCS","Wipro","Accenture","Deloitte","Ford","Hyundai",
              "Ashok Leyland","Capgemini","HCL","Mphasis","Oracle","SAP","Cisco","IBM","Intel","Samsung"]

def chips():
    row = "".join('<span class="reveal-chip">{}</span>'.format(r) for r in RECRUITERS)
    return row + row  # duplicate for seamless marquee

COURSE_OPTIONS = """                <option value="" selected disabled>Select Course</option>
                <option>B.Tech Computer Science &amp; Engineering</option>
                <option>B.Tech CSE (AI &amp; Machine Learning)</option>
                <option>B.Tech CSE (Data Science)</option>
                <option>B.Tech CSE (Cyber Security)</option>
                <option>B.Tech Electronics &amp; Communication</option>
                <option>B.Tech Information Science</option>
                <option>B.Tech Mechanical Engineering</option>
                <option>B.Tech Electrical &amp; Electronics</option>
                <option>B.Tech Civil Engineering</option>
                <option>B.Tech Biotechnology</option>
                <option>B.Tech Chemical Engineering</option>
                <option>B.Tech Industrial Engineering</option>
                <option>Not decided yet</option>"""

STATE_OPTIONS = """                <option value="" selected disabled>Select Your State</option>
                <option>Karnataka</option><option>Tamil Nadu</option><option>Andhra Pradesh</option>
                <option>Telangana</option><option>Kerala</option><option>Maharashtra</option><option>Delhi</option>
                <option>Gujarat</option><option>Uttar Pradesh</option><option>West Bengal</option><option>Rajasthan</option>
                <option>Jharkhand</option><option>Bihar</option><option>Madhya Pradesh</option><option>Punjab</option><option>Other</option>"""

def enquiry_form(c, source, submit_label):
    """Full lead-capture form wired to srm-enquiry.js (POST /api/leads)."""
    return """<form data-enquiry>
              <input type="hidden" name="college" value="{full}">
              <input type="hidden" name="source" value="{source}">
              <input type="hidden" name="page" value="{file}">
              <input type="text" name="name" placeholder="Full Name" required />
              <div class="phone-group">
                <select class="flag-select" name="country_code" aria-label="Country code">
                  <option value="+91" selected>🇮🇳 +91</option><option value="+971">🇦🇪 +971</option>
                  <option value="+1">🇺🇸 +1</option><option value="+44">🇬🇧 +44</option>
                </select>
                <input type="tel" name="phone" placeholder="10-digit mobile number" required />
              </div>
              <input type="email" name="email" placeholder="Email Address" required />
              <select name="course" required>
{courses}
              </select>
              <select name="state" required>
{states}
              </select>
              <input type="text" name="city" placeholder="Your City" required />
              <label class="form-consent"><input type="checkbox" name="consent" required /><span>I authorise <strong>Binayak Consultancy</strong> to contact me via call, SMS, WhatsApp or email about my enquiry.</span></label>
              <button type="submit">{submit}</button>
            </form>
            <div class="srm-form-success">
              <div class="tick">✓</div>
              <h4>Thank you!</h4>
              <p>Our counsellor will reach out within 4 working hours.</p>
            </div>""".format(full=c["full"], source=source, file=c["file"], courses=COURSE_OPTIONS,
                             states=STATE_OPTIONS, submit=submit_label)

def wa_link(c):
    txt = "Hi%20Binayak%20Consultancy%2C%20I'd%20like%20to%20know%20more%20about%20{alias}%20B.Tech%20admissions%20for%202026-27.".format(alias=c["alias"].replace(" ", "%20"))
    return "https://wa.me/919765785479?text=" + txt

def title_name(c):
    return c["full"] if c["alias"] == c["full"] else "{} ({})".format(c["full"], c["alias"])

TEMPLATE = open(os.path.join(os.path.dirname(__file__), "college-template.html")).read()

def render(c):
    html = TEMPLATE
    repl = {
        "%%FULL%%": c["full"],
        "%%ALIAS%%": c["alias"],
        "%%SHORT%%": c["short"],
        "%%TITLENAME%%": title_name(c),
        "%%FILE%%": c["file"],
        "%%BG%%": c["bg"],
        "%%YEAR%%": c["year"],
        "%%LEGACY%%": c["legacy"],
        "%%NAAC%%": c["naac"],
        "%%TYPE%%": c["type"],
        "%%ADDRESS%%": c["address"],
        "%%HERODESC%%": c["hero"],
        "%%WHY%%": c["why"],
        "%%PHONE%%": PHONE,
        "%%PHONE_DISP%%": PHONE_DISP,
        "%%EMAIL%%": EMAIL,
        "%%WA%%": wa_link(c),
        "%%CHIPS%%": chips(),
        "%%OTHERLINKS%%": other_links(c),
        "%%FORM_PROCESS%%": enquiry_form(c, "college-page", "Submit Enquiry"),
        "%%FORM_CONSULT%%": enquiry_form(c, "college-page-consult", "Book Consultation"),
        "%%FORM_FAQ%%": enquiry_form(c, "college-page-faq", "Submit Enquiry"),
    }
    for k, v in repl.items():
        html = html.replace(k, v)
    return html

if __name__ == "__main__":
    outdir = "colleges"
    for c in COLLEGES:
        path = os.path.join(outdir, c["file"])
        with open(path, "w") as f:
            f.write(render(c))
        print("wrote", path)
    # sanity: no leftover tokens
    import glob, re
    for p in glob.glob(os.path.join(outdir, "*.html")):
        leftover = re.findall(r"%%[A-Z_]+%%", open(p).read())
        if leftover:
            print("!! leftover tokens in", p, set(leftover))
    print("done")
