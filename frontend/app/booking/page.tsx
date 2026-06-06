import { BookingFlow } from "@/components/booking/booking-flow";

export default function BookingPage(): JSX.Element {
  return (
    <main className="bg-warm-surface">
      <section className="mx-auto max-w-container-max px-margin-mobile pt-section-gap md:px-margin-desktop">
        <p className="mb-base font-label-bold text-label-bold uppercase tracking-widest text-vibrant-clay">
          Booking
        </p>
        <h1 className="mb-gutter max-w-4xl font-display-xl text-display-xl-mobile text-deep-forest md:text-display-xl">
          Book a session
        </h1>
        <p className="mb-section-gap max-w-2xl font-body-lg text-body-lg text-on-surface-variant">
          Choose a date and time, enter your details, and confirm. You&apos;ll
          receive email confirmation with a calendar invite.
        </p>
      </section>
      <section className="mx-auto max-w-container-max px-margin-mobile pb-section-gap md:px-margin-desktop">
        <div className="border-2 border-primary bg-background p-gutter shadow-xl md:p-section-gap">
          <BookingFlow />
        </div>
      </section>
    </main>
  );
}
