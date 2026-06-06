"use client";

import { useEffect, useMemo, useState } from "react";

import { fetchReviews, getApiErrorMessage, type Review } from "@/lib/api";
import { cn } from "@/lib/utils";

const MIN_REVIEWS = 6;
const TRUNCATE_LENGTH = 120;

function truncateBody(text: string): string {
  if (text.length <= TRUNCATE_LENGTH) {
    return text;
  }
  return `${text.slice(0, TRUNCATE_LENGTH).trimEnd()}…`;
}

function expandReviews(reviews: Review[]): Review[] {
  if (reviews.length === 0) {
    return [];
  }
  const expanded = [...reviews];
  while (expanded.length < MIN_REVIEWS) {
    expanded.push(...reviews);
  }
  return expanded;
}

function StarDisplay({ rating }: { rating: number }): JSX.Element {
  return (
    <div aria-label={`${rating} out of 5 stars`} className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          className={cn(
            "material-symbols-outlined text-base",
            star <= rating ? "text-vibrant-clay" : "text-on-surface-variant/25",
          )}
          key={star}
          style={{ fontVariationSettings: star <= rating ? '"FILL" 1' : '"FILL" 0' }}
        >
          star
        </span>
      ))}
    </div>
  );
}

function ReviewCard({ review }: { review: Review }): JSX.Element {
  return (
    <article className="mx-base w-72 shrink-0 border-2 border-primary/20 bg-background p-gutter shadow-md">
      <StarDisplay rating={review.rating} />
      <p className="my-base font-body-md text-on-surface-variant">
        &ldquo;{truncateBody(review.body)}&rdquo;
      </p>
      <p className="font-label-bold text-label-bold text-deep-forest">
        {review.display_name}
      </p>
    </article>
  );
}

function MarqueeRow({
  reviews,
  direction,
}: {
  reviews: Review[];
  direction: "left" | "right";
}): JSX.Element {
  const track = [...reviews, ...reviews];

  return (
    <div className="reviews-marquee-row overflow-hidden">
      <div
        className={cn(
          "reviews-marquee-track flex w-max",
          direction === "left" ? "reviews-marquee-left" : "reviews-marquee-right",
        )}
      >
        {track.map((review, index) => (
          <ReviewCard key={`${review.display_name}-${review.created_at}-${index}`} review={review} />
        ))}
      </div>
    </div>
  );
}

export function ReviewsMarquee(): JSX.Element {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchReviews();
        if (!cancelled) {
          setReviews(data);
        }
      } catch (err) {
        if (!cancelled) {
          setError(getApiErrorMessage(err));
          setReviews([]);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };
    void load();
    return () => {
      cancelled = true;
    };
  }, []);

  const expanded = useMemo(() => expandReviews(reviews), [reviews]);
  const rowOne = useMemo(
    () => expanded.filter((_, index) => index % 2 === 0),
    [expanded],
  );
  const rowTwo = useMemo(
    () => expanded.filter((_, index) => index % 2 === 1),
    [expanded],
  );

  return (
    <section className="bg-warm-surface py-section-gap">
      <div className="mx-auto max-w-container-max px-margin-mobile md:px-margin-desktop">
        <div className="mb-section-gap text-center">
          <span className="mb-base inline-block font-label-bold text-label-bold uppercase tracking-widest text-vibrant-clay">
            Testimonials
          </span>
          <h2 className="font-headline-lg text-headline-lg text-deep-forest">
            What people say
          </h2>
        </div>

        {loading && (
          <p className="text-center font-body-md text-on-surface-variant">
            Loading reviews…
          </p>
        )}

        {!loading && error && (
          <p className="text-center font-body-md text-on-surface-variant" role="alert">
            {error}
          </p>
        )}

        {!loading && !error && reviews.length === 0 && (
          <p className="text-center font-body-md text-on-surface-variant">
            Reviews will appear here once approved.
          </p>
        )}

        {!loading && !error && reviews.length > 0 && (
          <div className="reviews-marquee group space-y-gutter">
            <MarqueeRow direction="left" reviews={rowOne.length > 0 ? rowOne : expanded} />
            <MarqueeRow direction="right" reviews={rowTwo.length > 0 ? rowTwo : expanded} />
          </div>
        )}
      </div>
    </section>
  );
}
