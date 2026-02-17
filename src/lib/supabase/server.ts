/**
 * Server-side Supabase client for Next.js API routes and Server Components.
 *
 * Uses cookie-based session management via @supabase/ssr.
 * This client reads/writes cookies to maintain the user's auth session
 * across server-rendered pages and API route handlers.
 *
 * @module lib/supabase/server
 */
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

/**
 * Creates a Supabase client for server-side use (Server Components, Route Handlers).
 *
 * Reads the auth session from cookies set by the browser client.
 * RLS policies apply based on the authenticated user's role.
 *
 * @returns Supabase server client instance
 */
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          } catch {
            // setAll can fail in Server Components (read-only cookies).
            // This is expected — the middleware handles cookie refresh.
          }
        },
      },
    },
  );
}
