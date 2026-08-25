# Kicks Shoelaces — Brand, Typography & Theme Guide

Reference spec for a 100% visual clone of the site. Use this as the single source of truth for design tokens (colors, type, spacing, components) before writing any HTML/CSS.

---

## 1. Brand Overview

- **Name:** KICKS Shoelaces
- **Category:** Premium replacement shoelaces & sneaker accessories e-commerce
- **Personality:** Bold, urban, athletic, streetwear-influenced, high-contrast, energetic
- **Visual language:** Black + neon lime/green accent, big condensed headlines, editorial sport/street photography, sharp square-ish product cards with generous whitespace

---

## 2. Color Palette

| Token               | Hex                                       | Usage                                                                                |
| ------------------- | ----------------------------------------- | ------------------------------------------------------------------------------------ |
| `--color-black`     | `#0D0D0D` / `#111111`                     | Primary background (header ticker, footer, nav text, headlines)                      |
| `--color-white`     | `#FFFFFF`                                 | Page background, text on black                                                       |
| `--color-lime`      | `#C6FF3D` (approx, verify against source) | Primary accent — CTA buttons, highlight text ("KICKS" in hero), badges, hover states |
| `--color-lime-dark` | `#A6E62D`                                 | Lime gradient bottom / hover shade                                                   |
| `--color-gray-50`   | `#F7F7F7`                                 | Card/section backgrounds (product tiles, category tiles bg)                          |
| `--color-gray-100`  | `#EFEFEF`                                 | Swatch backgrounds, dividers                                                         |
| `--color-gray-400`  | `#9A9A9A`                                 | Secondary/meta text (prices secondary, breadcrumbs)                                  |
| `--color-gray-700`  | `#4A4A4A`                                 | Body copy on white                                                                   |
| `--color-star-gold` | `#F5A623`                                 | Star ratings                                                                         |
| `--color-price`     | `#111111`                                 | Price text, bold                                                                     |

**Gradient accent:** diagonal/radial lime-green glow used at page bottom (black → lime glow), and on the "Custom Sneaker Laces" banner (dark navy/black photo overlay + lime text block).

---

## 3. Typography

### Primary Typeface — Display / Headlines

- **Style:** Bold condensed sans-serif (block/grotesk), heavy weight, tight letter-spacing, ALL CAPS
- **Closest web-safe stack:** `"Anton", "Archivo Black", "Oswald", "Helvetica Neue Condensed Bold", sans-serif`
- **Usage:** Hero headline ("LEVEL UP YOUR KICKS"), section titles ("BEST SELLERS", "NEW ARRIVALS", "NEWS"), category tile labels ("LACES BY BRAND")
- **Size scale:**
  - Hero H1: `64–80px` / `line-height: 0.95` / `font-weight: 900`
  - Section H2: `36–44px` / `font-weight: 900`
  - Category tile label: `20–24px` / `font-weight: 800`

### Secondary Typeface — Body / UI

- **Style:** Clean geometric/grotesk sans-serif, regular–semibold
- **Closest web-safe stack:** `"Inter", "Helvetica Neue", Arial, sans-serif`
- **Usage:** Nav links, product names, prices, descriptions, footer links, top announcement bar
- **Size scale:**
  - Nav links: `14px` / `500` / uppercase optional
  - Product title: `14–15px` / `600`
  - Price: `14px` / `700`
  - Body/description: `14–16px` / `400`, color `gray-700`
  - Micro/meta (announcement bar, footer legal): `11–12px` / `500` / letter-spacing `0.5px` / uppercase

### Type Pairing Rule

Headlines = condensed black display font. Everything else (nav, buttons, body, prices) = clean sans-serif. Never mix — this contrast is core to the brand feel.

---

## 4. Layout & Spacing

- **Max content width:** `1440px`, centered, `~24px` side gutters on desktop, `16px` mobile
- **Grid system:** 12-col desktop; product/category grids typically `4-up` (best sellers, new arrivals) and `3-up` (laces by brand/sport/accessories, no-tie/fat/fun shoelaces, news)
- **Section vertical rhythm:** `80–100px` padding between major sections
- **Card radius:** `8–12px` on images/tiles; buttons slightly smaller radius `6–8px` or pill for tags
- **Grid gap:** `20–24px`

---

## 5. Components

### Top Announcement Bar

- Black background, lime text, marquee/repeating text separated by `+`
- Content: "Easy Return + 24/7 Support + Worldwide Shipping" (repeating)
- Height: `~32px`, font `11px` uppercase, letter-spacing wide

### Main Navigation

- White background, black logo (bold wordmark "KICKS" + "SHOELACES" subtext, small basketball/sneaker icon accent)
- Center nav links: Home, Shoe Laces ▾, Laces by Shoe Brand ▾, Accessories ▾, Custom Shoelaces, Size Chart
- Right utilities: Currency selector (USD $ ▾), search icon, account icon, cart icon
- Sticky on scroll

### Hero Banner

- Full-bleed photo (athlete lacing sneaker on outdoor court, blue sky), dark overlay on left for text legibility
- Large stacked headline, last word in lime green
- Subcopy line below headline (uppercase, letter-spaced, small)
- Lime CTA button, pill/rounded-rect, black bold text, arrow icon ↗

### Brand Logo Strip

- Centered label above ("Replacement Shoelaces for Popular Brands")
- Row of 6 grayscale/black brand logos, evenly spaced, on white

### Category Tiles (3-up)

- Full-bleed photo, rounded corners
- Bottom-left label overlay (white bold caps text on gradient/dark scrim) + circular arrow button bottom-right
- Tiles: "Laces by Brand", "Laces by Sport", "Accessories"

### Section Header Pattern

- Big black condensed title left-aligned (e.g. "BEST SELLERS")
- Sits directly above product grid, no extra rule/divider

### Product Card

- White/light-gray square image tile with rounded corners, product centered
- Below image: product name (2-line max, semibold), star rating row (gold stars + number "4.8"), price (bold)
- Swatch row: small square color/style thumbnails + "+N" overflow pill
- No visible "Add to Cart" button on grid view — click-through card

### Promo Banner (Custom Sneaker Laces)

- Full-width dark photo banner (fists with branded laces), black gradient overlay left-to-right
- Small lime kicker line top-left, large white/lime stacked headline right side, lime pill CTA button

### Lifestyle Tile Row (No-Tie / Fat / Fun Shoelaces)

- Same pattern as Category Tiles component (3-up, photo + label overlay + arrow)

### News/Blog Cards (3-up)

- Bold poster-style thumbnail (brand-colored background: purple/pink/blue per article)
- Title below in black semibold, 2-line clamp

### Partnership Logo Strip

- Small centered label ("Partnerships & Activations")
- Row of 6 small grayscale partner/charity logos

### Footer

- Full black background with lime radial glow effect at very top edge (decorative divider between content and footer)
- Logo + social icons (Facebook, Instagram) top row
- 4-column link layout: "Shoe Laces For Shoes" (long list), "Customer Service", "Information", "Kicks Shoelaces" (brand blurb paragraph)
- Link text: gray-400, hover white
- Bottom bar: copyright line, centered, small, muted gray

---

## 6. Buttons

| Variant                    | Background                     | Text                  | Border-radius                | Notes                              |
| -------------------------- | ------------------------------ | --------------------- | ---------------------------- | ---------------------------------- |
| Primary CTA                | Lime `#C6FF3D`                 | Black, bold           | `24px` pill or `8px` rounded | Used for "Shop Now ↗", "Explore ↗" |
| Secondary/outline          | Transparent                    | Black/White (context) | `8px`                        | Rare, minimal use                  |
| Icon button (arrow circle) | White/black translucent circle | Black arrow ↗         | `50%`                        | Bottom-right of every tile card    |

---

## 7. Imagery Style

- High-contrast editorial photography, outdoor urban/athletic settings (basketball courts, streetwear)
- Real models, candid action shots (lacing shoes, playing basketball, portraits)
- Product photography: clean, isolated on light-gray backgrounds, slight drop shadow
- Consistent color grading: cool blues (sky/court) contrasted with warm skin tones and neon lime brand accent overlays

---

## 8. Iconography

- Line-style icons, `1.5–2px` stroke, black
- Used for: search, account, cart, dropdown chevrons (▾), arrow-up-right (↗) on CTAs and tile corners
- Star icons: filled gold/yellow for ratings

---

## 9. Motion & Interaction (implied)

- Hover: product image slight zoom, card shadow lift
- Hover: nav links underline or color shift to lime
- Arrow-circle buttons on tiles: fill/scale on hover
- Marquee ticker in top bar: continuous horizontal scroll

---

## 10. Build Notes for 100% Clone

1. Confirm exact lime hex via color-picker on the source screenshot/site (approx `#C6FF3D`–`#CCFF33` range).
2. Source or license the actual display font — likely **Anton**, **Archivo Black**, or a custom condensed grotesk; verify against letterforms (note the squared-off "K", tight "G").
3. Body font is likely **Inter** or **Helvetica Now** — check the terminal shapes of "a" and "g".
4. Rebuild all photography with matching aspect ratios (hero: ~21:9, category tiles: ~4:5, promo banner: ~21:9, lifestyle tiles: ~4:5).
5. Recreate brand/partner logos as SVG for crispness.
6. Match the lime radial-glow footer transition — likely a CSS `radial-gradient` or blurred SVG shape, not a raster image.
