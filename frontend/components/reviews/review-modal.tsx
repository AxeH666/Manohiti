"use client";

import { useEffect, useState } from "react";

import { getApiErrorMessage, submitReview } from "@/lib/api";
import { cn } from "@/lib/utils";

type ReviewModalProps = {
  open: boolean;
  onClose: () => void;
  defaultDisplayName?: string;
};

function StarRating({
  value,
  onChange,
  disabled,
}: {
  value: number;
  onChange: (rating: number) => void;
  disabled?: boolean;
}): JSX.Element {
  return (
    <div className="flex gap-base" role="group" aria-label="Rating">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          aria-label={`${star} star${star === 1 ? "" : "s"}`}
          className={cn(
            "text-3xl transition-colors",
            star <= value ? "text-vibrant-clay" : "text-on-surface-variant/30",
            disabled && "cursor-not-allowed opacity-50",
          )}
          disabled={disabled}
          key={star}
          onClick={() => onChange(star)}
          type="button"
        >
          <span className="material-symbols-outlined" style={{ fontVariationSettings: star <= value ? '"FILL" 1' : '"FILL" 0' }}>
            star
          </span>
        </button>
      ))}
    </div>
  );
}

export function ReviewModal({
  open,
  onClose,
  defaultDisplayName = "",
}: ReviewModalProps): JSX.Element | null {
  const [rating, setRating] = useState(0);
  const [displayName, setDisplayName] = useState(defaultDisplayName);
  const [body, setBody] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (open) {
      setDisplayName(defaultDisplayName);
      setRating(0);
      setBody("");
      setError(null);
      setSuccess(false);
      setLoading(false);
    }
  }, [open, defaultDisplayName]);

  useEffect(() => {
    if (!open) {
      return;
    }
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !loading) {
        onClose();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, loading, onClose]);

  if (!open) {
    return null;
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (rating < 1) {
      setError("Please select a star rating.");
      return;
    }
    if (body.trim().length < 20) {
      setError("Review must be at least 20 characters.");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      await submitReview({
        rating,
        body: body.trim(),
        display_name: displayName.trim() || undefined,
      });
      setSuccess(true);
    } catch (err) {
      setError(getApiErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      aria-labelledby="review-modal-title"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-margin-mobile"
      role="dialog"
    >
      <button
        aria-label="Close review dialog"
        className="absolute inset-0 bg-deep-forest/60"
        disabled={loading}
        onClick={onClose}
        type="button"
      />
      <div className="relative z-10 w-full max-w-lg border-2 border-primary bg-background p-gutter shadow-2xl md:p-section-gap">
        {success ? (
          <div className="text-center">
            <div className="mx-auto mb-gutter flex h-14 w-14 items-center justify-center rounded-full bg-vibrant-clay/10">
              <span className="material-symbols-outlined text-2xl text-vibrant-clay">
                check_circle
              </span>
            </div>
            <p className="mb-gutter font-body-lg text-body-lg text-deep-forest">
              Thanks! Your review will appear once approved.
            </p>
            <button
              className="rounded-full bg-deep-forest px-gutter py-base font-label-bold text-label-bold text-on-primary transition-colors hover:bg-primary"
              onClick={onClose}
              type="button"
            >
              Close
            </button>
          </div>
        ) : (
          <>
            <h2
              className="mb-gutter font-headline-md text-headline-md text-deep-forest"
              id="review-modal-title"
            >
              Leave a review
            </h2>
            {error && (
              <p className="mb-gutter border-2 border-vibrant-clay bg-vibrant-clay/10 p-base font-body-md text-deep-forest" role="alert">
                {error}
              </p>
            )}
            <form className="space-y-gutter" onSubmit={(e) => void handleSubmit(e)}>
              <div>
                <p className="mb-base font-label-bold text-label-bold uppercase tracking-wide text-deep-forest">
                  Rating
                </p>
                <StarRating disabled={loading} onChange={setRating} value={rating} />
              </div>
              <div>
                <label
                  className="mb-base block font-label-bold text-label-bold uppercase tracking-wide text-deep-forest"
                  htmlFor="review_display_name"
                >
                  Display name
                </label>
                <input
                  className="w-full border-2 border-primary bg-background px-base py-base font-body-md text-on-surface outline-none focus:border-vibrant-clay disabled:opacity-50"
                  disabled={loading}
                  id="review_display_name"
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="Anonymous"
                  type="text"
                  value={displayName}
                />
              </div>
              <div>
                <label
                  className="mb-base block font-label-bold text-label-bold uppercase tracking-wide text-deep-forest"
                  htmlFor="review_body"
                >
                  Your review
                </label>
                <textarea
                  className="min-h-32 w-full border-2 border-primary bg-background px-base py-base font-body-md text-on-surface outline-none focus:border-vibrant-clay disabled:opacity-50"
                  disabled={loading}
                  id="review_body"
                  minLength={20}
                  onChange={(e) => setBody(e.target.value)}
                  required
                  value={body}
                />
                <p className="mt-base font-body-md text-on-surface-variant/70">
                  Minimum 20 characters ({body.trim().length}/20)
                </p>
              </div>
              <div className="flex flex-wrap gap-base">
                <button
                  className="rounded-full border-2 border-deep-forest px-gutter py-base font-label-bold text-label-bold text-deep-forest transition-colors hover:bg-deep-forest hover:text-on-primary disabled:opacity-50"
                  disabled={loading}
                  onClick={onClose}
                  type="button"
                >
                  Cancel
                </button>
                <button
                  className="rounded-full bg-vibrant-clay px-gutter py-base font-label-bold text-label-bold text-on-primary shadow-lg transition-all hover:opacity-90 disabled:opacity-50"
                  disabled={loading}
                  type="submit"
                >
                  {loading ? "Submitting…" : "Submit review"}
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
