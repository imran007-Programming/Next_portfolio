# Imran — Portfolio

Personal portfolio site built with **Next.js**, **TypeScript**, and **Tailwind CSS**.

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Customize your content

| File | What to update |
|------|----------------|
| `src/data/site.ts` | Name, tagline, email, GitHub, LinkedIn |
| `src/data/skills.ts` | Your tech stack |
| `src/data/projects.ts` | Real projects with links |
| `src/components/About.tsx` | Your bio paragraph |

Add project screenshots to `public/` and reference them in project cards when you are ready.

## Deploy

Push to GitHub and deploy on [Vercel](https://vercel.com) — it detects Next.js automatically.

```bash
npm run build
```

## Scripts

- `npm run dev` — development server
- `npm run build` — production build
- `npm run start` — run production build locally
- `npm run lint` — ESLint
