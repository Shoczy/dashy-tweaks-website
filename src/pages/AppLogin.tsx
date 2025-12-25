import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { signInWithGoogle, signInWithDiscord, supabase } from '../lib/supabase'

export default function AppLogin() {
    const [searchParams] = useSearchParams()
    const [status, setStatus] = useState<'loading' | 'selecting' | 'success' | 'error'>('loading')
    const [error, setError] = useState('')

    const provider = searchParams.get('provider')
    const sessionId = searchParams.get('session')

    useEffect(() => {
        // Check if already logged in
        supabase.auth.getSession().then(({ data: { session } }) => {
            if (session) {
                handleLoginSuccess(session.user)
            } else if (provider === 'google' || provider === 'discord') {
                // Auto-start OAuth if provider specified
                handleLogin(provider)
            } else {
                setStatus('selecting')
            }
        })

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
            if (event === 'SIGNED_IN' && session) {
                handleLoginSuccess(session.user)
            }
        })

        return () => subscription.unsubscribe()
    }, [provider])

    const handleLoginSuccess = async (user: any) => {
        setStatus('success')

        // If we have a session ID, notify the desktop app
        if (sessionId) {
            try {
                // Check subscription status
                const { data: subscription } = await supabase
                    .from('subscriptions')
                    .select('plan, status')
                    .eq('user_id', user.id)
                    .single()

                const userData = {
                    name: user.user_metadata?.full_name || user.user_metadata?.name || user.email?.split('@')[0] || 'User',
                    email: user.email,
                    plan: subscription?.status === 'active' ? subscription.plan : 'free'
                }

                // Notify desktop app via API
                await fetch(`/api/check-login?session=${sessionId}`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ user: userData })
                })
            } catch (e) {
                console.error('Failed to notify desktop app:', e)
            }
        }
    }

    const handleLogin = async (selectedProvider: 'google' | 'discord') => {
        setStatus('loading')
        try {
            // Store session ID for after OAuth redirect
            if (sessionId) {
                localStorage.setItem('app_login_session', sessionId)
            }
            if (selectedProvider === 'google') {
                await signInWithGoogle()
            } else {
                await signInWithDiscord()
            }
        } catch (e: any) {
            setError(e.message || 'Login failed')
            setStatus('error')
        }
    }

    // Success view
    if (status === 'success') {
        return (
            <div className="min-h-[70vh] flex items-center justify-center px-6">
                <div className="text-center max-w-md">
                    <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                        <svg className="w-10 h-10 text-emerald-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <h1 className="text-3xl font-bold mb-4">Login Successful!</h1>
                    <p className="text-neutral-400 mb-6">
                        You can now close this tab and return to the Dashy Tweaks app.
                    </p>
                    <p className="text-sm text-neutral-500">
                        The app will automatically detect your login.
                    </p>
                </div>
            </div>
        )
    }

    // Error view
    if (status === 'error') {
        return (
            <div className="min-h-[70vh] flex items-center justify-center px-6">
                <div className="text-center max-w-md">
                    <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                        <svg className="w-10 h-10 text-red-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </div>
                    <h1 className="text-3xl font-bold mb-4">Login Failed</h1>
                    <p className="text-neutral-400 mb-6">{error || 'Something went wrong. Please try again.'}</p>
                    <button
                        onClick={() => setStatus('selecting')}
                        className="px-6 py-3 bg-emerald-500 hover:bg-emerald-400 rounded-xl font-medium transition"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        )
    }

    // Loading view
    if (status === 'loading') {
        return (
            <div className="min-h-[70vh] flex items-center justify-center">
                <div className="text-center">
                    <div className="w-10 h-10 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-neutral-400">Connecting...</p>
                </div>
            </div>
        )
    }

    // Provider selection view
    return (
        <div className="min-h-[70vh] flex items-center justify-center px-6">
            <div className="w-full max-w-sm">
                <div className="text-center mb-8">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                    </div>
                    <h1 className="text-2xl font-bold mb-2">Sign in to Dashy Tweaks</h1>
                    <p className="text-neutral-500">Choose your login method</p>
                </div>

                <div className="space-y-3">
                    <button
                        onClick={() => handleLogin('google')}
                        className="w-full h-14 bg-white hover:bg-gray-100 text-gray-800 rounded-xl font-medium flex items-center justify-center gap-3 transition"
                    >
                        <svg className="w-5 h-5" viewBox="0 0 24 24">
                            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                        </svg>
                        Continue with Google
                    </button>

                    <button
                        onClick={() => handleLogin('discord')}
                        className="w-full h-14 bg-[#5865F2] hover:bg-[#4752C4] text-white rounded-xl font-medium flex items-center justify-center gap-3 transition"
                    >
                        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
                        </svg>
                        Continue with Discord
                    </button>
                </div>

                <p className="text-xs text-neutral-600 text-center mt-6">
                    By signing in, you agree to our Terms of Service and Privacy Policy
                </p>
            </div>
        </div>
    )
}
