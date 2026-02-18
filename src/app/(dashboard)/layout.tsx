/**
 * Dashboard layout — wraps all authenticated pages.
 *
 * Provides a consistent navigation header with:
 * - App title (Nielsen #4: Consistency)
 * - User email display (Nielsen #1: System status)
 * - Sign out button
 * - Navigation links
 *
 * WCAG AAA: landmark roles, skip-to-content target, keyboard navigation.
 *
 * @module app/(dashboard)/layout
 */
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { APP_NAME } from "@/lib/constants";
import Link from "next/link";

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation header */}
      <header
        role="banner"
        className="border-b border-border bg-background-inverse"
      >
        <nav
          aria-label="Primary navigation"
          className="mx-auto flex max-w-7xl items-center justify-between px-carbon-5 py-carbon-3"
        >
          {/* Left: App title + nav links */}
          <div className="flex items-center gap-carbon-7">
            <Link
              href="/graph"
              className="text-carbon-lg font-semibold text-foreground-inverse hover:opacity-90"
            >
              {APP_NAME}
            </Link>
            <div className="flex items-center gap-carbon-5">
              <Link
                href="/graph"
                className="text-carbon-sm text-foreground-inverse/80 hover:text-foreground-inverse"
              >
                Guidance Items
              </Link>
              <Link
                href="/guidance/new"
                className="text-carbon-sm text-foreground-inverse/80 hover:text-foreground-inverse"
              >
                + New Item
              </Link>
            </div>
          </div>

          {/* Right: User info + sign out */}
          <div className="flex items-center gap-carbon-5">
            <span className="text-carbon-sm text-foreground-inverse/70">
              {user.email}
            </span>
            <form action="/api/auth/signout" method="POST">
              <button
                type="submit"
                className="rounded border border-foreground-inverse/30 px-carbon-4 py-carbon-2 text-carbon-sm text-foreground-inverse/80 transition-colors hover:bg-foreground-inverse/10 hover:text-foreground-inverse focus:outline-none focus:ring-2 focus:ring-interactive focus:ring-offset-2 focus:ring-offset-background-inverse"
              >
                Sign out
              </button>
            </form>
          </div>
        </nav>
      </header>

      {/* Main content area */}
      {children}
    </div>
  );
}
