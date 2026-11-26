<div align="center">

# ResumeFlow — 103 Free Professional CV Templates

**Instant, zero-login archive of 103 designer-crafted DIN A4 CV templates in editable Microsoft Word (`.docx`) and 300 DPI Print PDF.**

[![Live Demo](https://img.shields.io/badge/Live%20Website-resumeflow--cv.netlify.app-107C41?style=for-the-badge&logo=netlify&logoColor=white)](https://resumeflow-cv.netlify.app/)
[![Templates](https://img.shields.io/badge/CV%20Templates-103%20Free-0A1F17?style=for-the-badge&labelColor=C8F550&color=0A1F17)](https://resumeflow-cv.netlify.app/templates)
[![Next.js](https://img.shields.io/badge/Next.js-16.4-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-v4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)

[Browse Live Templates](https://resumeflow-cv.netlify.app/templates) · [Sitemap](https://resumeflow-cv.netlify.app/sitemap.xml) · [Report an Issue](https://github.com/abidsuhaib525-bot/resume-flow/issues)

</div>

---

## Overview

**ResumeFlow** is a fast, editorial CV template showcase built for job seekers who want studio-grade resumes without sign-up walls, paywalls, or broken web editors. Every template in the 103-volume archive ships with its real editable **Microsoft Word (`.docx`)** file (compatible with Word, Google Docs, and LibreOffice) and a crisp **300 DPI Print PDF**.

## Key Features

| Feature | Details |
| :--- | :--- |
| **103 Real CV Templates** | 57 Adobe InDesign + 46 Adobe Illustrator volumes across Executive, Creative, Tech, Minimalist, and Academic categories. |
| **Instant CDN Downloads** | Direct one-click Word (`.docx`) and Print PDF downloads served over Netlify Global Edge CDN — zero login required. |
| **Full-Screen Live Preview** | High-resolution A4 preview modal with Crisp Sheet & Live PDF Viewer toggle, color variant switcher, and keyboard navigation (`←`, `→`, `Esc`). |
| **Dual Editorial Themes** | **Light Emerald** (`#F8FAF9` / `#107C41`) and **Dark Forest Electric Lime** (`#081611` / `#C8F550`) with 0ms instant switching and GPU radial pulse animation. |
| **Local Favorites** | Bookmark templates locally via `localStorage` with instant filtering and animated toast feedback. |
| **Programmatic SEO (105 Pages)** | 103 statically generated `/templates/[id]` landing pages, dynamic `/sitemap.xml`, `/robots.txt`, OpenGraph cards, and `WebSite`, `FAQPage`, & `CreativeWork` JSON-LD schemas. |

## Tech Stack

- **Framework:** Next.js 16 (App Router, Turbopack, Cache Components)
- **Language:** TypeScript 5
- **Styling & Motion:** Tailwind CSS v4, Framer Motion, Lucide React
- **Hosting & CDN:** Netlify (`@netlify/plugin-nextjs` + immutable static CDN caching for `.docx` & `.pdf` assets)

## Project Structure

```text
├── netlify.toml                  # Netlify Next.js build & CDN download headers
├── public/
│   ├── files/                    # 210 direct-download .docx & .pdf CV assets
│   ├── thumbnails/               # 103 optimized WebP A4 preview thumbnails
│   └── google*.html              # Google Search Console verification
└── src/
    ├── app/
    │   ├── api/download/[id]/    # CDN redirect endpoint for .docx / .pdf & variants
    │   ├── templates/            # Full 103-template gallery + search/category filters
    │   ├── templates/[id]/       # 103 statically generated SEO template pages
    │   ├── robots.ts             # Dynamic robots.txt
    │   └── sitemap.ts            # Dynamic 105-URL sitemap.xml
    ├── components/               # Navbar, TemplateCard, TemplatePreviewModal
    ├── data/                     # templates.json & file-map.json
    └── lib/store.tsx             # Split ThemeContext (0ms) + AppContext (favorites/toasts)
```

## Run Locally

```bash
git clone https://github.com/abidsuhaib525-bot/resume-flow.git
cd resume-flow
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Environment Variables (Optional)

Set `NEXT_PUBLIC_SITE_URL` if deploying to a custom domain (defaults to `https://resumeflow-cv.netlify.app`):

```env
NEXT_PUBLIC_SITE_URL=https://your-custom-domain.com
```

---

<div align="center">
  Built & maintained by <a href="https://github.com/abidsuhaib525-bot">Suhaib Abid</a> · Live at <a href="https://resumeflow-cv.netlify.app/">resumeflow-cv.netlify.app</a>
</div>
