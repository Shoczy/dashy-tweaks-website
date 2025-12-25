import { Link } from 'react-router-dom'

export default function Home() {
    return (
        <>
            {/* Hero */}
            <section className="relative overflow-hidden">
                {/* Background glow */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-emerald-500/20 rounded-full blur-[150px] pointer-events-none" />

                <div className="max-w-6xl mx-auto px-6 pt-16 pb-24 relative">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        {/* Badge */}
                        <div className="inline-flex items-center gap-2 px-4 py-2 glass-card rounded-full mb-8 animate-slideUp">
                            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-glow"></span>
                            <span className="text-sm text-neutral-400">Trusted by 10,000+ gamers</span>
                        </div>

                        {/* Headline */}
                        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 leading-tight animate-slideUp delay-100">
                            Unlock your PC's
                            <span className="gradient-text block">full gaming potential</span>
                        </h1>

                        {/* Subheadline */}
                        <p className="text-lg text-neutral-400 mb-10 max-w-xl mx-auto animate-slideUp delay-200">
                            Professional Windows optimization that actually works. More FPS, less input delay, zero bloat.
                        </p>

                        {/* CTA Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slideUp delay-300">
                            <Link
                                to="/download"
                                className="h-14 px-8 bg-emerald-500 hover:bg-emerald-400 rounded-2xl font-semibold flex items-center justify-center gap-3 transition glow-green"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                </svg>
                                Download Free
                            </Link>
                            <Link
                                to="/pricing"
                                className="h-14 px-8 glass-card hover:bg-white/5 rounded-2xl font-semibold flex items-center justify-center transition"
                            >
                                View Pricing
                            </Link>
                        </div>
                    </div>

                    {/* App Screenshot */}
                    <div className="relative animate-slideUp delay-400">
                        <div className="screenshot-frame glow-green max-w-4xl mx-auto">
                            <img src="/screenshot.png" alt="Dashy Tweaks Dashboard" className="w-full rounded-xl" />
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats */}
            <section className="border-y border-neutral-900/50">
                <div className="max-w-6xl mx-auto px-6 py-16">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        <Stat value="132" label="Tweaks" />
                        <Stat value="0" label="Downloads" />
                        <Stat value="+30%" label="FPS Increase" />
                        <Stat value="<1ms" label="Input Delay" />
                    </div>
                </div>
            </section>

            {/* Features */}
            <section className="py-24">
                <div className="max-w-6xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">Everything you need to dominate</h2>
                        <p className="text-neutral-500 max-w-lg mx-auto">Comprehensive tweaks for every aspect of your system</p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <FeatureCard
                            icon="⚡"
                            title="FPS Boost"
                            description="Disable unnecessary services, optimize Windows settings, and squeeze every frame out of your hardware."
                        />
                        <FeatureCard
                            icon="🎯"
                            title="Input Delay"
                            description="Reduce mouse and keyboard latency to the absolute minimum for faster reactions."
                        />
                        <FeatureCard
                            icon="🌐"
                            title="Network"
                            description="Lower ping, reduce packet loss, and optimize your connection for online gaming."
                        />
                        <FeatureCard
                            icon="🎮"
                            title="GPU Tweaks"
                            description="NVIDIA and AMD specific optimizations for maximum graphics performance."
                        />
                        <FeatureCard
                            icon="🧹"
                            title="Debloat"
                            description="Remove Windows bloatware, telemetry, and background processes eating your resources."
                        />
                        <FeatureCard
                            icon="↩️"
                            title="Reversible"
                            description="Every tweak can be undone with one click. Your system is always safe."
                        />
                    </div>
                </div>
            </section>

            {/* Screenshot Gallery */}
            <section className="py-24">
                <div className="max-w-6xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">See it in action</h2>
                        <p className="text-neutral-500">Clean interface, powerful features</p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                        <ScreenshotCard
                            title="FPS Tweaks"
                            description="One-click optimizations for maximum framerate"
                            image="/screenshots/fps-tweaks.png"
                        />
                        <ScreenshotCard
                            title="GPU Optimization"
                            description="NVIDIA and AMD specific tweaks"
                            image="/screenshots/gpu.png"
                        />
                        <ScreenshotCard
                            title="Network Tools"
                            description="Ping testing and connection optimization"
                            image="/screenshots/network.png"
                        />
                        <ScreenshotCard
                            title="System Cleanup"
                            description="Remove bloatware and free up resources"
                            image="/screenshots/cleanup.png"
                        />
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-24">
                <div className="max-w-3xl mx-auto px-6 text-center">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to boost your performance?</h2>
                    <p className="text-neutral-500 mb-10">Join thousands of gamers who already optimized their systems</p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            to="/download"
                            className="h-14 px-8 bg-emerald-500 hover:bg-emerald-400 rounded-2xl font-semibold flex items-center justify-center gap-3 transition glow-green"
                        >
                            Download Now — It's Free
                        </Link>
                    </div>
                </div>
            </section>
        </>
    )
}

function Stat({ value, label }: { value: string; label: string }) {
    return (
        <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold gradient-text">{value}</div>
            <div className="text-sm text-neutral-500 mt-1">{label}</div>
        </div>
    )
}

function FeatureCard({ icon, title, description }: { icon: string; title: string; description: string }) {
    return (
        <div className="glass-card rounded-2xl p-6 hover:bg-white/[0.02] transition group">
            <div className="text-3xl mb-4">{icon}</div>
            <h3 className="font-semibold text-lg mb-2 group-hover:text-emerald-400 transition">{title}</h3>
            <p className="text-neutral-500 text-sm leading-relaxed">{description}</p>
        </div>
    )
}

function ScreenshotCard({ title, description, image }: { title: string; description: string; image: string }) {
    return (
        <div className="glass-card rounded-2xl overflow-hidden group hover:border-emerald-500/20 transition">
            <div className="aspect-video overflow-hidden">
                <img
                    src={image}
                    alt={title}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                />
            </div>
            <div className="p-5">
                <h3 className="font-semibold mb-1 group-hover:text-emerald-400 transition">{title}</h3>
                <p className="text-sm text-neutral-500">{description}</p>
            </div>
        </div>
    )
}
