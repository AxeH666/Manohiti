import { StaticPage } from "@/components/site/static-page";

export default function PrivacyPage(): JSX.Element {
  return (
    <StaticPage
      description="Temporary privacy policy for the Manohiti Phase 1 frontend."
      eyebrow="Privacy Policy"
      title="Your information should be handled with care."
    >
      <p>
        This temporary policy explains the intended privacy posture while the
        full legal policy is being prepared. Manohiti collects only the details
        needed to respond to booking requests, manage sessions, and send
        transactional communication.
      </p>
      <p>
        Booking-related information may include name, email, phone number,
        preferred session time, and short notes submitted by the client. Secrets
        and credentials are never stored in frontend code.
      </p>
      <p>
        A production legal review should replace this page before public launch.
      </p>
    </StaticPage>
  );
}
