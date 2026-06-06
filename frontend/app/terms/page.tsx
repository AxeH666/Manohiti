import { StaticPage } from "@/components/site/static-page";

export default function TermsPage(): JSX.Element {
  return (
    <StaticPage
      description="Temporary terms for using the Manohiti website and booking experience."
      eyebrow="Terms of Service"
      title="Use the platform respectfully and with accurate information."
    >
      <p>
        This temporary terms page is a placeholder until formal terms are
        prepared. By using the site, clients should provide accurate booking
        details and avoid submitting emergency or crisis requests through the
        website.
      </p>
      <p>
        The website is not an emergency service. If someone is in immediate
        danger, they should contact local emergency services or a crisis support
        line in their region.
      </p>
      <p>
        Phase 1 sessions are pro bono. Future payment-related terms should be
        added before paid sessions or payment collection go live.
      </p>
    </StaticPage>
  );
}
