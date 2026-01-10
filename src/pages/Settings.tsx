import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { signOut, linkDiscordAccount, unlinkDiscordAccount, updateProfileDiscord, supabase } from '../lib/supabase'
import { RefreshCw, Shield } from 'lucide-react'

const DiscordIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
    <svg className={className} viewBox="0 0 127.14 96.36" fill="currentColor">
        <path d="M107.7,8.07A105.15,105.15,0,0,0,81.47,0a72.06,72.06,0,0,0-3.36,6.83A97.68,97.68,0,0,0,49,6.83,72.37,72.37,0,0,0,45.64,0,105.89,105.89,0,0,0,19.39,8.09C2.79,32.65-1.71,56.6.54,80.21h0A105.73,105.73,0,0,0,32.71,96.36,77.7,77.7,0,0,0,39.6,85.25a68.42,68.42,0,0,1-10.85-5.18c.91-.66,1.8-1.34,2.66-2a75.57,75.57,0,0,0,64.32,0c.87.71,1.76,1.39,2.66,2a68.68,68.68,0,0,1-10.87,5.19,77,77,0,0,0,6.89,11.1A105.25,105.25,0,0,0,126.6,80.22h0C129.24,52.84,122.09,29.11,107.7,8.07ZM42.45,65.69C36.18,65.69,31,60,31,53s5-12.74,11.43-12.74S54,46,53.89,53,48.84,65.69,42.45,65.69Zm42.24,0C78.41,65.69,73.25,60,73.25,53s5-12.74,11.44-12.74S96.23,46,96.12,53,91.08,65.69,84.69,65.69Z" />
    </svg>
)

export default function Settings() {
    const { user, profile, license, loading, refreshData } = useAuth()
    const navigate = useNavigate()
    const [linkingDiscord, setLinkingDiscord] = useState(false)
    const [unlinkingDiscord, setUnlinkingDiscord] = useState(false)
    const [discordLinked, setDiscordLinked] = useState<{ id: string, username: string | null, avatar: string | null } | null>(null)
    const [deleteConfirm, setDeleteConfirm] = useState(false)
    const [deleting, setDeleting] = useState(false)
    const [syncingRole, setSyncingRole] = useState(false)
    const [updatingProfile, setUpdatingProfile] = useState(false)
    const [syncMessage, setSyncMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

    useEffect(() => {
        if (!loading && !user) navigate('/')
    }, [user, loading, navigate])

    useEffect(() => {
        const checkDiscordStatus = async () => {
            if (!user) return
            if (profile?.discord_id) {
                setDiscordLinked({
                    id: profile.discord_id,
                    username: profile.discord_username,
                    avatar: profile.discord_avatar
                })
                return
            }
            const { data: { user: freshUser } } = await supabase.auth.getUser()
            if (!freshUser) return
            const discordIdentity = freshUser.identities?.find(i => i.provider === 'discord')
            if (discordIdentity) {
                const discordData = discordIdentity.identity_data
                const discordInfo = {
                    id: discordData?.provider_id || discordIdentity.id,
                    username: discordData?.full_name || discordData?.name || null,
                    avatar: discordData?.avatar_url || null
                }
                setDiscordLinked(discordInfo)
                await updateProfileDiscord(user.id, {
                    discord_id: discordInfo.id,
                    discord_username: discordInfo.username,
                    discord_avatar: discordInfo.avatar
                })
                await refreshData()
            }
        }
        checkDiscordStatus()
    }, [user, profile?.discord_id])

    const handleLinkDiscord = async () => {
        setLinkingDiscord(true)
        await linkDiscordAccount()
    }

    const handleUnlinkDiscord = async () => {
        setUnlinkingDiscord(true)
        await unlinkDiscordAccount()
        await updateProfileDiscord(user!.id, { discord_id: null, discord_username: null, discord_avatar: null })
        setDiscordLinked(null)
        await refreshData()
        setUnlinkingDiscord(false)
    }

    const handleSyncRole = async () => {
        if (!user) return
        setSyncingRole(true)
        setSyncMessage(null)
        try {
            const response = await fetch('/api/discord-sync', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'sync-role', userId: user.id })
            })
            const data = await response.json()
            if (data.success) {
                setSyncMessage({
                    type: 'success',
                    text: data.role ? `✓ ${data.role} role synced!` : 'No active license to sync'
                })
            } else {
                setSyncMessage({ type: 'error', text: data.error || 'Failed to sync role' })
            }
        } catch (error) {
            setSyncMessage({ type: 'error', text: 'Failed to sync role' })
        }
        setSyncingRole(false)
    }

    const handleUpdateDiscordProfile = async () => {
        if (!user) return
        setUpdatingProfile(true)
        setSyncMessage(null)
        try {
            const response = await fetch('/api/discord-sync', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'update-profile', userId: user.id })
            })
            const data = await response.json()
            if (data.success) {
                setDiscordLinked(prev => prev ? { ...prev, username: data.username, avatar: data.avatar } : null)
                await refreshData()
                setSyncMessage({ type: 'success', text: '✓ Discord profile updated!' })
            } else {
                setSyncMessage({ type: 'error', text: data.error || 'Failed to update profile' })
            }
        } catch (error) {
            setSyncMessage({ type: 'error', text: 'Failed to update profile' })
        }
        setUpdatingProfile(false)
    }

    const handleDeleteAccount = async () => {
        if (!deleteConfirm) {
            setDeleteConfirm(true)
            return
        }
        setDeleting(true)
        // Delete profile and revoke licenses
        await supabase.from('licenses').update({ is_active: false, user_id: null }).eq('user_id', user!.id)
        await supabase.from('profiles').delete().eq('id', user!.id)
        await signOut()
        window.location.href = '/'
    }

    const handleLogout = async () => {
        await signOut()
        window.location.href = '/'
    }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-zinc-950">
                <div className="w-10 h-10 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
            </div>
        )
    }

    if (!user) return null

    return (
        <div className="min-h-screen bg-zinc-950">
            <div className="fixed top-0 left-1/4 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none" />
            <div className="fixed bottom-0 right-1/4 w-[400px] h-[400px] bg-emerald-500/5 rounded-full blur-[100px] pointer-events-none" />

            {/* Header */}
            <header className="relative z-10 border-b border-white/5 bg-black/40 backdrop-blur-xl">
                <div className="max-w-3xl mx-auto px-6 py-4 flex items-center justify-between">
                    <Link to="/dashboard" className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center">
                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                        </div>
                        <span className="font-bold text-lg text-white">DASHY</span>
                    </Link>
                    <button onClick={handleLogout} className="px-4 py-2 text-neutral-400 hover:text-white text-sm transition">
                        Logout
                    </button>
                </div>
            </header>

            {/* Content */}
            <main className="relative z-10 max-w-3xl mx-auto px-6 py-12">
                <div className="mb-8">
                    <Link to="/dashboard" className="inline-flex items-center gap-2 text-sm text-neutral-400 hover:text-white mb-4">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                        </svg>
                        Back to Dashboard
                    </Link>
                    <h1 className="text-3xl font-bold text-white">Account Settings</h1>
                    <p className="text-neutral-400 mt-2">Manage your account and connected services</p>
                </div>

                {/* Profile Section */}
                <section className="mb-8 p-6 rounded-2xl bg-white/5 border border-white/10">
                    <h2 className="text-lg font-semibold text-white mb-4">Profile</h2>
                    <div className="flex items-center gap-4 mb-6">
                        {discordLinked?.avatar ? (
                            <img src={discordLinked.avatar} className="w-16 h-16 rounded-full ring-2 ring-emerald-500/30" alt="" />
                        ) : (
                            <div className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center text-2xl font-bold text-emerald-400">
                                {profile?.username?.[0]?.toUpperCase() || 'U'}
                            </div>
                        )}
                        <div>
                            <p className="text-xl font-semibold text-white">{profile?.username || 'User'}</p>
                            <p className="text-sm text-neutral-400">{user.email}</p>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 rounded-xl bg-black/30">
                            <p className="text-sm text-neutral-500 mb-1">Plan</p>
                            <p className={`font-semibold ${license ? 'text-emerald-400' : 'text-neutral-400'}`}>
                                {license ? (license.plan === 'lifetime' ? 'Lifetime' : 'Monthly') : 'None'}
                            </p>
                        </div>
                        <div className="p-4 rounded-xl bg-black/30">
                            <p className="text-sm text-neutral-500 mb-1">License</p>
                            <p className="font-semibold text-white">
                                {license ? (license.expires_at ? `${Math.max(0, Math.ceil((new Date(license.expires_at).getTime() - Date.now()) / (1000 * 60 * 60 * 24)))} days` : 'Lifetime') : 'None'}
                            </p>
                        </div>
                    </div>
                </section>

                {/* Discord Section */}
                <section className="mb-8 p-6 rounded-2xl bg-white/5 border border-white/10">
                    <h2 className="text-lg font-semibold text-white mb-4">Discord Connection</h2>
                    {discordLinked ? (
                        <>
                            <div className="flex items-center justify-between p-4 rounded-xl bg-[#5865F2]/10 border border-[#5865F2]/20 mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-[#5865F2]/20 flex items-center justify-center">
                                        <DiscordIcon className="w-5 h-5 text-[#5865F2]" />
                                    </div>
                                    <div>
                                        <p className="font-medium text-white">{discordLinked.username || 'Discord User'}</p>
                                        <p className="text-xs text-neutral-400">ID: {discordLinked.id}</p>
                                    </div>
                                </div>
                                <button
                                    onClick={handleUnlinkDiscord}
                                    disabled={unlinkingDiscord}
                                    className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg text-sm font-medium transition"
                                >
                                    {unlinkingDiscord ? 'Unlinking...' : 'Unlink'}
                                </button>
                            </div>

                            {/* Sync Buttons */}
                            <div className="grid grid-cols-2 gap-3 mb-3">
                                <button
                                    onClick={handleSyncRole}
                                    disabled={syncingRole}
                                    className="flex items-center justify-center gap-2 p-3 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 text-emerald-400 font-medium transition disabled:opacity-50"
                                >
                                    <Shield className={`w-4 h-4 ${syncingRole ? 'animate-pulse' : ''}`} />
                                    {syncingRole ? 'Syncing...' : 'Sync Role'}
                                </button>
                                <button
                                    onClick={handleUpdateDiscordProfile}
                                    disabled={updatingProfile}
                                    className="flex items-center justify-center gap-2 p-3 rounded-xl bg-[#5865F2]/10 hover:bg-[#5865F2]/20 border border-[#5865F2]/20 text-[#5865F2] font-medium transition disabled:opacity-50"
                                >
                                    <RefreshCw className={`w-4 h-4 ${updatingProfile ? 'animate-spin' : ''}`} />
                                    {updatingProfile ? 'Updating...' : 'Update Profile'}
                                </button>
                            </div>

                            {/* Sync Message */}
                            {syncMessage && (
                                <div className={`p-3 rounded-lg text-sm ${syncMessage.type === 'success'
                                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                    : 'bg-red-500/10 text-red-400 border border-red-500/20'
                                    }`}>
                                    {syncMessage.text}
                                </div>
                            )}
                        </>
                    ) : (
                        <button
                            onClick={handleLinkDiscord}
                            disabled={linkingDiscord}
                            className="w-full flex items-center justify-center gap-3 p-4 rounded-xl bg-[#5865F2] hover:bg-[#4752C4] text-white font-medium transition"
                        >
                            <DiscordIcon className="w-5 h-5" />
                            {linkingDiscord ? 'Connecting...' : 'Connect Discord'}
                        </button>
                    )}
                    <p className="text-xs text-neutral-500 mt-3">
                        Link your Discord to sync your role (Monthly/Lifetime) and get support in our server.
                    </p>
                </section>

                {/* License Section */}
                {license && (
                    <section className="mb-8 p-6 rounded-2xl bg-white/5 border border-white/10">
                        <h2 className="text-lg font-semibold text-white mb-4">License Details</h2>
                        <div className="space-y-3">
                            <div className="flex justify-between p-3 rounded-lg bg-black/30">
                                <span className="text-neutral-400">Key</span>
                                <span className="font-mono text-sm text-white">{license.key?.substring(0, 10)}...</span>
                            </div>
                            <div className="flex justify-between p-3 rounded-lg bg-black/30">
                                <span className="text-neutral-400">Plan</span>
                                <span className="text-white capitalize">{license.plan}</span>
                            </div>
                            <div className="flex justify-between p-3 rounded-lg bg-black/30">
                                <span className="text-neutral-400">Status</span>
                                <span className={license.is_active ? 'text-emerald-400' : 'text-red-400'}>
                                    {license.is_active ? 'Active' : 'Revoked'}
                                </span>
                            </div>
                        </div>
                    </section>
                )}

                {/* Danger Zone */}
                <section className="p-6 rounded-2xl bg-red-500/5 border border-red-500/20">
                    <h2 className="text-lg font-semibold text-red-400 mb-4">Danger Zone</h2>
                    <p className="text-sm text-neutral-400 mb-4">
                        Deleting your account will revoke all licenses and remove all your data. This action cannot be undone.
                    </p>
                    <button
                        onClick={handleDeleteAccount}
                        disabled={deleting}
                        className={`px-6 py-3 rounded-xl font-medium transition ${deleteConfirm
                            ? 'bg-red-500 hover:bg-red-600 text-white'
                            : 'bg-red-500/20 hover:bg-red-500/30 text-red-400'
                            }`}
                    >
                        {deleting ? 'Deleting...' : deleteConfirm ? 'Click again to confirm' : 'Delete Account'}
                    </button>
                    {deleteConfirm && (
                        <button
                            onClick={() => setDeleteConfirm(false)}
                            className="ml-3 px-6 py-3 bg-white/10 hover:bg-white/20 rounded-xl text-white font-medium transition"
                        >
                            Cancel
                        </button>
                    )}
                </section>
            </main>
        </div>
    )
}
