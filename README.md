# Vue Starter

Vue 3 + TypeScript + Vite starter.

## Setup

```bash
npm install
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server |
| `npm run build` | Production build |
| `npm run preview` | Preview production build |
| `npm run test` | Run unit tests (Vitest) |
| `npm run test:watch` | Unit tests in watch mode |
| `npm run test:e2e` | Run E2E tests (Playwright) |
| `npm run lint` | Lint and fix |

## Tech stack

- Vue 3 (Composition API, `<script setup>`)
- TypeScript
- Vite
- Vue Router
- Vitest (unit)
- Playwright (E2E)

## Karolina's comments

- Keep the implementation simple and easy to explain.
- Prioritize accessibility, performance, and user experience over extra architecture.
- Load `results` and `facets` as separate API calls; keep them parallel for speed.
- Show the facets panel only after the first search is completed.
- Keep request payload minimal (`select=DOI,URL,title,publisher,type`, `rows=20`).
- Assume `DOI` is always present in returned records.
- Google Lighthouse scores 100/100 for Accessiblity, Performance and Best Practices, SEO ignored for now.
- Pagination was to be ignored for the purposes of the exercise but should be implemented properly.
- Advanced Search options and Search suggestions could be implemented for better user experience.
- Load times could further be improved by additional caching and fragmenting API calls.
