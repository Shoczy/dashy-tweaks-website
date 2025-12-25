import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export default function AuthCallback() {
    const navigate = useNavigate()
    const [searchParams] = useSearchParams()
    const [isDesktop, setIsDesktop] = useState(false)
    const [loginSuccess, setLoginSuccess] = useState(false)

    useEffect(() => {
        // Check if this is a desktop app callback
        const desktop = searchParams.get('desktop') === 'true'
        setIsDesktop(desktop)

        supabase.auth.onAuthStateChange((event, session) => {
            if (event === 'SIGNED_IN') {
                setLoginSuccess(true)

                if (desktop) {
                    // For desktop app, show success message
                    // User will manually return to the app
                } else {
                    // For web, redirect to dashboard
                    navigate('/dashboard')
                }
            }
        })
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
