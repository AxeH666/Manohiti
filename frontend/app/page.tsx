import Link from "next/link";

import { ReviewsMarquee } from "@/components/landing/reviews-marquee";
import { ScrollReveal } from "@/components/landing/scroll-reveal";

const THERAPIST_IMAGE =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuC44AugHc8sV2awMG9VtfY1hQmADgn4Zd1UEoX0iKFqgKo21lYd4nZsZcCYhXX3kjZC2yPl8vJt-NmIYmV4UOtLIN75ICCsaIm90mBTD2n_MOt6QUcVxOmETPWzI_wzWyr71xRd_8eBTG74bjS96O3mAJv4P8nQMfk8JusQn9dXQyjXeqDUWtmUNkqhxA-YsH8Zj-dgqFwG9bMdV6qOh09Lwcs_KiNqGl_apAOlV0vFN4hiW20AiRxmNJUPaKrZrPF3Ep64s1_STUg";

const DETAIL_IMAGE_ONE =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuCuC_vybI06fsKizQPa_UHF7xxArLeR_fYoK7eykLPSiEq4YoT8yZN_IF18WcihK0yr6nt1NpLsNzIV8MvvE_8nsfuejFXB0RiS2UDdvChFCViifIlKtAc8EyVqppu07sFixnvhQqwwpfwQmKNbNkaO9A--dysFuf9BwIcMdXghrKCCXZlh2zMQJhbHRnYnQBjBvlpmErn-weQ0gkCwdVIqrS-3eY6EabXIyqvN8PU1PTFcS2r2V8rXP4CnwZneUFLfqiEB8LsZNFM";

const DETAIL_IMAGE_TWO =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuA4g3tQvO44SE-n80Y5jgWhij97kTss91uEmCtaM4AQdfW93IplW7E0kyz7vc9D6hSubYOpTTMcPWTg750bvsbGxBNrFZ0N3GgbcYizWyKMVmuh7U1XgeD6TWZeEJhdZHTl5lEcpwS2KktUhO8MRwHZKhKWiTJNC14vTfmSUzDh1QxLar7CMCVfai3HbyV1oHLS_uTlRzLJCZrzGugEeke5Uiu_3kjLNFt2FlMiRlGvGs6LFEWDlQEmU2OsfE0KinnRLQNe9i7aOlg";

const SERVICES = [
  {
    title: "Individual Therapy",
    description: "1 hour, one-on-one sessions tailored to your needs and pace.",
  },
  {
    title: "Anxiety & Stress",
    description: "Practical tools to manage overwhelm and restore a sense of calm.",
  },
  {
    title: "Life Transitions",
    description: "Support through change — career, relationships, identity, and more.",
  },
] as const;

export default function Home(): JSX.Element {
  return (
    <>
      <main className="w-full">
        <section className="deep-texture relative overflow-hidden bg-surface-container-low pb-gutter pt-section-gap">
          <ScrollReveal immediate>
            <div className="mx-auto grid max-w-container-max grid-cols-1 items-center gap-gutter px-margin-mobile md:grid-cols-12 md:px-margin-desktop">
              <div className="z-10 md:col-span-6">
                <span className="mb-base inline-block font-label-bold text-label-bold uppercase tracking-widest text-vibrant-clay">
                  A Humanistic Approach
                </span>
                <h1 className="mb-gutter font-display-xl text-display-xl-mobile text-deep-forest md:text-display-xl">
                  This is your journey. <br />
                  <span className="font-light italic text-vibrant-clay">
                    I&apos;m just here.
                  </span>
                </h1>
                <p className="mb-gutter max-w-lg font-body-lg text-body-lg leading-relaxed text-on-surface-variant">
                  Finding balance isn&apos;t about reaching a destination;
                  it&apos;s about making peace with where you are right now. We
                  provide a sophisticated, grounding space for emotional
                  healing.
                </p>
                <div className="flex flex-col gap-gutter sm:flex-row">
                  <Link
                    className="group flex items-center justify-center gap-base rounded-full bg-deep-forest px-gutter py-base font-label-bold text-label-bold text-on-primary transition-all hover:bg-primary"
                    href="/booking"
                  >
                    Start Your Journey
                    <span className="material-symbols-outlined text-[20px] transition-transform group-hover:translate-x-1">
                      arrow_forward_ios
                    </span>
                  </Link>
                  <Link
                    className="rounded-full border-2 border-deep-forest px-gutter py-base font-label-bold text-label-bold text-deep-forest transition-all hover:bg-deep-forest hover:text-on-primary"
                    href="/practice"
                  >
                    View Approach
                  </Link>
                </div>
              </div>
              <div className="relative md:col-span-6">
                <div className="aspect-square overflow-hidden rounded-[3rem] bg-deep-forest shadow-2xl">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    alt="Therapist"
                    className="h-full w-full scale-110 object-cover transition-transform duration-700 hover:scale-105"
                    src={THERAPIST_IMAGE}
                  />
                </div>
                <div className="absolute -right-12 -top-12 -z-10 h-48 w-48 rounded-full bg-tertiary-fixed/40 blur-3xl" />
              </div>
            </div>
          </ScrollReveal>
        </section>

        <section className="bg-deep-forest py-section-gap text-on-primary">
          <ScrollReveal>
            <div className="mx-auto max-w-container-max px-margin-mobile md:px-margin-desktop">
              <div className="mb-section-gap flex flex-col justify-between gap-gutter md:flex-row md:items-end">
                <div className="max-w-2xl">
                  <h2 className="mb-gutter font-headline-lg text-headline-lg">
                    The Foundation of Our Work
                  </h2>
                  <p className="font-body-lg text-body-lg text-on-primary/80">
                    We embrace a person-centered philosophy that prioritizes
                    your autonomy and inner wisdom. Modern care for a complex
                    world.
                  </p>
                </div>
                <div className="hidden md:block">
                  <span className="font-display-xl text-[120px] leading-none text-vibrant-clay opacity-20">
                    01
                  </span>
                </div>
              </div>
              <div className="grid grid-cols-1 gap-gutter md:grid-cols-3">
                {SERVICES.map((service) => (
                  <article
                    className="border border-on-primary/20 bg-on-primary/5 p-gutter"
                    key={service.title}
                  >
                    <h3 className="mb-base font-headline-md text-headline-md">
                      {service.title}
                    </h3>
                    <p className="font-body-md text-on-primary/80">
                      {service.description}
                    </p>
                  </article>
                ))}
              </div>
            </div>
          </ScrollReveal>
        </section>

        <section className="bg-warm-surface py-section-gap">
          <div className="mx-auto flex max-w-container-max flex-col items-center gap-section-gap px-margin-mobile md:px-margin-desktop lg:flex-row">
            <div className="grid w-full grid-cols-2 gap-gutter lg:w-1/2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                alt="Detail 1"
                className="aspect-[3/4] w-full transform rounded-xl object-cover shadow-xl"
                src={DETAIL_IMAGE_ONE}
              />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                alt="Detail 2"
                className="aspect-[3/4] w-full transform rounded-xl object-cover shadow-xl"
                src={DETAIL_IMAGE_TWO}
              />
            </div>
            <div className="w-full lg:w-1/2">
              <h2 className="mb-gutter font-headline-lg text-headline-lg text-deep-forest">
                A Sanctuary for Transformation
              </h2>
              <p className="mb-gutter font-body-lg text-body-lg text-on-surface-variant">
                Our sessions are designed to be a refuge from the noise of
                modern life. In this space, silence is just as important as
                speech. We integrate traditional talk therapy with mindfulness
                practices to ensure a comprehensive healing experience.
              </p>
              <div className="space-y-gutter">
                <div className="flex items-start gap-gutter">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-vibrant-clay/10">
                    <span className="material-symbols-outlined text-vibrant-clay">
                      check_circle
                    </span>
                  </div>
                  <div>
                    <h4 className="mb-base font-headline-md text-[20px] text-deep-forest">
                      Trauma-Informed Space
                    </h4>
                    <p className="font-body-md text-on-surface-variant">
                      Safety and consent are the pillars of every interaction.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-gutter">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-vibrant-clay/10">
                    <span className="material-symbols-outlined text-vibrant-clay">
                      check_circle
                    </span>
                  </div>
                  <div>
                    <h4 className="mb-base font-headline-md text-[20px] text-deep-forest">
                      Virtual &amp; Global
                    </h4>
                    <p className="font-body-md text-on-surface-variant">
                      Expert care accessible from the comfort of your own home.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <ReviewsMarquee />

        <section className="bg-background px-margin-mobile pb-section-gap pt-section-gap md:px-margin-desktop">
          <div className="relative mx-auto max-w-container-max overflow-hidden rounded-[3rem] bg-vibrant-clay p-gutter text-center text-on-primary shadow-2xl md:p-section-gap">
            <div className="relative z-10">
              <h2 className="mb-gutter text-center font-display-xl text-display-xl-mobile md:text-display-xl">
                Ready to take the first step?
              </h2>
              <p className="mx-auto mb-section-gap max-w-2xl text-center font-body-lg text-body-lg opacity-90">
                Book a 1-hour session with Heti. Let&apos;s begin today.
              </p>
              <div className="flex flex-col justify-center gap-gutter sm:flex-row">
                <Link
                  className="rounded-full bg-deep-forest px-section-gap py-gutter font-label-bold text-label-bold text-on-primary shadow-xl transition-all hover:bg-primary"
                  href="/booking"
                >
                  Book a Session
                </Link>
              </div>
            </div>
            <div className="absolute -right-48 -top-48 h-96 w-96 rounded-full bg-on-primary/10 blur-[100px]" />
            <div className="absolute -bottom-48 -left-48 h-96 w-96 rounded-full bg-deep-forest/20 blur-[100px]" />
          </div>
        </section>
      </main>
    </>
  );
}
