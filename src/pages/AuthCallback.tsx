import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export default function AuthCallback() {
    const navigate = useNavigate()
    const [searchParams] = useSearchParams()
    const [isDesktop, setIsDesktop] = useState(false)
    const [loginSuccess, setLoginSuccess] = useState(false)

    useEffect(() => {
        const handleAuth = async () => {
            // Check if this is a desktop app callback
            const desktop = searchParams.get('desktop') === 'true'
            const storedSessionId = localStorage.getItem('app_login_session')
            setIsDesktop(desktop || !!storedSessionId)

            // Get the session - Supabase will parse the hash automatically
            const { data: { session }, error } = await supabase.auth.getSession()

            if (error) {
                console.error('Auth error:', error)
                navigate('/')
                return
            }

            if (session) {
                setLoginSuccess(true)

                // If we have a stored session ID from desktop app login
                if (storedSessionId) {
                    try {
                        // Check subscription status
                        const { data: subscription } = await supabase
                            .from('subscriptions')
                            .select('plan, status')
                            .eq('user_id', session.user.id)
                            .single()

                        const userData = {
                            name: session.user.user_metadata?.full_name || session.user.user_metadata?.name || session.user.email?.split('@')[0] || 'User',
                            email: session.user.email,
                            plan: subscription?.status === 'active' ? subscription.plan : 'free'
                        }

                        // Notify desktop app via API
                        await fetch(`/api/check-login?session=${storedSessionId}`, {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ user: userData })
                        })

                        // Clear the stored session
                        localStorage.removeItem('app_login_session')
                    } catch (e) {
                        console.error('Failed to notify desktop app:', e)
                    }
                } else if (!desktop) {
                    // For web, redirect to dashboard
                    navigate('/dashboard')
                }
            } else {
                // No session, redirect to home
                navigate('/')
            }
        }

        // Small delay to let Supabase parse the URL hash
        setTimeout(handleAuth, 100)
    }, [navigate, searchParams])

    // Desktop success view
    if (isDesktop && loginSuccess) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <div className="text-center max-w-md mx-auto px-6">
                    <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                        <svg className="w-8 h-8 text-emerald-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <h1 className="text-2xl font-bold mb-3">Login Successful!</h1>
                    <p className="text-neutral-400 mb-6">
                        You can now close this window and return to the Dashy Tweaks app.
                    </p>
                    <div className="glass-card rounded-xl p-4 text-sm text-neutral-500">
                        Click <span className="text-emerald-400 font-medium">"I've logged in"</span> in the app to continue
                    </div>
                </div>
            </div>
        )
    }

    // Desktop waiting view
    if (isDesktop) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <div className="text-center">
                    <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-neutral-400">Completing login for Dashy Tweaks...</p>
                </div>
            </div>
        )
    }

    // Normal web callback
    return (
        <div className="min-h-[60vh] flex items-center justify-center">
            <div className="text-center">
                <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-neutral-400">Signing you in...</p>
            </div>
        </div>
    )
}
