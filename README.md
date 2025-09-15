# Quiet Hours Scheduler

A full-stack web application that allows authenticated users to schedule silent-study time blocks and receive automated email reminders 10 minutes before each block begins.

This project demonstrates a modern web development stack, including a Next.js frontend, a complete Supabase backend (database, authentication, storage, edge functions), and integration with a third-party email service (Resend).

---

## 🚀 Key Features


- **Secure User Authentication**: Users can sign up and log in with email/password or social providers (Google).  
- **Time Block Management (CRUD)**: Logged-in users can create, view, and manage their own study blocks.  
- **Interactive Calendar Dashboard**: A visual calendar displays all scheduled blocks, with different views (Month, Week, Day, Agenda).  
- **Automated Email Reminders**: A background CRON job runs every minute, triggering a serverless function to check for upcoming sessions.  
- **Reliable Notification System**: Prevents duplicate notifications by marking reminders as "sent" in the database.  
- **Secure & Scalable Backend**: Supabase with Row Level Security (RLS) ensures users only access their own data.  

---
## 🛠 Tech Stack

- **Framework**: Next.js (App Router)
- **Backend & Database**: Supabase
- **Authentication**: Supabase Auth
- **Database**: Supabase Postgres
- **Serverless Functions**: Supabase Edge Functions (Deno)
- **CRON Jobs**: Supabase pg_cron
- **Styling**: Tailwind CSS
- **UI Components**:
  - Calendar: `react-big-calendar`
  - Auth Form: `@supabase/auth-ui-react`
- **Email Service**: Resend
- **Deployment**: Vercel

---

## 📦 Getting Started

Follow these instructions to set up and run the project locally.

### ✅ Prerequisites

- Node.js (v18 or later)
- npm
- A [Supabase](https://supabase.com/) account
- A [Resend](https://resend.com/) account (for sending emails)

---
### 1. Clone the Repository

    ```bash
     git clone https://github.com/pratiksha033/quiet-hours-scheduler.git
     cd quiet-hours-scheduler

2. Install Dependencies

       ```bash
       npm install
3. Set Up Supabase

   1. Create a new Supabase project.

   2.Go to the SQL Editor and run the SQL scripts to:

   - Create the study_blocks table

   - Enable RLS

   - Set up the necessary database functions

   3 .Enable the Google Provider in Authentication → Providers and add your Google OAuth credentials.

   4.Update your URL Configuration with local and production URLs.

4. Environment Variables

Create a .env.local file in the root of your project and add your Supabase credentials:

         ```bash
      NEXT_PUBLIC_SUPABASE_URL=YOUR_PROJECT_URL
     NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_ANON_KEY

### 5. Set Up the Edge Function

1.  **Install the Supabase CLI**:

        ```bash
         npm install supabase --save-dev

    

2.  **Log in and link your project**:

         ```bash

         npx supabase login
         npx supabase link --project-ref YOUR_PROJECT_ID

3.  **Set up the Resend API Key**:

-Get your API key from the Resend dashboard.

-In Supabase Dashboard → Edge Functions → send-reminders → Secrets, add a new secret:

      ```bash
     RESEND_API_KEY=your_api_key

4. **Deploy the function**:

        ```bash
       npx supabase functions deploy send-reminders --no-verify-jwt

   

5. **Schedule the CRON Job**:

-In Supabase Dashboard → Database → Cron Jobs

-Create a new job that runs the send-reminders function every minute:

6. **Run the Development Server**:

        ```bash
        npm run dev
   

📌 Now open \*http://localhost:3001\*\*
in your browser.

🌍 **Deployment**

This application is configured for Vercel deployment.

🚀 Push to GitHub: Push your project to a new GitHub repository.

🚀 Import to Vercel: Import the repository on the Vercel dashboard.

Add Environment Variables: In your Vercel project settings, add:

          ```bash
            NEXT_PUBLIC_SUPABASE_URL=YOUR_PROJECT_URL
            NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_ANON_KEY

📌 **Update Supabase URLs**:
In Supabase project settings, add your Vercel production URL to:

Site URL

Redirect URLs

📌 Vercel will automatically build and deploy your application on every push to the main branch. 🚀

   
