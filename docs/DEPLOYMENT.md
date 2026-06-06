# Deployment

## Documentation

- Product requirements: [`docs/PRD.md`](PRD.md)
- Technical specification: [`docs/TECH_SPEC.md`](TECH_SPEC.md)
- Design system: [`docs/design.md`](design.md)
- Roadmap: [`docs/ROADMAP.md`](ROADMAP.md)

## Targets

- **Frontend:** Vercel (Next.js 14) — `frontend/vercel.json`
- **Backend:** Railway (Django + gunicorn + PostgreSQL) — `backend/Procfile`, `backend/railway.toml`

---

## 1. Railway — Backend + PostgreSQL

### Create the project

1. Go to [railway.app](https://railway.app) and create a new project.
2. **Add PostgreSQL:** Project → **New** → **Database** → **PostgreSQL**.
3. **Add the backend service:** **New** → **GitHub Repo** → select `manohiti` → set root directory to `backend/` (or deploy from monorepo with `backend` as the service path).

Railway reads `backend/railway.toml` and starts with:

```bash
gunicorn core.wsgi --bind 0.0.0.0:$PORT
```

### Backend environment variables

In Railway → backend service → **Variables**, set:

| Variable | Example / notes |
| --- | --- |
| `ENV` | `production` |
| `SECRET_KEY` | Long random string (generate at [djecrety.ir](https://djecrety.ir)) |
| `DEBUG` | `False` (ignored when `ENV=production`) |
| `DB_NAME` | From PostgreSQL addon (`PGDATABASE` or Railway reference) |
| `DB_USER` | From PostgreSQL addon |
| `DB_PASSWORD` | From PostgreSQL addon |
| `DB_HOST` | From PostgreSQL addon |
| `DB_PORT` | `5432` |
| `GMAIL_USER` | `heti3215@gmail.com` |
| `GMAIL_APP_PASSWORD` | 16-char Google App Password |
| `THERAPIST_EMAIL` | `heti3215@gmail.com` |
| `SESSION_PRICE` | `0` |
| `FRONTEND_URL` | Your Vercel URL, e.g. `https://manohiti.vercel.app` |
| `RAZORPAY_KEY_ID` | Leave blank for pro bono |
| `RAZORPAY_KEY_SECRET` | Leave blank for pro bono |
| `WHATSAPP_ENABLED` | `False` |

**Tip:** Use Railway variable references to wire PostgreSQL credentials (`${{Postgres.PGHOST}}`, etc.) or copy values from the Postgres service **Connect** tab.

`ALLOWED_HOSTS` is built automatically in `settings.py`:

- `localhost`, `127.0.0.1`
- `.railway.app` (all Railway subdomains)
- `RAILWAY_PUBLIC_DOMAIN` (set automatically by Railway when assigned)
- Hostname parsed from `FRONTEND_URL`

Optionally set `ALLOWED_HOSTS` for extra domains (comma-separated), e.g. a custom API domain.

### First deploy — run migrations

After the first successful deploy:

1. Railway → backend service → **Settings** → enable **One-off command** / open the **Shell**, or use Railway CLI:

```bash
railway link
railway run python manage.py migrate
railway run python manage.py seed_slots
railway run python manage.py createsuperuser
```

2. Copy the public backend URL from Railway (e.g. `https://manohiti-backend-production.up.railway.app`).

### Static files + admin

WhiteNoise serves Django admin static assets in production. On deploy, ensure static files are collected. If admin CSS is missing, run once:

```bash
railway run python manage.py collectstatic --noinput
```

---

## 2. Vercel — Frontend

### Connect the repo

1. Go to [vercel.com](https://vercel.com) → **Add New Project** → import the GitHub repo.
2. Set **Root Directory** to `frontend/`.
3. Framework is auto-detected via `frontend/vercel.json`:

```json
{ "framework": "nextjs" }
```

4. Deploy.

### Frontend environment variables

In Vercel → Project → **Settings** → **Environment Variables**:

| Variable | Value |
| --- | --- |
| `NEXT_PUBLIC_API_URL` | Railway backend URL, e.g. `https://manohiti-backend-production.up.railway.app` |

Redeploy after setting env vars so the build picks them up.

### Update backend CORS

Set `FRONTEND_URL` on Railway to your Vercel deployment URL (e.g. `https://manohiti.vercel.app`). Redeploy the backend if needed. CORS allows `FRONTEND_URL` and `http://localhost:3000`.

---

## 3. Custom domains (later)

### Frontend (Vercel)

1. Vercel → Project → **Settings** → **Domains** → add e.g. `manohiti.health`.
2. Follow DNS instructions (CNAME to Vercel).
3. Update Railway `FRONTEND_URL` to `https://manohiti.health`.
4. Redeploy backend.

### Backend (Railway)

1. Railway → backend service → **Settings** → **Networking** → **Custom Domain** → e.g. `api.manohiti.health`.
2. Add the CNAME record Railway provides.
3. Set `ALLOWED_HOSTS=api.manohiti.health` on Railway (or rely on `RAILWAY_PUBLIC_DOMAIN`).
4. Update Vercel `NEXT_PUBLIC_API_URL` to `https://api.manohiti.health`.

---

## Pre-deploy checklist

1. All env vars set on Railway and Vercel (see `backend/.env.example`, `frontend/.env.local.example`).
2. `ENV=production` on Railway.
3. Migrations applied (`python manage.py migrate`).
4. Therapist + slots seeded (`python manage.py seed_slots`).
5. Gmail App Password configured for production sender account.
6. `FRONTEND_URL` on Railway matches the live Vercel URL.
7. `NEXT_PUBLIC_API_URL` on Vercel matches the live Railway backend URL.
8. Test booking flow end-to-end on production URLs.
