import { useState, useEffect } from 'react'
import { useNavigate, Link, useSearchParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { signOut, redeemLicense, linkDiscordAccount, unlinkDiscordAccount, updateProfileDiscord, supabase } from '../lib/supabase'

const DISCORD = 'https://discord.gg/cXxFzBuG'
type Tab = 'home' | 'download' | 'license' | 'settings' | 'status' | 'faq' | 'terms' | 'changelog' | 'tickets'

const DiscordIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
    <svg className={className} viewBox="0 0 127.14 96.36" fill="currentColor">
        <path d="M107.7,8.07A105.15,105.15,0,0,0,81.47,0a72.06,72.06,0,0,0-3.36,6.83A97.68,97.68,0,0,0,49,6.83,72.37,72.37,0,0,0,45.64,0,105.89,105.89,0,0,0,19.39,8.09C2.79,32.65-1.71,56.6.54,80.21h0A105.73,105.73,0,0,0,32.71,96.36,77.7,77.7,0,0,0,39.6,85.25a68.42,68.42,0,0,1-10.85-5.18c.91-.66,1.8-1.34,2.66-2a75.57,75.57,0,0,0,64.32,0c.87.71,1.76,1.39,2.66,2a68.68,68.68,0,0,1-10.87,5.19,77,77,0,0,0,6.89,11.1A105.25,105.25,0,0,0,126.6,80.22h0C129.24,52.84,122.09,29.11,107.7,8.07ZM42.45,65.69C36.18,65.69,31,60,31,53s5-12.74,11.43-12.74S54,46,53.89,53,48.84,65.69,42.45,65.69Zm42.24,0C78.41,65.69,73.25,60,73.25,53s5-12.74,11.44-12.74S96.23,46,96.12,53,91.08,65.69,84.69,65.69Z" />
    </svg>
)

// Tickets Tab Component
function TicketsTab({ userId }: { userId?: string }) {
    const [tickets, setTickets] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [filter, setFilter] = useState<'all' | 'open' | 'pending' | 'closed'>('all')
    const [showNewTicket, setShowNewTicket] = useState(false)
    const [newSubject, setNewSubject] = useState('')
    const [newMessage, setNewMessage] = useState('')
    const [newCategory, setNewCategory] = useState('general')
    const [creating, setCreating] = useState(false)
    const [selectedTicket, setSelectedTicket] = useState<any>(null)
    const [ticketMessages, setTicketMessages] = useState<any[]>([])
    const [replyMessage, setReplyMessage] = useState('')
    const [sending, setSending] = useState(false)

    useEffect(() => {
        if (userId) loadTickets()
    }, [userId])

    const loadTickets = async () => {
        try {
            const res = await fetch(`/api/tickets?userId=${userId}`)
            const data = await res.json()
            if (data.success) setTickets(data.tickets || [])
        } catch (e) { console.error(e) }
        setLoading(false)
    }

    const createTicket = async () => {
        if (!newSubject.trim() || !newMessage.trim()) return
        setCreating(true)
        try {
            const res = await fetch('/api/tickets', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'create', userId, subject: newSubject, category: newCategory, message: newMessage })
            })
            const data = await res.json()
            if (data.success) {
                setShowNewTicket(false)
                setNewSubject('')
                setNewMessage('')
                loadTickets()
            }
        } catch (e) { console.error(e) }
        setCreating(false)
    }

    const openTicket = async (ticket: any) => {
        setSelectedTicket(ticket)
        try {
            const res = await fetch('/api/tickets', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'get', ticketId: ticket.id })
            })
            const data = await res.json()
            if (data.success) setTicketMessages(data.messages || [])
        } catch (e) { console.error(e) }
    }

    const sendReply = async () => {
        if (!replyMessage.trim() || !selectedTicket) return
        setSending(true)
        try {
            await fetch('/api/tickets', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'reply', ticketId: selectedTicket.id, userId, message: replyMessage })
            })
            setReplyMessage('')
            openTicket(selectedTicket)
        } catch (e) { console.error(e) }
        setSending(false)
    }

    const closeTicket = async () => {
        if (!selectedTicket) return
        try {
            await fetch('/api/tickets', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'close', ticketId: selectedTicket.id })
            })
            setSelectedTicket(null)
            loadTickets()
        } catch (e) { console.error(e) }
    }

    const filteredTickets = tickets.filter(t => filter === 'all' || t.status === filter)

    const statusColors: Record<string, string> = {
        open: 'bg-emerald-500/20 text-emerald-400',
        pending: 'bg-amber-500/20 text-amber-400',
        closed: 'bg-zinc-500/20 text-zinc-400'
    }

    if (selectedTicket) {
        return (
            <div className="p-8 max-w-4xl mx-auto">
                <button onClick={() => setSelectedTicket(null)} className="flex items-center gap-2 text-sm text-neutral-400 hover:text-white mb-6">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
                    Back to Tickets
                </button>
                <div className="flex items-start justify-between mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-white mb-2">{selectedTicket.subject}</h1>
                        <div className="flex items-center gap-3">
                            <span className={`px-2 py-1 rounded text-xs font-medium ${statusColors[selectedTicket.status]}`}>{selectedTicket.status}</span>
                            <span className="text-sm text-neutral-500">{selectedTicket.category}</span>
                            <span className="text-sm text-neutral-500">{new Date(selectedTicket.created_at).toLocaleDateString('de-DE')}</span>
                        </div>
                    </div>
                    {selectedTicket.status !== 'closed' && (
                        <button onClick={closeTicket} className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg text-sm font-medium transition">Close Ticket</button>
                    )}
                </div>
                <div className="space-y-4 mb-6">
                    {ticketMessages.map((msg, i) => (
                        <div key={i} className={`p-4 rounded-xl ${msg.is_staff ? 'bg-emerald-500/10 border border-emerald-500/20' : 'bg-white/5 border border-white/10'}`}>
                            <div className="flex items-center gap-2 mb-2">
                                <span className={`text-sm font-medium ${msg.is_staff ? 'text-emerald-400' : 'text-white'}`}>{msg.is_staff ? 'Staff' : msg.profiles?.username || 'You'}</span>
                                <span className="text-xs text-neutral-500">{new Date(msg.created_at).toLocaleString('de-DE')}</span>
                            </div>
                            <p className="text-neutral-300 text-sm whitespace-pre-wrap">{msg.message}</p>
                        </div>
                    ))}
                </div>
                {selectedTicket.status !== 'closed' && (
                    <div className="flex gap-3">
                        <textarea value={replyMessage} onChange={(e) => setReplyMessage(e.target.value)} placeholder="Type your reply..." className="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-neutral-500 resize-none focus:outline-none focus:border-emerald-500/50" rows={3} />
                        <button onClick={sendReply} disabled={sending || !replyMessage.trim()} className="px-6 py-3 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 rounded-xl text-white font-medium transition">{sending ? 'Sending...' : 'Send'}</button>
                    </div>
                )}
            </div>
        )
    }

    return (
        <div className="p-8 max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-white mb-2">Support Tickets</h1>
                    <p className="text-neutral-500">View and manage your support requests</p>
                </div>
                <button onClick={() => setShowNewTicket(true)} className="flex items-center gap-2 px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 rounded-xl text-white font-medium transition">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
                    New Ticket
                </button>
            </div>

            {/* Filter */}
            <div className="flex gap-2 mb-6">
                {(['all', 'open', 'pending', 'closed'] as const).map(f => (
                    <button key={f} onClick={() => setFilter(f)} className={`px-4 py-2 rounded-lg text-sm font-medium transition ${filter === f ? 'bg-emerald-500 text-white' : 'bg-white/5 text-neutral-400 hover:text-white'}`}>
                        {f === 'all' ? 'All' : f.charAt(0).toUpperCase() + f.slice(1)}
                    </button>
                ))}
            </div>

            {/* Tickets List */}
            {loading ? (
                <div className="flex justify-center py-12"><div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" /></div>
            ) : filteredTickets.length === 0 ? (
                <div className="text-center py-16">
                    <svg className="w-16 h-16 mx-auto text-neutral-600 mb-4" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
                    <p className="text-neutral-500 mb-4">No tickets found</p>
                    <button onClick={() => setShowNewTicket(true)} className="px-6 py-3 bg-emerald-500 hover:bg-emerald-400 rounded-xl text-white font-medium transition">Create Your First Ticket</button>
                </div>
            ) : (
                <div className="space-y-3">
                    {filteredTickets.map(ticket => (
                        <button key={ticket.id} onClick={() => openTicket(ticket)} className="w-full p-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-left transition">
                            <div className="flex items-center justify-between mb-2">
                                <h3 className="font-medium text-white">{ticket.subject}</h3>
                                <span className={`px-2 py-1 rounded text-xs font-medium ${statusColors[ticket.status]}`}>{ticket.status}</span>
                            </div>
                            <div className="flex items-center gap-3 text-sm text-neutral-500">
                                <span>{ticket.category}</span>
                                <span>•</span>
                                <span>{new Date(ticket.created_at).toLocaleDateString('de-DE')}</span>
                            </div>
                        </button>
                    ))}
                </div>
            )}

            {/* New Ticket Modal */}
            {showNewTicket && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="w-full max-w-lg p-6 bg-zinc-900 border border-white/10 rounded-2xl">
                        <h2 className="text-xl font-bold text-white mb-6">Create New Ticket</h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm text-neutral-400 mb-2">Category</label>
                                <select value={newCategory} onChange={(e) => setNewCategory(e.target.value)} className="w-full px-4 py-3 bg-zinc-800 border border-white/10 rounded-xl text-white focus:outline-none focus:border-emerald-500/50 [&>option]:bg-zinc-800 [&>option]:text-white">
                                    <option value="general">General Support</option>
                                    <option value="technical">Technical Issue</option>
                                    <option value="billing">Billing</option>
                                    <option value="hwid">HWID Reset</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm text-neutral-400 mb-2">Subject</label>
                                <input type="text" value={newSubject} onChange={(e) => setNewSubject(e.target.value)} placeholder="Brief description of your issue" className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-neutral-500 focus:outline-none focus:border-emerald-500/50" />
                            </div>
                            <div>
                                <label className="block text-sm text-neutral-400 mb-2">Message</label>
                                <textarea value={newMessage} onChange={(e) => setNewMessage(e.target.value)} placeholder="Describe your issue in detail..." className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-neutral-500 resize-none focus:outline-none focus:border-emerald-500/50" rows={5} />
                            </div>
                        </div>
                        <div className="flex gap-3 mt-6">
                            <button onClick={() => setShowNewTicket(false)} className="flex-1 px-4 py-3 bg-white/5 hover:bg-white/10 rounded-xl text-white font-medium transition">Cancel</button>
                            <button onClick={createTicket} disabled={creating || !newSubject.trim() || !newMessage.trim()} className="flex-1 px-4 py-3 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 rounded-xl text-white font-medium transition">{creating ? 'Creating...' : 'Create Ticket'}</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

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
    const [syncingRole, setSyncingRole] = useState(false)
    const [updatingProfile, setUpdatingProfile] = useState(false)
    const [agreedToTerms, setAgreedToTerms] = useState(false)

    const [discordLinked, setDiscordLinked] = useState<{ id: string, username: string | null, avatar: string | null } | null>(null)

    // Initialize tab from URL or localStorage
    useEffect(() => {
        const tab = searchParams.get('tab')
        const savedTab = localStorage.getItem('dashboard-tab')
        if (tab && ['home', 'download', 'license', 'settings', 'status', 'faq', 'terms', 'changelog', 'tickets'].includes(tab)) {
            setActiveTab(tab as Tab)
            localStorage.setItem('dashboard-tab', tab)
        } else if (savedTab && ['home', 'download', 'license', 'settings', 'status', 'faq', 'terms', 'changelog', 'tickets'].includes(savedTab)) {
            setActiveTab(savedTab as Tab)
        }
        if (window.location.hash.includes('access_token')) {
            setActiveTab('settings')
            localStorage.setItem('dashboard-tab', 'settings')
            window.history.replaceState({}, '', '/dashboard?tab=settings')
        }
    }, [searchParams])

    // Save tab to localStorage when it changes
    const handleTabChange = (tab: Tab) => {
        setActiveTab(tab)
        localStorage.setItem('dashboard-tab', tab)
        window.history.replaceState({}, '', `/dashboard?tab=${tab}`)
    }

    // Check Discord link status - first from profile, then from identities
    useEffect(() => {
        const checkDiscordStatus = async () => {
            if (!user) return

            // First check if we have Discord data in profile (this persists)
            if (profile?.discord_id) {
                console.log('Discord found in profile:', profile.discord_id)
                setDiscordLinked({
                    id: profile.discord_id,
                    username: profile.discord_username,
                    avatar: profile.discord_avatar
                })
                return
            }

            // If not in profile, check identities (for fresh OAuth callback)
            const { data: { user: freshUser } } = await supabase.auth.getUser()
            if (!freshUser) return

            console.log('Checking identities:', freshUser.identities?.map(i => i.provider))
            const discordIdentity = freshUser.identities?.find(i => i.provider === 'discord')

            if (discordIdentity) {
                const discordData = discordIdentity.identity_data
                const discordInfo = {
                    id: discordData?.provider_id || discordIdentity.id,
                    username: discordData?.full_name || discordData?.name || discordData?.custom_claims?.global_name || null,
                    avatar: discordData?.avatar_url || null
                }
                console.log('Discord found in identities, syncing to profile:', discordInfo)
                setDiscordLinked(discordInfo)

                // Save to profile table so it persists
                const result = await updateProfileDiscord(user.id, {
                    discord_id: discordInfo.id,
                    discord_username: discordInfo.username,
                    discord_avatar: discordInfo.avatar
                })
                console.log('Profile update result:', result)
                await refreshData()
            } else {
                console.log('No Discord identity found')
                setDiscordLinked(null)
            }
        }

        checkDiscordStatus()
    }, [user, profile?.discord_id])

    useEffect(() => { if (!loading && !user) navigate('/') }, [user, loading, navigate])

    const handleLogout = async () => {
        console.log('Logging out...')
        await signOut()
        window.location.href = '/'
    }
    const handleLinkDiscord = async () => { setLinkingDiscord(true); await linkDiscordAccount() }
    const handleUnlinkDiscord = async () => {
        setUnlinkingDiscord(true)
        console.log('Unlinking Discord...')
        const { error } = await unlinkDiscordAccount()
        if (error) {
            console.error('Unlink failed:', error)
        }
        await updateProfileDiscord(user!.id, { discord_id: null, discord_username: null, discord_avatar: null })
        setDiscordLinked(null)
        await refreshData()
        setUnlinkingDiscord(false)
    }
    const handleSyncDiscordRole = async () => {
        if (!user) return
        setSyncingRole(true)
        try {
            const response = await fetch('/api/discord-sync', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'sync-role', userId: user.id })
            })
            const data = await response.json()
            if (data.success) {
                alert(data.role ? `✓ ${data.role} role synced!` : 'No active license to sync')
            } else {
                alert(data.error || 'Failed to sync role')
            }
        } catch (error) {
            alert('Failed to sync role')
        }
        await refreshData()
        setSyncingRole(false)
    }
    const handleUpdateDiscordProfile = async () => {
        setUpdatingProfile(true)
        console.log('Updating Discord profile...')
        const { data: { user: freshUser } } = await supabase.auth.getUser()
        if (freshUser) {
            const discordIdentity = freshUser.identities?.find(i => i.provider === 'discord')
            if (discordIdentity) {
                const discordData = discordIdentity.identity_data
                const result = await updateProfileDiscord(user!.id, {
                    discord_id: discordData?.provider_id || discordIdentity.id,
                    discord_username: discordData?.full_name || discordData?.name || discordData?.custom_claims?.global_name || null,
                    discord_avatar: discordData?.avatar_url || null
                })
                console.log('Update result:', result)
                if (discordData) {
                    setDiscordLinked({
                        id: discordData.provider_id || discordIdentity.id,
                        username: discordData.full_name || discordData.name || null,
                        avatar: discordData.avatar_url || null
                    })
                }
                await refreshData()
            }
        }
        setUpdatingProfile(false)
    }
    const handleRedeem = async () => {
        if (!licenseKey.trim() || !user || !agreedToTerms) return
        setRedeeming(true); setRedeemError(''); setRedeemSuccess('')
        const { error } = await redeemLicense(licenseKey, user.id)
        if (error) setRedeemError(error.message)
        else { setRedeemSuccess('License activated!'); setLicenseKey(''); await refreshData() }
        setRedeeming(false)
    }

    if (loading) return <div className="min-h-screen flex items-center justify-center bg-zinc-950"><div className="w-10 h-10 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" /></div>
    if (!user) return null

    const menuItems = [
        { id: 'home', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6', label: 'Dashboard' },
        { id: 'download', icon: 'M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4', label: 'Download' },
        { id: 'license', icon: 'M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z', label: 'Redeem Key' },
    ]
    const supportItems = [
        { id: 'tickets', icon: 'M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z', label: 'Support Tickets' },
        { id: 'changelog', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01', label: 'Changelog' },
        { id: 'faq', icon: 'M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z', label: 'FAQs' },
        { id: 'status', icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z', label: 'System Status' },
        { id: 'terms', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z', label: 'Terms of Service' },
        { id: 'settings', icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z', label: 'Settings' },
    ]

    return (
        <div className="min-h-screen flex bg-zinc-950">
            <div className="fixed top-0 left-1/4 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none" />
            <div className="fixed bottom-0 right-1/4 w-[400px] h-[400px] bg-emerald-500/5 rounded-full blur-[100px] pointer-events-none" />

            {/* Sidebar */}
            <div className="w-72 h-screen bg-black/40 backdrop-blur-xl border-r border-white/5 flex flex-col relative z-10 sticky top-0">
                <div className="p-6">
                    <Link to="/" className="flex items-center gap-3 group">
                        <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-500/20">
                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                        </div>
                        <div><span className="font-bold text-lg text-white">DASHY</span><p className="text-[11px] text-emerald-400/80">Dashboard</p></div>
                    </Link>
                </div>
                <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
                    {menuItems.map(item => (
                        <button key={item.id} onClick={() => handleTabChange(item.id as Tab)} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${activeTab === item.id ? 'bg-emerald-500/15 text-emerald-400' : 'text-neutral-400 hover:text-white hover:bg-white/5'}`}>
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d={item.icon} /></svg>
                            {item.label}
                        </button>
                    ))}
                    <div className="pt-4 pb-2 px-3"><span className="text-[10px] font-medium text-neutral-600 uppercase tracking-wider">Support</span></div>
                    {supportItems.map(item => (
                        <button key={item.id} onClick={() => handleTabChange(item.id as Tab)} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${activeTab === item.id ? 'bg-emerald-500/15 text-emerald-400' : 'text-neutral-400 hover:text-white hover:bg-white/5'}`}>
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d={item.icon} /></svg>
                            {item.label}
                        </button>
                    ))}
                </nav>
                <div className="p-4 border-t border-white/5 bg-black/40 backdrop-blur-xl">
                    <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5">
                        {discordLinked?.avatar ? <img src={discordLinked.avatar} className="w-10 h-10 rounded-full ring-2 ring-emerald-500/30" alt="" /> : <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center text-sm font-bold text-emerald-400">{profile?.username?.[0]?.toUpperCase() || user?.user_metadata?.username?.[0]?.toUpperCase() || 'U'}</div>}
                        <div className="flex-1 min-w-0"><p className="font-medium text-sm text-white truncate">{profile?.username || user?.user_metadata?.username || 'User'}</p><p className={`text-xs ${isPremium ? 'text-emerald-400' : 'text-neutral-500'}`}>{isPremium ? (license?.expires_at ? `${Math.max(0, Math.ceil((new Date(license.expires_at).getTime() - Date.now()) / (1000 * 60 * 60 * 24)))} days left` : 'Lifetime') : 'No Plan'}</p></div>
                        <button onClick={handleLogout} className="p-2 text-neutral-500 hover:text-red-400 rounded-lg transition"><svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg></button>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 overflow-auto relative z-10">
                {/* Home Tab */}
                {activeTab === 'home' && (
                    <div className="p-8 max-w-5xl mx-auto">
                        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-500/20 via-emerald-600/10 to-transparent border border-emerald-500/20 p-8 mb-8">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/20 rounded-full blur-3xl" />
                            <div className="relative">
                                <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/20 rounded-full text-xs text-emerald-400 mb-4"><span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />{isPremium ? (license?.expires_at ? `${Math.max(0, Math.ceil((new Date(license.expires_at).getTime() - Date.now()) / (1000 * 60 * 60 * 24)))} days left` : 'Lifetime') : 'No Plan'}</div>
                                <h1 className="text-3xl font-bold text-white mb-2">Welcome back, <span className="text-emerald-400">{profile?.username || user?.user_metadata?.username || 'User'}</span></h1>
                                <p className="text-neutral-400">Manage your account and optimize your gaming experience.</p>
                            </div>
                        </div>
                        <div className="grid grid-cols-3 gap-4 mb-8">
                            <button onClick={() => handleTabChange('download')} className="group p-6 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-emerald-500/30 transition-all text-left">
                                <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center mb-4"><svg className="w-6 h-6 text-emerald-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg></div>
                                <h3 className="font-semibold text-white mb-1">Download App</h3><p className="text-sm text-neutral-500">Get Dashy Tweaks</p>
                            </button>
                            <button onClick={() => handleTabChange('license')} className="group p-6 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-emerald-500/30 transition-all text-left">
                                <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center mb-4"><svg className="w-6 h-6 text-emerald-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" /></svg></div>
                                <h3 className="font-semibold text-white mb-1">Redeem Key</h3><p className="text-sm text-neutral-500">Activate Premium</p>
                            </button>
                            <a href={DISCORD} target="_blank" className="group p-6 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-[#5865F2]/30 transition-all text-left">
                                <div className="w-12 h-12 rounded-xl bg-[#5865F2]/10 flex items-center justify-center mb-4"><DiscordIcon className="w-6 h-6 text-[#5865F2]" /></div>
                                <h3 className="font-semibold text-white mb-1">Join Discord</h3><p className="text-sm text-neutral-500">Get Support</p>
                            </a>
                        </div>
                        <div className="grid grid-cols-4 gap-4">
                            <div className="p-5 rounded-xl bg-white/5 border border-white/5"><p className="text-2xl font-bold text-emerald-400">270+</p><p className="text-sm text-neutral-500">Total Tweaks</p></div>
                            <div className="p-5 rounded-xl bg-white/5 border border-white/5"><p className="text-2xl font-bold text-white">{isPremium ? '270+' : '50+'}</p><p className="text-sm text-neutral-500">Available</p></div>
                            <div className="p-5 rounded-xl bg-white/5 border border-white/5"><p className="text-2xl font-bold text-white">+30%</p><p className="text-sm text-neutral-500">FPS Boost</p></div>
                            <div className="p-5 rounded-xl bg-white/5 border border-white/5"><p className={`text-2xl font-bold ${isPremium ? 'text-emerald-400' : 'text-neutral-400'}`}>{isPremium ? 'Active' : 'Free'}</p><p className="text-sm text-neutral-500">Status</p></div>
                        </div>
                    </div>
                )}

                {/* Download Tab */}
                {activeTab === 'download' && (
                    <div className="p-8 max-w-3xl mx-auto">
                        <div className="mb-8"><h1 className="text-2xl font-bold text-white mb-2">Download</h1><p className="text-neutral-500">Get the Dashy Tweaks application</p></div>
                        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-500/10 to-transparent border border-emerald-500/20 p-8 mb-6">
                            <div className="relative flex items-center gap-6 mb-6">
                                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-500/30"><svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg></div>
                                <div><h2 className="text-xl font-bold text-white">Dashy Tweaks</h2><p className="text-neutral-400">v1.0.0 • Windows 10/11</p></div>
                            </div>
                            <a href="https://github.com/Shoczy/dashy-tweaks/releases/latest" target="_blank" className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-500 hover:bg-emerald-400 rounded-xl font-semibold text-white shadow-lg shadow-emerald-500/30 transition-all"><svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>Download for Windows</a>
                        </div>
                    </div>
                )}

                {/* License Tab */}
                {activeTab === 'license' && (
                    <div className="flex flex-col items-center justify-center min-h-full py-16 px-4">
                        <div className="relative w-24 h-24 rounded-full bg-gradient-to-br from-emerald-500/20 to-emerald-600/10 flex items-center justify-center mb-8 ring-1 ring-emerald-500/30"><svg className="w-12 h-12 text-emerald-400" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z" /></svg></div>
                        <h1 className="text-3xl font-bold text-white mb-2">Redeem License Key</h1>
                        <p className="text-neutral-500 mb-10">Enter your license key to upgrade your account</p>
                        <div className="w-full max-w-lg p-8 rounded-2xl bg-white/5 backdrop-blur border border-white/10">
                            <label className="block text-sm text-neutral-400 mb-2">License Key</label>
                            <input type="text" value={licenseKey} onChange={(e) => setLicenseKey(e.target.value.toUpperCase())} placeholder="XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX" className="w-full px-5 py-4 bg-black/30 border border-white/10 rounded-xl text-white placeholder-neutral-600 font-mono focus:outline-none focus:border-emerald-500/50" />
                            <label className="flex items-center gap-3 mt-6 cursor-pointer">
                                <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${agreedToTerms ? 'bg-emerald-500 border-emerald-500' : 'border-white/20'}`}>{agreedToTerms && <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>}</div>
                                <input type="checkbox" checked={agreedToTerms} onChange={(e) => setAgreedToTerms(e.target.checked)} className="hidden" />
                                <span className="text-sm text-neutral-400">I agree to the <button onClick={() => handleTabChange('terms')} className="text-emerald-400 hover:underline">Terms of Service</button></span>
                            </label>
                            <button onClick={handleRedeem} disabled={redeeming || !licenseKey.trim() || !agreedToTerms} className="w-full mt-6 py-4 bg-emerald-500 hover:bg-emerald-400 disabled:bg-white/5 disabled:text-neutral-600 rounded-xl font-semibold text-white shadow-lg shadow-emerald-500/30 disabled:shadow-none transition-all">{redeeming ? 'Redeeming...' : 'Redeem Key'}</button>
                            {redeemError && <p className="mt-4 text-sm text-red-400 text-center">{redeemError}</p>}
                            {redeemSuccess && <p className="mt-4 text-sm text-emerald-400 text-center">{redeemSuccess}</p>}
                        </div>
                        <div className="flex gap-4 mt-8 w-full max-w-lg">
                            <a href={DISCORD} target="_blank" className="flex-1 p-5 rounded-xl bg-white/5 border border-white/5 hover:border-emerald-500/30 transition-all text-center"><p className="font-medium text-white">Need a key?</p><p className="text-xs text-emerald-400">Purchase on Discord</p></a>
                            <a href={DISCORD} target="_blank" className="flex-1 p-5 rounded-xl bg-white/5 border border-white/5 hover:border-emerald-500/30 transition-all text-center"><p className="font-medium text-white">Lost your key?</p><p className="text-xs text-emerald-400">Contact support</p></a>
                        </div>
                    </div>
                )}

                {/* System Status Tab */}
                {activeTab === 'status' && (
                    <div className="p-8 max-w-3xl mx-auto">
                        <div className="mb-8"><h1 className="text-2xl font-bold text-white mb-2">System Status</h1><p className="text-neutral-500">Current status of all Dashy Tweaks services</p></div>
                        <div className="space-y-4">
                            {[
                                { name: 'Website', status: 'operational', desc: 'Dashboard and landing page' },
                                { name: 'Authentication', status: 'operational', desc: 'Login and registration services' },
                                { name: 'License System', status: 'operational', desc: 'Key redemption and validation' },
                                { name: 'Download Server', status: 'operational', desc: 'Application downloads via GitHub' },
                                { name: 'Discord Bot', status: 'operational', desc: 'License management bot' },
                                { name: 'API', status: 'operational', desc: 'Backend services' },
                            ].map((service, i) => (
                                <div key={i} className="p-5 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between">
                                    <div>
                                        <h3 className="font-medium text-white">{service.name}</h3>
                                        <p className="text-sm text-neutral-500">{service.desc}</p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                                        <span className="text-sm text-emerald-400 font-medium">Operational</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="mt-8 p-5 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center"><svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg></div>
                                <div><p className="font-medium text-white">All Systems Operational</p><p className="text-sm text-neutral-400">Last updated: {new Date().toLocaleString('de-DE')}</p></div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Tickets Tab */}
                {activeTab === 'tickets' && (
                    <TicketsTab userId={user?.id} />
                )}

                {/* Changelog Tab */}
                {activeTab === 'changelog' && (
                    <div className="p-8 max-w-3xl mx-auto">
                        <div className="mb-8">
                            <h1 className="text-2xl font-bold text-white mb-2">Changelog</h1>
                            <p className="text-neutral-500">Stay up to date with the latest updates</p>
                        </div>
                        <div className="space-y-6">
                            {/* v1.3.0 */}
                            <div className="relative pl-8 pb-6 border-l-2 border-emerald-500/30">
                                <div className="absolute -left-2 top-0 w-4 h-4 rounded-full bg-emerald-500 ring-4 ring-emerald-500/20" />
                                <div className="flex items-center gap-3 mb-3">
                                    <span className="px-2 py-1 bg-emerald-500/20 text-emerald-400 text-xs font-bold rounded">v1.3.0</span>
                                    <span className="text-sm text-neutral-500">10. Januar 2026</span>
                                    <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 text-[10px] font-medium rounded">LATEST</span>
                                </div>
                                <div className="space-y-2">
                                    <div className="flex items-start gap-2 p-3 rounded-lg bg-white/5"><span className="px-1.5 py-0.5 bg-emerald-500/20 text-emerald-400 text-[10px] font-bold rounded">NEW</span><span className="text-sm text-neutral-300">24 Game Templates mit optimierten Tweak-Presets</span></div>
                                    <div className="flex items-start gap-2 p-3 rounded-lg bg-white/5"><span className="px-1.5 py-0.5 bg-emerald-500/20 text-emerald-400 text-[10px] font-bold rounded">NEW</span><span className="text-sm text-neutral-300">Template-Filter auf allen Tweak-Seiten</span></div>
                                    <div className="flex items-start gap-2 p-3 rounded-lg bg-white/5"><span className="px-1.5 py-0.5 bg-emerald-500/20 text-emerald-400 text-[10px] font-bold rounded">NEW</span><span className="text-sm text-neutral-300">Remember Me Login mit Auto-Login</span></div>
                                    <div className="flex items-start gap-2 p-3 rounded-lg bg-white/5"><span className="px-1.5 py-0.5 bg-blue-500/20 text-blue-400 text-[10px] font-bold rounded">IMPROVED</span><span className="text-sm text-neutral-300">Templates erweitert von 25 auf 140 Tweaks pro Spiel</span></div>
                                    <div className="flex items-start gap-2 p-3 rounded-lg bg-white/5"><span className="px-1.5 py-0.5 bg-blue-500/20 text-blue-400 text-[10px] font-bold rounded">IMPROVED</span><span className="text-sm text-neutral-300">Website jetzt Discord-only Purchase Flow</span></div>
                                    <div className="flex items-start gap-2 p-3 rounded-lg bg-white/5"><span className="px-1.5 py-0.5 bg-red-500/20 text-red-400 text-[10px] font-bold rounded">REMOVED</span><span className="text-sm text-neutral-300">Free Plan entfernt - nur noch Monthly/Lifetime</span></div>
                                </div>
                            </div>

                            {/* v1.2.0 */}
                            <div className="relative pl-8 pb-6 border-l-2 border-white/10">
                                <div className="absolute -left-2 top-0 w-4 h-4 rounded-full bg-white/20 ring-4 ring-white/5" />
                                <div className="flex items-center gap-3 mb-3">
                                    <span className="px-2 py-1 bg-white/10 text-white text-xs font-bold rounded">v1.2.0</span>
                                    <span className="text-sm text-neutral-500">9. Januar 2026</span>
                                </div>
                                <div className="space-y-2">
                                    <div className="flex items-start gap-2 p-3 rounded-lg bg-white/5"><span className="px-1.5 py-0.5 bg-emerald-500/20 text-emerald-400 text-[10px] font-bold rounded">NEW</span><span className="text-sm text-neutral-300">Discord Giveaway System mit Live Entry-Counter</span></div>
                                    <div className="flex items-start gap-2 p-3 rounded-lg bg-white/5"><span className="px-1.5 py-0.5 bg-emerald-500/20 text-emerald-400 text-[10px] font-bold rounded">NEW</span><span className="text-sm text-neutral-300">User Blacklist System für Admins</span></div>
                                    <div className="flex items-start gap-2 p-3 rounded-lg bg-white/5"><span className="px-1.5 py-0.5 bg-emerald-500/20 text-emerald-400 text-[10px] font-bold rounded">NEW</span><span className="text-sm text-neutral-300">Neuer Payment Flow mit automatischer License Delivery</span></div>
                                    <div className="flex items-start gap-2 p-3 rounded-lg bg-white/5"><span className="px-1.5 py-0.5 bg-blue-500/20 text-blue-400 text-[10px] font-bold rounded">IMPROVED</span><span className="text-sm text-neutral-300">Ticket System zeigt jetzt Claim Button für Staff</span></div>
                                    <div className="flex items-start gap-2 p-3 rounded-lg bg-white/5"><span className="px-1.5 py-0.5 bg-amber-500/20 text-amber-400 text-[10px] font-bold rounded">FIXED</span><span className="text-sm text-neutral-300">Doppelter Ping in Ticket Channels behoben</span></div>
                                </div>
                            </div>

                            {/* v1.0.0 */}
                            <div className="relative pl-8 pb-6 border-l-2 border-white/10">
                                <div className="absolute -left-2 top-0 w-4 h-4 rounded-full bg-white/20 ring-4 ring-white/5" />
                                <div className="flex items-center gap-3 mb-3">
                                    <span className="px-2 py-1 bg-white/10 text-white text-xs font-bold rounded">v1.0.0</span>
                                    <span className="text-sm text-neutral-500">1. Januar 2026</span>
                                </div>
                                <div className="space-y-2">
                                    <div className="flex items-start gap-2 p-3 rounded-lg bg-white/5"><span className="px-1.5 py-0.5 bg-emerald-500/20 text-emerald-400 text-[10px] font-bold rounded">NEW</span><span className="text-sm text-neutral-300">Initial Release von Dashy Tweaks</span></div>
                                    <div className="flex items-start gap-2 p-3 rounded-lg bg-white/5"><span className="px-1.5 py-0.5 bg-emerald-500/20 text-emerald-400 text-[10px] font-bold rounded">NEW</span><span className="text-sm text-neutral-300">270+ Windows Optimierungs-Tweaks</span></div>
                                    <div className="flex items-start gap-2 p-3 rounded-lg bg-white/5"><span className="px-1.5 py-0.5 bg-emerald-500/20 text-emerald-400 text-[10px] font-bold rounded">NEW</span><span className="text-sm text-neutral-300">FPS Booster, Input Delay Optimizer, Network Optimizer</span></div>
                                    <div className="flex items-start gap-2 p-3 rounded-lg bg-white/5"><span className="px-1.5 py-0.5 bg-emerald-500/20 text-emerald-400 text-[10px] font-bold rounded">NEW</span><span className="text-sm text-neutral-300">License System mit Discord Integration</span></div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* FAQ Tab */}
                {activeTab === 'faq' && (
                    <div className="p-8 max-w-3xl mx-auto">
                        <div className="mb-8"><h1 className="text-2xl font-bold text-white mb-2">Frequently Asked Questions</h1><p className="text-neutral-500">Find answers to common questions</p></div>
                        <div className="space-y-4">
                            {[
                                { q: 'What is Dashy Tweaks?', a: 'Dashy Tweaks is a Windows optimization tool designed to boost gaming performance. It includes 270+ tweaks for FPS improvement, input delay reduction, network optimization, and more.' },
                                { q: 'Is Dashy Tweaks safe to use?', a: 'Yes! All tweaks are reversible and we only modify Windows settings that are safe to change. We recommend creating a system restore point before applying tweaks.' },
                                { q: 'What\'s the difference between Free and Premium?', a: 'Free users get access to 50+ basic tweaks. Premium unlocks all 270+ tweaks including advanced GPU optimizations, network tweaks, and priority support.' },
                                { q: 'How do I get a license key?', a: 'License keys can be purchased through our Discord server. Join our Discord and open a ticket to purchase.' },
                                { q: 'Can I use my license on multiple PCs?', a: 'Each license is valid for one PC. If you need to transfer your license, contact support on Discord.' },
                                { q: 'How do I apply tweaks?', a: 'Simply download the app, log in with your account, and toggle the tweaks you want to apply. Most tweaks require a restart to take effect.' },
                                { q: 'Will this work on Windows 11?', a: 'Yes! Dashy Tweaks is fully compatible with both Windows 10 and Windows 11.' },
                                { q: 'How do I get support?', a: 'Join our Discord server for support. Premium users get priority support with faster response times.' },
                            ].map((faq, i) => (
                                <div key={i} className="p-5 rounded-xl bg-white/5 border border-white/5">
                                    <h3 className="font-medium text-white mb-2">{faq.q}</h3>
                                    <p className="text-sm text-neutral-400">{faq.a}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Terms of Service Tab */}
                {activeTab === 'terms' && (
                    <div className="p-8 max-w-3xl mx-auto">
                        <div className="mb-8"><h1 className="text-2xl font-bold text-white mb-2">Terms of Service</h1><p className="text-neutral-500">Last updated: January 2026</p></div>
                        <div className="prose prose-invert prose-sm max-w-none space-y-6">
                            <div className="p-6 rounded-xl bg-white/5 border border-white/5">
                                <h3 className="text-lg font-semibold text-white mb-3">1. Acceptance of Terms</h3>
                                <p className="text-neutral-400">By accessing or using Dashy Tweaks, you agree to be bound by these Terms of Service. If you do not agree to these terms, do not use our services.</p>
                            </div>
                            <div className="p-6 rounded-xl bg-white/5 border border-white/5">
                                <h3 className="text-lg font-semibold text-white mb-3">2. License</h3>
                                <p className="text-neutral-400">Upon purchase, you are granted a non-exclusive, non-transferable license to use Dashy Tweaks on one (1) personal computer. This license is for personal use only and may not be shared, resold, or distributed.</p>
                            </div>
                            <div className="p-6 rounded-xl bg-white/5 border border-white/5">
                                <h3 className="text-lg font-semibold text-white mb-3">3. Prohibited Uses</h3>
                                <p className="text-neutral-400">You may not: reverse engineer, decompile, or disassemble the software; share your license key with others; use the software for any illegal purpose; attempt to bypass license verification.</p>
                            </div>
                            <div className="p-6 rounded-xl bg-white/5 border border-white/5">
                                <h3 className="text-lg font-semibold text-white mb-3">4. Disclaimer</h3>
                                <p className="text-neutral-400">Dashy Tweaks is provided "as is" without warranty of any kind. We are not responsible for any damage to your system. Always create a system restore point before applying tweaks.</p>
                            </div>
                            <div className="p-6 rounded-xl bg-white/5 border border-white/5">
                                <h3 className="text-lg font-semibold text-white mb-3">5. Refund Policy</h3>
                                <p className="text-neutral-400">Due to the digital nature of our product, all sales are final. No refunds will be issued after a license key has been redeemed. If you experience issues, contact support for assistance.</p>
                            </div>
                            <div className="p-6 rounded-xl bg-white/5 border border-white/5">
                                <h3 className="text-lg font-semibold text-white mb-3">6. Account Termination</h3>
                                <p className="text-neutral-400">We reserve the right to terminate accounts that violate these terms, including but not limited to: sharing license keys, chargebacks, or abusive behavior towards staff.</p>
                            </div>
                            <div className="p-6 rounded-xl bg-white/5 border border-white/5">
                                <h3 className="text-lg font-semibold text-white mb-3">7. Changes to Terms</h3>
                                <p className="text-neutral-400">We may update these terms at any time. Continued use of Dashy Tweaks after changes constitutes acceptance of the new terms.</p>
                            </div>
                            <div className="p-6 rounded-xl bg-white/5 border border-white/5">
                                <h3 className="text-lg font-semibold text-white mb-3">8. Contact</h3>
                                <p className="text-neutral-400">For questions about these terms, contact us on Discord or via email at support@dashytweaks.com</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Settings Tab */}
                {activeTab === 'settings' && (
                    <div className="p-8 max-w-3xl mx-auto">
                        <div className="mb-8"><h1 className="text-2xl font-bold text-white mb-2">Settings</h1><p className="text-neutral-500">Manage your account settings</p></div>
                        <div className="rounded-2xl bg-white/5 border border-white/5 overflow-hidden mb-6">
                            <div className="px-6 py-4 border-b border-white/5 flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center"><svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg></div>
                                <h3 className="font-semibold text-white">Profile Information</h3>
                            </div>
                            <div className="p-6 space-y-5">
                                <div><label className="block text-sm text-neutral-400 mb-2">Username</label><input type="text" value={profile?.username || user?.user_metadata?.username || ''} readOnly className="w-full px-4 py-3 bg-black/30 border border-white/10 rounded-xl text-white" /></div>
                                <div><label className="block text-sm text-neutral-400 mb-2">Email</label><input type="email" value={user?.email || ''} readOnly className="w-full px-4 py-3 bg-black/30 border border-white/10 rounded-xl text-white" /></div>
                            </div>
                        </div>
                        <div className="rounded-2xl bg-white/5 border border-white/5 overflow-hidden mb-6">
                            <div className="px-6 py-4 border-b border-white/5 flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-[#5865F2]/10 flex items-center justify-center"><DiscordIcon className="w-4 h-4 text-[#5865F2]" /></div>
                                <h3 className="font-semibold text-white">Discord Connection</h3>
                            </div>
                            <div className="p-6">
                                {discordLinked ? (
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-4">
                                                {discordLinked.avatar ? <img src={discordLinked.avatar} className="w-14 h-14 rounded-full ring-2 ring-[#5865F2]/30" alt="" /> : <div className="w-14 h-14 rounded-full bg-[#5865F2]/20 flex items-center justify-center"><DiscordIcon className="w-7 h-7 text-[#5865F2]" /></div>}
                                                <div><p className="font-medium text-white">{discordLinked.username || 'Discord User'}</p><p className="text-sm text-neutral-500">Discord Connected</p></div>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <span className="px-3 py-1.5 rounded-full text-xs font-medium bg-emerald-500/20 text-emerald-400">Connected</span>
                                                <button onClick={handleUnlinkDiscord} disabled={unlinkingDiscord} className="px-4 py-2 text-sm text-red-400 hover:bg-red-500/10 rounded-xl transition">{unlinkingDiscord ? '...' : 'Disconnect'}</button>
                                            </div>
                                        </div>
                                        <div className="flex gap-3 pt-2 border-t border-white/5">
                                            <button onClick={handleSyncDiscordRole} disabled={syncingRole} className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-[#5865F2]/10 hover:bg-[#5865F2]/20 text-[#5865F2] rounded-xl text-sm font-medium transition">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                                                {syncingRole ? 'Syncing...' : 'Sync Role'}
                                            </button>
                                            <button onClick={handleUpdateDiscordProfile} disabled={updatingProfile} className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-white/5 hover:bg-white/10 text-white rounded-xl text-sm font-medium transition">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                                                {updatingProfile ? 'Updating...' : 'Update Profile'}
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className="w-14 h-14 rounded-full bg-[#5865F2]/10 flex items-center justify-center"><DiscordIcon className="w-7 h-7 text-[#5865F2]/50" /></div>
                                            <div><p className="font-medium text-white">Discord</p><p className="text-sm text-neutral-500">Not connected</p></div>
                                        </div>
                                        <button onClick={handleLinkDiscord} disabled={linkingDiscord} className="flex items-center gap-2 px-5 py-3 bg-[#5865F2] hover:bg-[#4752C4] rounded-xl font-medium text-white transition"><DiscordIcon className="w-5 h-5" />{linkingDiscord ? 'Connecting...' : 'Link Discord'}</button>
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="rounded-2xl bg-white/5 border border-white/5 overflow-hidden">
                            <div className="px-6 py-4 border-b border-white/5 flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center"><svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg></div>
                                <h3 className="font-semibold text-white">Account Information</h3>
                            </div>
                            <div className="p-6 grid grid-cols-2 gap-6">
                                <div><p className="text-sm text-neutral-500 mb-1">Member Since</p><p className="text-white font-medium">{profile?.created_at ? new Date(profile.created_at).toLocaleDateString('de-DE') : '-'}</p></div>
                                <div><p className="text-sm text-neutral-500 mb-1">Subscription</p><p className={`font-medium ${isPremium ? 'text-emerald-400' : 'text-neutral-400'}`}>{isPremium ? (license?.expires_at ? `${Math.max(0, Math.ceil((new Date(license.expires_at).getTime() - Date.now()) / (1000 * 60 * 60 * 24)))} days left` : 'Lifetime') : 'No Plan'}</p></div>
                                {license && (<><div><p className="text-sm text-neutral-500 mb-1">License Type</p><p className="text-white font-medium">{license.plan === 'lifetime' ? 'Lifetime' : 'Subscription'}</p></div><div><p className="text-sm text-neutral-500 mb-1">Expires</p><p className="text-white font-medium">{license.expires_at ? new Date(license.expires_at).toLocaleDateString('de-DE') : 'Never'}</p></div></>)}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
