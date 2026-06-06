import { Button as ButtonPrimitive } from "@base-ui/react/button";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center border border-transparent bg-clip-padding whitespace-nowrap transition-all outline-none select-none focus-visible:ring-2 focus-visible:ring-primary/30 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default:
          "rounded-full bg-vibrant-clay font-label-bold text-label-bold text-on-primary shadow-lg hover:opacity-90 active:scale-95",
        primary:
          "rounded-full bg-deep-forest font-label-bold text-label-bold text-on-primary transition-all hover:bg-primary",
        outline:
          "rounded-full border-2 border-deep-forest font-label-bold text-label-bold text-deep-forest transition-all hover:bg-deep-forest hover:text-on-primary",
        secondary:
          "rounded-full bg-vibrant-clay font-label-bold text-label-bold text-on-primary shadow-xl transition-all hover:bg-primary",
        ghost:
          "rounded-full font-label-bold text-label-bold text-primary transition-colors hover:text-vibrant-clay",
        destructive:
          "rounded-full bg-error/10 font-label-bold text-label-bold text-error hover:bg-error/20",
        link: "font-body-md text-vibrant-clay underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 gap-1.5 px-gutter py-base",
        sm: "h-8 gap-1 px-3 text-[0.8rem]",
        lg: "h-12 gap-2 px-section-gap py-gutter text-base",
        icon: "size-10 rounded-full",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

function Button({
  className,
  variant = "default",
  size = "default",
  ...props
}: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
