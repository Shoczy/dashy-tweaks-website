import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Home() {
    const { user } = useAuth()

    return (
        <div className="relative">
            {/* Hero Section */}
            <section className="min-h-[90vh] flex items-center justify-center relative overflow-hidden">
                {/* Background Effects */}
                <div className="absolute inset-0 bg-gradient-to-b from-emerald-500/5 via-transparent to-transparent"></div>
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl"></div>
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>

                <div className="relative z-10 text-center px-6 max-w-5xl mx-auto">
                    {/* Badge */}
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-sm text-emerald-400 mb-8">
                        <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></span>
                        270+ Professional Tweaks
                    </div>

                    {/* Title */}
                    <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
                        Optimize Your
                        <span className="block bg-gradient-to-r from-emerald-400 to-emerald-600 bg-clip-text text-transparent">
                            Gaming Performance
                        </span>
                    </h1>

                    {/* Subtitle */}
                    <p className="text-xl text-neutral-400 max-w-2xl mx-auto mb-10">
                        The ultimate Windows optimization tool. Boost FPS, reduce input delay,
                        and unlock your system's full potential with one click.
                    </p>

                    {/* CTA Buttons */}
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link
                            to="/download"
                            className="px-8 py-4 bg-emerald-500 hover:bg-emerald-400 rounded-xl font-semibold text-lg transition flex items-center gap-3 group"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                            </svg>
                            Download Free
                            <span className="text-emerald-200 text-sm">v1.0.0</span>
                        </Link>
                        {user ? (
                            <Link to="/dashboard" className="px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl font-semibold text-lg transition">
                                Open Dashboard
                            </Link>
                        ) : (
                            <Link to="/login" className="px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl font-semibold text-lg transition">
                                Sign In
                            </Link>
                        )}
                    </div>

                    {/* Stats */}
                    <div className="flex items-center justify-center gap-8 mt-16 text-sm">
                        <div className="text-center">
                            <p className="text-2xl font-bold text-emerald-400">270+</p>
                            <p className="text-neutral-500">Tweaks</p>
                        </div>
                        <div className="w-px h-10 bg-white/10"></div>
                        <div className="text-center">
                            <p className="text-2xl font-bold text-emerald-400">10K+</p>
                            <p className="text-neutral-500">Users</p>
                        </div>
                        <div className="w-px h-10 bg-white/10"></div>
                        <div className="text-center">
                            <p className="text-2xl font-bold text-emerald-400">+30%</p>
                            <p className="text-neutral-500">FPS Boost</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-24 px-6">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">Everything You Need</h2>
                        <p className="text-neutral-400 max-w-xl mx-auto">Professional-grade optimizations for competitive gaming</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6">
                        {[
                            { icon: '⚡', title: 'FPS Boost', desc: 'Disable Game DVR, FSO, VBS and more for maximum frames', color: 'emerald' },
                            { icon: '🎯', title: 'Input Delay', desc: 'Reduce mouse and keyboard latency for faster reactions', color: 'purple' },
                            { icon: '🌐', title: 'Network', desc: 'Optimize TCP/IP settings for lower ping in online games', color: 'blue' },
                            { icon: '💾', title: 'Memory', desc: 'Clean RAM, disable services, optimize page file', color: 'orange' },
                            { icon: '🖥️', title: 'GPU Tweaks', desc: 'NVIDIA, AMD & Intel specific optimizations', color: 'red' },
                            { icon: '🔧', title: 'System', desc: 'Debloat Windows, manage startup, clean temp files', color: 'cyan' },
                        ].map((f, i) => (
                            <div key={i} className="glass-card rounded-2xl p-6 hover:bg-white/5 transition group">
                                <div className={`w-12 h-12 rounded-xl bg-${f.color}-500/10 flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition`}>
                                    {f.icon}
                                </div>
                                <h3 className="text-lg font-semibold mb-2">{f.title}</h3>
                                <p className="text-neutral-500 text-sm">{f.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* How It Works */}
            <section className="py-24 px-6 bg-gradient-to-b from-transparent via-emerald-500/5 to-transparent">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">How It Works</h2>
                        <p className="text-neutral-400">Get started in under a minute</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            { step: '01', title: 'Download', desc: 'Get the app for free from our website' },
                            { step: '02', title: 'Select Tweaks', desc: 'Choose which optimizations to apply' },
                            { step: '03', title: 'Enjoy', desc: 'Experience better gaming performance' },
                        ].map((s, i) => (
                            <div key={i} className="text-center">
                                <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto mb-4">
                                    <span className="text-emerald-400 font-bold">{s.step}</span>
                                </div>
                                <h3 className="text-lg font-semibold mb-2">{s.title}</h3>
                                <p className="text-neutral-500 text-sm">{s.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Pricing Preview */}
            <section className="py-24 px-6">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">Simple Pricing</h2>
                        <p className="text-neutral-400">Start free, upgrade when you need more</p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                        {/* Free */}
                        <div className="glass-card rounded-2xl p-8">
                            <h3 className="text-xl font-semibold mb-2">Free</h3>
                            <p className="text-neutral-500 text-sm mb-6">Basic optimizations</p>
                            <p className="text-4xl font-bold mb-6">€0</p>
                            <ul className="space-y-3 mb-8">
                                {['50+ Basic Tweaks', 'FPS Optimization', 'Memory Cleanup', 'Community Support'].map((f, i) => (
                                    <li key={i} className="flex items-center gap-3 text-sm text-neutral-400">
                                        <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                        </svg>
                                        {f}
                                    </li>
                                ))}
                            </ul>
                            <Link to="/download" className="block w-full py-3 text-center bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl font-medium transition">
                                Download Free
                            </Link>
                        </div>

                        {/* Premium */}
                        <div className="glass-card rounded-2xl p-8 border border-emerald-500/30 bg-emerald-500/5 relative">
                            <div className="absolute -top-3 right-6 px-3 py-1 bg-emerald-500 rounded-full text-xs font-medium">
                                Popular
                            </div>
                            <h3 className="text-xl font-semibold mb-2">Premium</h3>
                            <p className="text-neutral-500 text-sm mb-6">Full access forever</p>
                            <p className="text-4xl font-bold mb-6">€15 <span className="text-lg text-neutral-500 font-normal">lifetime</span></p>
                            <ul className="space-y-3 mb-8">
                                {['270+ Premium Tweaks', 'Advanced GPU Tweaks', 'Security Optimizations', 'Priority Support', 'Future Updates'].map((f, i) => (
                                    <li key={i} className="flex items-center gap-3 text-sm">
                                        <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                        </svg>
                                        {f}
                                    </li>
                                ))}
                            </ul>
                            <a href="https://discord.gg/cXxFzBuG" target="_blank" className="block w-full py-3 text-center bg-emerald-500 hover:bg-emerald-400 rounded-xl font-medium transition">
                                Get Premium
                            </a>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24 px-6">
                <div className="max-w-3xl mx-auto text-center">
                    <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Boost Your FPS?</h2>
                    <p className="text-neutral-400 mb-8">Join thousands of gamers who already optimized their systems</p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link to="/download" className="px-8 py-4 bg-emerald-500 hover:bg-emerald-400 rounded-xl font-semibold transition flex items-center gap-2">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                            </svg>
                            Download Now
                        </Link>
                        <a href="https://discord.gg/cXxFzBuG" target="_blank" className="px-8 py-4 bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-400 rounded-xl font-semibold transition flex items-center gap-2">
                            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128c.126-.094.252-.192.372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z" />
                            </svg>
                            Join Discord
                        </a>
                    </div>
                </div>
            </section>
        </div>
    )
}
