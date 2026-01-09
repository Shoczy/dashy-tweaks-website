import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { signIn, signUp } from '../lib/supabase'

export default function Login() {
    const [isLogin, setIsLogin] = useState(true)
    const [email, setEmail] = useState('')
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')
    const navigate = useNavigate()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError('')
        setSuccess('')

        if (isLogin) {
            const { error } = await signIn(email, password)
            if (error) {
                setError(error.message)
            } else {
                navigate('/dashboard')
            }
        } else {
            if (!username.trim()) {
                setError('Username is required')
                setLoading(false)
                return
            }
            if (password.length < 6) {
                setError('Password must be at least 6 characters')
                setLoading(false)
                return
            }

            const { error } = await signUp(email, password, username)
            if (error) {
                setError(error.message)
            } else {
                setSuccess('Account created! Check your email to verify.')
            }
        }

        setLoading(false)
    }

    return (
        <div className="min-h-[80vh] flex items-center justify-center px-6">
            <div className="w-full max-w-md">
                {/* Logo */}
                <div className="text-center mb-10">
                    <Link to="/" className="inline-flex items-center gap-3 mb-6">
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center">
                            <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                        </div>
                        <span className="text-2xl font-bold">DASHY</span>
                    </Link>
                    <h1 className="text-2xl font-bold">{isLogin ? 'Welcome back' : 'Create account'}</h1>
                    <p className="text-neutral-500 mt-2">
                        {isLogin ? 'Sign in to your account' : 'Get started with Dashy Tweaks'}
                    </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="glass-card rounded-2xl p-8 space-y-5">
                    {!isLogin && (
                        <div>
                            <label className="block text-sm font-medium text-neutral-400 mb-2">Username</label>
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                placeholder="shoczy"
                                className="w-full px-4 py-3 bg-black/30 border border-white/10 rounded-xl focus:outline-none focus:border-emerald-500/50 transition"
                            />
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-medium text-neutral-400 mb-2">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="you@example.com"
                            className="w-full px-4 py-3 bg-black/30 border border-white/10 rounded-xl focus:outline-none focus:border-emerald-500/50 transition"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-neutral-400 mb-2">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            className="w-full px-4 py-3 bg-black/30 border border-white/10 rounded-xl focus:outline-none focus:border-emerald-500/50 transition"
                            required
                        />
                    </div>

                    {error && (
                        <div className="flex items-center gap-2 text-red-400 text-sm bg-red-500/10 px-4 py-3 rounded-xl">
                            <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {error}
                        </div>
                    )}

                    {success && (
                        <div className="flex items-center gap-2 text-emerald-400 text-sm bg-emerald-500/10 px-4 py-3 rounded-xl">
                            <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                            {success}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-4 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 rounded-xl font-semibold transition flex items-center justify-center gap-2"
                    >
                        {loading ? (
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                            isLogin ? 'Sign In' : 'Create Account'
                        )}
                    </button>
                </form>

                {/* Toggle */}
                <p className="text-center mt-6 text-neutral-500">
                    {isLogin ? "Don't have an account? " : "Already have an account? "}
                    <button
                        onClick={() => { setIsLogin(!isLogin); setError(''); setSuccess('') }}
                        className="text-emerald-400 hover:text-emerald-300 font-medium"
                    >
                        {isLogin ? 'Sign up' : 'Sign in'}
                    </button>
                </p>
            </div>
        </div>
    )
}
