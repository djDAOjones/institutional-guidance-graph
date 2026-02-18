# Institutional Guidance Graph: Phase 1 Implementation Guide

This document provides comprehensive step-by-step instructions for setting up the database and deploying the application. Each step is explained in extensive detail for novice users with screenshots and examples where helpful.

## Key Project Information

### Account Details
- **GitHub**: Username: djDAOjones, Repository: https://github.com/djDAOjones/institutional-guidance-graph.git (public)
- **Vercel**: Email: joe@hungryjoe.tv, Project URL: https://institutional-guidance-graph.vercel.app/
- **Supabase**: Email: joe@hungryjoe.tv, Project: institutional-guidance-graph, Region: Europe, URL: https://figtiyversvulkqcvkdd.supabase.co

## Step 1: Set Up Supabase Database

### 1.1 Run SQL Migrations
- **Action**: Apply the SQL migration files to your Supabase database
- **What this does**: Creates all the database tables, enums, relationships, and security policies needed for the application
- **Detailed Steps**:

  1. **Log in to Supabase**
     - Open your web browser and go to https://supabase.com/dashboard
     - Enter your email (joe@hungryjoe.tv) and password
     - If prompted for 2FA, complete the authentication process
     - You should now see your dashboard with your projects listed

  2. **Select your project**
     - Click on the "institutional-guidance-graph" project from your list
     - This will take you to the project dashboard with various options in the left sidebar

  3. **Access the SQL Editor**
     - Look at the left sidebar navigation menu
     - Find and click on "SQL Editor" (it has a database/code icon)
     - The SQL Editor page will open with a list of saved queries on the left and the editor on the right

  4. **Create a new query**
     - Click the "New Query" button (usually at the top of the saved queries list)
     - A new, blank SQL editor will appear
     - You can name your query something like "01_enums" by clicking on "New Query" at the top of the editor and typing the new name

  5. **Run the first migration (00001_enums.sql)**
     - On your local computer, open the file explorer/finder
     - Navigate to your project folder
     - Go to the `supabase/migrations` folder
     - Open `00001_enums.sql` with a text editor (like VS Code, Notepad++, etc.)
     - Select all the content (Ctrl+A or Cmd+A) and copy it (Ctrl+C or Cmd+C)
     - Go back to the Supabase SQL Editor in your browser
     - Paste the content (Ctrl+V or Cmd+V) into the editor
     - Click the "Run" button (green play button at the top right of the editor)
     - Wait for the query to complete - you should see a success message like "Success. No rows returned"
     - If you see any errors, read them carefully as they might indicate what went wrong

  6. **Run the remaining migrations in order**
     - Create a new query for each migration file by clicking "New Query" again
     - Name each query according to the migration (e.g., "02_lookup_tables", "03_guidance_items", etc.)
     - For each migration file, repeat the process of opening the file locally, copying its contents, pasting into the SQL Editor, and running it
     - **IMPORTANT**: Run the migrations in this exact order:
       1. `00001_enums.sql` - Creates enum types (doc_type, item_status, etc.)
       2. `00002_lookup_tables.sql` - Creates vocabulary tables (service_areas, services, etc.)
       3. `00003_guidance_items.sql` - Creates the main guidance_items table
       4. `00004_relationship_tables.sql` - Creates join tables for relationships
       5. `00005_auth_roles.sql` - Creates the user_roles table for permissions
       6. `00006_rls_policies.sql` - Sets up Row Level Security policies
       7. `00007_indexes.sql` - Creates database indexes for performance

  7. **Verify each migration**
     - After running each migration, check for success messages
     - If you encounter errors, read the error message carefully
     - Common errors include:
       - Syntax errors: Check for typos or missing semicolons
       - Dependency errors: Ensure you're running migrations in the correct order
       - Permission errors: Make sure you're logged in with the right account

  8. **Check the database structure**
     - After running all migrations, click on "Table Editor" in the left sidebar
     - You should see all the tables created by your migrations
     - Click on each table to verify its structure (columns, constraints, etc.)
     - You should see tables like `guidance_items`, `service_areas`, `services`, etc.

### 1.2 Seed Initial Data
- **Action**: Load the seed data into your database
- **What this does**: Populates the lookup tables with initial values like service areas, audiences, etc.
- **Detailed Steps**:

  1. **Create a new query for seed data**
     - In the Supabase SQL Editor, click "New Query"
     - Name it "seed_data" or something similar

  2. **Prepare the seed data**
     - On your local computer, open the file explorer/finder
     - Navigate to your project folder
     - Go to the `supabase` folder
     - Open `seed.sql` with a text editor
     - Select all the content and copy it

  3. **Run the seed data script**
     - Go back to the Supabase SQL Editor
     - Paste the content of `seed.sql` into the editor
     - Click the "Run" button
     - Wait for the query to complete
     - You should see success messages indicating rows were inserted

  4. **Verify the data was inserted**
     - Click on "Table Editor" in the left sidebar
     - Click on tables like `service_areas`, `services`, `audiences`, etc.
     - Each table should now contain the seed data
     - For example:
       - `service_areas` should have entries like "Assessment", "Teaching", etc.
       - `services` should have entries like "Moodle", "Turnitin", etc.
       - `audiences` should have entries like "Staff", "Students", etc.

  5. **Check relationships**
     - Some tables have relationships (e.g., services belong to service areas)
     - Click on a service in the `services` table
     - You should see its `service_area_id` pointing to a valid ID in the `service_areas` table

## Step 2: Set Up Authentication

### 2.1 Create Admin User
- **Action**: Create your first user with admin privileges
- **What this does**: Creates a user account that can log in to the application and has full admin rights
- **Detailed Steps**:

  1. **Navigate to Authentication settings**
     - In your Supabase project dashboard, look at the left sidebar
     - Click on "Authentication" (it has a user/person icon)
     - This will expand a submenu - click on "Users"
     - You'll see a list of users (likely empty if this is a new project)

  2. **Enable Email authentication (if not already enabled)**
     - Click on "Providers" in the Authentication submenu
     - Make sure "Email" is enabled (toggle should be on)
     - If you need to enable it, click the toggle and save any changes

  3. **Create a new user**
     - Go back to the "Users" section
     - Click the "Add User" button (usually at the top right)
     - A form will appear asking for user details

  4. **Fill in user details**
     - Email: Enter your email address
     - Password: Create a secure password (at least 8 characters, with numbers, symbols, etc.)
     - Optional: You can add additional user metadata if desired
     - Click "Create User" button

  5. **Find your user ID**
     - After creating the user, you'll be back at the Users list
     - Find your newly created user in the list
     - Click on the user to view details
     - Look for the "ID" field - this is your user UUID
     - It will look something like: `a1b2c3d4-5e6f-7g8h-9i0j-1k2l3m4n5o6p`
     - Copy this ID (you'll need it in the next step)

  6. **Grant admin privileges**
     - Go to the SQL Editor (click "SQL Editor" in the left sidebar)
     - Create a new query
     - Enter the following SQL, replacing `your-user-id-here` with the UUID you copied:
     ```sql
     INSERT INTO user_roles (user_id, role) 
     VALUES ('your-user-id-here', 'admin');
     ```
     - For example:
     ```sql
     INSERT INTO user_roles (user_id, role) 
     VALUES ('a1b2c3d4-5e6f-7g8h-9i0j-1k2l3m4n5o6p', 'admin');
     ```
     - Click the "Run" button
     - You should see a success message indicating 1 row was inserted

  7. **Verify admin role**
     - Go to the Table Editor
     - Click on the `user_roles` table
     - You should see one row with your user ID and the role set to "admin"

## Step 3: Configure GitHub and Vercel

### 3.1 Add GitHub Secrets for CI/CD
- **Action**: Add Supabase credentials as GitHub secrets
- **What this does**: Allows GitHub Actions to build and test your application with access to your Supabase database
- **Detailed Steps**:

  1. **Get your Supabase credentials**
     - In your Supabase project dashboard, click on "Settings" (gear icon) in the left sidebar
     - Click on "API" in the submenu
     - Under "Project API keys", you'll find:
       - Project URL: Copy this value
       - anon/public key: Copy this value
       - (Note: Keep these values secure and don't share them publicly)

  2. **Access your GitHub repository**
     - Open a new browser tab
     - Go to https://github.com/djDAOjones/institutional-guidance-graph
     - Make sure you're logged in to your GitHub account

  3. **Navigate to repository settings**
     - Click on the "Settings" tab near the top of the repository page
     - On the left sidebar, scroll down to find "Secrets and variables"
     - Click on "Actions" under "Secrets and variables"

  4. **Add the Supabase URL secret**
     - Click the "New repository secret" button
     - For "Name", enter exactly: `NEXT_PUBLIC_SUPABASE_URL`
     - For "Value", paste your Supabase Project URL (copied earlier)
     - Click "Add secret"

  5. **Add the Supabase anon key secret**
     - Click the "New repository secret" button again
     - For "Name", enter exactly: `NEXT_PUBLIC_SUPABASE_ANON_KEY`
     - For "Value", paste your Supabase anon/public key (copied earlier)
     - Click "Add secret"

  6. **Verify secrets were added**
     - You should now see both secrets listed in the "Repository secrets" section
     - The values will be hidden for security, showing only "••••••••"

### 3.2 Connect Vercel to GitHub
- **Action**: Set up automatic deployments from GitHub to Vercel
- **What this does**: Enables continuous deployment so your app is automatically updated whenever you push changes to GitHub
- **Detailed Steps**:

  1. **Log in to Vercel**
     - Open a new browser tab
     - Go to https://vercel.com/dashboard
     - Log in with your account (connected to joe@hungryjoe.tv)

  2. **Start a new project**
     - On your Vercel dashboard, click the "Add New..." button
     - Select "Project" from the dropdown

  3. **Import your GitHub repository**
     - Under "Import Git Repository", you should see your GitHub account
     - If not, click "Add GitHub Account" and follow the prompts to connect your account
     - Find and select the "institutional-guidance-graph" repository
     - Click "Import"

  4. **Configure project settings**
     - You'll be taken to the project configuration page
     - Under "Framework Preset", select "Next.js" from the dropdown
     - Leave "Root Directory" as `.` (dot) to use the repository root
     - Expand the "Environment Variables" section

  5. **Add environment variables**
     - Add the same environment variables as in your `.env.local` file:
       - Name: `NEXT_PUBLIC_SUPABASE_URL`, Value: your Supabase Project URL
       - Name: `NEXT_PUBLIC_SUPABASE_ANON_KEY`, Value: your Supabase anon key
     - Click "Add" after entering each variable

  6. **Deploy the project**
     - Review all settings to ensure they're correct
     - Click the "Deploy" button
     - Vercel will now clone your repository, build your Next.js application, and deploy it
     - This process may take a few minutes

  7. **Monitor the deployment**
     - You'll be taken to a deployment page showing build logs
     - Watch for any errors in the build process
     - If the build fails, review the logs to identify and fix the issue

### 3.3 Verify Deployment
- **Action**: Check that your application deployed successfully
- **What this does**: Confirms that your app is live and functioning correctly
- **Detailed Steps**:

  1. **Wait for deployment to complete**
     - On the Vercel deployment page, wait until you see "Deployment Complete"
     - You should see a green checkmark indicating success

  2. **Visit your deployed application**
     - Click on the "Visit" button, or
     - Open a new browser tab and go to https://institutional-guidance-graph.vercel.app/

  3. **Check the login page**
     - You should see the login page with:
       - The application title/logo
       - Email and password input fields
       - A "Sign In" button
     - If you don't see this, check the Vercel deployment logs for errors

  4. **Test authentication**
     - Enter the email and password you created in Supabase
     - Click "Sign In"
     - If successful, you should be redirected to the graph page
     - If unsuccessful, check the browser console for errors (F12 > Console)

  5. **Verify admin access**
     - Once logged in, you should see some indication that you're an admin user
     - This might be in a user profile section or settings page
     - You should have access to all features of the application

## Step 4: Local Development

### 4.1 Run the Application Locally
- **Action**: Start the development server on your local machine
- **What this does**: Allows you to make changes and test them locally before pushing to GitHub
- **Detailed Steps**:

  1. **Open your terminal/command prompt**
     - On Windows: Press Win+R, type "cmd" and press Enter
     - On Mac: Open Terminal from Applications > Utilities
     - On Linux: Use your preferred terminal application

  2. **Navigate to your project directory**
     - Use the `cd` command to change to your project directory
     - For example:
     ```bash
     cd "/Users/joe/Library/CloudStorage/OneDrive-TheUniversityofNottingham/_Joe Bell UoN Files/2_Projects/2025-02-24 Video Pedagogies 2025/Windsurf Projects/Institutional Guidance Graph"
     ```
     - Tip: You can drag the folder from Finder/Explorer into the terminal to automatically fill in the path

  3. **Install dependencies (if not already done)**
     - Run the following command to install all required packages:
     ```bash
     npm install
     ```
     - This may take a few minutes as it downloads and installs all dependencies
     - You should see a progress bar and eventually a success message

  4. **Verify your environment variables**
     - Make sure your `.env.local` file exists in the project root
     - It should contain your Supabase URL and anon key
     - If not, create it with the following content:
     ```
     NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
     NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
     ```
     - Replace the placeholders with your actual values

  5. **Start the development server**
     - Run the following command:
     ```bash
     npm run dev
     ```
     - You should see output indicating the server is starting
     - Wait until you see a message like "ready - started server on 0.0.0.0:3000"

  6. **Access your local application**
     - Open your web browser
     - Go to http://localhost:3000
     - You should see the same login page as on the deployed version

  7. **Test local authentication**
     - Log in with the same credentials you used on the deployed version
     - Verify that you can access the application

  8. **Make and test changes (optional)**
     - Open the project in your code editor
     - Make small changes to see them reflected in real-time
     - For example, edit a text string in `src/app/page.tsx`
     - Save the file and check your browser - it should update automatically

## Step 5: Next Steps and Troubleshooting

### 5.1 Common Issues and Solutions

- **Supabase Migration Errors**
  - **Issue**: Error about relation already exists
  - **Solution**: The migration was already run. Skip to the next one.

- **Authentication Failures**
  - **Issue**: Can't log in with created user
  - **Solution**: Check that the user exists in Supabase Auth and has an entry in the user_roles table

- **Vercel Deployment Errors**
  - **Issue**: Build fails with environment variable errors
  - **Solution**: Verify that all required environment variables are set in Vercel project settings

- **Local Development Issues**
  - **Issue**: "Module not found" errors
  - **Solution**: Run `npm install` again to ensure all dependencies are installed

### 5.2 Useful Commands

- **Check Node.js version**: `node -v`
- **Check npm version**: `npm -v`
- **Clean install dependencies**: `npm ci`
- **Run tests**: `npm test`
- **Build for production**: `npm run build`
- **Start production build locally**: `npm start`
- **Check for TypeScript errors**: `npm run type-check`
- **Run linter**: `npm run lint`

---

Once you've completed these steps, your Institutional Guidance Graph application will be fully set up and deployed. You can now proceed to Phase 2 for implementing the graph visualization and CRUD operations for guidance items.