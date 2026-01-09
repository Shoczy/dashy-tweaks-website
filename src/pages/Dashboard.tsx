import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { signOut, redeemLicense } from '../lib/supabase'

type Tab = 'home' | 'license' | 'discord' | 'settings'

export default function Dashboard() {
    const { user, profile, license, loading, isPremium, refreshData } = useAuth()
    const navigate = useNavigate()
    const [activeTab, setActiveTab] = useState<Tab>('home')
    const [licenseKey, setLicenseKey] = useState('')
    const [redeeming, setRedeeming] = useState(false)
    const [redeemError, setRedeemError] = useState('')
    const [redeemSuccess, setRedeemSuccess] = useState('')

    useEffect(() => {
        if (!loading && !user) {
            navigate('/login')
        }
    }, [user, loading, navigate])

    const handleLogout = async () => {
        await signOut()
        navigate('/')
    }

    const handleRedeem = async () => {
        if (!licenseKey.trim() || !user) return
        setRedeeming(true)
        setRedeemError('')
        setRedeemSuccess('')

        const { error } = await redeemLicense(licenseKey, user.id)
        if (error) {
            setRedeemError(error.message)
        } else {
            setRedeemSuccess('License activated successfully!')
            setLicenseKey('')
            await refreshData()
        }
        setRedeeming(false)
    }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        )
    }

    if (!user) return null

    const menuItems = [
        { id: 'home', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6', label: 'Dashboard' },
        { id: 'license', icon: 'M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z', label: 'License' },
        { id: 'discord', icon: 'M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84', label: 'Discord' },
        { id: 'settings', icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z', label: 'Settings' },
    ]

    return (
        <div className="min-h-screen flex">
            {/* Sidebar */}
            <div className="w-64 bg-zinc-950 border-r border-white/5 flex flex-col">
                {/* Logo */}
                <div className="p-6 border-b border-white/5">
                    <Link to="/" className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center">
                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                        </div>
                        <div>
                            <span className="font-bold text-lg">DASHY</span>
                            <p className="text-xs text-neutral-500">Dashboard</p>
                        </div>
                    </Link>
                </div>

                {/* Menu */}
                <nav className="flex-1 p-4 space-y-1">
                    {menuItems.map(item => (
                        <button
                            key={item.id}
                            onClick={() => setActiveTab(item.id as Tab)}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition ${activeTab === item.id
                                ? 'bg-emerald-500/10 text-emerald-400'
                                : 'text-neutral-400 hover:text-white hover:bg-white/5'
                                }`}
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d={item.icon} />
                            </svg>
                            {item.label}
                        </button>
                    ))}
                </nav>

                {/* User */}
                <div className="p-4 border-t border-white/5">
                    <div className="flex items-center gap-3 px-3 py-2">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500/30 to-emerald-600/30 flex items-center justify-center text-sm font-bold">
                            {profile?.username?.[0]?.toUpperCase() || 'U'}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm truncate">{profile?.username || 'User'}</p>
                            <p className={`text-xs ${isPremium ? 'text-emerald-400' : 'text-neutral-500'}`}>
                                {isPremium ? '⭐ Premium' : 'Free'}
                            </p>
                        </div>
                        <button onClick={handleLogout} className="p-2 text-neutral-500 hover:text-white transition">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 bg-zinc-900/50">
                <div className="max-w-5xl mx-auto p-8">
                    {/* Home Tab */}
                    {activeTab === 'home' && (
                        <div className="space-y-8">
                            {/* Welcome */}
                            <div className="glass-card rounded-2xl p-8">
                                <div className="flex items-center gap-4">
                                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-emerald-600/20 flex items-center justify-center">
                                        <svg className="w-8 h-8 text-emerald-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="text-sm text-neutral-500">WELCOME BACK</p>
                                        <h1 className="text-3xl font-bold">Hello, <span className="text-emerald-400">{profile?.username}</span></h1>
                                        <p className="text-neutral-500 mt-1">Your central hub for Dashy Tweaks. Navigate using the sidebar.</p>
                                    </div>
                                </div>
                            </div>

                            {/* Quick Access */}
                            <div>
                                <h2 className="text-lg font-semibold mb-4">Quick Access</h2>
                                <div className="grid grid-cols-4 gap-4">
                                    <Link to="/download" className="glass-card rounded-xl p-5 hover:bg-white/5 transition group">
                                        <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center mb-3 group-hover:bg-emerald-500/20 transition">
                                            <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                            </svg>
                                        </div>
                                        <h3 className="font-medium">Download</h3>
                                        <p className="text-xs text-neutral-500 mt-1">Get the app</p>
                                    </Link>
                                    <button onClick={() => setActiveTab('license')} className="glass-card rounded-xl p-5 hover:bg-white/5 transition group text-left">
                                        <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center mb-3 group-hover:bg-purple-500/20 transition">
                                            <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                                            </svg>
                                        </div>
                                        <h3 className="font-medium">Redeem Key</h3>
                                        <p className="text-xs text-neutral-500 mt-1">Activate license</p>
                                    </button>
                                    <a href="https://discord.gg/cXxFzBuG" target="_blank" className="glass-card rounded-xl p-5 hover:bg-white/5 transition group">
                                        <div className="w-10 h-10 rounded-lg bg-indigo-500/10 flex items-center justify-center mb-3 group-hover:bg-indigo-500/20 transition">
                                            <svg className="w-5 h-5 text-indigo-400" viewBox="0 0 24 24" fill="currentColor">
                                                <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128c.126-.094.252-.192.372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z" />
                                            </svg>
                                        </div>
                                        <h3 className="font-medium">Discord</h3>
                                        <p className="text-xs text-neutral-500 mt-1">Join community</p>
                                    </a>
                                    <Link to="/how-to-use" className="glass-card rounded-xl p-5 hover:bg-white/5 transition group">
                                        <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center mb-3 group-hover:bg-blue-500/20 transition">
                                            <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                            </svg>
                                        </div>
                                        <h3 className="font-medium">Docs</h3>
                                        <p className="text-xs text-neutral-500 mt-1">How to use</p>
                                    </Link>
                                </div>
                            </div>

                            {/* Account Info */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="glass-card rounded-xl p-5">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                                            <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <h3 className="font-medium">Account Status</h3>
                                            <p className="text-xs text-neutral-500">Your subscription</p>
                                        </div>
                                    </div>
                                    <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium ${isPremium ? 'bg-emerald-500/20 text-emerald-400' : 'bg-white/5 text-neutral-400'}`}>
                                        {isPremium ? '⭐ Premium Active' : '○ Free Plan'}
                                    </div>
                                </div>
                                <button onClick={() => setActiveTab('settings')} className="glass-card rounded-xl p-5 hover:bg-white/5 transition text-left">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                                            <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <h3 className="font-medium">Account Settings</h3>
                                            <p className="text-xs text-neutral-500">Manage profile</p>
                                        </div>
                                    </div>
                                    <p className="text-sm text-emerald-400">Open Settings →</p>
                                </button>
                            </div>
                        </div>
                    )}

                    {/* License Tab */}
                    {activeTab === 'license' && (
                        <div className="space-y-6">
                            <div>
                                <h1 className="text-2xl font-bold">License</h1>
                                <p className="text-neutral-500">Manage your license key</p>
                            </div>

                            {/* Current License */}
                            {license && (
                                <div className={`glass-card rounded-2xl p-6 border ${isPremium ? 'border-emerald-500/30 bg-emerald-500/5' : 'border-white/10'}`}>
                                    <div className="flex items-center gap-4 mb-4">
                                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${isPremium ? 'bg-emerald-500/20' : 'bg-white/5'}`}>
                                            <svg className={`w-6 h-6 ${isPremium ? 'text-emerald-400' : 'text-neutral-400'}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <h2 className="text-lg font-semibold">{license.plan === 'lifetime' ? 'Lifetime' : 'Premium'} License</h2>
                                            <p className="text-sm text-neutral-500">
                                                {license.expires_at ? `Expires: ${new Date(license.expires_at).toLocaleDateString()}` : 'Never expires'}
                                            </p>
                                        </div>
                                        <span className={`ml-auto px-3 py-1 rounded-full text-xs font-medium ${isPremium ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>
                                            {isPremium ? '✓ Active' : 'Expired'}
                                        </span>
                                    </div>
                                    <div className="bg-black/30 rounded-xl p-4">
                                        <p className="text-xs text-neutral-500 mb-2">License Key</p>
                                        <code className="text-lg font-mono text-emerald-400">{license.key}</code>
                                    </div>
                                </div>
                            )}

                            {/* Redeem License */}
                            <div className="glass-card rounded-2xl p-6">
                                <h2 className="text-lg font-semibold mb-4">Redeem License Key</h2>
                                <div className="flex gap-3">
                                    <input
                                        type="text"
                                        value={licenseKey}
                                        onChange={(e) => setLicenseKey(e.target.value.toUpperCase())}
                                        placeholder="DASHY-XXXX-XXXX-XXXX"
                                        className="flex-1 px-4 py-3 bg-black/30 border border-white/10 rounded-xl font-mono focus:outline-none focus:border-emerald-500/50 transition"
                                    />
                                    <button
                                        onClick={handleRedeem}
                                        disabled={redeeming || !licenseKey.trim()}
                                        className="px-6 py-3 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 rounded-xl font-medium transition"
                                    >
                                        {redeeming ? 'Redeeming...' : 'Redeem'}
                                    </button>
                                </div>
                                {redeemError && <p className="mt-3 text-sm text-red-400">{redeemError}</p>}
                                {redeemSuccess && <p className="mt-3 text-sm text-emerald-400">{redeemSuccess}</p>}
                            </div>

                            {/* Get License */}
                            {!isPremium && (
                                <div className="glass-card rounded-2xl p-6 border border-emerald-500/20">
                                    <h2 className="text-lg font-semibold mb-2">Get Premium</h2>
                                    <p className="text-neutral-500 text-sm mb-4">Unlock all 270+ tweaks and premium features</p>
                                    <a href="https://discord.gg/cXxFzBuG" target="_blank" className="inline-flex items-center gap-2 px-5 py-3 bg-emerald-500 hover:bg-emerald-400 rounded-xl font-medium transition">
                                        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128c.126-.094.252-.192.372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z" />
                                        </svg>
                                        Get License on Discord
                                    </a>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Discord Tab */}
                    {activeTab === 'discord' && (
                        <div className="space-y-6">
                            <div>
                                <h1 className="text-2xl font-bold">Discord</h1>
                                <p className="text-neutral-500">Link your Discord account</p>
                            </div>

                            <div className="glass-card rounded-2xl p-6">
                                {profile?.discord_id ? (
                                    <div className="flex items-center gap-4">
                                        {profile.discord_avatar ? (
                                            <img src={profile.discord_avatar} alt="Discord" className="w-16 h-16 rounded-full" />
                                        ) : (
                                            <div className="w-16 h-16 rounded-full bg-indigo-500/20 flex items-center justify-center">
                                                <svg className="w-8 h-8 text-indigo-400" viewBox="0 0 24 24" fill="currentColor">
                                                    <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128c.126-.094.252-.192.372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z" />
                                                </svg>
                                            </div>
                                        )}
                                        <div>
                                            <h3 className="text-lg font-semibold">{profile.discord_username}</h3>
                                            <p className="text-sm text-emerald-400">✓ Connected</p>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="text-center py-8">
                                        <div className="w-16 h-16 rounded-full bg-indigo-500/20 flex items-center justify-center mx-auto mb-4">
                                            <svg className="w-8 h-8 text-indigo-400" viewBox="0 0 24 24" fill="currentColor">
                                                <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128c.126-.094.252-.192.372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z" />
                                            </svg>
                                        </div>
                                        <h3 className="text-lg font-semibold mb-2">Connect Discord</h3>
                                        <p className="text-neutral-500 text-sm mb-4">Link your Discord to show in the app</p>
                                        <button className="px-6 py-3 bg-indigo-500 hover:bg-indigo-400 rounded-xl font-medium transition">
                                            Connect Discord
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Settings Tab */}
                    {activeTab === 'settings' && (
                        <div className="space-y-6">
                            <div>
                                <h1 className="text-2xl font-bold">Settings</h1>
                                <p className="text-neutral-500">Manage your account</p>
                            </div>

                            <div className="glass-card rounded-2xl p-6">
                                <h2 className="text-lg font-semibold mb-4">Profile</h2>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm text-neutral-500 mb-1">Username</label>
                                        <p className="text-lg">{profile?.username}</p>
                                    </div>
                                    <div>
                                        <label className="block text-sm text-neutral-500 mb-1">Email</label>
                                        <p className="text-lg">{user?.email}</p>
                                    </div>
                                    <div>
                                        <label className="block text-sm text-neutral-500 mb-1">Member since</label>
                                        <p className="text-lg">{profile?.created_at ? new Date(profile.created_at).toLocaleDateString() : '-'}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="glass-card rounded-2xl p-6 border border-red-500/20">
                                <h2 className="text-lg font-semibold mb-2 text-red-400">Danger Zone</h2>
                                <p className="text-neutral-500 text-sm mb-4">Irreversible actions</p>
                                <button onClick={handleLogout} className="px-5 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-xl font-medium transition">
                                    Sign Out
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
