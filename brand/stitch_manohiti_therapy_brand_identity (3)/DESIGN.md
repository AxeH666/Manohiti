---
name: Manohiti v1
colors:
  surface: '#fdf8f8'
  surface-dim: '#ddd9d8'
  surface-bright: '#fdf8f8'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f7f2f2'
  surface-container: '#f1edec'
  surface-container-high: '#ece7e7'
  surface-container-highest: '#e6e1e1'
  on-surface: '#1c1b1b'
  on-surface-variant: '#42493f'
  inverse-surface: '#313030'
  inverse-on-surface: '#f4f0ef'
  outline: '#72796f'
  outline-variant: '#c1c9bd'
  surface-tint: '#3b683b'
  primary: '#002405'
  on-primary: '#ffffff'
  primary-container: '#0d3b13'
  on-primary-container: '#77a773'
  inverse-primary: '#a1d39c'
  secondary: '#a23e19'
  on-secondary: '#ffffff'
  secondary-container: '#fe8358'
  on-secondary-container: '#701f00'
  tertiary: '#735c00'
  on-tertiary: '#ffffff'
  tertiary-container: '#c5a84d'
  on-tertiary-container: '#4e3d00'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#bcf0b6'
  primary-fixed-dim: '#a1d39c'
  on-primary-fixed: '#002205'
  on-primary-fixed-variant: '#245025'
  secondary-fixed: '#ffdbd0'
  secondary-fixed-dim: '#ffb59d'
  on-secondary-fixed: '#390c00'
  on-secondary-fixed-variant: '#822702'
  tertiary-fixed: '#ffe085'
  tertiary-fixed-dim: '#e3c466'
  on-tertiary-fixed: '#231b00'
  on-tertiary-fixed-variant: '#574500'
  background: '#fdf8f8'
  on-background: '#1c1b1b'
  surface-variant: '#e6e1e1'
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
  headline-lg-mobile:
    fontFamily: Libre Caslon Text
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 38px
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
  section-gap: 96px
  container-max: 1200px
  gutter: 20px
  margin-mobile: 18px
  margin-desktop: 56px
---

## Brand & Style

This design system shifts away from passive minimalism toward a high-contrast, sophisticated aesthetic that maintains its roots in professional wellness. The brand personality is authoritative and grounded—replacing soft linen textures with deep, saturated canvases and bold structural elements. 

The design style is **High-Contrast / Bold**, utilizing massive typography and intentional color blocks to create a sense of confidence. It draws inspiration from editorial layouts, where whitespace is used as a structural tool rather than just a void, and deep tonal accents provide a rhythmic pulse across the interface. The emotional response is one of clarity, focused vitality, and sophisticated care.

## Colors

The palette is anchored by a deep, forest green ("Primary") that injects a sense of established authority and organic depth into the wellness space. This is balanced by "Vibrant Clay" (Secondary) and a golden "Tertiary" accent to maintain the narrative of natural vitality without appearing washed out.

Color blocking is the primary driver of the visual hierarchy. Large sections of the UI should alternate between neutral surfaces and deep primary blocks to create high-impact, prestigious transitions. The primary dark green is used to signal growth and stability, while the secondary clay is reserved for high-priority interactive elements, ensuring the visual rhythm remains intentional and energetic.

## Typography

This design system leverages a dramatic type scale to establish a clear editorial voice. **Libre Caslon Text** is used for all headlines and display roles, bringing a classic, timeless, and prestigious tone that evokes the heritage of high-end editorial publishing. Its elegant serifs and high-contrast strokes provide a sophisticated counterpoint to the bold layout.

**Roboto** serves as the functional workhorse for body text, providing a clean, modern, and highly legible counterpoint to the traditional elegance of Libre Caslon Text. For labels and small UI hints, **Inter** is utilized with high-weight styling and increased letter spacing to ensure technical clarity against dark background blocks.

## Layout & Spacing

The layout philosophy follows a **Fixed Grid** model with generous margins and aggressive section verticality. Content is organized within a 12-column grid on desktop, emphasizing asymmetrical compositions that allow for large-scale color blocking.

- **Desktop:** 64px outer margins with a 1280px max-width container. 
- **Mobile:** 20px outer margins on a single-column flow.
- **Sectioning:** Use "section-gap" (120px) to separate major thematic blocks. Each block should ideally occupy a distinct background color to reinforce the color-blocking strategy.

## Elevation & Depth

This design system avoids traditional shadows in favor of **Tonal Layers** and **Bold Borders**. Depth is communicated through the physical stacking of color blocks rather than light-source simulation.

- **Surface Tiers:** Interactive cards use a slightly lighter or darker tint of the background color rather than a shadow.
- **Borders:** Use 1px or 2px solid borders in high-contrast colors (often the primary deep green) to define interactive boundaries.
- **Micro-elevation:** For hovering states, instead of raising an element with a shadow, shift the background color or apply a slight "offset" stroke to simulate a physical displacement.

## Shapes

The shape language is strictly **Sharp (0)**. To achieve the bold, architectural feel inspired by modern editorial design, every element—from buttons and input fields to large image containers—uses 90-degree corners. This lack of rounding reinforces the "professional" and "authoritative" aspects of the brand while providing a clean canvas for the deep primary colors to take center stage.

## Components

### Buttons
Primary buttons are high-contrast rectangles with no rounding. Use the deep primary green background with high-contrast text. Hover states should switch to the secondary clay for a dramatic visual shift.

### Input Fields
Fields are defined by a bottom-border only or a full high-contrast 1px border. Labels should use the `label-bold` typographic style, positioned directly above the input with minimal padding.

### Cards
Cards are containers for the "Tonal Layering" strategy. They should not use shadows. Instead, use a background color that is one step removed from the global section background.

### Chips & Tags
Small, rectangular blocks with a solid fill. Use these to introduce the tertiary gold into a primary-colored block to create focal points within dense information.

### Progress & Status
Use highly saturated colors for status, relying on the `label-bold` text to provide the context. Use the primary deep green for "active/success" and the secondary clay for "urgent/error" states.