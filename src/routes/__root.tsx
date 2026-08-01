import type { ReactNode } from "react";
import {
  Outlet,
  createRootRoute,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { Toaster } from "sonner";
import { AuthProvider } from "@/lib/auth/provider";
import appCss from "@/styles.css?url";

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      {
        title: "Annotated — clip, annotate, share the open web",
      },
      {
        name: "description",
        content:
          "Chrome sidebar for clipping text, audio, and video from anywhere on the web. Add your take. Publish a landing page that always links back to the source.",
      },
      { property: "og:title", content: "Annotated" },
      {
        property: "og:description",
        content: "Clip media. Add commentary. Share with a source link.",
      },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", href: "/favicon.svg" },
    ],
  }),
  component: RootComponent,
});

function RootComponent() {
  return (
    <RootDocument>
      <AuthProvider>
        <Outlet />
        <Toaster
          theme="dark"
          position="bottom-center"
          toastOptions={{
            className:
              "!bg-[var(--color-bg-elevated)] !text-[var(--color-fg)] !border-[var(--color-border)]",
          }}
        />
      </AuthProvider>
    </RootDocument>
  );
}

function RootDocument({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}
