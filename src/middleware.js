import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'

export async function middleware(request) {
  // This response will be returned unmodified if the user is authenticated.
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        get(name) {
          return request.cookies.get(name)?.value
        },
        set(name, value, options) {
          // If the cookie is set, update the request and response cookies.
          request.cookies.set({ name, value, ...options })
          response.cookies.set({ name, value, ...options })
        },
        remove(name, options) {
          // If the cookie is removed, update the request and response cookies.
          request.cookies.delete({ name, ...options })
          response.cookies.delete({ name, ...options })
        },
      },
    }
  )

  // This will refresh the user's session if it has expired.
  // It will also handle the case where the user is not logged in.
  const { data: { user } } = await supabase.auth.getUser()

  const { pathname } = request.nextUrl
  
  // Protect the dashboard route
  if (!user && pathname === '/dashboard') {
    return NextResponse.redirect(new URL('/login', request.url))
  }
  
  // Redirect logged-in users from the login page to the dashboard
  if (user && pathname === '/login') {
      return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return response
}

// Ensure the middleware runs on all paths except for static assets.
export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}
