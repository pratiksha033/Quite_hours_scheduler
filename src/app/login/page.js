'use client'
import { createClient } from '@/lib/supabase/client'
import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
    const supabase = createClient()
    const router = useRouter()

    supabase.auth.onAuthStateChange((event) => {
        if (event === 'SIGNED_IN') {
            router.push('/dashboard')
        }
    })

    // This is the crucial change. We're telling the Auth component
    // to redirect to our new server-side callback route after a successful login.
    const getURL = () => {
        let url =
          process?.env?.NEXT_PUBLIC_SITE_URL ?? // Set this to your site URL in production
          process?.env?.NEXT_PUBLIC_VERCEL_URL ?? // Automatically set by Vercel.
          'http://localhost:3001/'
        // Make sure to include `https` in production
        url = url.includes('http') ? url : `https://${url}`
        // Make sure to include a trailing `/`
        url = url.charAt(url.length - 1) === '/' ? url : `${url}/`
        return `${url}auth/callback` // The new callback route
      }

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
                <h2 className="text-2xl font-bold text-center text-gray-900">Sign in to your account</h2>
                <Auth
                    supabaseClient={supabase}
                    appearance={{ theme: ThemeSupa }}
                    theme="dark"
                    providers={['google']}
                    redirectTo={getURL()}
                />
            </div>
        </div>
    )
}