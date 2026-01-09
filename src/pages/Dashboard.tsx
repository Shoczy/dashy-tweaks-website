import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { signOut, redeemLicense } from '../lib/supabase'

const DISCORD = 'https://discord.gg/cXxFzBuG'
type Tab = 'home' | 'download' | 'license' | 'settings'

export default function Dashboard() {
    const { user, profile, license, loading, isPremium, refreshData } = useAuth()
    const navigate = useNavigate()
    const [activeTab, setActiveTab] = useState<Tab>('home')
    const [licenseKey, setLicenseKey] = useState('')
    const [redeeming, setRedeeming] = useState(false)
    const [redeemError, setRedeemError] = useState('')
    const [redeemSuccess, setRedeemSuccess] = useState('')

    useEffect(() => {
        if (!loading && !user) navigate('/')
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
        if (error) setRedeemError(error.message)
        else {
            setRedeemSuccess('License activated!')
            setLicenseKey('')
            await refreshData()
        }
        setRedeeming(false)
    }

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-zinc-950">
            <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
        </div>
    )
    if (!user) return null

    const menuItems = [
        { id: 'home', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6', label: 'Home' },
        { id: 'download', icon: 'M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4', label: 'Download' },
        { id: 'license', icon: 'M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z', label: 'License' },
        { id: 'settings', icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z', label: 'Settings' },
    ]

    return (
        <div className="min-h-screen flex bg-zinc-950">
            {/* Sidebar */}
            <div className="w-72 border-r border-white/5 flex flex-col">
                <div className="p-6">
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

                <nav className="flex-1 px-4 space-y-1">
                    {menuItems.map(item => (
                        <button
                            key={item.id}
                            onClick={() => setActiveTab(item.id as Tab)}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition ${activeTab === item.id ? 'bg-emerald-500/10 text-emerald-400' : 'text-neutral-400 hover:text-white hover:bg-white/5'}`}
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d={item.icon} />
                            </svg>
                            {item.label}
                        </button>
                    ))}
                </nav>

                <div className="p-4 border-t border-white/5">
                    <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500/30 to-emerald-600/30 flex items-center justify-center text-sm font-bold">
                            {profile?.username?.[0]?.toUpperCase() || 'U'}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm truncate">{profile?.username || 'User'}</p>
                            <p className={`text-xs ${isPremium ? 'text-emerald-400' : 'text-neutral-500'}`}>
                                {isPremium ? '⭐ Premium' : 'Free'}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main */}
            <div className="flex-1 overflow-auto">
                <div className="max-w-4xl mx-auto p-8">

                    {/* Home Tab */}
                    {activeTab === 'home' && (
                        <div className="space-y-8">
                            <div className="bg-gradient-to-br from-emerald-500/10 to-emerald-600/5 rounded-2xl p-8 border border-emerald-500/20">
                                <h1 className="text-3xl font-bold mb-2">Welcome back, <span className="text-emerald-400">{profile?.username}</span></h1>
                                <p className="text-neutral-400">Manage your account and download the app.</p>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <button onClick={() => setActiveTab('download')} className="p-6 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 transition text-left group">
                                    <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center mb-4 group-hover:bg-emerald-500/20 transition">
                                        <svg className="w-6 h-6 text-emerald-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                        </svg>
                                    </div>
                                    <h3 className="font-semibold mb-1">Download App</h3>
                                    <p className="text-sm text-neutral-500">Get Dashy Tweaks</p>
                                </button>

                                <button onClick={() => setActiveTab('license')} className="p-6 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 transition text-left group">
                                    <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center mb-4 group-hover:bg-purple-500/20 transition">
                                        <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                                        </svg>
                                    </div>
                                    <h3 className="font-semibold mb-1">Redeem Key</h3>
                                    <p className="text-sm text-neutral-500">Activate Premium</p>
                                </button>
                            </div>

                            <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h3 className="font-semibold mb-1">Account Status</h3>
                                        <p className="text-sm text-neutral-500">Your current plan</p>
                                    </div>
                                    <span className={`px-4 py-2 rounded-full text-sm font-medium ${isPremium ? 'bg-emerald-500/20 text-emerald-400' : 'bg-white/10 text-neutral-400'}`}>
                                        {isPremium ? '⭐ Premium' : 'Free Plan'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Download Tab */}
                    {activeTab === 'download' && (
                        <div className="space-y-6">
                            <div>
                                <h1 className="text-2xl font-bold mb-1">Download</h1>
                                <p className="text-neutral-500">Get the Dashy Tweaks application</p>
                            </div>

                            <div className="p-8 rounded-2xl bg-gradient-to-br from-emerald-500/10 to-emerald-600/5 border border-emerald-500/20">
                                <div className="flex items-center gap-6 mb-6">
                                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center">
                                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-bold">Dashy Tweaks</h2>
                                        <p className="text-neutral-500">v1.0.0 • Windows 10/11</p>
                                    </div>
                                </div>
                                <a href="https://github.com/Shoczy/dashy-tweaks/releases/latest" target="_blank" className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-500 hover:bg-emerald-400 rounded-xl font-medium transition">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                    </svg>
                                    Download for Windows
                                </a>
                            </div>

                            <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
                                <h3 className="font-semibold mb-4">Requirements</h3>
                                <ul className="space-y-2 text-sm text-neutral-400">
                                    <li className="flex items-center gap-2"><span className="text-emerald-400">✓</span> Windows 10/11</li>
                                    <li className="flex items-center gap-2"><span className="text-emerald-400">✓</span> Administrator privileges</li>
                                    <li className="flex items-center gap-2"><span className="text-emerald-400">✓</span> ~50MB disk space</li>
                                </ul>
                            </div>
                        </div>
                    )}

                    {/* License Tab */}
                    {activeTab === 'license' && (
                        <div className="space-y-6">
                            <div>
                                <h1 className="text-2xl font-bold mb-1">License</h1>
                                <p className="text-neutral-500">Manage your license key</p>
                            </div>

                            {license && (
                                <div className={`p-6 rounded-2xl border ${isPremium ? 'bg-emerald-500/5 border-emerald-500/30' : 'bg-white/5 border-white/10'}`}>
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex items-center gap-4">
                                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${isPremium ? 'bg-emerald-500/20' : 'bg-white/10'}`}>
                                                <svg className={`w-6 h-6 ${isPremium ? 'text-emerald-400' : 'text-neutral-400'}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                                </svg>
                                            </div>
                                            <div>
                                                <h3 className="font-semibold">{license.plan === 'lifetime' ? 'Lifetime' : 'Premium'}</h3>
                                                <p className="text-sm text-neutral-500">{license.expires_at ? `Expires ${new Date(license.expires_at).toLocaleDateString()}` : 'Never expires'}</p>
                                            </div>
                                        </div>
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${isPremium ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>
                                            {isPremium ? 'Active' : 'Expired'}
                                        </span>
                                    </div>
                                    <div className="p-4 rounded-xl bg-black/30">
                                        <p className="text-xs text-neutral-500 mb-1">License Key</p>
                                        <code className="text-emerald-400 font-mono">{license.key}</code>
                                    </div>
                                </div>
                            )}

                            <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
                                <h3 className="font-semibold mb-4">Redeem License Key</h3>
                                <div className="flex gap-3">
                                    <input type="text" value={licenseKey} onChange={(e) => setLicenseKey(e.target.value.toUpperCase())} placeholder="DASHY-XXXX-XXXX-XXXX" className="flex-1 px-4 py-3 bg-black/30 border border-white/10 rounded-xl font-mono focus:outline-none focus:border-emerald-500/50" />
                                    <button onClick={handleRedeem} disabled={redeeming || !licenseKey.trim()} className="px-6 py-3 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 rounded-xl font-medium transition">
                                        {redeeming ? '...' : 'Redeem'}
                                    </button>
                                </div>
                                {redeemError && <p className="mt-3 text-sm text-red-400">{redeemError}</p>}
                                {redeemSuccess && <p className="mt-3 text-sm text-emerald-400">{redeemSuccess}</p>}
                            </div>

                            {!isPremium && (
                                <div className="p-6 rounded-2xl bg-gradient-to-br from-emerald-500/10 to-emerald-600/5 border border-emerald-500/20">
                                    <h3 className="font-semibold mb-2">Get Premium</h3>
                                    <p className="text-sm text-neutral-500 mb-4">Unlock all 270+ tweaks</p>
                                    <a href={DISCORD} target="_blank" className="inline-flex items-center gap-2 px-5 py-3 bg-emerald-500 hover:bg-emerald-400 rounded-xl font-medium transition">
                                        Get License on Discord
                                    </a>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Settings Tab */}
                    {activeTab === 'settings' && (
                        <div className="space-y-6">
                            <div>
                                <h1 className="text-2xl font-bold mb-1">Settings</h1>
                                <p className="text-neutral-500">Manage your account</p>
                            </div>

                            <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
                                <h3 className="font-semibold mb-4">Profile</h3>
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between py-3 border-b border-white/5">
                                        <span className="text-neutral-500">Username</span>
                                        <span>{profile?.username}</span>
                                    </div>
                                    <div className="flex items-center justify-between py-3 border-b border-white/5">
                                        <span className="text-neutral-500">Email</span>
                                        <span>{user?.email}</span>
                                    </div>
                                    <div className="flex items-center justify-between py-3">
                                        <span className="text-neutral-500">Member since</span>
                                        <span>{profile?.created_at ? new Date(profile.created_at).toLocaleDateString() : '-'}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
                                <h3 className="font-semibold mb-4">Discord</h3>
                                {profile?.discord_id ? (
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-full bg-indigo-500/20 flex items-center justify-center">
                                            <svg className="w-6 h-6 text-indigo-400" viewBox="0 0 24 24" fill="currentColor">
                                                <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128c.126-.094.252-.192.372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <p className="font-medium">{profile.discord_username}</p>
                                            <p className="text-sm text-emerald-400">Connected</p>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="text-center py-4">
                                        <p className="text-neutral-500 text-sm mb-4">Link your Discord account</p>
                                        <a href={DISCORD} target="_blank" className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-500 hover:bg-indigo-400 rounded-xl font-medium transition">
                                            Join Discord
                                        </a>
                                    </div>
                                )}
                            </div>

                            <div className="p-6 rounded-2xl bg-red-500/5 border border-red-500/20">
                                <h3 className="font-semibold mb-2 text-red-400">Danger Zone</h3>
                                <p className="text-sm text-neutral-500 mb-4">Sign out of your account</p>
                                <button onClick={handleLogout} className="px-5 py-2.5 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-xl font-medium transition">
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
