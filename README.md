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

   
