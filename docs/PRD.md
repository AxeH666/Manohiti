# Product Requirements Document (PRD) - manohiti

## 1) Product Summary

manohiti is a focused therapy booking platform centered on therapist **Heti Mehra** (`heti3215@gmail.com`). Users discover availability and book 1-hour individual therapy sessions.

The initial offering is **pro bono**, so no price display or paid upsell UX should be introduced in Phase 1.

## 2) Who Uses It

### Primary Users
- Therapy seekers who want to book an individual session.

### Operator User
- Therapist/admin (Heti Mehra) who manages slot availability and reviews bookings.

## 3) What We Are Building

A web product with:
- Public-facing pages for therapist profile and available slots.
- Booking flow for 1-hour individual sessions.
- Backend booking management with PostgreSQL persistence.
- Payment subsystem foundation with Razorpay INR integration and Stripe-ready architecture.
- Email notifications through Gmail SMTP.

## 4) Feature Scope

## Phase 1 - Must-Haves

1. Therapist profile page (single therapist profile).
2. Availability calendar/list for open slots.
3. Booking form + booking confirmation flow.
4. Admin slot management endpoints.
5. Booking status lifecycle (PENDING_PAYMENT, confirmed, cancelled, completed).
6. Razorpay INR integration for order creation + verification endpoints.
7. Email notifications (confirmation/cancellation/reminders).
8. APScheduler jobs for reminders/maintenance.
9. Deployment-ready structure for Vercel (frontend) + Railway (backend).
10. Anonymous review submission by clients (display name optional, defaults to "Anonymous").
11. Therapist approves reviews before they go public.
12. Approved reviews displayed as auto-scrolling marquee on landing page.
13. Booking confirmation emails include `.ics` calendar invites for clients and Heti.
14. Optional WhatsApp notifications via Meta Cloud API (`WHATSAPP_ENABLED=False` by default).
15. Session reminders at 24 hours and 1 hour before start (email; WhatsApp when enabled).

## Phase 2 - Planned Enhancements

1. Stripe integration behind the same payment abstraction.
2. Better admin dashboard UX in frontend.
3. Automated timezone-aware user-facing slot conversions.
4. Session notes/history for returning clients.
5. Metrics dashboard (bookings, completion, payment signal).
6. Additional communication channels (e.g., WhatsApp/SMS provider later).

## 5) UX and Visual Design

All Phase 1 frontend work must follow the **Manohiti v1** design system defined in [`docs/design.md`](design.md).

Key product-facing constraints:

1. **Brand tone:** High-contrast editorial wellness — deep forest, vibrant clay, warm surfaces (see stitch reference in `brand/`).
2. **Landing page:** Implemented from `brand/stitch_manohiti_therapy_brand_identity (3)/code.html` — do not drift without design review.
3. **Typography:** Libre Caslon Text (display/headlines), Roboto (body), Inter (labels), Material Symbols (icons).
4. **Interaction:** Pill CTAs (`rounded-full`); primary forest green buttons; vibrant clay for accent CTAs and nav active state.
5. **Phase 1 pages:** Landing uses stitch layout; booking flow and admin surfaces extend the same token set from `docs/design.md`.

## 6) Important Product Rules

1. Session definition is fixed in Phase 1:
   - Type: individual therapy
   - Duration: 1 hour
   - Price: pro bono
   - Initial booking status: PENDING_PAYMENT
2. Do not expose paid pricing UI for Phase 1.
3. Data integrity first: a booked slot cannot be double-booked.
4. Payment integration must be provider-agnostic in architecture, even if only Razorpay is active now.
5. All transactional emails must be logged and failures tracked.
6. Frontend must consume backend API via env-driven base URL.

## 7) Success Criteria (Phase 1)

- A user can view open slots and submit a valid booking.
- Admin can create and manage availability slots.
- Booking lifecycle updates persist reliably.
- Email notifications are sent for critical events.
- Payment endpoints for Razorpay are operational and auditable.
- Clients can submit a review after booking.
- Heti can approve/reject reviews from admin panel.
- Approved reviews display on the landing page.
