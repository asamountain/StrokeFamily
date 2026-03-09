# StrokeFamily

**Understanding stroke. Supporting caregivers. Technology for healing.**

An interactive educational website for families caring for stroke survivors — built with React, Three.js, and Vite. Deployed on Vercel.

## Live Site

> [strokefamily.vercel.app](https://strokefamily.vercel.app) *(update after deployment)*

## What's inside

| Section | Description |
|---|---|
| **Home** | 3D brain intro + navigation overview |
| **Brain Atlas** | Interactive 3D brain — click regions to understand stroke-related behavior |
| **Voices of Hope** | Authors & survivors who turned difficulty into guidance |
| **Caregiver Wellbeing** | Self-compassion, meditation, yoga, somatic practices, and more |
| **Smart Home Tech** | 8 IoT solutions that directly reduce caregiver burden |
| **Build with Purpose** | ESP32/Raspberry Pi projects for IoT learners to help real families |
| **Local Resources** | Wauwatosa / Milwaukee County specific support services |
| **Community** | Online communities and local support groups |

## Tech Stack

- **React 18** + **Vite**
- **Three.js** for the 3D brain visualization
- **No UI library** — all styling in inline JS objects
- **Google Fonts** — Lora + DM Sans

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

## Build for Production

```bash
npm run build
npm run preview
```

## Deploy to Vercel

1. Push this repo to GitHub
2. Go to [vercel.com](https://vercel.com) → New Project
3. Import `asamountain/StrokeFamily`
4. Framework: **Vite** (auto-detected)
5. Click Deploy — done

Vercel will auto-deploy on every push to `main`.

## Project Structure

```
strokefamily/
├── public/
│   └── favicon.svg
├── src/
│   ├── App.jsx          # Main application, all sections
│   ├── BrainCanvas.jsx  # Three.js 3D brain component
│   ├── data.js          # All static content data
│   ├── index.css        # Global reset styles
│   └── main.jsx         # React entry point
├── index.html
├── package.json
└── vite.config.js
```

## Local Resources (Wauwatosa, WI)

- **Milwaukee County ADRC**: (414) 289-6874
- **Froedtert Neuroscience Center**: 8701 Watertown Plank Rd, Wauwatosa
- **American Stroke Association**: strokeassociation.org

---

*Built with care for families navigating the long road of stroke recovery.*
