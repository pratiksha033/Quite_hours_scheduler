import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

// This page now correctly uses the server client to determine where to redirect.
export default async function Homepage() {
  const supabase = createClient();
  const { data: { session } } = await supabase.auth.getSession();

  if (session) {
    redirect('/dashboard');
  } else {
    redirect('/login');
  }
}

