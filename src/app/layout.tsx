/**
 * Root layout for the Institutional Guidance Graph application.
 *
 * Responsibilities:
 * - Sets HTML lang attribute for screen readers (WCAG AAA)
 * - Loads IBM Plex Sans font for Carbon Design System compliance
 * - Provides skip-to-content link for keyboard navigation (WCAG AAA)
 * - Imports global CSS with Tailwind + Carbon design tokens
 *
 * @see https://carbondesignsystem.com/guidelines/typography/overview/
 */
import type { Metadata } from "next";
import { APP_NAME, APP_DESCRIPTION } from "@/lib/constants";
import "./globals.css";

export const metadata: Metadata = {
  title: APP_NAME,
  description: APP_DESCRIPTION,
};

/**
 * Root layout wrapping all pages.
 *
 * Nielsen #1 (System status): The layout shell provides consistent
 * navigation landmarks so users always know where they are.
 *
 * Nielsen #4 (Consistency): All pages share the same typography,
 * spacing, and colour scheme via Carbon tokens.
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* IBM Plex Sans — Carbon Design System's primary typeface */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen bg-background text-foreground antialiased">
        {/* Skip-to-content for keyboard/screen reader users (WCAG AAA) */}
        <a href="#main-content" className="skip-to-content">
          Skip to main content
        </a>
        {children}
      </body>
    </html>
  );
}
