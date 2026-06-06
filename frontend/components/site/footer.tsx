import Link from "next/link";

const INSTAGRAM_URL = "https://www.instagram.com/manohitihealth/";

export function Footer(): JSX.Element {
  return (
    <footer className="w-full bg-deep-forest text-warm-surface">
      <div className="mx-auto grid w-full max-w-container-max grid-cols-1 gap-gutter px-margin-mobile py-section-gap md:grid-cols-12 md:px-margin-desktop">
        <div className="md:col-span-4">
          <Link
            className="mb-gutter block font-headline-lg text-headline-lg text-vibrant-clay"
            href="/"
          >
            Manohiti
          </Link>
          <p className="mb-gutter max-w-xs font-body-md text-warm-surface/70">
            Sophisticated Care, Boldly Delivered. We walk beside you on the path
            to self-discovery.
          </p>
        </div>
        <div className="md:col-span-2">
          <h5 className="mb-gutter font-label-bold text-[12px] uppercase tracking-widest text-vibrant-clay">
            Practice
          </h5>
          <ul className="space-y-base">
            <li>
              <Link
                className="font-body-md text-warm-surface/80 transition-colors hover:text-tertiary-fixed-dim"
                href="/therapies"
              >
                Therapies
              </Link>
            </li>
            <li>
              <Link
                className="font-body-md text-warm-surface/80 transition-colors hover:text-tertiary-fixed-dim"
                href="/practice"
              >
                Specialists
              </Link>
            </li>
            <li>
              <Link
                className="font-body-md text-warm-surface/80 transition-colors hover:text-tertiary-fixed-dim"
                href="/resources"
              >
                Resources
              </Link>
            </li>
          </ul>
        </div>
        <div className="md:col-span-2">
          <h5 className="mb-gutter font-label-bold text-[12px] uppercase tracking-widest text-vibrant-clay">
            Legal
          </h5>
          <ul className="space-y-base">
            <li>
              <Link
                className="font-body-md text-warm-surface/80 transition-colors hover:text-tertiary-fixed-dim"
                href="/privacy"
              >
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link
                className="font-body-md text-warm-surface/80 transition-colors hover:text-tertiary-fixed-dim"
                href="/terms"
              >
                Terms of Service
              </Link>
            </li>
            <li>
              <Link
                className="font-body-md text-warm-surface/80 transition-colors hover:text-tertiary-fixed-dim"
                href="/accessibility"
              >
                Accessibility
              </Link>
            </li>
          </ul>
        </div>
        <div className="md:col-span-4">
          <h5 className="mb-gutter font-label-bold text-[12px] uppercase tracking-widest text-vibrant-clay">
            Stay Connected
          </h5>
          <div className="mb-gutter flex gap-gutter">
            <a
              aria-label="Email Manohiti"
              className="text-warm-surface transition-colors hover:text-vibrant-clay"
              href="mailto:heti3215@gmail.com"
            >
              <span className="material-symbols-outlined">alternate_email</span>
            </a>
            <a
              aria-label="Manohiti Health on Instagram"
              className="text-warm-surface transition-colors hover:text-vibrant-clay"
              href={INSTAGRAM_URL}
              rel="noreferrer"
              target="_blank"
            >
              <span className="material-symbols-outlined">photo_camera</span>
            </a>
          </div>
          <p className="font-body-md text-[12px] text-warm-surface/50">
            © 2024 Manohiti Wellness Collective. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
