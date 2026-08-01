import { Link } from "@tanstack/react-router";
import { Highlighter, Menu, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { UserButton } from "@/lib/auth/gates";
import { cn } from "@/lib/utils";

const links = [
  { to: "/feed", label: "Feed" },
  { to: "/clip", label: "Sidebar" },
  { to: "/demo", label: "Demo video" },
] as const;

export function SiteHeader() {
  const { user, isPending } = useCurrentUserState();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-[var(--color-border)] bg-[color-mix(in_oklab,var(--color-bg)_88%,transparent)] backdrop-blur-xl">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-3 px-4 sm:px-6">
        <Link to="/" className="flex items-center gap-2.5">
          <span className="grid h-8 w-8 place-items-center rounded-[var(--radius-sm)] bg-[var(--color-fg)] text-[var(--color-primary-fg)]">
            <Highlighter className="h-4 w-4" />
          </span>
          <span className="text-sm font-semibold tracking-tight">annotated</span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className="rounded-[var(--radius-sm)] px-3 py-2 text-sm text-[var(--color-fg-muted)] transition hover:bg-[var(--color-bg-subtle)] hover:text-[var(--color-fg)]"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <div className="hidden sm:block">
            {isPending ? (
              <div className="h-8 w-28 animate-pulse rounded-full bg-[var(--color-bg-subtle)]" />
            ) : user ? (
              <UserButton />
            ) : (
              <Button asChild size="sm" variant="secondary">
                <Link to="/login">Sign in</Link>
              </Button>
            )}
          </div>
          <Button
            variant="ghost"
            size="icon-sm"
            className="md:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-label="Menu"
          >
            {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      <div
        className={cn(
          "border-t border-[var(--color-border)] md:hidden",
          open ? "block" : "hidden",
        )}
      >
        <div className="mx-auto flex max-w-6xl flex-col gap-1 px-4 py-3">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              onClick={() => setOpen(false)}
              className="rounded-[var(--radius-sm)] px-3 py-2.5 text-sm text-[var(--color-fg-muted)] hover:bg-[var(--color-bg-subtle)] hover:text-[var(--color-fg)]"
            >
              {l.label}
            </Link>
          ))}
          <div className="pt-2">
            {isPending ? null : user ? (
              <UserButton />
            ) : (
              <Button asChild className="w-full" size="sm">
                <Link to="/login" onClick={() => setOpen(false)}>
                  Sign in with X or Google
                </Link>
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
