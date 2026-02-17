# BEDA (Rebuilt)

## 1) Install & run

```bash
npm install
cp .env.example .env.local
# fill VITE_SUPABASE_URL + VITE_SUPABASE_PUBLISHABLE_KEY
npm run dev
```

## 2) Supabase keys (important)

If you see **"Legacy API keys are disabled"** or **"Invalid API key"**, your frontend is sending the wrong key.

- Use **Publishable key** (starts with `sb_publishable_...`) for the frontend.
- **Do not** use service keys or secret keys in the browser.

## 3) Vercel SPA routing

This repo includes a `vercel.json` that keeps SPA routes working (refresh on nested routes) and adds a safe CSP.

