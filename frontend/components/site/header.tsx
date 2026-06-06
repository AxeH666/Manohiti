import Link from "next/link";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/practice", label: "Our Practice" },
  { href: "/therapies", label: "Therapies" },
  { href: "/resources", label: "Resources" },
] as const;

export function Header(): JSX.Element {
  return (
    <header className="sticky top-0 z-50 w-full border-b-2 border-primary bg-background">
      <nav className="mx-auto flex w-full max-w-container-max items-center justify-between px-margin-mobile py-base md:px-margin-desktop">
        <Link
          className="font-headline-md text-headline-md font-bold text-primary"
          href="/"
        >
          Manohiti
        </Link>
        <div className="hidden items-center gap-gutter md:flex">
          {NAV_LINKS.map((link) => (
            <Link
              className="font-label-bold text-label-bold font-medium text-primary transition-colors duration-200 hover:text-vibrant-clay"
              href={link.href}
              key={link.href}
            >
              {link.label}
            </Link>
          ))}
        </div>
        <Link
          className="rounded-full bg-vibrant-clay px-gutter py-base font-label-bold text-label-bold text-on-primary shadow-lg transition-all hover:opacity-90 active:scale-95"
          href="/booking"
        >
          Book Session
        </Link>
      </nav>
    </header>
  );
}
