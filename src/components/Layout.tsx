import { useState } from 'react'
import { Link, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { signIn, signUp } from '../lib/supabase'

const DISCORD = 'https://discord.gg/cXxFzBuG'

export default function Layout() {
    const [menuOpen, setMenuOpen] = useState(false)
    const [loginOpen, setLoginOpen] = useState(false)
    const location = useLocation()
    const { user } = useAuth()

    return (
        <div className="min-h-screen">
            {/* Navbar */}
            <nav className="fixed top-0 left-0 right-0 z-50">
                <div className="max-w-6xl mx-auto px-6 py-4">
                    <div className="glass-card rounded-2xl px-6 py-3 flex items-center justify-between">
                        <Link to="/" className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center font-bold text-sm">
                                DT
                            </div>
                            <span className="font-semibold hidden sm:block">Dashy Tweaks</span>
                        </Link>

                        <div className="flex items-center gap-3">
                            {user ? (
                                <Link
                                    to="/dashboard"
                                    className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-sm font-medium rounded-xl transition flex items-center gap-2"
                                >
                                    <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-xs">
                                        {user.email?.[0]?.toUpperCase()}
                                    </div>
                                    Dashboard
                                </Link>
                            ) : (
                                <button
                                    onClick={() => setLoginOpen(true)}
                                    className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-sm font-medium rounded-xl transition"
                                >
                                    Sign In
                                </button>
                            )}
                            <button
                                onClick={() => setMenuOpen(!menuOpen)}
                                className="md:hidden p-2 text-neutral-400"
                            >
                                <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
                                    {menuOpen ? <path d="M6 18L18 6M6 6l12 12" /> : <path d="M4 6h16M4 12h16M4 18h16" />}
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile Menu */}
                {menuOpen && (
                    <div className="md:hidden glass-card mx-6 mt-2 rounded-2xl p-4 animate-fadeIn">
                        <Link to="/" className="block py-3 text-neutral-400 hover:text-white" onClick={() => setMenuOpen(false)}>Home</Link>
                        {user ? (
                            <Link to="/dashboard" className="block py-3 text-emerald-400 hover:text-emerald-300" onClick={() => setMenuOpen(false)}>Dashboard</Link>
                        ) : (
                            <button onClick={() => { setLoginOpen(true); setMenuOpen(false); }} className="block py-3 text-emerald-400 hover:text-emerald-300 w-full text-left">Sign In</button>
                        )}
                    </div>
                )}
            </nav>

            {/* Main Content */}
            <main className="pt-24">
                <Outlet />
            </main>

            {/* Footer */}
            <footer className="border-t border-neutral-900 mt-32">
                <div className="max-w-6xl mx-auto px-6 py-12">
                    <div className="flex flex-col md:flex-row justify-between items-start gap-8 mb-8">
                        <div>
                            <div className="flex items-center gap-3 mb-3">
                                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center font-bold text-xs">DT</div>
                                <span className="font-semibold">Dashy Tweaks</span>
                            </div>
                            <p className="text-sm text-neutral-500 max-w-xs">Windows optimization for competitive gamers.</p>
                        </div>
                        <div className="flex gap-12">
                            <div>
                                <h4 className="font-medium mb-3 text-sm">Legal</h4>
                                <div className="space-y-2 text-sm text-neutral-500">
                                    <Link to="/privacy" className="block hover:text-white transition">Privacy</Link>
                                    <Link to="/terms" className="block hover:text-white transition">Terms</Link>
                                    <Link to="/impressum" className="block hover:text-white transition">Impressum</Link>
                                </div>
                            </div>
                            <div>
                                <h4 className="font-medium mb-3 text-sm">Community</h4>
                                <a href={DISCORD} target="_blank" className="flex items-center gap-2 text-sm text-neutral-500 hover:text-white transition">
                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z" /></svg>
                                    Discord
                                </a>
                            </div>
                        </div>
                    </div>
                    <div className="pt-6 border-t border-neutral-900 text-center">
                        <span className="text-xs text-neutral-600">© 2025 Dashy Tweaks</span>
                    </div>
                </div>
            </footer>

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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError('')

        try {
            if (isLogin) {
                const { error } = await signIn(email, password)
                if (error) throw error
                onClose()
            } else {
                const { error } = await signUp(email, password, username)
                if (error) throw error
                setError('')
                setIsLogin(true)
                alert('Account created! You can now sign in.')
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
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center font-bold text-xl mx-auto mb-4">
                        DT
                    </div>
                    <h2 className="text-2xl font-bold mb-2">{isLogin ? 'Welcome back' : 'Create account'}</h2>
                    <p className="text-neutral-500">{isLogin ? 'Sign in to your account' : 'Get started with Dashy Tweaks'}</p>
                </div>

                {error && (
                    <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-sm text-red-400">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    {!isLogin && (
                        <input
                            type="text"
                            placeholder="Username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full h-12 px-4 bg-white/5 border border-white/10 rounded-xl focus:border-emerald-500 focus:outline-none transition"
                            required
                        />
                    )}
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full h-12 px-4 bg-white/5 border border-white/10 rounded-xl focus:border-emerald-500 focus:outline-none transition"
                        required
                    />
                    <div className="relative">
                        <input
                            type={showPassword ? 'text' : 'password'}
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full h-12 px-4 pr-12 bg-white/5 border border-white/10 rounded-xl focus:border-emerald-500 focus:outline-none transition"
                            required
                            minLength={6}
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-white transition"
                        >
                            {showPassword ? (
                                <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                </svg>
                            ) : (
                                <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                </svg>
                            )}
                        </button>
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full h-12 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 rounded-xl font-medium transition"
                    >
                        {loading ? 'Please wait...' : (isLogin ? 'Sign In' : 'Create Account')}
                    </button>
                </form>

                <p className="text-sm text-neutral-500 text-center mt-6">
                    {isLogin ? "Don't have an account? " : "Already have an account? "}
                    <button onClick={() => setIsLogin(!isLogin)} className="text-emerald-400 hover:underline">
                        {isLogin ? 'Sign up' : 'Sign in'}
                    </button>
                </p>

                <p className="text-xs text-neutral-600 text-center mt-4">
                    By signing in, you agree to our <Link to="/terms" className="text-emerald-400 hover:underline" onClick={onClose}>Terms</Link> and <Link to="/privacy" className="text-emerald-400 hover:underline" onClick={onClose}>Privacy Policy</Link>
                </p>
            </div>
        </div>
    )
}
