import { useAuth } from '../context/AuthContext'
import { signOut, supabase } from '../lib/supabase'
import { useNavigate, Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { getPaymentLink } from '../lib/stripe'

interface Subscription {
    plan: 'free' | 'monthly' | 'lifetime'
    status: 'active' | 'cancelled' | 'expired'
    license_key: string | null
    expires_at: string | null
}

export default function Dashboard() {
    const { user, loading } = useAuth()
    const navigate = useNavigate()
    const [subscription, setSubscription] = useState<Subscription | null>(null)
    const [licenseInput, setLicenseInput] = useState('')
    const [activating, setActivating] = useState(false)
    const [activationStatus, setActivationStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null)
    const [copied, setCopied] = useState(false)

    useEffect(() => {
        if (!loading && !user) {
            navigate('/')
        }
    }, [user, loading, navigate])

    // Fetch subscription data
    useEffect(() => {
        if (user) {
            fetchSubscription()
        }
    }, [user])

    const fetchSubscription = async () => {
        const { data } = await supabase
            .from('subscriptions')
            .select('plan, status, license_key, expires_at')
            .eq('user_id', user?.id)
            .single()

        if (data) {
            setSubscription(data)
        }
    }

    const activateLicense = async () => {
        if (!licenseInput.trim() || !user) return

        setActivating(true)
        setActivationStatus(null)

        try {
            // Check if license exists and is valid via KeyAuth or direct check
            // For now, we'll update/create the subscription with the license key
            const { data: existing } = await supabase
                .from('subscriptions')
                .select('id')
                .eq('license_key', licenseInput.trim())
                .single()

            if (existing) {
                setActivationStatus({ type: 'error', message: 'This license key is already in use' })
                setActivating(false)
                return
            }

            // Upsert subscription with license key
            const { error } = await supabase
                .from('subscriptions')
                .upsert({
                    user_id: user.id,
                    license_key: licenseInput.trim(),
                    plan: 'lifetime', // or determine from key
                    status: 'active'
                }, { onConflict: 'user_id' })

            if (error) {
                setActivationStatus({ type: 'error', message: 'Failed to activate license' })
            } else {
                setActivationStatus({ type: 'success', message: 'License activated successfully!' })
                setLicenseInput('')
                fetchSubscription()
            }
        } catch (e) {
            setActivationStatus({ type: 'error', message: 'An error occurred' })
        }

        setActivating(false)
    }

    const copyLicenseKey = () => {
        if (subscription?.license_key) {
            navigator.clipboard.writeText(subscription.license_key)
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
        }
    }

    if (loading) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        )
    }

    if (!user) return null

    const handleSignOut = async () => {
        await signOut()
        navigate('/')
    }

    const providerIcon = user.app_metadata?.provider === 'discord' ? '🎮' : '🔵'

    return (
        <div className="max-w-4xl mx-auto px-6 py-16">
            {/* Header */}
            <div className="flex items-center justify-between mb-12">
                <div>
                    <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
                    <p className="text-neutral-500">Welcome back!</p>
                </div>
                <button
                    onClick={handleSignOut}
                    className="px-4 py-2 text-sm text-neutral-400 hover:text-white transition flex items-center gap-2"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Sign out
                </button>
            </div>

            {/* Profile Card */}
            <div className="glass-card rounded-2xl p-6 mb-6">
                <div className="flex items-start justify-between mb-6">
                    <h2 className="font-semibold flex items-center gap-2">
                        <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        Profile
                    </h2>
                    <span className="text-xs px-2 py-1 rounded-full bg-white/5 text-neutral-400">
                        {providerIcon} {user.app_metadata?.provider || 'email'}
                    </span>
                </div>

                <div className="flex items-center gap-5">
                    {user.user_metadata?.avatar_url ? (
                        <img
                            src={user.user_metadata.avatar_url}
                            alt="Avatar"
                            className="w-20 h-20 rounded-2xl ring-2 ring-emerald-500/20"
                        />
                    ) : (
                        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-emerald-500/30 to-emerald-600/30 flex items-center justify-center text-3xl font-bold">
                            {user.email?.[0]?.toUpperCase() || '?'}
                        </div>
                    )}
                    <div className="flex-1">
                        <p className="text-xl font-semibold mb-1">
                            {user.user_metadata?.full_name || user.user_metadata?.name || 'User'}
                        </p>
                        <p className="text-neutral-500 mb-3">{user.email}</p>
                        <div className="flex items-center gap-3 text-xs text-neutral-600">
                            <span>Joined {new Date(user.created_at).toLocaleDateString()}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* License Key Card - Show if user has premium */}
            {subscription?.license_key && subscription.status === 'active' && (
                <div className="glass-card rounded-2xl p-6 mb-6 border border-emerald-500/30 bg-emerald-500/5">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                            <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                            </svg>
                        </div>
                        <div>
                            <h2 className="font-semibold text-emerald-400">Premium Active</h2>
                            <p className="text-sm text-neutral-500">{subscription.plan === 'lifetime' ? 'Lifetime License' : 'Monthly Subscription'}</p>
                        </div>
                        <span className="ml-auto px-3 py-1 bg-emerald-500/20 text-emerald-400 text-xs font-medium rounded-full">
                            ✓ Active
                        </span>
                    </div>

                    <div className="bg-black/30 rounded-xl p-4 mb-4">
                        <p className="text-xs text-neutral-500 mb-2">Your License Key</p>
                        <div className="flex items-center gap-3">
                            <code className="flex-1 text-lg font-mono text-emerald-400 tracking-wider">
                                {subscription.license_key}
                            </code>
                            <button
                                onClick={copyLicenseKey}
                                className="px-3 py-2 bg-white/5 hover:bg-white/10 rounded-lg transition text-sm"
                            >
                                {copied ? '✓ Copied' : 'Copy'}
                            </button>
                        </div>
                    </div>

                    <p className="text-xs text-neutral-500">
                        Use this key in the Dashy Tweaks app to unlock Premium features. Go to Settings → Enter License Key.
                    </p>
                </div>
            )}

            {/* Get Premium Card - Show if no premium */}
            {(!subscription || subscription.plan === 'free' || !subscription.license_key) && (
                <div className="glass-card rounded-2xl p-6 mb-6 border border-emerald-500/20">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                            <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                            </svg>
                        </div>
                        <div>
                            <h2 className="font-semibold">Get Premium</h2>
                            <p className="text-sm text-neutral-500">Unlock all 132+ tweaks</p>
                        </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4 mb-6">
                        <a
                            href={getPaymentLink('monthly', user.email || undefined)}
                            target="_blank"
                            className="p-4 glass-card hover:bg-white/5 rounded-xl transition"
                        >
                            <div className="flex items-center justify-between mb-2">
                                <span className="font-medium">Monthly</span>
                                <span className="text-emerald-400 font-bold">€6/mo</span>
                            </div>
                            <p className="text-xs text-neutral-500">Cancel anytime</p>
                        </a>
                        <a
                            href={getPaymentLink('lifetime', user.email || undefined)}
                            target="_blank"
                            className="p-4 glass-card hover:bg-white/5 rounded-xl transition border-emerald-500/30 relative"
                        >
                            <div className="absolute -top-2 right-3 px-2 py-0.5 bg-emerald-500 text-xs rounded-full">Best Value</div>
                            <div className="flex items-center justify-between mb-2">
                                <span className="font-medium">Lifetime</span>
                                <span className="text-emerald-400 font-bold">€60</span>
                            </div>
                            <p className="text-xs text-neutral-500">One-time payment</p>
                        </a>
                    </div>

                    {/* Activate License Key */}
                    <div className="border-t border-white/5 pt-5">
                        <p className="text-sm text-neutral-400 mb-3">Already have a license key?</p>
                        <div className="flex gap-3">
                            <input
                                type="text"
                                value={licenseInput}
                                onChange={(e) => setLicenseInput(e.target.value.toUpperCase())}
                                placeholder="DASHY-XXXX-XXXX-XXXX"
                                className="flex-1 px-4 py-3 bg-black/30 border border-white/10 rounded-xl text-sm font-mono focus:outline-none focus:border-emerald-500/50 transition"
                            />
                            <button
                                onClick={activateLicense}
                                disabled={activating || !licenseInput.trim()}
                                className="px-5 py-3 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl font-medium text-sm transition"
                            >
                                {activating ? 'Activating...' : 'Activate'}
                            </button>
                        </div>
                        {activationStatus && (
                            <p className={`mt-3 text-sm ${activationStatus.type === 'success' ? 'text-emerald-400' : 'text-red-400'}`}>
                                {activationStatus.message}
                            </p>
                        )}
                    </div>
                </div>
            )}

            {/* Quick Links */}
            <div className="grid sm:grid-cols-3 gap-4">
                <Link to="/download" className="glass-card rounded-xl p-4 hover:bg-white/5 transition flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                        <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                    </div>
                    <div>
                        <p className="font-medium text-sm">Download</p>
                        <p className="text-xs text-neutral-500">Get the app</p>
                    </div>
                </Link>
                <Link to="/how-to-use" className="glass-card rounded-xl p-4 hover:bg-white/5 transition flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                        <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                    </div>
                    <div>
                        <p className="font-medium text-sm">Documentation</p>
                        <p className="text-xs text-neutral-500">Learn how to use</p>
                    </div>
                </Link>
                <a href="https://discord.gg/cXxFzBuG" target="_blank" className="glass-card rounded-xl p-4 hover:bg-white/5 transition flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-indigo-500/10 flex items-center justify-center">
                        <svg className="w-5 h-5 text-indigo-400" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
                        </svg>
                    </div>
                    <div>
                        <p className="font-medium text-sm">Discord</p>
                        <p className="text-xs text-neutral-500">Get support</p>
                    </div>
                </a>
            </div>
        </div>
    )
}
