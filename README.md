# YEMELINK

Professional TanStack Start web app for YEMELINK, ready for Lovable publish and external static hosting.

## External deployment on Vercel

This project builds to `dist/client` for the browser app.

### Required Vercel settings

- **Framework preset:** Other
- **Build command:** `npm run build`
- **Output directory:** `dist/client`
- **Node version:** `22`

You can keep these in Vercel project settings, or rely on the included `vercel.json`.

### Environment variables

Add these in Vercel before deploying:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_PUBLISHABLE_KEY`
- `VITE_SUPABASE_PROJECT_ID`

### Why the 404 happened

Vercel was likely serving `dist/`, but this app's browser files are generated into `dist/client`. That makes successful builds still deploy to a path with no `index.html`, which produces `404: NOT_FOUND`.

The included `vercel.json` fixes that by:

- pointing Vercel to `dist/client`
- rewriting direct route requests to `/index.html` for SPA navigation

## Local development

```bash
bun install
bun run dev
```

## Production build

```bash
bun run build
```