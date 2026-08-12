# Required assets — Event Photo public site

Every item below is a dashed-border placeholder box (the `AssetPlaceholder` component) already in the code, showing exactly where the real photo, screenshot, or video needs to go. Search the codebase for the bolded label text to find the exact spot. Nothing here needs new code — just swap the placeholder for a real file.

Two spots are marked **(plain circle, not yet a placeholder)** — small avatar-style circles that are just a dashed-border `div` for now rather than the full `AssetPlaceholder` component, since the component's label text doesn't fit in a 32–44px circle. They still need a photo, just wire them up when you're ready.

Legend: 🖼️ image · 🎬 video (or image as a fallback) · 🖼️/🎬 either works, video reads best in the reference

---

## Home page (`/`)

| # | Label in code | Used for |
|---|---|---|
| 1 | 🖼️ "Photo/video: phone mockup showing the guest upload screen with real event photos, plus a QR code card" | Hero visual, right side |
| 2 | 🖼️ "Screenshot: shared gallery view with a grid of guest uploads" | Feature-highlight section mockup |
| 3 | 🖼️ "Screenshot: event creation form (name, date, cover)" | How-it-works step 1 |
| 4 | 🖼️ "Photo: printed table card + QR code" | How-it-works step 2 |
| 5 | 🎬 "Photo/video: TV screen showing live photo wall at an event" | How-it-works step 3 (optional/live-slideshow step) |
| 6 | 🖼️ "Screenshot: finished gallery with guest uploads" | How-it-works step 4 |
| 7 | 🖼️ "Logos: recognizable brands/venues that have used the product (optional, for social proof)" | Stats banner logo strip |
| 8 | 🖼️ "Photo collage: mix of guest-uploaded event photos" | Comparison section collage |

Testimonials on the home page pull from `lib/marketing-content.ts` → `defaultTestimonials`; one entry has a photo placeholder:
| 9 | 🖼️ "Photo: guest holding phone at the event" | Testimonial from "Sara M." — also reused on every use-case page and the two QR-code pages, since they share the same testimonial data |

---

## Pricing page (`/pricing`)

No image placeholders — plan cards are text/price only.

---

## Stories / Wall of Love (`/stories`)

**No placeholders here anymore.** This page is database-backed: photos come from real guest-submitted reviews (via the "Submit a review" modal), not placeholder art. Nothing to swap in manually — it fills in as real reviews get published.

---

## Guides listing (`/guides`)

| # | Label in code | Used for |
|---|---|---|
| 10 | 🖼️ `Cover image for "<guide title>"` — one per guide card | Cover image on every guide card in the grid (currently 5 guides) |

---

## Consumer use-case pages (`use-case-page.tsx` — used by Weddings, Parties, Birthdays, Family Reunions, Graduations)

These 4 placeholders repeat once **per category**, with the label auto-filled with that category's name (e.g. "wedding", "party", "birthday"):

| # | Label pattern | Used for |
|---|---|---|
| 11 | 🖼️ "Photo/video: real **[category]** photos in a phone mockup, plus a QR code card" | Hero visual |
| 12 | 🖼️ "Screenshot: shared gallery for a **[category]** event" | Feature-highlight mockup |
| 13 | 🖼️ "Screenshot: **[category]** gallery creation form (name, date, cover)" | How-it-works step 1 |
| 14 | 🖼️ "Photo: printed **[category]** card + QR code" | How-it-works step 2 |
| 15 | 🎬 "Photo/video: TV screen showing a live photo wall at a **[category]**" | How-it-works step 3 (optional) |
| 16 | 🖼️ "Screenshot: finished **[category]** gallery with guest uploads" | How-it-works step 4 |
| 17 | 🎬 "Photo/video: guests using the live slideshow at a real **[category]**" | "[Category] You'll Never Forget" highlight banner |
| 18 | 🖼️ "Photo collage: guest-uploaded photos from real **[category]** events" | Comparison section collage |
| 19 | **(plain circles, not yet placeholders)** 4 small host/guest headshot photos | Hero trust-avatar row (stacked circles next to the star rating) |

→ **5 categories × 8 image placeholders = 40 images**, plus 20 small headshot photos (4 × 5 categories) for the trust row.

---

## Organization use-case pages (`organization-use-case-page.tsx` — used by Conferences, Corporate)

Repeats **per category** (2 categories: conferences, corporate):

| # | Label pattern | Used for |
|---|---|---|
| 20 | 🖼️ "Photo/video: phone, tablet, and TV mockup showing the live gallery for a **[category]**" | Hero visual |
| 21 | 🖼️ "Photo: branded live photo wall at a **[category]**" | "Why use it" grid, item 1 |
| 22 | 🖼️ "Photo: attendees uploading photos on their phones" | "Why use it" grid, item 2 |
| 23 | 🖼️ "Photo/graphic: social share icons over an event photo" | "Why use it" grid, item 3 |
| 24 | 🖼️ "Photo collage: guest-uploaded content from a past event" | "Why use it" grid, item 4 |
| 25 | 🖼️ "Screenshot: **[category]** gallery creation form (name, date, cover, branding)" | How-it-works step 1 |
| 26 | 🖼️ "Photo: QR code signage + phone mockup for a **[category]**" | How-it-works step 2 |
| 27 | 🎬 "Photo/video: TV screen showing a live photo wall at a **[category]**" | How-it-works step 3 (optional) |
| 28 | 🖼️ "Logo: client, venue, or partner brand mark (optional)" × 6 | Trust-logo strip |

→ **2 categories × 8 image placeholders = 16 images**, plus 12 optional logo slots (6 × 2 categories).

---

## Business page (`/for/business`)

| # | Label in code | Used for |
|---|---|---|
| 29 | 🖼️ "Logo: client, venue, or partner brand mark (optional)" × 6 | Trust-logo strip |
| 30 | 🖼️ "Photo: customer headshot" × 6 | One per business-type tab (Photography, Event Production, Corporate, Business Venue, Education, Other) |
| 31 | 🖼️ "Screenshot: watermark settings with a logo applied to a sample photo" | "Designed for professionals" card 1 |
| 32 | 🖼️ "Screenshot: custom welcome form on the guest upload screen" | "Designed for professionals" card 2 |
| 33 | 🖼️ "Screenshot: white-labeled gallery dashboard" | "Designed for professionals" card 3 |
| 34 | **(plain circles, not yet placeholders)** 3 small avatar photos | "We're here for you" closing banner |

---

## Help Center (`/help`, `/help/[category]`, `/help/[category]/[article]`)

No image placeholders — this section is text/article content only.

---

## Switch page (`/switch`)

| # | Label in code | Used for |
|---|---|---|
| 35 | 🖼️ "Screenshot: your current app's upload or login screen" | Hero, left side of the before/after visual |
| 36 | 🖼️ "Photo/video: Event Photo's guest upload screen with real event photos" | Hero, right side of the before/after visual |
| 37 | 🖼️ "Screenshot: event creation form (name, date, cover)" | How-it-works step 1 |
| 38 | 🖼️ "Photo: QR code signage + phone mockup" | How-it-works step 2 |
| 39 | 🎬 "Photo/video: TV screen showing a live photo wall at an event" | How-it-works step 3 (optional) |

---

## Digital Wedding Guestbook (`/digital-wedding-guestbook`)

Reuses the consumer use-case template (see that section above) with `[category]` = "Weddings" — same 8 image placeholders + 4 trust-row headshots as any other consumer use-case page.

---

## QR Code for Wedding Pictures (`/qr-code-for-wedding-pictures`)

| # | Label in code | Used for |
|---|---|---|
| 40 | 🖼️ "Photo/video: printed welcome sign with names + QR code, next to a phone mockup showing the upload screen" | Hero visual |
| 41 | 🖼️ "Screenshot: shared wedding gallery on a phone, plus a QR code overlay" | Feature-highlight mockup |
| 42 | 🖼️ "Screenshot: wedding album creation form (names, date, cover)" | How-it-works step 1 |
| 43 | 🖼️ "Photo: welcome sign + QR code card" | How-it-works step 2 |
| 44 | 🎬 "Photo/video: reception screen showing a live wedding photo wall" | How-it-works step 3 (optional) |
| 45 | 🖼️ "Screenshot: finished wedding gallery with guest uploads" | How-it-works step 4 |
| 46 | 🖼️ "Photo collage: QR code table card, phone mockup, and guest reactions" | "Why Choose" section image |
| 47 | 🖼️ "Photo collage: guest-submitted wedding photos" | Comparison section collage |
| 48 | 🖼️ "Photo: guest reviewing photos on their phone" | Closing stat/testimonial banner, image 1 |
| 49 | 🖼️ "Photo: finished wedding album shown on a tablet" | Closing stat/testimonial banner, image 2 |
| — | "Photo: guest or host headshot" | Small circular headshot next to the closing banner quote |

---

## QR Code for Photo Sharing (`/qr-code-for-photo-sharing`)

| # | Label in code | Used for |
|---|---|---|
| 50 | 🖼️ "Photo/video: printed party sign with QR code, next to a phone mockup showing the upload screen" | Hero visual |
| 51 | 🖼️ "Screenshot: shared event gallery on a phone, plus a QR code overlay" | Feature-highlight mockup |
| 52 | 🖼️ "Screenshot: event album creation form (name, date, cover)" | How-it-works step 1 |
| 53 | 🖼️ "Photo: printed sign + QR code card" | How-it-works step 2 |
| 54 | 🎬 "Photo/video: screen showing a live event photo wall" | How-it-works step 3 (optional) |
| 55 | 🖼️ "Screenshot: finished event gallery with guest uploads" | How-it-works step 4 |
| 56 | 🖼️ "Photo collage: QR code table card, phone mockup, and guest reactions" | "Why Choose" section image |
| 57 | 🖼️ "Photo collage: guest-submitted event photos" | Comparison section collage |

(No closing stat banner on this page — that's wedding-page-only.)

---

## Privacy Policy, Terms of Use, Data Processing Agreement, Security

No image placeholders — these need real company/legal/security text, not imagery. See the "Template notice" banner on each page. (Security also has no photo/video needs — it's text-only, same as the other three.)

---

## Fair Usage Policy (`/fair-usage-policy`)

No full-size image placeholders — just text and a numbered list.

| # | Label in code | Used for |
|---|---|---|
| — | **(plain circles, not yet placeholders)** 3 small team headshot photos | "Event Photo Team - [support email]" signature line at the bottom |

---

## Fair Refund Policy (`/fair-refund-policy`)

| # | Label in code | Used for |
|---|---|---|
| 58 | 🖼️ "Graphic: money-back guarantee seal/badge" | The circular "100% money-back guarantee" badge graphic between the two paragraphs |
| — | **(plain circles, not yet placeholders)** 3 small team headshot photos | "Event Photo Team - [support email]" signature line at the bottom (can reuse the same 3 photos as the Fair Usage Policy page) |

---

## Videos specifically called out

Every 🎬 row above is a "how-it-works step 3 / live slideshow" spot, and they all currently just hold a static image placeholder — nothing plays a real video anywhere yet. Two buttons also imply a video that doesn't exist behind them:

- **"Watch how it works"** (home hero) and **"Watch video"** (every use-case, QR-code, and switch-page hero) currently just scroll down to the how-it-works section.
- If you produce real demo footage, say so and I'll wire up a lightbox/player for these; otherwise I can soften the button copy so it doesn't promise a video that isn't there.

---

## Rough totals

- **Unique image/video placeholder spots in shared templates:** ~41 (many of these repeat once per category — weddings, parties, birthdays, conferences, corporate, etc. — so the real number of individual files is higher, see the per-section math above).
- **Optional logo slots:** up to 18 (6 per trust-logo strip × 3 pages that have one).
- **Small circular headshots (not full placeholders yet):** ~38 (4 per consumer use-case page × 5 pages, 6 on the Business page tabs, 3 on the Business closing banner, 1 on the wedding QR page's closing banner, 3 each on the Fair Usage and Fair Refund signature blocks).
- **Legal/text-only pages with no imagery needed:** Privacy Policy, Terms of Use, Data Processing Agreement, Security, Fair Usage Policy (aside from its signature photos).
