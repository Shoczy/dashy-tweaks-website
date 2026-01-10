import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { Zap, Target, Globe, HardDrive, Cpu, Settings, Calendar, Infinity, Check, MessageCircle } from 'lucide-react'
import StatsCounter from '../components/StatsCounter'
import PartnerSlider from '../components/PartnerSlider'

const DISCORD = 'https://discord.gg/cXxFzBuG'

export default function Home() {
    const { user } = useAuth()
    const navigate = useNavigate()

    const handleGetStarted = () => {
        window.open(DISCORD, '_blank')
    }

    const features = [
        { icon: Zap, title: 'FPS Boost', desc: 'Disable Game DVR, FSO, VBS and more' },
        { icon: Target, title: 'Input Delay', desc: 'Reduce mouse and keyboard latency' },
        { icon: Globe, title: 'Network', desc: 'Optimize TCP/IP for lower ping' },
        { icon: HardDrive, title: 'Memory', desc: 'Clean RAM, optimize page file' },
        { icon: Cpu, title: 'GPU Tweaks', desc: 'NVIDIA, AMD & Intel optimizations' },
        { icon: Settings, title: 'System', desc: 'Debloat Windows, manage startup' },
    ]

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

                    <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight animate-fadeIn">
                        Optimize Your
                        <span className="block bg-gradient-to-r from-emerald-400 to-emerald-600 bg-clip-text text-transparent animate-slideUp">
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
                            <MessageCircle className="w-6 h-6" />
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
                        <StatsCounter />
                    </div>
                </div>
            </section>

            {/* Partner Slider */}
            <PartnerSlider />

            {/* Features */}
            <section className="py-24 px-6">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">Everything You Need</h2>
                        <p className="text-neutral-400">Professional-grade optimizations for competitive gaming</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6">
                        {features.map((f, i) => (
                            <div key={i} className="glass-card rounded-2xl p-6 hover:bg-white/5 transition">
                                <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center mb-4">
                                    <f.icon className="w-6 h-6 text-emerald-400" />
                                </div>
                                <h3 className="text-lg font-semibold mb-2">{f.title}</h3>
                                <p className="text-neutral-500 text-sm">{f.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Pricing - Two Plans */}
            <section className="py-24 px-6 bg-gradient-to-b from-transparent via-emerald-500/5 to-transparent">
                <div className="max-w-3xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">Choose Your Plan</h2>
                        <p className="text-neutral-400">Get access to all 270+ tweaks</p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                        {/* Monthly */}
                        <div className="glass-card rounded-2xl p-8">
                            <div className="flex items-center gap-3 mb-4">
                                <Calendar className="w-6 h-6 text-blue-400" />
                                <h3 className="text-xl font-semibold">Monthly</h3>
                            </div>
                            <p className="text-4xl font-bold mb-6">€7 <span className="text-lg text-neutral-500 font-normal">/month</span></p>
                            <ul className="space-y-3 mb-8 text-sm">
                                <li className="flex items-center gap-2 text-neutral-400"><Check className="w-4 h-4 text-blue-400" /> 270+ Premium Tweaks</li>
                                <li className="flex items-center gap-2 text-neutral-400"><Check className="w-4 h-4 text-blue-400" /> Game Templates</li>
                                <li className="flex items-center gap-2 text-neutral-400"><Check className="w-4 h-4 text-blue-400" /> Discord Support</li>
                                <li className="flex items-center gap-2 text-neutral-400"><Check className="w-4 h-4 text-blue-400" /> Cancel anytime</li>
                            </ul>
                            <a href={DISCORD} target="_blank" className="flex items-center justify-center gap-2 w-full py-3 text-center glass-card hover:bg-white/10 rounded-xl font-medium transition border border-white/10">
                                <MessageCircle className="w-5 h-5" />
                                Get Monthly
                            </a>
                        </div>

                        {/* Lifetime */}
                        <div className="glass-card rounded-2xl p-8 border border-emerald-500/30 bg-emerald-500/5 relative">
                            <div className="absolute -top-3 right-6 px-3 py-1 bg-emerald-500 rounded-full text-xs font-medium">Best Value</div>
                            <div className="flex items-center gap-3 mb-4">
                                <Infinity className="w-6 h-6 text-emerald-400" />
                                <h3 className="text-xl font-semibold">Lifetime</h3>
                            </div>
                            <p className="text-4xl font-bold mb-6">€30 <span className="text-lg text-neutral-500 font-normal">one-time</span></p>
                            <ul className="space-y-3 mb-8 text-sm">
                                <li className="flex items-center gap-2 text-emerald-400"><Check className="w-4 h-4" /> 270+ Premium Tweaks</li>
                                <li className="flex items-center gap-2 text-emerald-400"><Check className="w-4 h-4" /> Game Templates</li>
                                <li className="flex items-center gap-2 text-emerald-400"><Check className="w-4 h-4" /> Priority Support</li>
                                <li className="flex items-center gap-2 text-emerald-400"><Check className="w-4 h-4" /> All Future Updates</li>
                            </ul>
                            <a href={DISCORD} target="_blank" className="flex items-center justify-center gap-2 w-full py-3 text-center bg-emerald-500 hover:bg-emerald-400 rounded-xl font-medium transition">
                                <MessageCircle className="w-5 h-5" />
                                Get Lifetime
                            </a>
                            <p className="text-center text-xs text-neutral-500 mt-4">
                                Save €54/year compared to monthly
                            </p>
                        </div>
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
                        <MessageCircle className="w-6 h-6" />
                        Join Discord & Get Started
                    </a>
                </div>
            </section>
        </div>
    )
}
