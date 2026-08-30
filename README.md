# Temenos Study App

Vercel-ready Next.js version of the supplied `TemenosStudyApp.jsx`.

## Run locally

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Test locally

```bash
npm test
```

This project does not include a dedicated unit-test runner yet, so the test script validates the app builds successfully.

## Production build

```bash
npm run build
npm start
```

## Deploy to Vercel

Push this folder to GitHub and import the repository into Vercel. Vercel will detect Next.js automatically.

No environment variables are required for the current version.

## Persistence

Study progress is stored in the browser using `localStorage`, so it persists across normal refreshes on the same browser/device.
