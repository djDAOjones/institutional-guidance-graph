import type { Config } from "tailwindcss";
import forms from "@tailwindcss/forms";

/**
 * Tailwind CSS configuration aligned with IBM Carbon Design System.
 *
 * Design tokens reference:
 * - Carbon color palette: https://carbondesignsystem.com/guidelines/color/overview/
 * - Carbon type scale: https://carbondesignsystem.com/guidelines/typography/type-sets/
 * - Carbon spacing scale: https://carbondesignsystem.com/guidelines/spacing/overview/
 *
 * WCAG AAA compliance:
 * - All text colours against backgrounds must meet 7:1 contrast ratio
 * - Large text (18px+ bold, 24px+ normal) must meet 4.5:1
 */
const config: Config = {
  content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
    "./src/lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      /* ── IBM Carbon colour palette ── */
      colors: {
        carbon: {
          /* Gray scale */
          "gray-10": "#f4f4f4",
          "gray-20": "#e0e0e0",
          "gray-30": "#c6c6c6",
          "gray-50": "#8d8d8d",
          "gray-60": "#6f6f6f",
          "gray-70": "#525252",
          "gray-80": "#393939",
          "gray-90": "#262626",
          "gray-100": "#161616",

          /* Blue (interactive) */
          "blue-20": "#d0e2ff",
          "blue-40": "#78a9ff",
          "blue-60": "#0f62fe",
          "blue-70": "#0043ce",
          "blue-80": "#002d9c",

          /* Support colours */
          "red-60": "#da1e28",
          "green-50": "#24a148",
          "yellow-30": "#f1c21b",
          "purple-60": "#8a3ffc",
          "teal-50": "#009d9a",
          "cyan-40": "#33b1ff",
        },
        /* Semantic aliases for WCAG AAA compliance */
        background: {
          DEFAULT: "#ffffff",
          subtle: "#f4f4f4",
          inverse: "#161616",
        },
        foreground: {
          DEFAULT: "#161616",
          secondary: "#525252",
          inverse: "#ffffff",
          disabled: "#8d8d8d",
        },
        interactive: {
          DEFAULT: "#0f62fe",
          hover: "#0043ce",
          active: "#002d9c",
        },
        border: {
          DEFAULT: "#e0e0e0",
          strong: "#8d8d8d",
          interactive: "#0f62fe",
        },
        status: {
          error: "#da1e28",
          success: "#24a148",
          warning: "#f1c21b",
          info: "#0f62fe",
        },
      },

      /* ── IBM Carbon type scale ── */
      fontSize: {
        "carbon-xs": ["0.75rem", { lineHeight: "1rem" }],       /* 12px */
        "carbon-sm": ["0.875rem", { lineHeight: "1.25rem" }],   /* 14px */
        "carbon-base": ["1rem", { lineHeight: "1.5rem" }],      /* 16px */
        "carbon-lg": ["1.125rem", { lineHeight: "1.75rem" }],   /* 18px */
        "carbon-xl": ["1.25rem", { lineHeight: "1.75rem" }],    /* 20px */
        "carbon-2xl": ["1.5rem", { lineHeight: "2rem" }],       /* 24px */
        "carbon-3xl": ["1.75rem", { lineHeight: "2.25rem" }],   /* 28px */
        "carbon-4xl": ["2rem", { lineHeight: "2.5rem" }],       /* 32px */
        "carbon-5xl": ["2.625rem", { lineHeight: "3.125rem" }], /* 42px */
      },

      /* ── IBM Carbon spacing scale (multiples of 0.5rem / 8px) ── */
      spacing: {
        "carbon-1": "0.125rem",  /* 2px  */
        "carbon-2": "0.25rem",   /* 4px  */
        "carbon-3": "0.5rem",    /* 8px  */
        "carbon-4": "0.75rem",   /* 12px */
        "carbon-5": "1rem",      /* 16px */
        "carbon-6": "1.5rem",    /* 24px */
        "carbon-7": "2rem",      /* 32px */
        "carbon-8": "2.5rem",    /* 40px */
        "carbon-9": "3rem",      /* 48px */
      },

      /* ── Grid: Carbon 16-column grid at 1440px ── */
      maxWidth: {
        "carbon-sm": "672px",
        "carbon-md": "1056px",
        "carbon-lg": "1312px",
        "carbon-xl": "1584px",
      },

      /* ── Focus ring for keyboard navigation (WCAG AAA) ── */
      ringWidth: {
        focus: "2px",
      },
      ringColor: {
        focus: "#0f62fe",
      },
      ringOffsetWidth: {
        focus: "2px",
      },

      /* ── Transitions for perceived performance ── */
      transitionDuration: {
        "carbon-fast": "70ms",
        "carbon-moderate": "150ms",
        "carbon-slow": "240ms",
      },
    },
  },
  plugins: [forms],
};

export default config;
