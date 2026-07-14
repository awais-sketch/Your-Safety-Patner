# Your Safety Partners — Landing Page

Marketing landing page for **Your Safety Partners**, a Melbourne-based Workplace Health &amp; Safety (WHS/OHS) consultancy servicing Australia-wide.

Static, self-contained site — no build step required.

## Stack
- Plain HTML, CSS, JavaScript (no framework, no build)
- Google Fonts: Poppins (display), Open Sans (body), IBM Plex Mono (labels)
- Brand palette: charcoal `#1a1b1d` + safety yellow `#FAB702`

## Features
- Cinematic hero with real photography, spotlight glow &amp; animated highlight
- Seamless single-line client-logo marquee
- 12 service cards, 4 pillars, process steps, reviews, Safety Portal mockup, insights, FAQ
- Aceternity-style **Comet Card** 3D tilt + glare on cards, moving-border CTA, scroll reveals, count-up stats
- Fully responsive, `prefers-reduced-motion` aware

## Run locally
Any static server, e.g.:
```bash
python -m http.server 8123
# open http://127.0.0.1:8123/
```

## Files
- `index.html` — page markup
- `styles.css` — all styling &amp; animations
- `script.js` — reveals, marquee, comet cards, accordion, count-up
