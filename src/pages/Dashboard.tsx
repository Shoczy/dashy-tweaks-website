import { useState, useEffect } from 'react'
import { useNavigate, Link, useSearchParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { signOut, redeemLicense, linkDiscordAccount, unlinkDiscordAccount, updateProfileDiscord, supabase } from '../lib/supabase'

const DISCORD = 'https://discord.gg/cXxFzBuG'
type Tab = 'home' | 'download' | 'license' | 'settings'

export default function Dashboard() {
    const { user, profile, license, loading, isPremium, refreshData } = useAuth()
    const navigate = useNavigate()
    const [searchParams] = useSearchParams()
    const [activeTab, setActiveTab] = useState<Tab>('home')
    const [licenseKey, setLicenseKey] = useState('')
    const [redeeming, setRedeeming] = useState(false)
    const [redeemError, setRedeemError] = useState('')
    const [redeemSuccess, setRedeemSuccess] = useState('')
    const [linkingDiscord, setLinkingDiscord] = useState(false)
    const [unlinkingDiscord, setUnlinkingDiscord] = useState(false)
    const [agreedToTerms, setAgreedToTerms] = useState(false)

    useEffect(() => {
        const tab = searchParams.get('tab')
        if (tab && ['home', 'download', 'license', 'settings'].includes(tab)) {
            setActiveTab(tab as Tab)
        }
    }, [searchParams])

    useEffect(() => {
        const syncDiscordData = async () => {
            if (!user) return
            const { data: { user: freshUser } } = await supabase.auth.getUser()
            if (!freshUser) return
            const discordIdentity = freshUser.identities?.find(i => i.provider === 'discord')
            if (discordIdentity && !profile?.discord_id) {
                const discordData = discordIdentity.identity_data
                await updateProfileDiscord(user.id, {
                    discord_id: discordData?.provider_id || discordIdentity.id,
                    discord_username: discordData?.full_name || discordData?.name || null,
                    discord_avatar: discordData?.avatar_url || null
                })
                await refreshData()
            } else if (!discordIdentity && profile?.discord_id) {
                await updateProfileDiscord(user.id, { discord_id: null, discord_username: null, discord_avatar: null })
                await refreshData()
            }
        }
        syncDiscordData()
    }, [user, profile?.discord_id])

    useEffect(() => {
        if (!loading && !user) navigate('/')
    }, [user, loading, navigate])

    const handleLogout = async () => { await signOut(); navigate('/') }
    const handleLinkDiscord = async () => { setLinkingDiscord(true); await linkDiscordAccount() }
    const handleUnlinkDiscord = async () => {
        setUnlinkingDiscord(true)
        await unlinkDiscordAccount()
        await updateProfileDiscord(user!.id, { discord_id: null, discord_username: null, discord_avatar: null })
        await refreshData()
        setUnlinkingDiscord(false)
    }

    const handleRedeem = async () => {
        if (!licenseKey.trim() || !user || !agreedToTerms) return
        setRedeeming(true)
        setRedeemError('')
        setRedeemSuccess('')
        const { error } = await redeemLicense(licenseKey, user.id)
        if (error) setRedeemError(error.message)
        else { setRedeemSuccess('License activated!'); setLicenseKey(''); await refreshData() }
        setRedeeming(false)
    }

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-zinc-950">
            <div className="w-10 h-10 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
        </div>
    )
    if (!user) return null

    const menuItems = [
        { id: 'home', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6', label: 'Dashboard' },
        { id: 'download', icon: 'M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4', label: 'Download' },
        { id: 'license', icon: 'M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z', label: 'Redeem Key' },
        { id: 'settings', icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z', label: 'Settings' },
    ]

    return (
        <div className="min-h-screen flex bg-zinc-950">
            {/* Glow Effects */}
            <div className="fixed top-0 left-1/4 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none" />
            <div className="fixed bottom-0 right-1/4 w-[400px] h-[400px] bg-emerald-500/5 rounded-full blur-[100px] pointer-events-none" />

            {/* Sidebar */}
            <div className="w-72 bg-black/40 backdrop-blur-xl border-r border-white/5 flex flex-col relative z-10">
                <div className="p-6">
                    <Link to="/" className="flex items-center gap-3 group">
                        <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-500/20 group-hover:shadow-emerald-500/40 transition-shadow">
                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                        </div>
                        <div>
                            <span className="font-bold text-lg text-white">DASHY</span>
                            <p className="text-[11px] text-emerald-400/80">Dashboard</p>
                        </div>
                    </Link>
                </div>

                <nav className="flex-1 px-4 space-y-1">
                    {menuItems.map(item => (
                        <button key={item.id} onClick={() => setActiveTab(item.id as Tab)}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${activeTab === item.id
                                ? 'bg-emerald-500/15 text-emerald-400 shadow-lg shadow-emerald-500/10'
                                : 'text-neutral-400 hover:text-white hover:bg-white/5'
                                }`}>
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d={item.icon} />
                            </svg>
                            {item.label}
                            {activeTab === item.id && (
                                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-lg shadow-emerald-400/50" />
                            )}
                        </button>
                    ))}
                </nav>

                {/* User Profile */}
                <div className="p-4 border-t border-white/5">
                    <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 backdrop-blur">
                        {profile?.discord_avatar ? (
                            <img src={profile.discord_avatar} className="w-10 h-10 rounded-full ring-2 ring-emerald-500/30" alt="" />
                        ) : (
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400/20 to-emerald-600/20 flex items-center justify-center text-sm font-bold text-emerald-400 ring-2 ring-emerald-500/30">
                                {profile?.username?.[0]?.toUpperCase() || 'U'}
                            </div>
                        )}
                        <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm text-white truncate">{profile?.username || 'User'}</p>
                            <p className={`text-xs ${isPremium ? 'text-emerald-400' : 'text-neutral-500'}`}>
                                {isPremium ? '⭐ Premium' : 'Free Plan'}
                            </p>
                        </div>
                        <button onClick={handleLogout} className="p-2 text-neutral-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 overflow-auto relative z-10">
                {/* Home Tab */}
                {activeTab === 'home' && (
                    <div className="p-8 max-w-5xl mx-auto">
                        {/* Welcome Banner */}
                        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-500/20 via-emerald-600/10 to-transparent border border-emerald-500/20 p-8 mb-8">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/20 rounded-full blur-3xl" />
                            <div className="relative">
                                <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/20 rounded-full text-xs text-emerald-400 mb-4">
                                    <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                                    {isPremium ? 'Premium Active' : 'Free Plan'}
                                </div>
                                <h1 className="text-3xl font-bold text-white mb-2">
                                    Welcome back, <span className="text-emerald-400">{profile?.username}</span>
                                </h1>
                                <p className="text-neutral-400">Manage your account and optimize your gaming experience.</p>
                            </div>
                        </div>

                        {/* Quick Actions */}
                        <div className="grid grid-cols-3 gap-4 mb-8">
                            <button onClick={() => setActiveTab('download')} className="group p-6 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-emerald-500/30 transition-all text-left">
                                <div className="w-12 h-12 rounded-xl bg-emerald-500/10 group-hover:bg-emerald-500/20 flex items-center justify-center mb-4 transition">
                                    <svg className="w-6 h-6 text-emerald-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                    </svg>
                                </div>
                                <h3 className="font-semibold text-white mb-1">Download App</h3>
                                <p className="text-sm text-neutral-500">Get Dashy Tweaks</p>
                            </button>

                            <button onClick={() => setActiveTab('license')} className="group p-6 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-emerald-500/30 transition-all text-left">
                                <div className="w-12 h-12 rounded-xl bg-emerald-500/10 group-hover:bg-emerald-500/20 flex items-center justify-center mb-4 transition">
                                    <svg className="w-6 h-6 text-emerald-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                                    </svg>
                                </div>
                                <h3 className="font-semibold text-white mb-1">Redeem Key</h3>
                                <p className="text-sm text-neutral-500">Activate Premium</p>
                            </button>

                            <a href={DISCORD} target="_blank" className="group p-6 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-[#5865F2]/30 transition-all text-left">
                                <div className="w-12 h-12 rounded-xl bg-[#5865F2]/10 group-hover:bg-[#5865F2]/20 flex items-center justify-center mb-4 transition">
                                    <svg className="w-6 h-6 text-[#5865F2]" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128c.126-.094.252-.192.372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z" />
                                    </svg>
                                </div>
                                <h3 className="font-semibold text-white mb-1">Join Discord</h3>
                                <p className="text-sm text-neutral-500">Get Support</p>
                            </a>
                        </div>

                        {/* Stats */}
                        <div className="grid grid-cols-4 gap-4">
                            <div className="p-5 rounded-xl bg-white/5 border border-white/5">
                                <p className="text-2xl font-bold text-emerald-400">270+</p>
                                <p className="text-sm text-neutral-500">Total Tweaks</p>
                            </div>
                            <div className="p-5 rounded-xl bg-white/5 border border-white/5">
                                <p className="text-2xl font-bold text-white">{isPremium ? '270+' : '50+'}</p>
                                <p className="text-sm text-neutral-500">Available</p>
                            </div>
                            <div className="p-5 rounded-xl bg-white/5 border border-white/5">
                                <p className="text-2xl font-bold text-white">+30%</p>
                                <p className="text-sm text-neutral-500">FPS Boost</p>
                            </div>
                            <div className="p-5 rounded-xl bg-white/5 border border-white/5">
                                <p className={`text-2xl font-bold ${isPremium ? 'text-emerald-400' : 'text-neutral-400'}`}>
                                    {isPremium ? 'Active' : 'Free'}
                                </p>
                                <p className="text-sm text-neutral-500">Status</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Download Tab */}
                {activeTab === 'download' && (
                    <div className="p-8 max-w-3xl mx-auto">
                        <div className="mb-8">
                            <h1 className="text-2xl font-bold text-white mb-2">Download</h1>
                            <p className="text-neutral-500">Get the Dashy Tweaks application</p>
                        </div>

                        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-500/10 to-transparent border border-emerald-500/20 p-8 mb-6">
                            <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/20 rounded-full blur-3xl" />
                            <div className="relative flex items-center gap-6 mb-6">
                                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-500/30">
                                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                                    </svg>
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-white">Dashy Tweaks</h2>
                                    <p className="text-neutral-400">v1.0.0 • Windows 10/11</p>
                                </div>
                            </div>
                            <a href="https://github.com/Shoczy/dashy-tweaks/releases/latest" target="_blank"
                                className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-500 hover:bg-emerald-400 rounded-xl font-semibold text-white shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/50 transition-all">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                </svg>
                                Download for Windows
                            </a>
                        </div>

                        <div className="p-6 rounded-xl bg-white/5 border border-white/5">
                            <h3 className="font-semibold text-white mb-4">System Requirements</h3>
                            <div className="grid grid-cols-3 gap-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                                        <span className="text-emerald-400">✓</span>
                                    </div>
                                    <span className="text-sm text-neutral-400">Windows 10/11</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                                        <span className="text-emerald-400">✓</span>
                                    </div>
                                    <span className="text-sm text-neutral-400">Admin Rights</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                                        <span className="text-emerald-400">✓</span>
                                    </div>
                                    <span className="text-sm text-neutral-400">~50MB Space</span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* License/Redeem Key Tab */}
                {activeTab === 'license' && (
                    <div className="flex flex-col items-center justify-center min-h-full py-16 px-4">
                        {/* Glow */}
                        <div className="absolute w-64 h-64 bg-emerald-500/20 rounded-full blur-[100px]" />

                        {/* Key Icon */}
                        <div className="relative w-24 h-24 rounded-full bg-gradient-to-br from-emerald-500/20 to-emerald-600/10 flex items-center justify-center mb-8 ring-1 ring-emerald-500/30">
                            <svg className="w-12 h-12 text-emerald-400" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z" />
                            </svg>
                        </div>

                        <h1 className="text-3xl font-bold text-white mb-2">Redeem License Key</h1>
                        <p className="text-neutral-500 mb-10">Enter your license key to upgrade your account</p>

                        {/* License Card */}
                        <div className="w-full max-w-lg p-8 rounded-2xl bg-white/5 backdrop-blur border border-white/10 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl" />

                            <div className="relative">
                                <label className="block text-sm text-neutral-400 mb-2">License Key</label>
                                <input
                                    type="text"
                                    value={licenseKey}
                                    onChange={(e) => setLicenseKey(e.target.value.toUpperCase())}
                                    placeholder="XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX"
                                    className="w-full px-5 py-4 bg-black/30 border border-white/10 rounded-xl text-white placeholder-neutral-600 font-mono focus:outline-none focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20 transition-all"
                                />
                                <p className="text-xs text-neutral-600 mt-2">Enter your license key</p>

                                {/* Terms Checkbox */}
                                <label className="flex items-center gap-3 mt-6 cursor-pointer group">
                                    <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${agreedToTerms ? 'bg-emerald-500 border-emerald-500' : 'border-white/20 group-hover:border-emerald-500/50'}`}>
                                        {agreedToTerms && (
                                            <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                            </svg>
                                        )}
                                    </div>
                                    <input type="checkbox" checked={agreedToTerms} onChange={(e) => setAgreedToTerms(e.target.checked)} className="hidden" />
                                    <span className="text-sm text-neutral-400">
                                        I agree to the <Link to="/terms" className="text-emerald-400 hover:underline">Terms of Service</Link>
                                    </span>
                                </label>

                                {/* Redeem Button */}
                                <button
                                    onClick={handleRedeem}
                                    disabled={redeeming || !licenseKey.trim() || !agreedToTerms}
                                    className="w-full mt-6 py-4 bg-emerald-500 hover:bg-emerald-400 disabled:bg-white/5 disabled:text-neutral-600 rounded-xl font-semibold text-white shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/50 disabled:shadow-none transition-all flex items-center justify-center gap-2"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                                    </svg>
                                    {redeeming ? 'Redeeming...' : 'Redeem Key'}
                                </button>

                                {redeemError && <p className="mt-4 text-sm text-red-400 text-center">{redeemError}</p>}
                                {redeemSuccess && <p className="mt-4 text-sm text-emerald-400 text-center">{redeemSuccess}</p>}
                            </div>
                        </div>

                        {/* Bottom Cards */}
                        <div className="flex gap-4 mt-8 w-full max-w-lg">
                            <a href={DISCORD} target="_blank" className="flex-1 p-5 rounded-xl bg-white/5 border border-white/5 hover:border-emerald-500/30 transition-all text-center group">
                                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 group-hover:bg-emerald-500/20 flex items-center justify-center mx-auto mb-3 transition">
                                    <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <p className="font-medium text-white">Need a key?</p>
                                <p className="text-xs text-emerald-400">Purchase on Discord</p>
                            </a>
                            <a href={DISCORD} target="_blank" className="flex-1 p-5 rounded-xl bg-white/5 border border-white/5 hover:border-emerald-500/30 transition-all text-center group">
                                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 group-hover:bg-emerald-500/20 flex items-center justify-center mx-auto mb-3 transition">
                                    <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <p className="font-medium text-white">Lost your key?</p>
                                <p className="text-xs text-emerald-400">Contact support</p>
                            </a>
                        </div>

                        <p className="text-xs text-neutral-600 mt-8">Each key can only be redeemed once.</p>
                    </div>
                )}

                {/* Settings Tab */}
                {activeTab === 'settings' && (
                    <div className="p-8 max-w-3xl mx-auto">
                        <div className="mb-8">
                            <h1 className="text-2xl font-bold text-white mb-2">Settings</h1>
                            <p className="text-neutral-500">Manage your account settings</p>
                        </div>

                        {/* Profile Information */}
                        <div className="rounded-2xl bg-white/5 backdrop-blur border border-white/5 overflow-hidden mb-6">
                            <div className="px-6 py-4 border-b border-white/5 flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                                    <svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                </div>
                                <h3 className="font-semibold text-white">Profile Information</h3>
                            </div>
                            <div className="p-6 space-y-5">
                                <div>
                                    <label className="block text-sm text-neutral-400 mb-2">Username</label>
                                    <input type="text" value={profile?.username || ''} readOnly
                                        className="w-full px-4 py-3 bg-black/30 border border-white/10 rounded-xl text-white focus:outline-none" />
                                </div>
                                <div>
                                    <label className="block text-sm text-neutral-400 mb-2">Email</label>
                                    <input type="email" value={user?.email || ''} readOnly
                                        className="w-full px-4 py-3 bg-black/30 border border-white/10 rounded-xl text-white focus:outline-none" />
                                </div>
                            </div>
                        </div>

                        {/* Discord Connection */}
                        <div className="rounded-2xl bg-white/5 backdrop-blur border border-white/5 overflow-hidden mb-6">
                            <div className="px-6 py-4 border-b border-white/5 flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-[#5865F2]/10 flex items-center justify-center">
                                    <svg className="w-4 h-4 text-[#5865F2]" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128c.126-.094.252-.192.372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z" />
                                    </svg>
                                </div>
                                <h3 className="font-semibold text-white">Discord Connection</h3>
                            </div>
                            <div className="p-6">
                                {profile?.discord_id ? (
                                    <>
                                        <div className="flex items-center gap-4 mb-5">
                                            {profile.discord_avatar ? (
                                                <img src={profile.discord_avatar} className="w-14 h-14 rounded-full ring-2 ring-[#5865F2]/30" alt="" />
                                            ) : (
                                                <div className="w-14 h-14 rounded-full bg-[#5865F2]/20 flex items-center justify-center">
                                                    <svg className="w-7 h-7 text-[#5865F2]" viewBox="0 0 24 24" fill="currentColor">
                                                        <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128c.126-.094.252-.192.372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z" />
                                                    </svg>
                                                </div>
                                            )}
                                            <div className="flex-1">
                                                <p className="font-medium text-white">{profile.discord_username || 'Discord User'}</p>
                                                <p className="text-sm text-neutral-500">Discord Connected</p>
                                            </div>
                                            <span className="px-3 py-1.5 rounded-full text-xs font-medium bg-emerald-500/20 text-emerald-400">Connected</span>
                                        </div>
                                        <div className="flex gap-3">
                                            <button className="flex items-center gap-2 px-4 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-sm text-neutral-400 hover:text-white transition">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                                </svg>
                                                Sync Roles
                                            </button>
                                            <button className="flex items-center gap-2 px-4 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-sm text-neutral-400 hover:text-white transition">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                                </svg>
                                                Update Profile
                                            </button>
                                            <button onClick={handleUnlinkDiscord} disabled={unlinkingDiscord}
                                                className="flex items-center gap-2 px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/10 rounded-xl transition disabled:opacity-50">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.181 8.68a4.503 4.503 0 011.903 6.405m-9.768-2.782L3.56 14.06a4.5 4.5 0 006.364 6.365l3.129-3.129m5.614-5.615l1.757-1.757a4.5 4.5 0 00-6.364-6.365l-4.5 4.5" />
                                                </svg>
                                                {unlinkingDiscord ? 'Disconnecting...' : 'Disconnect'}
                                            </button>
                                        </div>
                                    </>
                                ) : (
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className="w-14 h-14 rounded-full bg-[#5865F2]/10 flex items-center justify-center">
                                                <svg className="w-7 h-7 text-[#5865F2]/50" viewBox="0 0 24 24" fill="currentColor">
                                                    <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128c.126-.094.252-.192.372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z" />
                                                </svg>
                                            </div>
                                            <div>
                                                <p className="font-medium text-white">Discord</p>
                                                <p className="text-sm text-neutral-500">Not connected</p>
                                            </div>
                                        </div>
                                        <button onClick={handleLinkDiscord} disabled={linkingDiscord}
                                            className="flex items-center gap-2 px-5 py-3 bg-[#5865F2] hover:bg-[#4752C4] rounded-xl font-medium text-white shadow-lg shadow-[#5865F2]/30 transition disabled:opacity-50">
                                            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                                                <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128c.126-.094.252-.192.372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z" />
                                            </svg>
                                            {linkingDiscord ? 'Connecting...' : 'Link Discord'}
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Account Info */}
                        <div className="rounded-2xl bg-white/5 backdrop-blur border border-white/5 overflow-hidden">
                            <div className="px-6 py-4 border-b border-white/5 flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                                    <svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <h3 className="font-semibold text-white">Account Information</h3>
                            </div>
                            <div className="p-6">
                                <div className="grid grid-cols-2 gap-6">
                                    <div>
                                        <p className="text-sm text-neutral-500 mb-1">Member Since</p>
                                        <p className="text-white font-medium">{profile?.created_at ? new Date(profile.created_at).toLocaleDateString('de-DE') : '-'}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-neutral-500 mb-1">Subscription</p>
                                        <p className={`font-medium ${isPremium ? 'text-emerald-400' : 'text-neutral-400'}`}>{isPremium ? '⭐ Premium' : 'Free Plan'}</p>
                                    </div>
                                    {license && (
                                        <>
                                            <div>
                                                <p className="text-sm text-neutral-500 mb-1">License Type</p>
                                                <p className="text-white font-medium">{license.plan === 'lifetime' ? 'Lifetime' : 'Subscription'}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-neutral-500 mb-1">Expires</p>
                                                <p className="text-white font-medium">{license.expires_at ? new Date(license.expires_at).toLocaleDateString('de-DE') : 'Never'}</p>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
