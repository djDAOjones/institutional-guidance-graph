/**
 * POST /api/auth/signout — Signs out the current user.
 *
 * Clears the Supabase session cookies and redirects to the login page.
 * Uses a server-side route handler so the session is invalidated
 * on the server before the redirect.
 *
 * @module app/api/auth/signout/route
 */
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { type NextRequest } from "next/server";

export async function POST(_request: NextRequest) {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}
