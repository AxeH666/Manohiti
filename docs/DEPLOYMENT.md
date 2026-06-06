# Deployment

## Documentation

- Product requirements: [`docs/PRD.md`](PRD.md)
- Technical specification: [`docs/TECH_SPEC.md`](TECH_SPEC.md)
- Design system: [`docs/design.md`](design.md)
- Roadmap: [`docs/ROADMAP.md`](ROADMAP.md)

## Targets

- **Frontend:** Vercel (Next.js 14)
- **Backend:** Railway (Django + gunicorn + PostgreSQL)

## Pre-deploy checklist

1. Set all env vars from `backend/.env.example` and `frontend/.env.local.example`.
2. Confirm `FRONTEND_URL` matches the Vercel deployment URL for CORS.
3. Run backend migrations on Railway before serving traffic.
4. Verify Google Fonts load for Libre Caslon Text, Roboto, and Inter (design system typography).
