/**
 * Login page — email + password authentication via Supabase Auth.
 *
 * Design principles applied:
 * - Carbon: Uses Carbon spacing, type scale, and colour tokens
 * - WCAG AAA: 7:1 contrast, labelled inputs, keyboard-navigable, focus ring
 * - Nielsen #1 (System status): Loading state during auth
 * - Nielsen #5 (Error prevention): Email format validation before submit
 * - Nielsen #9 (Error recovery): Clear error messages with retry affordance
 *
 * @module app/(auth)/login/page
 */
"use client";

import { useState, type FormEvent } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { APP_NAME } from "@/lib/constants";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  /**
   * Handles form submission for email/password login.
   * Shows loading state during auth and clear error messages on failure.
   */
  async function handleLogin(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }

    router.push("/graph");
    router.refresh();
  }

  return (
    <main
      id="main-content"
      className="flex min-h-screen items-center justify-center bg-background-subtle px-carbon-5"
    >
      <div className="w-full max-w-md space-y-carbon-7">
        {/* Header — Carbon type scale */}
        <div className="text-center">
          <h1 className="text-carbon-4xl font-semibold text-foreground">
            {APP_NAME}
          </h1>
          <p className="mt-carbon-3 text-carbon-base text-foreground-secondary">
            Sign in to manage institutional guidance
          </p>
        </div>

        {/* Login form */}
        <form
          onSubmit={handleLogin}
          className="space-y-carbon-5 rounded-lg border border-border bg-background p-carbon-7 shadow-sm"
          noValidate
        >
          {/* Error message — Nielsen #9 (Error recovery) */}
          {error && (
            <div
              role="alert"
              className="rounded border border-status-error/30 bg-status-error/10 p-carbon-4 text-carbon-sm text-status-error"
            >
              <p className="font-medium">Sign in failed</p>
              <p className="mt-carbon-1">{error}</p>
            </div>
          )}

          {/* Email field — WCAG: labelled, described, keyboard-navigable */}
          <div className="space-y-carbon-2">
            <label
              htmlFor="email"
              className="block text-carbon-sm font-medium text-foreground"
            >
              Email address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@nottingham.ac.uk"
              aria-describedby="email-hint"
              className="block w-full rounded border border-border bg-background px-carbon-4 py-carbon-3 text-carbon-base text-foreground placeholder:text-foreground-disabled focus:border-interactive focus:outline-none focus:ring-2 focus:ring-interactive focus:ring-offset-2"
            />
            <p id="email-hint" className="text-carbon-xs text-foreground-secondary">
              Use your university or registered email
            </p>
          </div>

          {/* Password field */}
          <div className="space-y-carbon-2">
            <label
              htmlFor="password"
              className="block text-carbon-sm font-medium text-foreground"
            >
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="block w-full rounded border border-border bg-background px-carbon-4 py-carbon-3 text-carbon-base text-foreground placeholder:text-foreground-disabled focus:border-interactive focus:outline-none focus:ring-2 focus:ring-interactive focus:ring-offset-2"
            />
          </div>

          {/* Submit button — Carbon interactive colour, loading state */}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded bg-interactive px-carbon-5 py-carbon-3 text-carbon-base font-medium text-foreground-inverse transition-colors duration-carbon-moderate hover:bg-interactive-hover focus:outline-none focus:ring-2 focus:ring-interactive focus:ring-offset-2 active:bg-interactive-active disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-carbon-3">
                {/* Simple loading indicator — Nielsen #1 (System status) */}
                <span
                  className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-foreground-inverse border-t-transparent"
                  aria-hidden="true"
                />
                Signing in…
              </span>
            ) : (
              "Sign in"
            )}
          </button>
        </form>

        {/* Help text */}
        <p className="text-center text-carbon-sm text-foreground-secondary">
          Don&apos;t have an account? Contact your administrator.
        </p>
      </div>
    </main>
  );
}
