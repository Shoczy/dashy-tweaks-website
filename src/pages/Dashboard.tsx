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
        <div className="min-h-screen flex items-center justify-center bg-[#0d0d0f]">
            <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
        </div>
    )
    if (!user) return null

    const menuItems = [
        { id: 'home', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6', label: 'Loader' },
        { id: 'download', icon: 'M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4', label: 'Download' },
    ]

    const supportItems = [
        { id: 'license', icon: 'M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z', label: 'Redeem Key' },
        { id: 'settings', icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z', label: 'Settings' },
    ]

    return (
        <div className="min-h-screen flex bg-[#0d0d0f]">
            {/* Sidebar */}
            <div className="w-64 bg-[#111113] border-r border-white/5 flex flex-col">
                <div className="p-5">
                    <Link to="/" className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center">
                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                        </div>
                        <div>
                            <span className="font-bold text-white">Dashy</span>
                            <p className="text-[10px] text-neutral-500">Dashboard</p>
                        </div>
                    </Link>
                </div>

                <nav className="flex-1 px-3">
                    {menuItems.map(item => (
                        <button key={item.id} onClick={() => setActiveTab(item.id as Tab)}
                            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition mb-1 ${activeTab === item.id ? 'bg-purple-500/10 text-purple-400 border-l-2 border-purple-500' : 'text-neutral-400 hover:text-white hover:bg-white/5'}`}>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d={item.icon} />
                            </svg>
                            {item.label}
                        </button>
                    ))}

                    <div className="mt-6 mb-2 px-3">
                        <span className="text-[10px] font-medium text-neutral-600 uppercase tracking-wider">Support</span>
                    </div>

                    {supportItems.map(item => (
                        <button key={item.id} onClick={() => setActiveTab(item.id as Tab)}
                            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition mb-1 ${activeTab === item.id ? 'bg-purple-500/10 text-purple-400 border-l-2 border-purple-500' : 'text-neutral-400 hover:text-white hover:bg-white/5'}`}>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d={item.icon} />
                            </svg>
                            {item.label}
                        </button>
                    ))}
                </nav>

                {/* User Profile Bottom */}
                <div className="p-3 border-t border-white/5">
                    <div className="flex items-center gap-3 p-2">
                        {profile?.discord_avatar ? (
                            <img src={profile.discord_avatar} className="w-9 h-9 rounded-full" alt="" />
                        ) : (
                            <div className="w-9 h-9 rounded-full bg-purple-500/20 flex items-center justify-center text-sm font-bold text-purple-400">
                                {profile?.username?.[0]?.toUpperCase() || 'U'}
                            </div>
                        )}
                        <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm text-white truncate">{profile?.username || 'User'}</p>
                            <p className={`text-xs ${isPremium ? 'text-purple-400' : 'text-neutral-500'}`}>
                                {isPremium ? 'Premium' : 'Free'}
                            </p>
                        </div>
                        <div className="flex gap-1">
                            <a href={DISCORD} target="_blank" className="p-1.5 text-neutral-500 hover:text-white transition">
                                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128c.126-.094.252-.192.372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z" />
                                </svg>
                            </a>
                            <button onClick={handleLogout} className="p-1.5 text-neutral-500 hover:text-red-400 transition">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 overflow-auto">
                {/* Home/Loader Tab */}
                {activeTab === 'home' && (
                    <div className="p-8 max-w-4xl mx-auto">
                        <div className="mb-8">
                            <h1 className="text-2xl font-bold text-white mb-1">Welcome back, {profile?.username}</h1>
                            <p className="text-neutral-500">Manage your account and access the loader</p>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mb-6">
                            <button onClick={() => setActiveTab('download')} className="p-5 rounded-xl bg-[#16161a] hover:bg-[#1a1a1f] border border-white/5 transition text-left group">
                                <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center mb-3 group-hover:bg-purple-500/20 transition">
                                    <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                    </svg>
                                </div>
                                <h3 className="font-medium text-white mb-0.5">Download</h3>
                                <p className="text-xs text-neutral-500">Get Dashy Tweaks</p>
                            </button>

                            <button onClick={() => setActiveTab('license')} className="p-5 rounded-xl bg-[#16161a] hover:bg-[#1a1a1f] border border-white/5 transition text-left group">
                                <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center mb-3 group-hover:bg-purple-500/20 transition">
                                    <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                                    </svg>
                                </div>
                                <h3 className="font-medium text-white mb-0.5">Redeem Key</h3>
                                <p className="text-xs text-neutral-500">Activate Premium</p>
                            </button>
                        </div>

                        <div className="p-5 rounded-xl bg-[#16161a] border border-white/5">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="font-medium text-white mb-0.5">Account Status</h3>
                                    <p className="text-xs text-neutral-500">Your current subscription</p>
                                </div>
                                <span className={`px-3 py-1.5 rounded-full text-xs font-medium ${isPremium ? 'bg-purple-500/20 text-purple-400' : 'bg-white/5 text-neutral-400'}`}>
                                    {isPremium ? '⭐ Premium' : 'Free'}
                                </span>
                            </div>
                        </div>
                    </div>
                )}

                {/* Download Tab */}
                {activeTab === 'download' && (
                    <div className="p-8 max-w-4xl mx-auto">
                        <div className="mb-8">
                            <h1 className="text-2xl font-bold text-white mb-1">Download</h1>
                            <p className="text-neutral-500">Get the Dashy Tweaks application</p>
                        </div>

                        <div className="p-6 rounded-xl bg-[#16161a] border border-white/5 mb-4">
                            <div className="flex items-center gap-5 mb-5">
                                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center">
                                    <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                                    </svg>
                                </div>
                                <div>
                                    <h2 className="text-lg font-bold text-white">Dashy Tweaks</h2>
                                    <p className="text-sm text-neutral-500">v1.0.0 • Windows 10/11</p>
                                </div>
                            </div>
                            <a href="https://github.com/Shoczy/dashy-tweaks/releases/latest" target="_blank"
                                className="inline-flex items-center gap-2 px-5 py-2.5 bg-purple-500 hover:bg-purple-400 rounded-lg font-medium text-white text-sm transition">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                </svg>
                                Download for Windows
                            </a>
                        </div>

                        <div className="p-5 rounded-xl bg-[#16161a] border border-white/5">
                            <h3 className="font-medium text-white mb-3">Requirements</h3>
                            <ul className="space-y-2 text-sm text-neutral-400">
                                <li className="flex items-center gap-2"><span className="text-purple-400">✓</span> Windows 10/11</li>
                                <li className="flex items-center gap-2"><span className="text-purple-400">✓</span> Administrator privileges</li>
                                <li className="flex items-center gap-2"><span className="text-purple-400">✓</span> ~50MB disk space</li>
                            </ul>
                        </div>
                    </div>
                )}

                {/* License/Redeem Key Tab - Cherax Style */}
                {activeTab === 'license' && (
                    <div className="flex flex-col items-center justify-center min-h-full py-16 px-4">
                        {/* Key Icon */}
                        <div className="w-20 h-20 rounded-full bg-purple-500/10 flex items-center justify-center mb-6">
                            <svg className="w-10 h-10 text-purple-400" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z" />
                            </svg>
                        </div>

                        <h1 className="text-2xl font-bold text-white mb-2">Redeem License Key</h1>
                        <p className="text-neutral-500 text-sm mb-8">Enter your license key to upgrade your account</p>

                        {/* License Card */}
                        <div className="w-full max-w-md p-6 rounded-xl bg-[#16161a] border border-white/5">
                            <label className="block text-xs text-neutral-500 mb-2">License Key</label>
                            <input
                                type="text"
                                value={licenseKey}
                                onChange={(e) => setLicenseKey(e.target.value.toUpperCase())}
                                placeholder="XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX"
                                className="w-full px-4 py-3 bg-[#0d0d0f] border border-white/10 rounded-lg text-white placeholder-neutral-600 font-mono text-sm focus:outline-none focus:border-purple-500/50 mb-2"
                            />
                            <p className="text-xs text-neutral-600 mb-4">Enter your license key</p>

                            {/* Terms Checkbox */}
                            <label className="flex items-center gap-2 mb-5 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={agreedToTerms}
                                    onChange={(e) => setAgreedToTerms(e.target.checked)}
                                    className="w-4 h-4 rounded border-white/20 bg-[#0d0d0f] text-purple-500 focus:ring-purple-500 focus:ring-offset-0"
                                />
                                <span className="text-sm text-neutral-400">
                                    I agree to the <Link to="/terms" className="text-purple-400 hover:underline">Terms of Service</Link>
                                </span>
                            </label>

                            {/* Redeem Button */}
                            <button
                                onClick={handleRedeem}
                                disabled={redeeming || !licenseKey.trim() || !agreedToTerms}
                                className="w-full py-3 bg-[#1a1a1f] hover:bg-purple-500/20 disabled:opacity-30 disabled:cursor-not-allowed rounded-lg font-medium text-neutral-400 hover:text-purple-400 transition flex items-center justify-center gap-2"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                                </svg>
                                {redeeming ? 'Redeeming...' : 'Redeem Key'}
                            </button>

                            {redeemError && <p className="mt-3 text-sm text-red-400 text-center">{redeemError}</p>}
                            {redeemSuccess && <p className="mt-3 text-sm text-green-400 text-center">{redeemSuccess}</p>}
                        </div>

                        {/* Bottom Cards */}
                        <div className="flex gap-4 mt-6 w-full max-w-md">
                            <a href={DISCORD} target="_blank" className="flex-1 p-4 rounded-xl bg-[#16161a] border border-white/5 hover:border-purple-500/30 transition text-center">
                                <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center mx-auto mb-2">
                                    <svg className="w-4 h-4 text-purple-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <p className="text-sm font-medium text-white">Need a key?</p>
                                <p className="text-xs text-purple-400">Purchase on Discord</p>
                            </a>
                            <a href={DISCORD} target="_blank" className="flex-1 p-4 rounded-xl bg-[#16161a] border border-white/5 hover:border-purple-500/30 transition text-center">
                                <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center mx-auto mb-2">
                                    <svg className="w-4 h-4 text-purple-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                                    </svg>
                                </div>
                                <p className="text-sm font-medium text-white">Lost your key?</p>
                                <p className="text-xs text-purple-400">Contact support</p>
                            </a>
                        </div>

                        <p className="text-xs text-neutral-600 mt-6">Each key can only be redeemed once.</p>
                    </div>
                )}

                {/* Settings Tab - Cherax Style */}
                {activeTab === 'settings' && (
                    <div className="p-8 max-w-2xl mx-auto">
                        {/* Profile Information */}
                        <div className="rounded-xl bg-[#16161a] border border-white/5 overflow-hidden mb-6">
                            <div className="px-5 py-4 border-b border-white/5 flex items-center gap-2">
                                <svg className="w-4 h-4 text-purple-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                                <h3 className="font-medium text-white">Profile Information</h3>
                            </div>
                            <div className="p-5 space-y-4">
                                <div>
                                    <label className="block text-xs text-neutral-500 mb-1.5">Username</label>
                                    <input
                                        type="text"
                                        value={profile?.username || ''}
                                        readOnly
                                        className="w-full px-4 py-2.5 bg-[#0d0d0f] border border-white/10 rounded-lg text-white text-sm focus:outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs text-neutral-500 mb-1.5">Email</label>
                                    <input
                                        type="email"
                                        value={user?.email || ''}
                                        readOnly
                                        className="w-full px-4 py-2.5 bg-[#0d0d0f] border border-white/10 rounded-lg text-white text-sm focus:outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs text-neutral-500 mb-1.5">Current Password</label>
                                    <input
                                        type="password"
                                        placeholder="Enter your password to confirm changes"
                                        className="w-full px-4 py-2.5 bg-[#0d0d0f] border border-white/10 rounded-lg text-white placeholder-neutral-600 text-sm focus:outline-none focus:border-purple-500/50"
                                    />
                                    <p className="text-xs text-neutral-600 mt-1">Required to update your profile</p>
                                </div>
                                <button className="flex items-center gap-2 px-4 py-2 bg-[#1a1a1f] hover:bg-purple-500/20 rounded-lg text-sm text-neutral-400 hover:text-purple-400 transition">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                                    </svg>
                                    Save Changes
                                </button>
                            </div>
                        </div>

                        {/* Discord Connection - Cherax Style */}
                        <div className="rounded-xl bg-[#16161a] border border-white/5 overflow-hidden mb-6">
                            <div className="px-5 py-4 border-b border-white/5 flex items-center gap-2">
                                <svg className="w-4 h-4 text-[#5865F2]" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128c.126-.094.252-.192.372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z" />
                                </svg>
                                <h3 className="font-medium text-white">Discord Connection</h3>
                            </div>
                            <div className="p-5">
                                {profile?.discord_id ? (
                                    <>
                                        <div className="flex items-center gap-4 mb-4">
                                            {profile.discord_avatar ? (
                                                <img src={profile.discord_avatar} className="w-12 h-12 rounded-full" alt="" />
                                            ) : (
                                                <div className="w-12 h-12 rounded-full bg-[#5865F2]/20 flex items-center justify-center">
                                                    <svg className="w-6 h-6 text-[#5865F2]" viewBox="0 0 24 24" fill="currentColor">
                                                        <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128c.126-.094.252-.192.372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z" />
                                                    </svg>
                                                </div>
                                            )}
                                            <div className="flex-1">
                                                <p className="font-medium text-white">{profile.discord_username || 'Discord User'}</p>
                                                <p className="text-xs text-neutral-500">Discord Connected</p>
                                            </div>
                                            <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-500/20 text-green-400">Connected</span>
                                        </div>
                                        <div className="flex gap-2">
                                            <button className="flex items-center gap-2 px-3 py-2 bg-[#1a1a1f] hover:bg-white/10 rounded-lg text-xs text-neutral-400 hover:text-white transition">
                                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                                </svg>
                                                Sync Roles
                                            </button>
                                            <button className="flex items-center gap-2 px-3 py-2 bg-[#1a1a1f] hover:bg-white/10 rounded-lg text-xs text-neutral-400 hover:text-white transition">
                                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                                </svg>
                                                Update Discord Profile
                                            </button>
                                            <button
                                                onClick={handleUnlinkDiscord}
                                                disabled={unlinkingDiscord}
                                                className="flex items-center gap-2 px-3 py-2 text-xs text-red-400 hover:bg-red-500/10 rounded-lg transition disabled:opacity-50"
                                            >
                                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.181 8.68a4.503 4.503 0 011.903 6.405m-9.768-2.782L3.56 14.06a4.5 4.5 0 006.364 6.365l3.129-3.129m5.614-5.615l1.757-1.757a4.5 4.5 0 00-6.364-6.365l-4.5 4.5" />
                                                </svg>
                                                {unlinkingDiscord ? 'Disconnecting...' : 'Disconnect'}
                                            </button>
                                        </div>
                                    </>
                                ) : (
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-full bg-[#5865F2]/10 flex items-center justify-center">
                                                <svg className="w-6 h-6 text-[#5865F2]/50" viewBox="0 0 24 24" fill="currentColor">
                                                    <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128c.126-.094.252-.192.372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z" />
                                                </svg>
                                            </div>
                                            <div>
                                                <p className="font-medium text-white">Discord</p>
                                                <p className="text-xs text-neutral-500">Not connected</p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={handleLinkDiscord}
                                            disabled={linkingDiscord}
                                            className="flex items-center gap-2 px-4 py-2 bg-[#5865F2] hover:bg-[#4752C4] rounded-lg text-sm font-medium text-white transition disabled:opacity-50"
                                        >
                                            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                                                <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128c.126-.094.252-.192.372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z" />
                                            </svg>
                                            {linkingDiscord ? 'Connecting...' : 'Link your Discord account'}
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Account Information */}
                        <div className="rounded-xl bg-[#16161a] border border-white/5 overflow-hidden">
                            <div className="px-5 py-4 border-b border-white/5 flex items-center gap-2">
                                <svg className="w-4 h-4 text-purple-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <h3 className="font-medium text-white">Account Information</h3>
                            </div>
                            <div className="p-5">
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div>
                                        <p className="text-neutral-500 mb-1">Member Since</p>
                                        <p className="text-white">{profile?.created_at ? new Date(profile.created_at).toLocaleDateString('de-DE') : '-'}</p>
                                    </div>
                                    <div>
                                        <p className="text-neutral-500 mb-1">Subscription</p>
                                        <p className={isPremium ? 'text-purple-400' : 'text-neutral-400'}>{isPremium ? 'Premium' : 'Free'}</p>
                                    </div>
                                    {license && (
                                        <>
                                            <div>
                                                <p className="text-neutral-500 mb-1">License Type</p>
                                                <p className="text-white">{license.plan === 'lifetime' ? 'Lifetime' : 'Subscription'}</p>
                                            </div>
                                            <div>
                                                <p className="text-neutral-500 mb-1">Expires</p>
                                                <p className="text-white">{license.expires_at ? new Date(license.expires_at).toLocaleDateString('de-DE') : 'Never'}</p>
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
