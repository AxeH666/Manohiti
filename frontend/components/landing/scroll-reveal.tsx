"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

import { cn } from "@/lib/utils";

type ScrollRevealProps = {
  children: ReactNode;
  className?: string;
  immediate?: boolean;
};

export function ScrollReveal({
  children,
  className,
  immediate = false,
}: ScrollRevealProps): JSX.Element {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(immediate);

  useEffect(() => {
    if (immediate) {
      return;
    }

    const element = ref.current;
    if (!element) {
      return;
    }

    const reveal = (): void => {
      setVisible(true);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            reveal();
            observer.disconnect();
          }
        });
      },
      { threshold: 0.05, rootMargin: "0px 0px 10% 0px" },
    );

    const rect = element.getBoundingClientRect();
    if (rect.top < window.innerHeight * 0.95) {
      reveal();
      return;
    }

    observer.observe(element);

    const fallback = window.setTimeout(reveal, 1500);

    return () => {
      observer.disconnect();
      window.clearTimeout(fallback);
    };
  }, [immediate]);

  return (
    <div
      ref={ref}
      className={cn(
        "transition-all duration-1000",
        visible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0",
        className,
      )}
    >
      {children}
    </div>
  );
}
