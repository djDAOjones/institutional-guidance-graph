# Institutional Guidance Graph: Pre-Development Checklist

This document provides a step-by-step guide for everything you need to do and provide before we can start building the application. Each step is explained in detail for novice users.

## Step 1: Create Required Accounts

### 1.1 GitHub Account
- **Action**: Create a GitHub account if you don't already have one
- **Link**: [GitHub Sign Up](https://github.com/signup)
- **Information to provide**:
  - Your GitHub username: djDAOjones
  - Preferred repository name (e.g., "institutional-guidance-graph"):https://github.com/djDAOjones/institutional-guidance-graph.git
  - Should the repository be public or private?: public

### 1.2 Vercel Account
- **Action**: Create a Vercel account (free tier is sufficient)
- **Link**: [Vercel Sign Up](https://vercel.com/signup)
  - Tip: Sign up with your GitHub account for easier integration
- **Information to provide**:
  - Email associated with your Vercel account: joe@hungryjoe.tv
  - Preferred project name/subdomain (e.g., "guidance-graph"): https://institutional-guidance-graph.vercel.app/

### 1.3 Supabase Account
- **Action**: Create a Supabase account (free tier is sufficient)
- **Link**: [Supabase Sign Up](https://supabase.com/dashboard/sign-up)
- **Information to provide**:
  - Email associated with your Supabase account: joe@hungryjoe.tv
  - Preferred project name (e.g., "guidance-graph-db"): institutional-guidance-graph
  - Preferred database region (closest to you): Europe
  - Database URL: https://figtiyversvulkqcvkdd.supabase.co


## Step 2: Set Up Local Development Environment

### 2.1 Install Node.js
- **Action**: Install Node.js on your computer
- **Link**: [Node.js Download](https://nodejs.org/)
- **Tip**: Install the LTS (Long Term Support) version
- **Information to provide**:
  - Node.js version installed (run `node -v` in terminal): ________________
  - Preferred package manager (npm, yarn, or pnpm): ________________

### 2.2 Install Git
- **Action**: Install Git on your computer
- **Link**: [Git Download](https://git-scm.com/downloads)
- **Verification**: Open terminal/command prompt and run `git --version`

### 2.3 Code Editor
- **Action**: Install a code editor if you don't have one
- **Recommendation**: Visual Studio Code
- **Link**: [VS Code Download](https://code.visualstudio.com/)

## Step 3: Project Configuration Decisions

### 3.1 Authentication Requirements
- **Information to provide**:
  - Do you want email/password authentication? (Yes/No): ________________
  - Do you want any third-party authentication providers? List them if yes: ________________
  - Do you need email verification for users? (Yes/No): ________________

### 3.2 Initial Content for Controlled Vocabularies
- **Information to provide**:
  - List of services (e.g., "Video, Exams, Productivity, Intranet, IT"): ________________
  - List of tasks (e.g., "Set up Zoom meeting, Request exam software"): ________________
  - List of audiences (e.g., "Staff, Students, IT Admins"): ________________
  - List of source platforms (e.g., "SharePoint, Confluence, Web"): ________________

### 3.3 Development Preferences
- **Information to provide**:
  - Will you be developing locally or would you prefer a GitHub Codespaces setup?: ________________
  - Do you have any color scheme preferences for the UI?: ________________
  - Any specific accessibility requirements beyond WCAG AAA?: ________________

## Step 4: Create GitHub Repository

### 4.1 Create New Repository
- **Action**: Go to GitHub and create a new repository
- **Steps**:
  1. Log in to GitHub
  2. Click the "+" icon in the top-right corner
  3. Select "New repository"
  4. Enter the repository name you provided earlier
  5. Choose public or private as you indicated earlier
  6. Check "Add a README file"
  7. Click "Create repository"
- **Information to provide**:
  - The URL of your new repository: ________________

## Step 5: Create Vercel Project

### 5.1 Connect Vercel to GitHub
- **Action**: Connect your Vercel account to GitHub
- **Steps**:
  1. Log in to Vercel
  2. Go to Settings > Git
  3. Connect to GitHub if not already connected
  4. Grant access to your repository

### 5.2 Note Vercel Information
- **Information to provide**:
  - Vercel account is connected to GitHub? (Yes/No): yes
  - Any team members to add to the Vercel project? List emails if yes: no

## Step 6: Create Supabase Project

### 6.1 Create New Supabase Project
- **Action**: Create a new project in Supabase
- **Steps**:
  1. Log in to Supabase
  2. Click "New Project"
  3. Select the organization (create one if needed)
  4. Enter the project name you provided earlier
  5. Set a database password (save this securely)
  6. Select the region you provided earlier
  7. Click "Create new project"

### 6.2 Get Supabase Connection Information
- **Action**: Get your Supabase connection details
- **Steps**:
  1. In your Supabase project, go to Settings > API
  2. Note down the URL and anon/public key
  3. Also note the service role key (keep this secure)
- **Information to provide**:
  - Supabase project created? (Yes/No): yes
  - Database password is saved securely? (Yes/No): yes

## Step 7: Environment Variables

### 7.1 Create Environment Variables File
- **Action**: Create a `.env.local` file in your local project directory
- **Note**: Do NOT share these values in our chat. Just confirm you've created the file.
- **Template**:
  ```
  NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
  NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
  SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
  ```
- **Information to provide**:
  - Confirm you've created the `.env.local` file with the required variables (Yes/No): Yes

## Step 8: Final Confirmation

- **Action**: Review all the information you've provided and ensure it's complete
- **Information to provide**:
  - Confirm all steps are completed (Yes/No): All relevent ones, I think
  - Any questions or concerns before we begin development?: let me know if I missed anything

---

Once you've completed all these steps and provided the requested information, we can proceed with creating a detailed development plan and begin building your Institutional Guidance Graph application.