import { Link, createFileRoute } from "@tanstack/react-router";
import { Highlighter } from "lucide-react";
import { GROK_PROVIDERS, authEnabled, signIn } from "@/lib/auth/client";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/login")({
  component: LoginPage,
});

function LoginPage() {
  return (
    <div className="grid min-h-dvh place-items-center bg-[var(--color-bg)] px-4">
      <div className="w-full max-w-sm">
        <Link to="/" className="mb-8 flex items-center justify-center gap-2">
          <span className="grid h-9 w-9 place-items-center rounded-[var(--radius-sm)] bg-[var(--color-fg)] text-[var(--color-primary-fg)]">
            <Highlighter className="h-4 w-4" />
          </span>
          <span className="text-sm font-semibold tracking-tight">annotated</span>
        </Link>
        <div className="rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-6 shadow-[var(--shadow-soft)]">
          <h1 className="text-xl font-semibold tracking-tight">Sign in</h1>
          <p className="mt-1.5 text-sm text-[var(--color-fg-muted)]">
            Account creation is via X or Google only — matching the product
            spec.
          </p>
          <div className="mt-6 space-y-2">
            {authEnabled ? (
              GROK_PROVIDERS.map((p) => (
                <Button
                  key={p.providerId}
                  type="button"
                  variant="secondary"
                  className="w-full"
                  onClick={() => signIn(p.providerId, { callbackURL: "/clip" })}
                >
                  Continue with {p.label}
                </Button>
              ))
            ) : (
              <p className="text-sm text-[var(--color-fg-subtle)]">
                Sign-in is disabled in this environment.
              </p>
            )}
          </div>
        </div>
        <p className="mt-4 text-center text-xs text-[var(--color-fg-subtle)]">
          <Link to="/feed" className="hover:text-[var(--color-fg-muted)]">
            Browse the public feed without signing in
          </Link>
        </p>
      </div>
    </div>
  );
}
