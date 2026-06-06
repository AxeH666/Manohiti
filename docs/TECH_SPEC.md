# Technical Specification - manohiti

## 1) System Overview

manohiti is a web platform for individual therapy session discovery and booking for therapist **Heti Mehra** (`heti3215@gmail.com`).

- Session type: **Individual therapy**
- Duration: **1 hour**
- Pricing model: **Pro bono** (no paid pricing logic in Phase 1)

The architecture includes payment integration support because INR collection via Razorpay is required at the platform level and Stripe support is planned for future extensibility.

## 2) Technology Stack

### Frontend
- Framework: **Next.js 14 (App Router)**
- UI: **Tailwind CSS** + **shadcn/ui** (themed to Manohiti v1)
- Design system: [`docs/design.md`](design.md) — tokens in `frontend/app/globals.css` and `frontend/tailwind.config.ts`
- Fonts: **Libre Caslon Text** (display/headlines), **Roboto** (body), **Inter** (labels) via `next/font/google`
- HTTP client: **axios**
- Hosting target: **Vercel**

### Backend
- Framework: **Django 4.2**
- API: **Django REST Framework (DRF)**
- Database: **PostgreSQL**
- Scheduler: **APScheduler**
- Payment SDK: **Razorpay**
- SMTP: **Gmail SMTP**
- Hosting target: **Railway**
- WSGI server: **gunicorn**

## 3) Monorepo Structure

```text
manohiti/
├── backend/
│   ├── core/          # Django settings, urls, wsgi, asgi
│   ├── core_app/      # Main Django app (models, views, serializers, services)
│   ├── manage.py
│   ├── requirements.txt
│   └── .env.example
├── frontend/
│   ├── app/
│   ├── components/
│   ├── lib/
│   ├── package.json
│   └── .env.local.example
└── docs/
    ├── TECH_SPEC.md
    ├── PRD.md
    ├── ROADMAP.md
    ├── design.md
    └── DEPLOYMENT.md
```

## 4) Frontend Design System

Source of truth: [`docs/design.md`](design.md), derived from `brand/stitch_manohiti_therapy_brand_identity (3)/code.html`. Runtime tokens in `frontend/app/globals.css` and `frontend/tailwind.config.ts`. Landing page in `frontend/app/page.tsx`.

### 4.1 Visual Principles

- **Style:** High-contrast editorial layout — deep forest blocks, vibrant clay accents, warm surface sections.
- **Depth:** Shadows on hero image, content tiles, and CTA band; decorative blur circles; `.deep-texture` hero pattern.
- **Shapes:** Pill buttons (`rounded-full`); hero image `rounded-[3rem]`; content images `rounded-xl`.
- **Layout:** 12-column grid; `container-max` (1280px), `margin-desktop` (64px), `section-gap` (120px).

### 4.2 Token Usage

| Concern | Token / pattern |
| --- | --- |
| Nav + page bg | `background` (`#fcf9f8`) |
| Dark sections | `deep-forest` |
| Accent / CTA clay | `vibrant-clay` |
| Warm content block | `warm-surface` |
| Primary CTA buttons | `deep-forest` → hover `primary` |
| Nav book button | `vibrant-clay` pill |
| Form labels | `label-bold` typography (Inter 700, 0.05em tracking) |

### 4.3 Component Conventions

- **Buttons:** Pill-shaped per stitch reference; variants in `components/ui/button.tsx`.
- **Landing sections:** Header, hero, services block, sanctuary content, CTA band, footer — match `code.html` structure.
- **Motion:** `components/landing/scroll-reveal.tsx` for section entrance animation.

New UI work must use design tokens — no ad-hoc hex in components.

## 5) Backend Architecture

### 5.1 App Layering (`backend/core_app/`)

- `models.py`: domain entities and relational schema
- `serializers.py`: request/response validation
- `views.py` / `viewsets.py`: API controllers
- `urls.py`: app-level API routing
- `services/`: business logic (booking rules, payment adapter, notifications)
- `tasks/` or scheduler module: APScheduler jobs

### 5.2 Proposed Data Models

#### `User`
Use Django auth user as base identity.

#### `TherapistProfile`
- `user` (OneToOne -> User)
- `display_name`
- `email`
- `bio`
- `is_active`

Default seed/owner profile uses Heti Mehra details.

#### `AvailabilitySlot`
- `therapist` (FK -> TherapistProfile)
- `day_of_week` (IntegerField, `0=Monday` to `6=Sunday`)
- `start_time` (TimeField)
- `duration_minutes` (IntegerField, default `60`)
- `is_booked` (bool)
- constraints: no overlap per therapist for (`day_of_week`, `start_time`)

#### `SessionBooking`
- `client_name`
- `client_email`
- `client_phone` (optional)
- `therapist` (FK -> TherapistProfile)
- `slot` (FK -> AvailabilitySlot)
- `session_type` (enum; default `individual_therapy`)
- `duration_minutes` (default `60`)
- `status` (requested/confirmed/completed/cancelled)
- `notes` (optional)
- timestamps

#### `PaymentRecord`
- `booking` (FK -> SessionBooking)
- `provider` (enum: `razorpay`, `stripe`)
- `provider_order_id`
- `provider_payment_id`
- `currency` (default `INR`)
- `amount_minor` (integer; optional for pro bono)
- `status` (created/authorized/captured/failed/refunded)
- `raw_payload` (JSON)
- timestamps

#### `NotificationLog`
- `booking` (FK -> SessionBooking)
- `channel` (email)
- `recipient`
- `subject`
- `status`
- `error_message` (nullable)
- timestamps

## 6) API Design

Base prefix: `/api/v1/`

### 6.1 Public Endpoints
- `GET /api/v1/health/`
- `GET /api/v1/therapist/profile/`
- `GET /api/v1/availability/slots/` (list visible open slots)

### 6.2 Booking Endpoints
- `POST /api/v1/bookings/` (create booking request)
- `GET /api/v1/bookings/{id}/` (booking details)
- `POST /api/v1/bookings/{id}/cancel/`

### 6.3 Payment Endpoints
- `POST /api/v1/payments/orders/` (create provider order/session)
- `POST /api/v1/payments/verify/` (verify Razorpay signature + mark payment)
- `POST /api/v1/payments/webhook/razorpay/`

### 6.4 Admin/Therapist Endpoints
- `POST /api/v1/admin/slots/` (create/update recurring weekly availability)
- `PATCH /api/v1/admin/slots/{id}/`
- `GET /api/v1/admin/bookings/`

## 7) Payments Architecture Decision

Current provider is Razorpay for INR. Backend must use a provider adapter pattern:

- `PaymentGateway` interface
- `RazorpayGateway` implementation (active)
- `StripeGateway` implementation (planned)

Core booking/payment flows should depend on the interface, not provider-specific SDK calls in views. This prevents API contract churn when Stripe is added.

## 8) Environment Variables

### 8.1 Backend (`backend/.env`)

```env
SECRET_KEY=
DEBUG=True
ENV=development
DB_NAME=
DB_USER=
DB_PASSWORD=
DB_HOST=
DB_PORT=5432
RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=
GMAIL_USER=
GMAIL_APP_PASSWORD=
THERAPIST_EMAIL=heti3215@gmail.com
SESSION_PRICE=0
FRONTEND_URL=http://localhost:3000
WHATSAPP_ENABLED=False
WHATSAPP_ACCESS_TOKEN=
WHATSAPP_PHONE_NUMBER_ID=
THERAPIST_WHATSAPP_NUMBER=
```

### 8.2 Frontend (`frontend/.env.local`)

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_RAZORPAY_KEY_ID=
WATCHPACK_POLLING=true
```

## 9) Scheduling and Email

- APScheduler runs every **15 minutes** to evaluate reminder windows.
- Reminders fire at **24 hours** and **1 hour** before confirmed session start (IST).
- `NotificationLog` prevents duplicate sends per booking/channel/subject/recipient.
- Gmail SMTP is used for transactional notifications:
  - booking confirmation (client + therapist) with `.ics` calendar attachment
  - session reminders (client + therapist)
- WhatsApp (optional, Meta Cloud API) when `WHATSAPP_ENABLED=True`:
  - booking confirmation to client (if phone provided) and Heti
  - 24h and 1h reminders to both parties

## 10) Security and Operational Decisions

- CORS allows `http://localhost:3000` and `FRONTEND_URL`.
- Secrets must only come from env vars; never hardcoded.
- Webhook endpoints must verify provider signatures before state mutation.
- All datetimes stored timezone-aware in UTC.
- PostgreSQL is the source of truth for booking/payment state.

## 11) Non-Goals for Phase 1

- Multi-therapist marketplace behavior
- Complex role-based permissions beyond admin + public
- Full analytics dashboard
- Stripe live integration (only architecture support planned)
