---
name: Manohiti v1
source: brand/stitch_manohiti_therapy_brand_identity (3)/code.html
colors:
  background: '#fcf9f8'
  surface: '#fdf8f8'
  surface-container-low: '#f7f2f2'
  deep-forest: '#0D2622'
  primary: '#002405'
  on-primary: '#ffffff'
  vibrant-clay: '#D95D39'
  warm-surface: '#F9F6F0'
  tertiary-fixed: '#ffe085'
  tertiary-fixed-dim: '#e3c466'
  on-surface: '#1c1b1b'
  on-surface-variant: '#42493f'
  muted-sage: '#A8B2A6'
typography:
  display-xl:
    fontFamily: Libre Caslon Text
    fontSize: 84px
    fontWeight: '700'
    lineHeight: 92px
    letterSpacing: -0.03em
  display-xl-mobile:
    fontFamily: Libre Caslon Text
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 52px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Libre Caslon Text
    fontSize: 48px
    fontWeight: '600'
    lineHeight: 56px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Libre Caslon Text
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
  body-lg:
    fontFamily: Roboto
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Roboto
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-bold:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '700'
    lineHeight: 20px
    letterSpacing: 0.05em
spacing:
  base: 8px
  gutter: 24px
  section-gap: 120px
  container-max: 1280px
  margin-mobile: 18px
  margin-desktop: 64px
---

# Manohiti v1 Design System

Production reference: `brand/stitch_manohiti_therapy_brand_identity (3)/code.html` — implemented in `frontend/app/page.tsx`.

## Brand & Style

High-contrast editorial wellness with deep forest greens, vibrant clay accents, and warm neutral surfaces. The landing page uses generous typography, color-blocked sections, pill CTAs, and subtle scroll-reveal motion.

## Colors

| Token | Hex | Usage |
| --- | --- | --- |
| `deep-forest` | `#0D2622` | Hero CTAs, footer, primary dark blocks |
| `vibrant-clay` | `#D95D39` | Nav active state, accent text, CTA band, pill buttons |
| `primary` | `#002405` | Borders, hover states on forest buttons |
| `warm-surface` | `#F9F6F0` | Content section background |
| `background` | `#fcf9f8` | Page + nav background |
| `surface-container-low` | `#f7f2f2` | Hero section background |
| `tertiary-fixed` | `#ffe085` | Decorative blurs and hover accents |

## Typography

- **Libre Caslon Text** — display and headline roles (`font-display-xl`, `font-headline-lg`, `font-headline-md`)
- **Roboto** — body copy (`font-body-lg`, `font-body-md`)
- **Inter** — labels and nav (`font-label-bold`)
- **Material Symbols Outlined** — iconography (loaded via Google Fonts)

## Layout & Spacing

- **Container:** `max-w-container-max` (1280px), centered
- **Desktop margins:** `px-margin-desktop` (64px)
- **Mobile margins:** `px-margin-mobile` (18px) — use on smaller breakpoints when added
- **Section padding:** `py-section-gap` (120px)
- **Grid:** 12-column on desktop (`md:grid-cols-12`)

## Elevation & Depth

Shadows and blurs are used on the stitch landing page (hero image `shadow-2xl`, CTA card `shadow-2xl`, image tiles `shadow-xl`). Decorative `blur-3xl` / `blur-[100px]` circles add depth behind hero and CTA sections. Hero background uses `.deep-texture` SVG pattern overlay.

## Shapes

- **Pill buttons:** `rounded-full` for all primary CTAs and nav book button
- **Hero image:** `rounded-[3rem]`
- **Content images:** `rounded-xl`
- **Icon badges:** `rounded-full` with `bg-vibrant-clay/10`

## Components

### Buttons

- **Primary nav CTA:** `bg-vibrant-clay`, `rounded-full`, `shadow-lg`, clay hover opacity
- **Hero primary:** `bg-deep-forest` → `hover:bg-primary`
- **Hero secondary:** `border-2 border-deep-forest` outline pill
- **CTA band:** `bg-deep-forest` pill inside vibrant-clay section

### Navigation

Sticky header with `border-b-2 border-primary`. Active link uses clay underline; inactive links hover to clay.

### Footer

Four-column grid on desktop (`md:grid-cols-12`), `bg-deep-forest`, clay section headings, warm-surface body links.

### Motion

Section content wrapped in scroll-reveal (`opacity-0 translate-y-8` → visible on intersect). Hero loads immediately without reveal delay.
