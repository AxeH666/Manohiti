import Link from "next/link";
import type { ReactNode } from "react";

type StaticPageProps = {
  eyebrow: string;
  title: string;
  description: string;
  children: ReactNode;
};

export function StaticPage({
  eyebrow,
  title,
  description,
  children,
}: StaticPageProps): JSX.Element {
  return (
    <main className="bg-warm-surface">
      <section className="mx-auto max-w-container-max px-margin-mobile py-section-gap md:px-margin-desktop">
        <p className="mb-base font-label-bold text-label-bold uppercase tracking-widest text-vibrant-clay">
          {eyebrow}
        </p>
        <h1 className="mb-gutter max-w-4xl font-display-xl text-display-xl-mobile text-deep-forest md:text-display-xl">
          {title}
        </h1>
        <p className="max-w-2xl font-body-lg text-body-lg text-on-surface-variant">
          {description}
        </p>
      </section>
      <section className="mx-auto max-w-container-max px-margin-mobile pb-section-gap md:px-margin-desktop">
        <div className="grid gap-gutter lg:grid-cols-12">
          <article className="bg-background p-gutter shadow-xl lg:col-span-8">
            <div className="space-y-gutter font-body-md text-on-surface-variant">
              {children}
            </div>
          </article>
          <aside className="bg-deep-forest p-gutter text-on-primary lg:col-span-4">
            <h2 className="mb-gutter font-headline-md text-headline-md">
              Ready to begin?
            </h2>
            <p className="mb-gutter font-body-md text-on-primary/80">
              Book a pro bono individual session or return to the practice
              overview.
            </p>
            <div className="flex flex-col gap-base">
              <Link
                className="rounded-full bg-vibrant-clay px-gutter py-base text-center font-label-bold text-label-bold text-on-primary shadow-lg transition-all hover:opacity-90"
                href="/booking"
              >
                Book Session
              </Link>
              <Link
                className="rounded-full border-2 border-warm-surface px-gutter py-base text-center font-label-bold text-label-bold text-warm-surface transition-all hover:bg-warm-surface hover:text-deep-forest"
                href="/practice"
              >
                View Practice
              </Link>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}
