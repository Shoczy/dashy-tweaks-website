import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'

const DISCORD = 'https://discord.gg/cXxFzBuG'

export default function Home() {
    const { user } = useAuth()
    const navigate = useNavigate()

    const handleGetStarted = () => {
        window.open(DISCORD, '_blank')
    }

    return (
        <div className="relative">
            {/* Hero */}
            <section className="min-h-[85vh] flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-emerald-500/5 via-transparent to-transparent" />
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl" />
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />

                <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-sm text-emerald-400 mb-8">
                        <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                        270+ Professional Tweaks
                    </div>

                    <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
                        Optimize Your
                        <span className="block bg-gradient-to-r from-emerald-400 to-emerald-600 bg-clip-text text-transparent">
                            Gaming Performance
                        </span>
                    </h1>

                    <p className="text-xl text-neutral-400 max-w-2xl mx-auto mb-10">
                        The ultimate Windows optimization tool. Boost FPS, reduce input delay,
                        and unlock your system's full potential.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <button
                            onClick={handleGetStarted}
                            className="px-8 py-4 bg-emerald-500 hover:bg-emerald-400 rounded-xl font-semibold text-lg transition flex items-center gap-3"
                        >
                            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128c.126-.094.252-.192.372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z" />
                            </svg>
                            Get License on Discord
                        </button>
                        {user && (
                            <button
                                onClick={() => navigate('/dashboard')}
                                className="px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl font-semibold text-lg transition"
                            >
                                Open Dashboard
                            </button>
                        )}
                    </div>

                    <div className="flex items-center justify-center gap-8 mt-16 text-sm">
                        <div className="text-center">
                            <p className="text-2xl font-bold text-emerald-400">270+</p>
                            <p className="text-neutral-500">Tweaks</p>
                        </div>
                        <div className="w-px h-10 bg-white/10" />
                        <div className="text-center">
                            <p className="text-2xl font-bold text-emerald-400">10K+</p>
                            <p className="text-neutral-500">Users</p>
                        </div>
                        <div className="w-px h-10 bg-white/10" />
                        <div className="text-center">
                            <p className="text-2xl font-bold text-emerald-400">+30%</p>
                            <p className="text-neutral-500">FPS Boost</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features */}
            <section className="py-24 px-6">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">Everything You Need</h2>
                        <p className="text-neutral-400">Professional-grade optimizations for competitive gaming</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6">
                        {[
                            { icon: '⚡', title: 'FPS Boost', desc: 'Disable Game DVR, FSO, VBS and more' },
                            { icon: '🎯', title: 'Input Delay', desc: 'Reduce mouse and keyboard latency' },
                            { icon: '🌐', title: 'Network', desc: 'Optimize TCP/IP for lower ping' },
                            { icon: '💾', title: 'Memory', desc: 'Clean RAM, optimize page file' },
                            { icon: '🖥️', title: 'GPU Tweaks', desc: 'NVIDIA, AMD & Intel optimizations' },
                            { icon: '🔧', title: 'System', desc: 'Debloat Windows, manage startup' },
                        ].map((f, i) => (
                            <div key={i} className="glass-card rounded-2xl p-6 hover:bg-white/5 transition">
                                <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center text-2xl mb-4">
                                    {f.icon}
                                </div>
                                <h3 className="text-lg font-semibold mb-2">{f.title}</h3>
                                <p className="text-neutral-500 text-sm">{f.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Pricing - Single Premium Plan */}
            <section className="py-24 px-6 bg-gradient-to-b from-transparent via-emerald-500/5 to-transparent">
                <div className="max-w-xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">One Plan, Full Access</h2>
                        <p className="text-neutral-400">Get lifetime access to all 270+ tweaks</p>
                    </div>

                    <div className="glass-card rounded-2xl p-8 border border-emerald-500/30 bg-emerald-500/5 relative">
                        <div className="absolute -top-3 right-6 px-3 py-1 bg-emerald-500 rounded-full text-xs font-medium">Lifetime</div>
                        <h3 className="text-xl font-semibold mb-2">Premium</h3>
                        <p className="text-4xl font-bold mb-6">€15 <span className="text-lg text-neutral-500 font-normal">one-time</span></p>
                        <ul className="space-y-3 mb-8 text-sm">
                            <li className="text-emerald-400">✓ 270+ Premium Tweaks</li>
                            <li className="text-emerald-400">✓ Game-specific Templates</li>
                            <li className="text-emerald-400">✓ Advanced GPU Tweaks</li>
                            <li className="text-emerald-400">✓ Priority Discord Support</li>
                            <li className="text-emerald-400">✓ All Future Updates</li>
                        </ul>
                        <a href={DISCORD} target="_blank" className="flex items-center justify-center gap-3 w-full py-3 text-center bg-emerald-500 hover:bg-emerald-400 rounded-xl font-medium transition">
                            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128c.126-.094.252-.192.372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z" />
                            </svg>
                            Purchase on Discord
                        </a>
                        <p className="text-center text-xs text-neutral-500 mt-4">
                            Open a ticket • PayPal, Crypto & more • Instant delivery
                        </p>
                    </div>
                </div>
            </section>

            {/* How it works */}
            <section className="py-24 px-6">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">How to Get Started</h2>
                        <p className="text-neutral-400">Simple 3-step process</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="text-center">
                            <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xl font-bold mx-auto mb-4">1</div>
                            <h3 className="font-semibold mb-2">Join Discord</h3>
                            <p className="text-neutral-500 text-sm">Join our Discord server and open a purchase ticket</p>
                        </div>
                        <div className="text-center">
                            <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xl font-bold mx-auto mb-4">2</div>
                            <h3 className="font-semibold mb-2">Get Your Key</h3>
                            <p className="text-neutral-500 text-sm">Complete payment and receive your license key instantly</p>
                        </div>
                        <div className="text-center">
                            <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xl font-bold mx-auto mb-4">3</div>
                            <h3 className="font-semibold mb-2">Start Tweaking</h3>
                            <p className="text-neutral-500 text-sm">Download the app, login, and boost your FPS</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-24 px-6">
                <div className="max-w-3xl mx-auto text-center">
                    <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Boost Your FPS?</h2>
                    <p className="text-neutral-400 mb-8">Join thousands of gamers who already optimized their systems</p>
                    <a href={DISCORD} target="_blank" className="inline-flex items-center gap-3 px-8 py-4 bg-emerald-500 hover:bg-emerald-400 rounded-xl font-semibold transition">
                        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128c.126-.094.252-.192.372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z" />
                        </svg>
                        Join Discord & Get Started
                    </a>
                </div>
            </section>
        </div>
    )
}
