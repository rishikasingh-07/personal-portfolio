# Rishika Singh — Personal Portfolio

A responsive personal portfolio website built with **HTML, CSS, and vanilla JavaScript**. The site introduces me, showcases selected projects and skills, and includes a few playful interactions inspired by my interests.

## Live website

- **Portfolio:** https://personal-portfolio-iota-khaki-53.vercel.app
- **GitHub:** https://github.com/rishikasingh-07
- **LinkedIn:** https://www.linkedin.com/in/rishika-singh07


## Features

- Responsive layout for desktop and mobile screens
- Light/dark theme toggle
- About, projects, skills/interests, and contact sections
- Interactive decorative elements and custom inline SVG icons
- Guitar-string sound demo generated in JavaScript using the Web Audio API
- Email and social links for contact

## Built with

- **HTML5** — page structure and content
- **CSS3** — layout, responsive styling, themes, and animations
- **Vanilla JavaScript** — interactions and Web Audio API sound generation
- **Web Audio API** — browser-generated guitar tones; no audio files are required
- **Vercel** — hosting and deployment
- **Git and GitHub** — source control and repository hosting

## Typography credits

The website uses these typefaces served through **Google Fonts**:

- **Young Serif** — headings
- **Karla** — body text
- **JetBrains Mono** — small labels and code-like details
- **Caveat** — handwritten accents

Font family pages and licenses:

- Young Serif: https://fonts.google.com/specimen/Young+Serif
- Karla: https://fonts.google.com/specimen/Karla
- JetBrains Mono: https://fonts.google.com/specimen/JetBrains+Mono
- Caveat: https://fonts.google.com/specimen/Caveat

The typefaces are credited to their respective designers and are distributed under the licenses listed on their Google Fonts pages. They are not original fonts created for this portfolio.

## Visual assets and attribution

- The paw-print and sparkle symbols are inline SVGs included in the project's HTML; decorative effects are created with HTML, CSS, and JavaScript.
- No external stock-photo or illustration library is required by the current implementation.
- Project descriptions, personal information, layout, styling, and interactions are part of this portfolio project. Any third-party names, logos, fonts, or services remain the property of their respective owners.

## Run locally

No build step or package installation is required.

1. Download or clone this repository.
2. Keep `index.html`, `style.css`, and `script.js` together in the same folder.
3. Open `index.html` in a browser. For the most consistent local testing, use a simple local server or the Live Server extension in VS Code.

## Deployment

This is a static website. It can be deployed through Vercel by importing the GitHub repository with:

- **Framework preset:** Other
- **Root directory:** `./`
- **Build command:** leave blank
- **Output directory:** leave blank (serve the static files from the project root)
- **Install command:** leave blank

Make sure `index.html` is in the repository root and that the deployment is publicly accessible without requiring visitors to sign in.

## Browser and audio note

The guitar demo depends on browser support for the Web Audio API and on the browser/device allowing audio playback. On iPhone, test in Safari after tapping a string and checking the device's media volume and Silent Mode. Browser audio behavior can vary across devices and versions.

## Project structure

```text
.
├── index.html   # Portfolio content and inline SVG symbols
├── style.css    # Styling, responsive layout, themes, and animations
├── script.js    # Interactive behavior and guitar audio
└── README.md    # Project documentation and attributions
```

## License and reuse

This repository is shared as a personal portfolio/academic project. Please credit the author if you reuse substantial parts of the portfolio code or design. Third-party typefaces and services are subject to their own licenses and terms; see the links above.
