/**
 * Browser-side Supabase client (singleton).
 *
 * Uses the public anon key — all access is governed by Row Level Security (RLS).
 * This client runs in the browser and is safe to expose to end users.
 *
 * Environment variables:
 * - NEXT_PUBLIC_SUPABASE_URL: Supabase project URL
 * - NEXT_PUBLIC_SUPABASE_ANON_KEY: Supabase anonymous/public key
 *
 * @module lib/supabase/client
 */
import { createBrowserClient } from "@supabase/ssr";

/**
 * Creates a Supabase client for use in browser-side React components.
 *
 * Call this function once per component tree (or use via a hook/context).
 * The @supabase/ssr package handles cookie-based session management
 * automatically for Next.js App Router.
 *
 * @returns Supabase browser client instance
 */
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}
