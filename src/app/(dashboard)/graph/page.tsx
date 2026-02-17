/**
 * Graph explorer page — the main view of the application.
 *
 * This is a placeholder that will be replaced with the full Cytoscape.js
 * graph visualisation in Phase 1 (Task 1.6).
 *
 * Current behaviour: shows a simple status page confirming auth works
 * and the app shell is functional.
 *
 * @module app/(dashboard)/graph/page
 */
import { createClient } from "@/lib/supabase/server";
import { APP_NAME } from "@/lib/constants";
import { redirect } from "next/navigation";

export default async function GraphPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <main
      id="main-content"
      role="main"
      aria-label="Graph explorer"
      className="flex min-h-screen flex-col items-center justify-center bg-background px-carbon-5"
    >
      <div className="max-w-lg space-y-carbon-6 text-center">
        <h1 className="text-carbon-4xl font-semibold text-foreground">
          {APP_NAME}
        </h1>

        <p className="text-carbon-lg text-foreground-secondary">
          Phase 0 scaffold complete. The graph explorer will be built here in Phase 1.
        </p>

        {/* Auth status — Nielsen #1 (System status) */}
        <div className="rounded-lg border border-border bg-background-subtle p-carbon-5">
          <p className="text-carbon-sm text-foreground-secondary">
            Signed in as
          </p>
          <p className="mt-carbon-2 font-medium text-foreground">
            {user.email}
          </p>
        </div>

        {/* Sign out form */}
        <form action="/api/auth/signout" method="POST">
          <button
            type="submit"
            className="rounded border border-border bg-background px-carbon-5 py-carbon-3 text-carbon-sm font-medium text-foreground transition-colors duration-carbon-moderate hover:bg-background-subtle focus:outline-none focus:ring-2 focus:ring-interactive focus:ring-offset-2"
          >
            Sign out
          </button>
        </form>
      </div>
    </main>
  );
}
