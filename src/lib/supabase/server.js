import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

// This is the definitive server client for use in Server Components and Server Actions.
export const createClient = () => {
  const cookieStore = cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        get(name) {
          return cookieStore.get(name)?.value
        },
        set() {
          // no-op on server, handled via middleware
        },
        remove() {
          // no-op on server, handled via middleware
        },
      },
    }
  )
}
