# Institutional Guidance Graph: Setup Guide

This guide provides instructions for setting up and deploying the Institutional Guidance Graph application.

## Project Overview

- **GitHub**: https://github.com/djDAOjones/institutional-guidance-graph.git (public)
- **Vercel**: https://institutional-guidance-graph.vercel.app/
- **Supabase**: https://figtiyversvulkqcvkdd.supabase.co

## Environment Variables

The following environment variables are required:

```
NEXT_PUBLIC_SUPABASE_URL=https://figtiyversvulkqcvkdd.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

## Supabase Setup

1. **Database Configuration**
   - All tables have been created via migrations
   - SQL migrations are in `supabase/migrations/`
   - Seed data is in `supabase/seed.sql`

2. **Authentication**
   - Admin user created with ID: `869b60db-c2f0-48fc-b031-1ce107971283`
   - Role assigned as 'admin' in the `user_roles` table

## Vercel Deployment

1. **Configuration**
   - `vercel.json` added to fix output directory issue
   - Environment variables must be set in Vercel project settings

2. **Deployment URLs**
   - Production: https://institutional-guidance-graph.vercel.app/
   - Latest deployment: https://institutional-guidance-graph-bfruy5n05-tropicalwilsons-projects.vercel.app/

## GitHub CI/CD

GitHub Actions workflow is configured in `.github/workflows/ci.yml` to:
- Run linting
- Type checking
- Tests
- Build

## Local Development

1. Clone the repository
2. Create `.env.local` with the required environment variables
3. Run `npm install`
4. Run `npm run dev`
5. Access at http://localhost:3000

## Next Steps

1. **Technical Services Feature**
   - Implement the technical services feature as requested in `dev_docs/to_add.md`
   - Add to the existing services model

2. **Multiple Audience Selection**
   - Modify the UI to allow selecting multiple audiences
   - Update the database queries to handle multiple selections
