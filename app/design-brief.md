# Tropix — design brief

## Design read
For buyers, distributors and thirsty people who already know the taste: a
Turkish beverage house from Gaziantep that wants to be read as a serious
producer, not a corner-shop label. Emotional register: cold, confident,
appetising.

## Concept spine
**The site is a single unbroken sip.** One continuous camera move travels from
raw fruit into the liquid and out again as a finished bottle, and every chapter
of copy is a beat of that same swallow. Nothing cuts, because the product
promise is that nothing is interrupted between the orchard and the bottle.

## Delivery tier
`cinema` — Lenis-free scrub controller owns media time, chapters read over the
film, surrounding motion is transform-only.

## Animation mode
Animation mode: animated-website

### Journey shape
`single-shot` — ONE continuous 15s take, rendered once, then split into four
frame-exact consecutive segments so each chapter owns a stretch of the same
move. No seams exist because there was never more than one render.

### Journey
1. **Kaynak** — wide on a wet cross-section of tropical fruit in the void.
2. **Oz** — macro proximity, juice beads and translucent pulp.
3. **Donusum** — inside the liquid, a crimson column rising.
4. **Tropix** — the column resolves into the finished bottle, closing beauty.

The journey enacts the spine literally: the visitor's scroll is the sip, and
they cannot reach the bottle without passing through the fruit.

### World grammar
Infinite dark studio void, single soft key from top-left, cool rim from behind,
locked exposure and white balance, minimal motion blur, wet glossy surfaces,
subject always centre-safe with dark negative space above and below for type.

### Mobile framing
Every focal point inside the centre-safe area; mobile encodes capped at 720px
height so the whole desktop chain stays under 32 MiB and mobile under 16 MiB.

## Locked palette
- `#04120D` abyss — palm-shadow green-black, the void the film lives in
- `#0A2419` grove — raised surfaces, cards, bands
- `#E8375B` pulp — the crimson of pomegranate and cherry juice, every CTA
- `#86D96A` zest — lime green, secondary highlight and rule lines
- `#F6F1E6` cream — body and display type
- `#8FA79A` haze — muted supporting text

Defence: the void is green-black, not graphite, because the brand's whole
argument is fruit; the accent is fruit crimson rather than orange, so the pair
reads as pomegranate on palm shadow instead of the default dark-and-ember
template. Zest keeps a citrus note alive without becoming acid lime.

## Locked type
Display: **Bricolage Grotesque** (variable optical size, 600/800) — a wide,
slightly odd grotesk that carries appetite better than a neutral sans.
Text: **Instrument Sans** (400/500) — quiet, high x-height, reads cleanly at
14-16px over video. No serif: a juice producer has no archival claim to make.

## Section plan
1. Fixed nav bar (chrome, not a layout family)
2. Journey chapters over the film (cinematic scrub)
3. Urun ailesi — asymmetric split: image column beside a category list
4. Uretim — full-bleed image band with an overlaid stat row
5. Ihracat / bayilik — centred CTA band on a macro texture
6. Footer — three-column directory

Four distinct layout families across five content sections, no consecutive
repeats. Eyebrow budget: 2 (used on Urun ailesi and Uretim only).

## Asset plan
- The single-shot film, split into 4 desktop + 4 mobile encodes with exact
  first-frame posters (covers all hero and chapter imagery)
- Product still life (urun ailesi)
- Bottling line (uretim)
- Fruit macro texture (bayilik band)
- Hand-drawn SVG monogram + favicon
- OG / cover image composed from the product still

## CTA inventory
- `bayilik-primary` — solid pulp fill, cream label, capsule, arrow that slides
  on hover. The only filled button on the page.
- `urun-ghost` — cream hairline outline, fills to grove on hover, no radius
  change. Used in the journey chapter.
- `nav-link` — text with a zest underline that grows from the left.
- `footer-mail` — cream text with a permanent thin underline that thickens.

No shared button utility class exists; each garment is its own CSS block.
