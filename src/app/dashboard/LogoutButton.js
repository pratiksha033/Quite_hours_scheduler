'use client';

import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

export default function LogoutButton() {
  const router = useRouter();
  const supabase = createClient();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
    router.refresh(); // Ensure the page reloads to clear any cached user data
  };

  return (
    <button
      onClick={handleLogout}
      className="py-2 px-4 rounded-md no-underline bg-red-600 hover:bg-red-700 text-white"
    >
      Logout
    </button>
  );
}
