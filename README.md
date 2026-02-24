# Institutional Guidance Graph

A structured register mapping institutional guidance documents for the University of Nottingham Digital Technology Services (DTS).

## Purpose

Provides a single, navigable graph of all guidance documents — making them findable, showing ownership, and highlighting gaps or duplicates.

## Tech Stack

- **Frontend**: Next.js 16 (App Router, TypeScript), Tailwind CSS v4
- **Design**: IBM Carbon Design System tokens, WCAG 2.1 AAA compliance
- **Database**: Supabase (PostgreSQL + Auth + Row Level Security)
- **Graph**: Cytoscape.js
- **Search**: Fuse.js (client-side fuzzy search)
- **State**: TanStack Query
- **Hosting**: Vercel
- **CI/CD**: GitHub Actions

## Getting Started

```bash
# Clone the repository
git clone https://github.com/djDAOjones/institutional-guidance-graph.git
cd institutional-guidance-graph

# Install dependencies
npm install

# Copy environment variables and fill in your Supabase credentials
cp .env.example .env.local

# Run the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start development server |
| `npm run build` | Production build |
| `npm run start` | Serve production build |
| `npm run lint` | Run ESLint |
| `npm run type-check` | Run TypeScript type checker |
| `npm run test` | Run Vitest unit tests |
| `npm run test:watch` | Run tests in watch mode |

## Database Setup

SQL migrations are in `supabase/migrations/`. Run them in order against your Supabase project via the SQL Editor in the Supabase dashboard.

## Documentation

- `Spec.md` — Full product specification
- `dev_docs/dev_plan.md` — Detailed development plan
- `dev_docs/to_add.md` — Feature todo list
- `dev_docs/code_review.md` — Code review findings and recommendations
- `human_do.md` — Pre-development setup checklist

## License

MIT
