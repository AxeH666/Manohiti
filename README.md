# manohiti

Monorepo with a Django backend and Next.js frontend.

## Project Structure

- `backend/` - Django 4.2 + DRF API
- `frontend/` - Next.js 14 (App Router) + Tailwind + shadcn/ui
- `docs/` - PRD, tech spec, roadmap, and [`design.md`](docs/design.md) (synced with stitch brand reference in `brand/`)

## Prerequisites (WSL2 Ubuntu)

- Python 3.10+ (3.12 works)
- Node.js 20+
- npm 10+
- PostgreSQL running and accessible from WSL2

## Backend Setup (`backend/`)

```bash
cd /home/axehe/manohiti/backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
```

Update `.env` with PostgreSQL credentials and secrets.

Run migrations and start server:

```bash
cd /home/axehe/manohiti/backend
source .venv/bin/activate
python manage.py migrate
python manage.py runserver 0.0.0.0:8000
```

## Frontend Setup (`frontend/`)

```bash
cd /home/axehe/manohiti/frontend
npm install
cp .env.local.example .env.local
npm run dev
```

Frontend runs on `http://localhost:3000` by default.

## Environment Files

- Backend template: `backend/.env.example`
- Frontend template: `frontend/.env.local.example`

## Notes

- Backend CORS is configured for `http://localhost:3000` and `FRONTEND_URL` from env.
- Backend DB is configured via `DB_NAME`, `DB_USER`, `DB_PASSWORD`, `DB_HOST`, `DB_PORT`.
