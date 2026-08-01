import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium transition-colors",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-[var(--color-bg-subtle)] text-[var(--color-fg-muted)]",
        accent:
          "border-[color-mix(in_oklab,var(--color-accent)_35%,transparent)] bg-[var(--color-accent-soft)] text-[var(--color-accent)]",
        outline: "border-[var(--color-border-strong)] text-[var(--color-fg-muted)]",
      },
    },
    defaultVariants: { variant: "default" },
  },
);

export function Badge({
  className,
  variant,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof badgeVariants>) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}
