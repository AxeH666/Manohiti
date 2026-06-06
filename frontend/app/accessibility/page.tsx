import { StaticPage } from "@/components/site/static-page";

export default function AccessibilityPage(): JSX.Element {
  return (
    <StaticPage
      description="Temporary accessibility statement for Manohiti."
      eyebrow="Accessibility"
      title="The website should remain clear, navigable, and usable."
    >
      <p>
        Manohiti aims to keep the website readable, keyboard navigable, and
        understandable across devices. The design uses high-contrast color
        blocks, clear labels, and direct navigation paths.
      </p>
      <p>
        Accessibility review is still needed before launch. Future work should
        include keyboard testing, screen reader checks, form error validation,
        and contrast verification after all booking UI is connected.
      </p>
      <p>
        If something is difficult to use, email `heti3215@gmail.com` so it can
        be corrected.
      </p>
    </StaticPage>
  );
}
