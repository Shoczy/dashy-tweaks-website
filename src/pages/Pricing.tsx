import { useState } from 'react'
import { Check, Shield, Clock, Key, Calendar, Infinity, ChevronDown, MessageCircle } from 'lucide-react'

const DISCORD_LINK = 'https://discord.gg/cXxFzBuG'

export default function Pricing() {
    return (
        <div className="max-w-6xl mx-auto px-6 py-16">
            {/* Header */}
            <div className="text-center mb-12">
                <h1 className="text-3xl md:text-4xl font-bold mb-4">Choose Your Plan</h1>
                <p className="text-neutral-500 mb-8">Get access to all 270+ tweaks via Discord</p>
            </div>

            {/* Pricing Cards */}
            <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
                {/* Monthly */}
                <div className="glass-card rounded-3xl p-8">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center">
                            <Calendar className="w-5 h-5 text-blue-400" />
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold">Monthly</h3>
                            <p className="text-sm text-neutral-500">Flexible subscription</p>
                        </div>
                    </div>

                    <div className="mb-8">
                        <span className="text-4xl font-bold">€7</span>
                        <span className="text-neutral-500 ml-2">/month</span>
                    </div>

                    <ul className="space-y-4 mb-8">
                        <PricingFeature icon={<Check className="w-4 h-4" />}>270+ Premium Tweaks</PricingFeature>
                        <PricingFeature icon={<Check className="w-4 h-4" />}>Game-specific Templates</PricingFeature>
                        <PricingFeature icon={<Check className="w-4 h-4" />}>GPU optimizations</PricingFeature>
                        <PricingFeature icon={<Check className="w-4 h-4" />}>Discord Support</PricingFeature>
                        <PricingFeature icon={<Check className="w-4 h-4" />}>Cancel anytime</PricingFeature>
                    </ul>

                    <a
                        href={DISCORD_LINK}
                        target="_blank"
                        className="w-full h-12 glass-card hover:bg-white/10 rounded-xl font-medium flex items-center justify-center gap-2 transition border border-white/10"
                    >
                        <MessageCircle className="w-5 h-5" />
                        Get Monthly
                    </a>
                </div>

                {/* Lifetime */}
                <div className="relative glass-card rounded-3xl p-8 border-emerald-500/30 glow-green">
                    <div className="absolute -top-3 left-8 px-4 py-1 bg-emerald-500 rounded-full text-sm font-medium">
                        Best Value
                    </div>

                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                            <Infinity className="w-5 h-5 text-emerald-400" />
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold">Lifetime</h3>
                            <p className="text-sm text-neutral-500">One-time payment</p>
                        </div>
                    </div>

                    <div className="mb-8">
                        <span className="text-4xl font-bold">€30</span>
                        <span className="text-neutral-500 ml-2">one-time</span>
                    </div>

                    <ul className="space-y-4 mb-8">
                        <PricingFeature icon={<Check className="w-4 h-4" />} premium>270+ Premium Tweaks</PricingFeature>
                        <PricingFeature icon={<Check className="w-4 h-4" />} premium>Game-specific Templates</PricingFeature>
                        <PricingFeature icon={<Check className="w-4 h-4" />} premium>GPU optimizations (NVIDIA/AMD/Intel)</PricingFeature>
                        <PricingFeature icon={<Check className="w-4 h-4" />} premium>Priority Discord Support</PricingFeature>
                        <PricingFeature icon={<Check className="w-4 h-4" />} premium>All future updates included</PricingFeature>
                        <PricingFeature icon={<Check className="w-4 h-4" />} premium>Never pay again</PricingFeature>
                    </ul>

                    <a
                        href={DISCORD_LINK}
                        target="_blank"
                        className="w-full h-12 bg-emerald-500 hover:bg-emerald-400 rounded-xl font-medium flex items-center justify-center gap-2 transition"
                    >
                        <MessageCircle className="w-5 h-5" />
                        Get Lifetime
                    </a>

                    <p className="text-center text-xs text-neutral-500 mt-4">
                        Save €54/year compared to monthly
                    </p>
                </div>
            </div>

            {/* How to Purchase */}
            <div className="max-w-3xl mx-auto mt-16">
                <h2 className="text-xl font-bold text-center mb-8">How to Purchase</h2>
                <div className="grid md:grid-cols-3 gap-6">
                    <div className="text-center glass-card rounded-2xl p-6">
                        <div className="w-10 h-10 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold mx-auto mb-3">1</div>
                        <h3 className="font-medium mb-1">Join Discord</h3>
                        <p className="text-neutral-500 text-sm">Click the button and join our server</p>
                    </div>
                    <div className="text-center glass-card rounded-2xl p-6">
                        <div className="w-10 h-10 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold mx-auto mb-3">2</div>
                        <h3 className="font-medium mb-1">Open Ticket</h3>
                        <p className="text-neutral-500 text-sm">Create a purchase ticket</p>
                    </div>
                    <div className="text-center glass-card rounded-2xl p-6">
                        <div className="w-10 h-10 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold mx-auto mb-3">3</div>
                        <h3 className="font-medium mb-1">Get Key</h3>
                        <p className="text-neutral-500 text-sm">Pay & receive your key instantly</p>
                    </div>
                </div>
            </div>

            {/* Trust Badges */}
            <div className="flex flex-wrap justify-center gap-8 mt-12 text-neutral-500 text-sm">
                <div className="flex items-center gap-2">
                    <Shield className="w-5 h-5 text-emerald-400" />
                    Secure Payment
                </div>
                <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-emerald-400" />
                    Instant Activation
                </div>
                <div className="flex items-center gap-2">
                    <Key className="w-5 h-5 text-emerald-400" />
                    License Key System
                </div>
            </div>

            {/* FAQ */}
            <div className="max-w-2xl mx-auto mt-24">
                <h2 className="text-2xl font-bold text-center mb-12">Frequently asked questions</h2>
                <div className="space-y-4">
                    <FAQ
                        question="Is it safe to use?"
                        answer="Yes! All tweaks modify Windows settings that are fully reversible. We don't touch system files or install drivers."
                    />
                    <FAQ
                        question="Will I get banned in games?"
                        answer="No. Dashy Tweaks only changes Windows settings, not game files. It's completely safe for all games including competitive ones."
                    />
                    <FAQ
                        question="What's the difference between Monthly and Lifetime?"
                        answer="Monthly is €7/month and can be cancelled anytime. Lifetime is a one-time €30 payment that gives you permanent access to all features and future updates."
                    />
                    <FAQ
                        question="What payment methods do you accept?"
                        answer="We accept PayPal, Crypto, and various other payment methods through our Discord."
                    />
                    <FAQ
                        question="Do you offer refunds?"
                        answer="Yes, we offer a 7-day money-back guarantee if you're not satisfied. Contact us on Discord for refund requests."
                    />
                </div>
            </div>
        </div>
    )
}

function PricingFeature({ children, icon, premium = false }: { children: React.ReactNode; icon: React.ReactNode; premium?: boolean }) {
    return (
        <li className="flex items-center gap-3 text-sm">
            <span className={`flex-shrink-0 ${premium ? 'text-emerald-400' : 'text-neutral-500'}`}>
                {icon}
            </span>
            <span className={premium ? 'text-neutral-300' : 'text-neutral-400'}>{children}</span>
        </li>
    )
}

function FAQ({ question, answer }: { question: string; answer: string }) {
    const [open, setOpen] = useState(false)

    return (
        <div className="glass-card rounded-2xl overflow-hidden">
            <button
                onClick={() => setOpen(!open)}
                className="w-full p-5 flex items-center justify-between text-left hover:bg-white/[0.02] transition"
            >
                <span className="font-medium">{question}</span>
                <ChevronDown className={`w-5 h-5 text-neutral-500 transition-transform ${open ? 'rotate-180' : ''}`} />
            </button>
            {open && (
                <div className="px-5 pb-5 text-sm text-neutral-500 animate-fadeIn">
                    {answer}
                </div>
            )}
        </div>
    )
}
