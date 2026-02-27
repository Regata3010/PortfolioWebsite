# aravpandey.me — Portfolio Website

Personal portfolio website for **Arav Pandey** — AI/ML Engineer & Full-Stack Developer.

Built as a fully static single-page site with no frameworks or build tools required. All content is driven by plain-text files in the `data/` folder, making updates effortless without touching any code.

## Stack

- **HTML / CSS / JavaScript** — vanilla, zero dependencies
- **Google Fonts** — Inter + JetBrains Mono
- Content loaded at runtime via `fetch()` from `data/*.txt`

## Features

- Scroll progress bar + sticky nav with active section highlight
- Smooth scroll, fade-in on scroll, ripple click effects
- Ambient floating orbs, gradient hero name, boot typing animation
- Glass-card design with warm amber palette
- Fully responsive

## Content

All sections are editable via plain-text files — no code changes needed:

| File | Section |
|------|---------|
| `data/about.txt` | Hero bio, status, looking-for |
| `data/education.txt` | Schools, degrees, GPA |
| `data/experience.txt` | Work history with bullet points |
| `data/projects.txt` | Projects with stack, links, description |
| `data/skills.txt` | Skill categories and items |
| `data/contact.txt` | Email, GitHub, LinkedIn, availability |

Each file uses a simple `KEY: value` format with `---` separating multiple entries.

## Running Locally

```bash
cd /path/to/PortfolioWebsite
python3 -m http.server 8080
```

Then open [http://127.0.0.1:8080](http://127.0.0.1:8080).

> A local server is required because content is loaded via `fetch()` from the `data/` folder. Opening `index.html` directly will not work.

## Deployment

Deployed via **GitHub Pages** at **[aravpandey.me](https://aravpandey.me)**.

No build step needed. To redeploy, just push to `main` — GitHub Pages picks up changes automatically within ~60 seconds.
