import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { signIn, signUp } from '../lib/supabase'
import { useNavigate, Link } from 'react-router-dom'

const DISCORD = 'https://discord.gg/cXxFzBuG'

export default function Home() {
    const { user } = useAuth()
    const navigate = useNavigate()
    const [loginOpen, setLoginOpen] = useState(false)

    const handleGetStarted = () => {
        if (user) {
            navigate('/dashboard')
        } else {
            setLoginOpen(true)
        }
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

                    <button
                        onClick={handleGetStarted}
                        className="px-8 py-4 bg-emerald-500 hover:bg-emerald-400 rounded-xl font-semibold text-lg transition"
                    >
                        {user ? 'Open Dashboard' : 'Get Started Free'}
                    </button>

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

            {/* Pricing */}
            <section className="py-24 px-6 bg-gradient-to-b from-transparent via-emerald-500/5 to-transparent">
                <div className="max-w-3xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">Simple Pricing</h2>
                        <p className="text-neutral-400">Start free, upgrade when you need more</p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="glass-card rounded-2xl p-8">
                            <h3 className="text-xl font-semibold mb-2">Free</h3>
                            <p className="text-4xl font-bold mb-6">€0</p>
                            <ul className="space-y-3 mb-8 text-sm text-neutral-400">
                                <li>✓ 50+ Basic Tweaks</li>
                                <li>✓ FPS Optimization</li>
                                <li>✓ Memory Cleanup</li>
                            </ul>
                            <button onClick={handleGetStarted} className="w-full py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl font-medium transition">
                                Get Started
                            </button>
                        </div>

                        <div className="glass-card rounded-2xl p-8 border border-emerald-500/30 bg-emerald-500/5 relative">
                            <div className="absolute -top-3 right-6 px-3 py-1 bg-emerald-500 rounded-full text-xs font-medium">Popular</div>
                            <h3 className="text-xl font-semibold mb-2">Premium</h3>
                            <p className="text-4xl font-bold mb-6">€15 <span className="text-lg text-neutral-500 font-normal">lifetime</span></p>
                            <ul className="space-y-3 mb-8 text-sm">
                                <li className="text-emerald-400">✓ 270+ Premium Tweaks</li>
                                <li className="text-emerald-400">✓ Advanced GPU Tweaks</li>
                                <li className="text-emerald-400">✓ Priority Support</li>
                            </ul>
                            <a href={DISCORD} target="_blank" className="block w-full py-3 text-center bg-emerald-500 hover:bg-emerald-400 rounded-xl font-medium transition">
                                Get Premium
                            </a>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-24 px-6">
                <div className="max-w-3xl mx-auto text-center">
                    <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Boost Your FPS?</h2>
                    <p className="text-neutral-400 mb-8">Join thousands of gamers who already optimized their systems</p>
                    <button onClick={handleGetStarted} className="px-8 py-4 bg-emerald-500 hover:bg-emerald-400 rounded-xl font-semibold transition">
                        {user ? 'Open Dashboard' : 'Get Started Free'}
                    </button>
                </div>
            </section>

            {/* Login Modal */}
            {loginOpen && <LoginModal onClose={() => setLoginOpen(false)} />}
        </div>
    )
}


function LoginModal({ onClose }: { onClose: () => void }) {
    const [isLogin, setIsLogin] = useState(true)
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [username, setUsername] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const navigate = useNavigate()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError('')

        try {
            if (isLogin) {
                const { error } = await signIn(email, password)
                if (error) throw error
                onClose()
                navigate('/dashboard')
            } else {
                const { error } = await signUp(email, password, username)
                if (error) throw error
                const { error: loginError } = await signIn(email, password)
                if (loginError) throw loginError
                onClose()
                navigate('/dashboard')
            }
        } catch (e: any) {
            setError(e.message || 'Authentication failed')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-fadeIn">
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
            <div className="relative glass-card rounded-3xl p-8 w-full max-w-md glow-green animate-slideUp">
                <button onClick={onClose} className="absolute top-6 right-6 text-neutral-500 hover:text-white transition">
                    <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 18L18 6M6 6l12 12" /></svg>
                </button>

                <div className="text-center mb-8">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center font-bold text-xl mx-auto mb-4">DT</div>
                    <h2 className="text-2xl font-bold mb-2">{isLogin ? 'Welcome back' : 'Create account'}</h2>
                    <p className="text-neutral-500">{isLogin ? 'Sign in to your account' : 'Get started with Dashy Tweaks'}</p>
                </div>

                {error && <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-sm text-red-400">{error}</div>}

                <form onSubmit={handleSubmit} className="space-y-4">
                    {!isLogin && (
                        <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} className="w-full h-12 px-4 bg-white/5 border border-white/10 rounded-xl focus:border-emerald-500 focus:outline-none transition" required />
                    )}
                    <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full h-12 px-4 bg-white/5 border border-white/10 rounded-xl focus:border-emerald-500 focus:outline-none transition" required />
                    <div className="relative">
                        <input type={showPassword ? 'text' : 'password'} placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full h-12 px-4 pr-12 bg-white/5 border border-white/10 rounded-xl focus:border-emerald-500 focus:outline-none transition" required minLength={6} />
                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-white">
                            {showPassword ? '👁️' : '👁️‍🗨️'}
                        </button>
                    </div>
                    <button type="submit" disabled={loading} className="w-full h-12 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 rounded-xl font-medium transition">
                        {loading ? 'Please wait...' : (isLogin ? 'Sign In' : 'Create Account')}
                    </button>
                </form>

                <p className="text-sm text-neutral-500 text-center mt-6">
                    {isLogin ? "Don't have an account? " : "Already have an account? "}
                    <button onClick={() => setIsLogin(!isLogin)} className="text-emerald-400 hover:underline">{isLogin ? 'Sign up' : 'Sign in'}</button>
                </p>

                <p className="text-xs text-neutral-600 text-center mt-4">
                    By signing in, you agree to our <Link to="/terms" className="text-emerald-400 hover:underline" onClick={onClose}>Terms</Link> and <Link to="/privacy" className="text-emerald-400 hover:underline" onClick={onClose}>Privacy Policy</Link>
                </p>
            </div>
        </div>
    )
}
