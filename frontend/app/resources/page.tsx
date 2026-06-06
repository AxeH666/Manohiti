import Link from "next/link";

import { StaticPage } from "@/components/site/static-page";

export default function ResourcesPage(): JSX.Element {
  return (
    <StaticPage
      description="Short, practical resources will live here as the platform grows."
      eyebrow="Resources"
      title="Grounding material for before and after therapy."
    >
      <p>
        This resources page is a temporary home for future writing, grounding
        exercises, session preparation notes, and care guidance.
      </p>
      <p>
        Until the resource library is built, use the booking flow to schedule a
        session or follow Manohiti on Instagram for practice updates.
      </p>
      <p>
        Instagram:{" "}
        <a
          className="font-bold text-vibrant-clay underline-offset-4 hover:underline"
          href="https://www.instagram.com/manohitihealth/"
          rel="noreferrer"
          target="_blank"
        >
          @manohitihealth
        </a>
      </p>
      <p>
        Need a direct next step?{" "}
        <Link
          className="font-bold text-vibrant-clay underline-offset-4 hover:underline"
          href="/booking"
        >
          Book a session
        </Link>
        .
      </p>
    </StaticPage>
  );
}
