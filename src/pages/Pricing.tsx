import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { getPaymentLink } from '../lib/stripe'

export default function Pricing() {
    const [period, setPeriod] = useState<'monthly' | 'lifetime'>('lifetime')
    const { user } = useAuth()

    const handlePurchase = () => {
        const link = getPaymentLink(period, user?.email || undefined)
        window.open(link, '_blank')
    }

    return (
        <div className="max-w-6xl mx-auto px-6 py-16">
            {/* Header */}
            <div className="text-center mb-12">
                <h1 className="text-3xl md:text-4xl font-bold mb-4">Simple, transparent pricing</h1>
                <p className="text-neutral-500 mb-8">Start free, upgrade when you're ready</p>

                {/* Period Toggle */}
                <div className="inline-flex glass-card rounded-xl p-1">
                    <button
                        onClick={() => setPeriod('monthly')}
                        className={`px-5 py-2.5 rounded-lg text-sm font-medium transition ${period === 'monthly' ? 'bg-white/10 text-white' : 'text-neutral-500 hover:text-white'}`}
                    >
                        Monthly
                    </button>
                    <button
                        onClick={() => setPeriod('lifetime')}
                        className={`px-5 py-2.5 rounded-lg text-sm font-medium transition flex items-center gap-2 ${period === 'lifetime' ? 'bg-white/10 text-white' : 'text-neutral-500 hover:text-white'}`}
                    >
                        Lifetime
                        <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 text-xs rounded-full">Save 17%</span>
                    </button>
                </div>
            </div>

            {/* Pricing Cards */}
            <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
                {/* Free */}
                <div className="glass-card rounded-3xl p-8">
                    <div className="mb-6">
                        <h3 className="text-lg font-semibold mb-1">Free</h3>
                        <p className="text-sm text-neutral-500">Perfect for getting started</p>
                    </div>

                    <div className="mb-8">
                        <span className="text-4xl font-bold">€0</span>
                        <span className="text-neutral-500 ml-2">forever</span>
                    </div>

                    <ul className="space-y-4 mb-8">
                        <PricingFeature>Basic FPS optimizations</PricingFeature>
                        <PricingFeature>Input delay tweaks</PricingFeature>
                        <PricingFeature>Network optimization</PricingFeature>
                        <PricingFeature>System cleanup tools</PricingFeature>
                        <PricingFeature>Community support</PricingFeature>
                    </ul>

                    <Link
                        to="/download"
                        className="w-full h-12 glass-card hover:bg-white/5 rounded-xl font-medium flex items-center justify-center transition"
                    >
                        Download Free
                    </Link>
                </div>

                {/* Premium */}
                <div className="relative glass-card rounded-3xl p-8 border-emerald-500/30 glow-green">
                    <div className="absolute -top-3 left-8 px-4 py-1 bg-emerald-500 rounded-full text-sm font-medium">
                        Most Popular
                    </div>

                    <div className="mb-6">
                        <h3 className="text-lg font-semibold mb-1">Premium</h3>
                        <p className="text-sm text-neutral-500">For serious gamers</p>
                    </div>

                    <div className="mb-8">
                        <span className="text-4xl font-bold">€{period === 'monthly' ? '6' : '60'}</span>
                        <span className="text-neutral-500 ml-2">{period === 'monthly' ? '/month' : 'one-time'}</span>
                        {period === 'lifetime' && (
                            <span className="ml-2 text-sm text-neutral-600 line-through">€72</span>
                        )}
                    </div>

                    <ul className="space-y-4 mb-8">
                        <PricingFeature premium>Everything in Free</PricingFeature>
                        <PricingFeature premium>Advanced FPS tweaks</PricingFeature>
                        <PricingFeature premium>GPU optimizations (NVIDIA/AMD)</PricingFeature>
                        <PricingFeature premium>Memory manager</PricingFeature>
                        <PricingFeature premium>Timer resolution control</PricingFeature>
                        <PricingFeature premium>Power plan manager</PricingFeature>
                        <PricingFeature premium>Priority Discord support</PricingFeature>
                        {period === 'lifetime' && <PricingFeature premium>All future updates included</PricingFeature>}
                    </ul>

                    <button
                        onClick={handlePurchase}
                        className="w-full h-12 bg-emerald-500 hover:bg-emerald-400 rounded-xl font-medium flex items-center justify-center gap-2 transition"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                        </svg>
                        Get Premium - €{period === 'monthly' ? '6/mo' : '60'}
                    </button>

                    <p className="text-center text-xs text-neutral-500 mt-4">
                        Secure payment via Stripe • Cancel anytime
                    </p>
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
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                    </svg>
                    Money-back Guarantee
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
                        question="How do I activate Premium?"
                        answer="After purchase, you'll receive a license key in your dashboard. Simply copy it and paste it into the Dashy Tweaks app to unlock all Premium features."
                    />
                    <FAQ
                        question="Can I cancel my subscription?"
                        answer="Monthly subscriptions can be cancelled anytime from your Stripe customer portal. Lifetime is a one-time payment with no recurring charges."
                    />
                    <FAQ
                        question="What payment methods do you accept?"
                        answer="We accept all major credit cards, Apple Pay, Google Pay, and various local payment methods through Stripe."
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
