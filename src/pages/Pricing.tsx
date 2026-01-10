import { useState } from 'react'

const DISCORD_LINK = 'https://discord.gg/cXxFzBuG'

export default function Pricing() {
    return (
        <div className="max-w-6xl mx-auto px-6 py-16">
            {/* Header */}
            <div className="text-center mb-12">
                <h1 className="text-3xl md:text-4xl font-bold mb-4">One Plan, Full Access</h1>
                <p className="text-neutral-500 mb-8">Get lifetime access to all 270+ tweaks via Discord</p>
            </div>

            {/* Single Premium Card */}
            <div className="max-w-md mx-auto">
                <div className="relative glass-card rounded-3xl p-8 border-emerald-500/30 glow-green">
                    <div className="absolute -top-3 left-8 px-4 py-1 bg-emerald-500 rounded-full text-sm font-medium">
                        Lifetime Access
                    </div>

                    <div className="mb-6">
                        <h3 className="text-lg font-semibold mb-1">Premium</h3>
                        <p className="text-sm text-neutral-500">Full access to everything</p>
                    </div>

                    <div className="mb-8">
                        <span className="text-4xl font-bold">€15</span>
                        <span className="text-neutral-500 ml-2">one-time</span>
                    </div>

                    <ul className="space-y-4 mb-8">
                        <PricingFeature premium>270+ Premium Tweaks</PricingFeature>
                        <PricingFeature premium>Game-specific Templates</PricingFeature>
                        <PricingFeature premium>GPU optimizations (NVIDIA/AMD/Intel)</PricingFeature>
                        <PricingFeature premium>Advanced memory manager</PricingFeature>
                        <PricingFeature premium>Timer resolution control</PricingFeature>
                        <PricingFeature premium>Network & Input optimizations</PricingFeature>
                        <PricingFeature premium>Priority Discord support</PricingFeature>
                        <PricingFeature premium>All future updates included</PricingFeature>
                    </ul>

                    <a
                        href={DISCORD_LINK}
                        target="_blank"
                        className="w-full h-12 bg-emerald-500 hover:bg-emerald-400 rounded-xl font-medium flex items-center justify-center gap-2 transition"
                    >
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
                    <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                    Secure Payment
                </div>
                <div className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Instant Activation
                </div>
                <div className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                    </svg>
                    Lifetime License
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
                        question="How do I get Premium?"
                        answer="Join our Discord server and open a ticket. After payment, you'll receive a license key that you can redeem in your dashboard or directly in the app."
                    />
                    <FAQ
                        question="What payment methods do you accept?"
                        answer="We accept PayPal, Crypto, and various other payment methods through our Discord."
                    />
                    <FAQ
                        question="Do you offer refunds?"
                        answer="Yes, we offer a 7-day money-back guarantee if you're not satisfied with Premium. Contact us on Discord for refund requests."
                    />
                </div>
            </div>
        </div>
    )
}

function PricingFeature({ children, premium = false }: { children: React.ReactNode; premium?: boolean }) {
    return (
        <li className="flex items-center gap-3 text-sm">
            <svg className={`w-5 h-5 flex-shrink-0 ${premium ? 'text-emerald-400' : 'text-neutral-600'}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            <span className={premium ? 'text-neutral-300' : 'text-neutral-500'}>{children}</span>
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
                <svg
                    className={`w-5 h-5 text-neutral-500 transition-transform ${open ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
            </button>
            {open && (
                <div className="px-5 pb-5 text-sm text-neutral-500 animate-fadeIn">
                    {answer}
                </div>
            )}
        </div>
    )
}
