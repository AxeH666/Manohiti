"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import { ReviewModal } from "@/components/reviews/review-modal";
import {
  createBooking,
  fetchAvailableDates,
  fetchAvailableSlots,
  getApiErrorMessage,
  type AvailableSlot,
  type BookingCreateResponse,
} from "@/lib/api";
import { cn } from "@/lib/utils";

type Step = "date" | "time" | "details" | "consent" | "confirmation";

type ClientDetails = {
  client_name: string;
  client_email: string;
  client_phone: string;
  age: string;
  notes: string;
};

const STEPS: { id: Step; label: string }[] = [
  { id: "date", label: "Date" },
  { id: "time", label: "Time" },
  { id: "details", label: "Details" },
  { id: "consent", label: "Consent" },
  { id: "confirmation", label: "Done" },
];

const CONSENT_TEXT = `By booking this session, you agree to the following:

- Sessions are confidential. Information shared will not be disclosed to third parties except where required by law.
- You understand this is not an emergency service. If you are in crisis, please contact a helpline immediately.
- Sessions are 60 minutes. Late arrivals cannot be accommodated beyond the scheduled end time.
- You may cancel or reschedule by contacting Heti directly at heti3215@gmail.com at least 24 hours in advance.
- Your name, email, and phone are stored solely to manage your booking and send session reminders.`;

const WEEKDAY_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

function formatMonthLabel(year: number, month: number): string {
  return new Date(year, month - 1, 1).toLocaleDateString("en-IN", {
    month: "long",
    year: "numeric",
  });
}

function formatDateLabel(isoDate: string): string {
  const [y, m, d] = isoDate.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function formatTimeLabel(time: string): string {
  const [hours, minutes] = time.split(":").map(Number);
  const date = new Date();
  date.setHours(hours, minutes, 0, 0);
  return date.toLocaleTimeString("en-IN", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

function shiftMonth(year: number, month: number, delta: number): string {
  const date = new Date(year, month - 1 + delta, 1);
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  return `${y}-${m}`;
}

function toIsoDate(year: number, month: number, day: number): string {
  return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

function buildCalendarCells(year: number, month: number): (number | null)[] {
  const firstWeekday = (new Date(year, month - 1, 1).getDay() + 6) % 7;
  const daysInMonth = new Date(year, month, 0).getDate();
  const cells: (number | null)[] = Array.from({ length: firstWeekday }, () => null);
  for (let day = 1; day <= daysInMonth; day += 1) {
    cells.push(day);
  }
  while (cells.length % 7 !== 0) {
    cells.push(null);
  }
  return cells;
}

function isPastDate(isoDate: string): boolean {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const [y, m, d] = isoDate.split("-").map(Number);
  const target = new Date(y, m - 1, d);
  return target < today;
}

export function BookingFlow(): JSX.Element {
  const today = new Date();
  const [viewMonth, setViewMonth] = useState(
    `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}`,
  );
  const [step, setStep] = useState<Step>("date");
  const [availableDates, setAvailableDates] = useState<Set<string>>(new Set());
  const [availableSlots, setAvailableSlots] = useState<AvailableSlot[]>([]);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<AvailableSlot | null>(null);
  const [details, setDetails] = useState<ClientDetails>({
    client_name: "",
    client_email: "",
    client_phone: "",
    age: "",
    notes: "",
  });
  const [consentGiven, setConsentGiven] = useState(false);
  const [bookingResult, setBookingResult] = useState<BookingCreateResponse | null>(
    null,
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [reviewModalOpen, setReviewModalOpen] = useState(false);

  const [year, month] = viewMonth.split("-").map(Number);
  const calendarCells = useMemo(() => buildCalendarCells(year, month), [year, month]);

  const loadDates = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const rows = await fetchAvailableDates(viewMonth);
      setAvailableDates(new Set(rows.map((row) => row.date)));
    } catch (err) {
      setError(getApiErrorMessage(err));
      setAvailableDates(new Set());
    } finally {
      setLoading(false);
    }
  }, [viewMonth]);

  useEffect(() => {
    if (step === "date") {
      void loadDates();
    }
  }, [step, loadDates]);

  const loadSlots = useCallback(async (date: string) => {
    setLoading(true);
    setError(null);
    try {
      const slots = await fetchAvailableSlots(date);
      setAvailableSlots(slots);
    } catch (err) {
      setError(getApiErrorMessage(err));
      setAvailableSlots([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (step === "time" && selectedDate) {
      void loadSlots(selectedDate);
    }
  }, [step, selectedDate, loadSlots]);

  const handleSelectDate = (date: string) => {
    setSelectedDate(date);
    setSelectedSlot(null);
    setStep("time");
  };

  const handleSelectSlot = (slot: AvailableSlot) => {
    setSelectedSlot(slot);
    setStep("details");
  };

  const handleDetailsSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!selectedDate || !selectedSlot) {
      return;
    }
    if (!details.client_name.trim() || !details.client_email.trim()) {
      setError("Name and email are required.");
      return;
    }

    const ageValue = Number(details.age);
    if (!details.age.trim() || Number.isNaN(ageValue) || ageValue < 18) {
      setError("You must be 18 or older to book a session.");
      return;
    }

    setError(null);
    setConsentGiven(false);
    setStep("consent");
  };

  const handleConsentSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!selectedDate || !selectedSlot) {
      return;
    }
    if (!consentGiven) {
      setError("You must agree to the session terms before booking.");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const result = await createBooking({
        slot_date: selectedDate,
        slot_time: selectedSlot.slot_time,
        client_name: details.client_name.trim(),
        client_email: details.client_email.trim(),
        client_phone: details.client_phone.trim(),
        age: Number(details.age),
        notes: details.notes.trim(),
        consent_given: true,
      });
      setBookingResult(result);
      setStep("confirmation");
    } catch (err) {
      setError(getApiErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const currentStepIndex = STEPS.findIndex((item) => item.id === step);

  const summary = useMemo(() => {
    if (!selectedDate || !selectedSlot) {
      return null;
    }
    return {
      date: formatDateLabel(selectedDate),
      time: formatTimeLabel(selectedSlot.slot_time),
    };
  }, [selectedDate, selectedSlot]);

  return (
    <div className="mx-auto max-w-container-max">
      <nav
        aria-label="Booking progress"
        className="mb-gutter flex flex-wrap gap-base border-b-2 border-primary pb-gutter"
      >
        {STEPS.map((item, index) => {
          const isActive = item.id === step;
          const isComplete = index < currentStepIndex;
          return (
            <div
              className={cn(
                "font-label-bold text-label-bold uppercase tracking-wide",
                isActive && "text-vibrant-clay",
                isComplete && "text-deep-forest",
                !isActive && !isComplete && "text-on-surface-variant/50",
              )}
              key={item.id}
            >
              {index + 1}. {item.label}
            </div>
          );
        })}
      </nav>

      {error && (
        <div
          className="mb-gutter border-2 border-vibrant-clay bg-vibrant-clay/10 p-base font-body-md text-deep-forest"
          role="alert"
        >
          {error}
        </div>
      )}

      {step === "date" && (
        <section>
          <div className="mb-gutter flex items-center justify-between">
            <h2 className="font-headline-md text-headline-md text-deep-forest">
              Pick a date
            </h2>
            <div className="flex items-center gap-base">
              <button
                aria-label="Previous month"
                className="rounded-full border-2 border-deep-forest px-base py-base font-label-bold text-label-bold text-deep-forest transition-colors hover:bg-deep-forest hover:text-on-primary disabled:opacity-40"
                disabled={loading}
                onClick={() => setViewMonth(shiftMonth(year, month, -1))}
                type="button"
              >
                Prev
              </button>
              <span className="min-w-36 text-center font-body-md text-on-surface-variant">
                {formatMonthLabel(year, month)}
              </span>
              <button
                aria-label="Next month"
                className="rounded-full border-2 border-deep-forest px-base py-base font-label-bold text-label-bold text-deep-forest transition-colors hover:bg-deep-forest hover:text-on-primary disabled:opacity-40"
                disabled={loading}
                onClick={() => setViewMonth(shiftMonth(year, month, 1))}
                type="button"
              >
                Next
              </button>
            </div>
          </div>

          {loading ? (
            <p className="font-body-md text-on-surface-variant">Loading dates…</p>
          ) : (
            <>
              <div className="mb-base grid grid-cols-7 gap-base">
                {WEEKDAY_LABELS.map((label) => (
                  <div
                    className="text-center font-label-bold text-label-bold uppercase tracking-wide text-on-surface-variant/70"
                    key={label}
                  >
                    {label}
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-base">
                {calendarCells.map((day, index) => {
                  if (day === null) {
                    return <div aria-hidden key={`empty-${index}`} />;
                  }

                  const isoDate = toIsoDate(year, month, day);
                  const hasSlots = availableDates.has(isoDate);
                  const isPast = isPastDate(isoDate);
                  const isDisabled = !hasSlots || isPast;
                  const isSelected = selectedDate === isoDate;

                  return (
                    <button
                      aria-label={
                        isDisabled
                          ? `${day} unavailable`
                          : `Book on ${formatDateLabel(isoDate)}`
                      }
                      className={cn(
                        "aspect-square rounded-full border-2 font-body-md transition-colors",
                        isDisabled &&
                          "cursor-not-allowed border-primary/30 text-on-surface-variant/40",
                        !isDisabled &&
                          "border-primary text-deep-forest hover:border-vibrant-clay hover:bg-surface-container-low",
                        isSelected && !isDisabled && "border-vibrant-clay bg-vibrant-clay/10",
                      )}
                      disabled={isDisabled}
                      key={isoDate}
                      onClick={() => handleSelectDate(isoDate)}
                      type="button"
                    >
                      {day}
                    </button>
                  );
                })}
              </div>
              {!loading && availableDates.size === 0 && (
                <p className="mt-gutter font-body-md text-on-surface-variant">
                  No open dates this month. Try another month.
                </p>
              )}
            </>
          )}
        </section>
      )}

      {step === "time" && selectedDate && (
        <section>
          <div className="mb-gutter flex flex-wrap items-center justify-between gap-base">
            <h2 className="font-headline-md text-headline-md text-deep-forest">
              Pick a time
            </h2>
            <button
              className="font-label-bold text-label-bold text-vibrant-clay underline-offset-4 hover:underline"
              disabled={loading}
              onClick={() => setStep("date")}
              type="button"
            >
              Change date
            </button>
          </div>
          <p className="mb-gutter font-body-md text-on-surface-variant">
            {formatDateLabel(selectedDate)}
          </p>
          {loading ? (
            <p className="font-body-md text-on-surface-variant">Loading times…</p>
          ) : availableSlots.length === 0 ? (
            <p className="font-body-md text-on-surface-variant">
              No times available on this date.{" "}
              <button
                className="text-vibrant-clay underline-offset-4 hover:underline"
                onClick={() => setStep("date")}
                type="button"
              >
                Pick another date
              </button>
            </p>
          ) : (
            <div className="flex flex-wrap gap-base">
              {availableSlots.map((slot) => {
                const isActive = selectedSlot?.slot_time === slot.slot_time;
                return (
                  <button
                    className={cn(
                      "rounded-full border-2 px-gutter py-base font-label-bold text-label-bold transition-colors",
                      isActive
                        ? "border-vibrant-clay bg-vibrant-clay text-on-primary"
                        : "border-deep-forest text-deep-forest hover:bg-deep-forest hover:text-on-primary",
                    )}
                    key={slot.slot_time}
                    onClick={() => handleSelectSlot(slot)}
                    type="button"
                  >
                    {formatTimeLabel(slot.slot_time)}
                  </button>
                );
              })}
            </div>
          )}
        </section>
      )}

      {step === "details" && summary && (
        <section>
          <h2 className="mb-gutter font-headline-md text-headline-md text-deep-forest">
            Your details
          </h2>
          <p className="mb-gutter font-body-md text-on-surface-variant">
            {summary.date} at {summary.time} IST
          </p>
          <form className="space-y-gutter" onSubmit={handleDetailsSubmit}>
            <div>
              <label
                className="mb-base block font-label-bold text-label-bold uppercase tracking-wide text-deep-forest"
                htmlFor="client_name"
              >
                Name
              </label>
              <input
                className="w-full border-2 border-primary bg-background px-base py-base font-body-md text-on-surface outline-none focus:border-vibrant-clay disabled:opacity-50"
                disabled={loading}
                id="client_name"
                onChange={(e) =>
                  setDetails((prev) => ({ ...prev, client_name: e.target.value }))
                }
                required
                type="text"
                value={details.client_name}
              />
            </div>
            <div>
              <label
                className="mb-base block font-label-bold text-label-bold uppercase tracking-wide text-deep-forest"
                htmlFor="client_email"
              >
                Email
              </label>
              <input
                className="w-full border-2 border-primary bg-background px-base py-base font-body-md text-on-surface outline-none focus:border-vibrant-clay disabled:opacity-50"
                disabled={loading}
                id="client_email"
                onChange={(e) =>
                  setDetails((prev) => ({ ...prev, client_email: e.target.value }))
                }
                required
                type="email"
                value={details.client_email}
              />
            </div>
            <div>
              <label
                className="mb-base block font-label-bold text-label-bold uppercase tracking-wide text-deep-forest"
                htmlFor="client_phone"
              >
                Phone (optional)
              </label>
              <input
                className="w-full border-2 border-primary bg-background px-base py-base font-body-md text-on-surface outline-none focus:border-vibrant-clay disabled:opacity-50"
                disabled={loading}
                id="client_phone"
                onChange={(e) =>
                  setDetails((prev) => ({ ...prev, client_phone: e.target.value }))
                }
                placeholder="+91XXXXXXXXXX"
                type="tel"
                value={details.client_phone}
              />
            </div>
            <div>
              <label
                className="mb-base block font-label-bold text-label-bold uppercase tracking-wide text-deep-forest"
                htmlFor="client_age"
              >
                Age
              </label>
              <input
                className="w-full border-2 border-primary bg-background px-base py-base font-body-md text-on-surface outline-none focus:border-vibrant-clay disabled:opacity-50"
                disabled={loading}
                id="client_age"
                min={18}
                onChange={(e) =>
                  setDetails((prev) => ({ ...prev, age: e.target.value }))
                }
                required
                type="number"
                value={details.age}
              />
            </div>
            <div>
              <label
                className="mb-base block font-label-bold text-label-bold uppercase tracking-wide text-deep-forest"
                htmlFor="notes"
              >
                Notes (optional)
              </label>
              <textarea
                className="min-h-28 w-full border-2 border-primary bg-background px-base py-base font-body-md text-on-surface outline-none focus:border-vibrant-clay disabled:opacity-50"
                disabled={loading}
                id="notes"
                onChange={(e) =>
                  setDetails((prev) => ({ ...prev, notes: e.target.value }))
                }
                value={details.notes}
              />
            </div>
            <div className="flex flex-wrap gap-base">
              <button
                className="rounded-full border-2 border-deep-forest px-gutter py-base font-label-bold text-label-bold text-deep-forest transition-colors hover:bg-deep-forest hover:text-on-primary disabled:opacity-50"
                disabled={loading}
                onClick={() => setStep("time")}
                type="button"
              >
                Back
              </button>
              <button
                className="rounded-full bg-vibrant-clay px-gutter py-base font-label-bold text-label-bold text-on-primary shadow-lg transition-all hover:opacity-90 disabled:opacity-50"
                type="submit"
              >
                Continue
              </button>
            </div>
          </form>
        </section>
      )}

      {step === "consent" && summary && (
        <section>
          <h2 className="mb-gutter font-headline-md text-headline-md text-deep-forest">
            Session terms
          </h2>
          <p className="mb-gutter font-body-md text-on-surface-variant">
            {summary.date} at {summary.time} IST
          </p>
          <div className="mb-gutter whitespace-pre-line border-2 border-primary bg-surface-container-low p-gutter font-body-md text-on-surface-variant">
            {CONSENT_TEXT}
          </div>
          <form className="space-y-gutter" onSubmit={(e) => void handleConsentSubmit(e)}>
            <label className="flex cursor-pointer items-start gap-base">
              <input
                checked={consentGiven}
                className="mt-1 h-5 w-5 shrink-0 accent-vibrant-clay"
                disabled={loading}
                onChange={(e) => setConsentGiven(e.target.checked)}
                required
                type="checkbox"
              />
              <span className="font-body-md text-deep-forest">
                I have read and agree to the above
              </span>
            </label>
            <div className="flex flex-wrap gap-base">
              <button
                className="rounded-full border-2 border-deep-forest px-gutter py-base font-label-bold text-label-bold text-deep-forest transition-colors hover:bg-deep-forest hover:text-on-primary disabled:opacity-50"
                disabled={loading}
                onClick={() => setStep("details")}
                type="button"
              >
                Back
              </button>
              <button
                className="rounded-full bg-vibrant-clay px-gutter py-base font-label-bold text-label-bold text-on-primary shadow-lg transition-all hover:opacity-90 disabled:opacity-50"
                disabled={loading || !consentGiven}
                type="submit"
              >
                {loading ? "Booking…" : "Confirm booking"}
              </button>
            </div>
          </form>
        </section>
      )}

      {step === "confirmation" && summary && bookingResult && (
        <section className="text-center">
          <div className="mx-auto mb-gutter flex h-16 w-16 items-center justify-center rounded-full bg-vibrant-clay/10">
            <span className="material-symbols-outlined text-3xl text-vibrant-clay">
              check_circle
            </span>
          </div>
          <h2 className="mb-gutter font-headline-lg text-headline-lg text-deep-forest">
            You&apos;re booked
          </h2>
          <p className="mx-auto mb-base max-w-lg font-body-lg text-body-lg text-on-surface-variant">
            {summary.date} at {summary.time} IST
          </p>
          <p className="mx-auto mb-gutter max-w-lg font-body-md text-on-surface-variant">
            Check your email for details.
          </p>
          <button
            className="rounded-full border-2 border-deep-forest px-gutter py-base font-label-bold text-label-bold text-deep-forest transition-colors hover:bg-deep-forest hover:text-on-primary"
            onClick={() => setReviewModalOpen(true)}
            type="button"
          >
            Leave a review
          </button>
        </section>
      )}

      <ReviewModal
        defaultDisplayName={details.client_name}
        onClose={() => setReviewModalOpen(false)}
        open={reviewModalOpen}
      />
    </div>
  );
}
