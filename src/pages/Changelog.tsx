import { Link } from 'react-router-dom'

const changelog = [
    {
        version: '1.3.0',
        date: '2026-01-10',
        type: 'major',
        changes: [
            { type: 'new', text: '24 Game Templates with optimized tweak presets' },
            { type: 'new', text: 'Template filtering on all tweak pages (FPS, Input, Network, GPU, Mouse)' },
            { type: 'new', text: 'Remember Me login option with auto-login' },
            { type: 'improved', text: 'Expanded templates from 25 to 140 tweaks per game' },
            { type: 'improved', text: 'Website now Discord-only purchase flow' },
            { type: 'improved', text: 'Pricing page simplified to single Premium plan' },
            { type: 'removed', text: 'Removed Free plan - Premium only' },
        ]
    },
    {
        version: '1.2.0',
        date: '2026-01-09',
        type: 'major',
        changes: [
            { type: 'new', text: 'Added Discord Giveaway System with live entry counter' },
            { type: 'new', text: 'Added User Blacklist System for admins' },
            { type: 'new', text: 'New Payment Flow with automatic license delivery' },
            { type: 'improved', text: 'Ticket system now shows claim button for staff' },
            { type: 'improved', text: 'License info now shows who redeemed the key' },
            { type: 'fixed', text: 'Fixed double ping in ticket channels' },
        ]
    },
    {
        version: '1.1.0',
        date: '2026-01-08',
        type: 'major',
        changes: [
            { type: 'new', text: 'Discord Bot with Components v2 design' },
            { type: 'new', text: 'Ticket System for purchases and support' },
            { type: 'new', text: 'HWID Reset request system' },
            { type: 'improved', text: 'Dashboard redesign with new sidebar' },
            { type: 'improved', text: 'Better license management' },
        ]
    },
    {
        version: '1.0.0',
        date: '2026-01-01',
        type: 'major',
        changes: [
            { type: 'new', text: 'Initial release of Dashy Tweaks' },
            { type: 'new', text: '270+ Windows optimization tweaks' },
            { type: 'new', text: 'FPS Booster, Input Delay Optimizer' },
            { type: 'new', text: 'Network Optimizer, GPU Tweaks' },
            { type: 'new', text: 'License system with Discord integration' },
        ]
    },
]

const typeColors = {
    new: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    improved: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    fixed: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    removed: 'bg-red-500/20 text-red-400 border-red-500/30',
}

const typeLabels = {
    new: 'NEW',
    improved: 'IMPROVED',
    fixed: 'FIXED',
    removed: 'REMOVED',
}

export default function Changelog() {
    return (
        <div className="min-h-screen bg-zinc-950">
            {/* Background effects */}
            <div className="fixed top-0 left-1/4 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none" />
            <div className="fixed bottom-0 right-1/4 w-[400px] h-[400px] bg-emerald-500/5 rounded-full blur-[100px] pointer-events-none" />

            {/* Header */}
            <header className="relative z-10 border-b border-white/5 bg-black/40 backdrop-blur-xl">
                <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
                    <Link to="/" className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center">
                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                        </div>
                        <span className="font-bold text-lg text-white">DASHY</span>
                    </Link>
                    <Link to="/dashboard" className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 rounded-lg text-sm font-medium text-white transition">
                        Dashboard
                    </Link>
                </div>
            </header>

            {/* Content */}
            <main className="relative z-10 max-w-3xl mx-auto px-6 py-16">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-white mb-4">Changelog</h1>
                    <p className="text-neutral-400">Stay up to date with the latest updates and improvements</p>
                </div>

                <div className="space-y-8">
                    {changelog.map((release, i) => (
                        <div key={i} className="relative">
                            {/* Timeline line */}
                            {i < changelog.length - 1 && (
                                <div className="absolute left-[19px] top-12 bottom-0 w-px bg-white/10" />
                            )}

                            <div className="flex gap-6">
                                {/* Version badge */}
                                <div className="flex-shrink-0">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${release.type === 'major' ? 'bg-emerald-500/20 ring-2 ring-emerald-500/30' : 'bg-white/10'}`}>
                                        <span className="text-xs font-bold text-emerald-400">
                                            {release.version.split('.')[0]}.{release.version.split('.')[1]}
                                        </span>
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="flex-1 pb-8">
                                    <div className="flex items-center gap-3 mb-4">
                                        <h2 className="text-xl font-bold text-white">v{release.version}</h2>
                                        <span className="text-sm text-neutral-500">
                                            {new Date(release.date).toLocaleDateString('de-DE', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric'
                                            })}
                                        </span>
                                    </div>

                                    <div className="space-y-2">
                                        {release.changes.map((change, j) => (
                                            <div key={j} className="flex items-start gap-3 p-3 rounded-lg bg-white/5 border border-white/5">
                                                <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${typeColors[change.type as keyof typeof typeColors]}`}>
                                                    {typeLabels[change.type as keyof typeof typeLabels]}
                                                </span>
                                                <span className="text-sm text-neutral-300">{change.text}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </main>
        </div>
    )
}
