# SkiRadar Frontend (Next.js)

Next.js App Router UI for SkiRadar. Fetches data from the FastAPI backend and uses cookie-based admin auth.

## Quickstart
```bash
cd frontend
npm install
NEXT_PUBLIC_API_BASE_URL=http://localhost:9000 npm run dev
```

## Admin Auth
- Login at http://localhost:3000/admin/login (uses `ADMIN_USERNAME` / `ADMIN_PASSWORD` from the backend).
- Cookie is stored on success; admin routes call `/api/admin/session` to verify.

## Env
- `NEXT_PUBLIC_API_BASE_URL` → backend base URL (defaults to `http://localhost:9000`).

## Build/Production
```bash
npm run build
npm start
```
