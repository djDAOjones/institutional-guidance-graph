/**
 * Root page — redirects to /graph (the main explorer view).
 *
 * The middleware handles auth checks:
 * - Authenticated users → allowed through to /graph
 * - Unauthenticated users → redirected to /login
 *
 * This page exists as a fallback for the root URL.
 */
import { redirect } from "next/navigation";

export default function HomePage() {
  redirect("/graph");
}
