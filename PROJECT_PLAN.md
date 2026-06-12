# Hidden Lakes Website — Project Plan & Progress Tracker

**Purpose:** Living checklist so work can pause/resume across sessions. Update the
status boxes as items are completed. Repo: `AdamMeeker/hidden-lakes-website`
(deploys to Azure Static Web Apps on every push to `main` via GitHub Actions).

**Workflow reminder:** Edits are made to files in this folder, then committed &
pushed via **GitHub Desktop** (the Linux sandbox cannot push — credentials live in
the macOS keychain). Pushing to `main` auto-triggers the Azure build.

Files: `index.html`, `styles.css`, `script.js`, `images/`.

---

## STATUS LEGEND
- [ ] = not started
- [~] = in progress / partially done
- [x] = done & pushed
- [?] = blocked, needs info from Tiffany

---

## A. QUICK CONTENT FIXES (low risk, high value)  — DONE 2026-06-03

### A1. Lot count 52 → 50  [x]
Replace every "52" referring to lot count with "50". Locations found:
- `index.html` line ~7  (meta description)
- `index.html` line ~10 (og:description)
- `index.html` line ~15 (twitter:description)
- `index.html` line ~66 (hero stat value)
- `index.html` line ~623 (footer description)
- `script.js` line ~80 (comment) and the lotData array length

### A2. Lot size range "0.5 to 5 acres" → "0.5 to 1.5 acres"  [x]
(script.js rebuilt: 50 lots, all 0.5–1.5 ac, 5-ac lots removed, stats now 50/28)
- `index.html` line ~106 (feature-text: "0.5 to 5 acre homesites")
- `index.html` line ~257 (quick-stat value "0.5 - 5" → "0.5 - 1.5")
- `script.js` lotData: cap ALL sizes at 1.5 acres. Currently several lots are
  2.0/2.1/2.2/2.3/2.5/5.0 acres. Remove the two 5.0-acre lots (ids 51, 52 — the
  "across the road" acreage lots) entirely so the array totals 50, and rewrite any
  size > 1.5 to a value within 0.5–1.5. Update the `view: 'Acreage'` entries.

### A3. Drive times under "Premium Location"  [x]
- Coral Ridge Mall: change **28 min → 15 min** (`index.html` line ~320 area).
- ADD a new row: **Downtown Cedar Rapids — 28 min**.
- Also the Community feature card (`index.html` line ~156) says "28 minutes to
  Coral Ridge Mall" — fix that to 15 minutes too, and consider mentioning Cedar
  Rapids for consistency.

### A4. Instagram link  [x]
- Set the Instagram social link `href` to `https://www.instagram.com/hiddenlakesia/`
  (currently `#`), open in new tab (`target="_blank" rel="noopener"`).
- `index.html` lines ~591 (contact section) — the `.social-link` for Instagram.

### A5. Facebook link  [x] (commented out, restorable)
- Tiffany has NO Facebook yet. REMOVE the Facebook `.social-link` for now (lines
  ~586) OR comment it out so it can be restored later. Don't leave a dead `#` link.

---

## B. GALLERY FIX  [x] — DONE 2026-06-03
**Root cause:** `index.html` gallery `<img src>` point to `images/gallery-1.jpg` …
`gallery-6.jpg`, which no longer exist. Actual files are
`images/Dand_Rd_Drone-1.jpg` … `Dand_Rd_Drone-9.jpg` (9 drone photos, ~6 MB each).
- Repoint the 6 gallery `<img src>` (lines ~369–402) to the Dand_Rd_Drone images.
  Optionally add items for all 9.
- Update `alt` text and the `.gallery-item-overlay span` captions to match.
- Also the **hero** image (`index.html` line ~46) uses `hero-placeholder.svg` —
  swap to a strong drone shot (e.g. `Dand_Rd_Drone-1.jpg`).
- **Performance note:** these JPGs are ~6 MB each (~57 MB total). Strongly
  recommend resizing/compressing to ~1600px / <400 KB before relying on them, or
  the page will load very slowly on mobile. (Sandbox has ImageMagick/`sips` route
  via the user's Mac; can batch-convert.) Track as B-perf.

### B-perf. Compress gallery images  [x]
Done: 9 drone JPGs resized to 1920px (~600KB each, was ~6MB). Originals moved to
`images/originals/` and gitignored (kept locally, not deployed). Hero now uses
Dand_Rd_Drone-1.jpg.

---

## C. CONTACT FORM  [~] — CODE DONE, needs Adam's Azure provisioning
Formspree dropped (paywall). Replaced with **Azure-native** solution:
- `/api/contact` Azure Function (in repo): STORES to Azure Table Storage first,
  THEN emails via Azure Communication Services. Lead never lost if email fails.
- Front-end (`script.js`) posts via fetch with success message + email fallback if
  the API is unreachable. Honeypot anti-spam field added. Status styled in CSS.
- Workflow `api_location` set to `api`.
- **Remaining (Adam):** provision Storage + ACS, set 4 app settings. Full
  checklist in `SETUP_AZURE_FORM.md`. Then test a live submission.
- **Also flagged:** duplicate workflow `azure-static-web-apps.yml` should likely be
  deleted (see SETUP doc).

---

## D. "SCHEDULE A PRIVATE TOUR"  [?]  (NEEDS CLARIFICATION)
Requirement came in incomplete: *"Schedule a private tour, needs to also …"*.
The "Schedule Tour" / "Schedule Private Tour" buttons currently just jump to the
contact form (`#contact`). Ask Tiffany what else it should do, e.g.:
- Link to a scheduling tool (Calendly, etc.)?
- Pre-fill the contact form's "interest" = "Scheduling a Private Tour"?
- Open a different form / phone call CTA?

---

## E. INTERACTIVE LOT MAP  [~] HOVER MAP LIVE; click-to-media still pending
**Vision (Tiffany):** Hover any lot on the site plan → popup showing lot size &
price. Click a lot → go to drone/photos/footage of that specific parcel.

Current state: `script.js` `initLotMap()` is a stub — clicking the site plan opens
a *random* lot; filters do nothing; no per-lot hover regions exist.

**Phase E1 — Map the lots geometrically.  [~] IN PROGRESS**
- DECISION (2026-06-12): keep current `images/site-plan.jpg` as the visible map;
  overlay hover regions. Auto edge-detection rejected (unreliable on busy plat/
  faint aerial). Tracing chosen. Lot data: Tiffany already has it, will share.
- Built `lot-tracer.html` (repo root, gitignored, run locally): loads
  site-plan.jpg (2000x1333), click corners → Enter to close → exports
  `lot-polygons.json` with NORMALIZED 0..1 coords (so overlay scales responsively).
  Has zoom, re-trace, import/resume, localStorage autosave.
- NEXT: Tiffany traces all 50 lots in the tool, exports `lot-polygons.json`, sends
  it back + her lot data. Then build the SVG/canvas overlay from that JSON.
- Reference plat: `images/Plat layout for interactive map.pdf` (clear lot numbers).

**Phase E2 — Hover popups.  [x] DONE 2026-06-12**
- 50 polygons traced via lot-tracer, exported to `images/lot-polygons.json`,
  embedded into `script.js` lotData (with full Exhibit A data: acres, sf, dims,
  road, type, amenities, price). Verified polygon alignment against the image.
- SVG overlay renders per-lot polygons; hover shows tooltip with For-Sale status,
  size, amenities, price. Click opens detail panel. Size/View filters dim
  non-matching lots. Available lots have a faint always-on outline for
  discoverability. All 50 currently `status:'available'`.

**Phase E3 — Per-lot media pages.  [ ] PENDING (needs Tiffany)**
- Click a lot → open that parcel's drone/photo/video. **Need from Tiffany:** which
  drone images/footage map to which lot numbers. Then add `media:[...]` to lotData
  and open a gallery/modal on click instead of (or alongside) the detail panel.
- Also: tell me when any lots become reserved/sold (change `status`).

---

## F. NICE-TO-HAVE / FOLLOW-UPS
- [ ] Custom domain (e.g. hiddenlakesia.com) on Azure — free to attach if owned.
- [ ] Replace developer.jpg (currently a 1.8 KB placeholder) with a real photo.
- [ ] Replace site-plan.jpg if a higher-res plat is available.
- [ ] Confirm correct Google Map embed location (currently generic Iowa City).
- [ ] Install Chrome + extension so the assistant can watch deploys / verify the
      live site end-to-end (Safari is read-only to automation).

---

## OPEN QUESTIONS FOR TIFFANY
1. Formspree endpoint for the contact form? (Item C)
2. What should "Schedule a Private Tour" do beyond jumping to the form? (Item D)
3. Which drone photos/videos correspond to which lot numbers? (Item E3)
4. Real lot prices, or keep "Contact for Pricing"? (Items A2/E)
5. Exact lot boundaries for the interactive map, or OK to approximate v1? (Item E1)

---

## CHANGELOG
- 2026-06-01: Fixed phone tel: link; added SEO/social meta tags + favicon. (pushed)
- 2026-06-01: Added build marker to verify Azure deploy pipeline. (pushed)
- 2026-06-03: Section A complete (50 lots, 0.5-1.5 ac, drive times incl. Cedar
  Rapids 28min, Instagram link live, Facebook removed). (pushed)
- 2026-06-03: Section B complete (gallery repointed to 9 drone photos, compressed
  ~6MB->~600KB, originals gitignored, hero image swapped). (pushed)
- (next) Blocked items C (Formspree endpoint) & D (tour button) need Tiffany;
  then Section E interactive map.
