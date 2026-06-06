import { StaticPage } from "@/components/site/static-page";

export default function TherapiesPage(): JSX.Element {
  return (
    <StaticPage
      description="Individual therapy for people navigating anxiety, stress, relationships, and major transitions."
      eyebrow="Therapies"
      title="Support for the parts of life that ask for steadiness."
    >
      <p>
        Current services are focused on one-hour individual therapy sessions.
        The work may include emotional regulation, self-understanding,
        relationship reflection, stress management, and meaning-making during
        change.
      </p>
      <p>
        Manohiti does not present a generic menu of treatments yet. The Phase 1
        experience is intentionally narrow: discover the practice, view
        availability, and book a session.
      </p>
      <p>
        Temporary page: this will later list therapy themes, session structure,
        suitability guidance, and frequently asked questions.
      </p>
    </StaticPage>
  );
}
