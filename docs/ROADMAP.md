# Roadmap - manohiti

## Current Status

**Phase 1 / Milestone 3 (In Progress)**

## Phase 1: Foundation and Core Booking

### Milestone 1 - Monorepo and Baseline Setup (Completed)
- Monorepo created with `backend/` and `frontend/`.
- Django 4.2 + DRF backend scaffolded.
- Next.js 14 + Tailwind + shadcn/ui frontend scaffolded.
- Env templates and local setup docs added.
- Local PostgreSQL configured and running in WSL
- All migrations applied successfully

### Milestone 2 - Domain and API Foundation (Completed)
- Define domain models: therapist, slots, bookings, payments.
- Implement DRF serializers/views for core booking endpoints.
- Wire root API routes and health endpoint.
- Add admin utilities for slot creation and updates.
- Available slots API endpoint (GET /api/slots/available/)
- Available dates API endpoint (GET /api/slots/available-dates/)
- Both endpoints return empty list when no active therapist exists
- Confirmed booking exclusion logic verified
- POST /api/bookings/create/ with pro-bono and paid branching
- POST /api/bookings/verify-payment/ with HMAC verification
- Double-booking protection verified
- SESSION_PRICE=0 skips Razorpay, confirms booking directly
- Gmail SMTP configured
- send_booking_confirmation implemented
- send_reminder implemented
- APScheduler running daily at 9AM IST
- NotificationLog writes on email send/fail
- POST /api/reviews/submit/ with anonymous default and validation
- GET /api/reviews/ returns approved only, ordered by date
- Approved-only filter verified with seeded data

Exit criteria:
- CRUD and state transitions work for core booking entities.
- `python manage.py check` and API smoke tests pass.

### Milestone 3 - Payments + Notification Layer (In Progress)
- Implement Razorpay order/verify/webhook flows.
- Add payment records and reconciliation-safe status updates.
- Implement Gmail SMTP transactional emails.
- Add APScheduler jobs for reminders.

Exit criteria:
- Payment and notification flow works in staging.
- Webhook signature verification and retry handling validated.

### Milestone 4 - Frontend Booking UX Integration
- Landing page implemented from stitch brand HTML (`brand/.../code.html`) with scroll-reveal motion.
- Design tokens synced in `docs/design.md`, `globals.css`, and `tailwind.config.ts`.
- Load Libre Caslon Text, Roboto, Inter, and Material Symbols.
- Wire booking flow screens into the CTA sections (Book Session buttons).
- Connect frontend to backend via env base URL.
- Add success/error UX and basic validation.
- Reviews submission UI and marquee component (services grid section).
- Review approval flow in admin.

Exit criteria:
- End-to-end booking flow works from browser to DB.
- Landing page matches stitch reference; new screens use shared tokens.

## Phase 2: Enhancements and Scale

### Milestone 5 - Provider Expansion (Stripe)
- Implement Stripe adapter under payment interface.
- Keep existing API contracts stable.

### Milestone 6 - Admin Experience and Analytics
- Admin dashboard improvements.
- Operational metrics and reports.

### Milestone 7 - Reliability and Growth
- Monitoring hardening, alerting, and improved audit tooling.
- Performance tuning and resiliency improvements.
