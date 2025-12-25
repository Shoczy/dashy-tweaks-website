import { useState } from 'react'
import { Link } from 'react-router-dom'

const sections = [
    { id: 'installation', label: 'Installation' },
    { id: 'first-launch', label: 'First Launch' },
    { id: 'applying-tweaks', label: 'Applying Tweaks' },
    { id: 'reverting', label: 'Reverting Changes' },
    { id: 'recommended', label: 'Recommended Tweaks' },
    { id: 'faq', label: 'FAQ' },
]

export default function HowToUse() {
    const [activeSection, setActiveSection] = useState('installation')

    return (
        <div className="max-w-6xl mx-auto px-6 py-12">
            <div className="flex gap-12">
                {/* Sidebar */}
                <aside className="hidden lg:block w-56 flex-shrink-0">
                    <div className="sticky top-24">
                        <h4 className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-4">Documentation</h4>
                        <nav className="space-y-1">
                            {sections.map(s => (
                                <a
                                    key={s.id}
                                    href={`#${s.id}`}
                                    onClick={() => setActiveSection(s.id)}
                                    className={`block px-3 py-2 text-sm rounded-lg transition ${activeSection === s.id
                                            ? 'bg-emerald-500/10 text-emerald-400 border-l-2 border-emerald-500'
                                            : 'text-neutral-400 hover:text-white hover:bg-white/5'
                                        }`}
                                >
                                    {s.label}
                                </a>
                            ))}
                        </nav>

                        <div className="mt-8 p-4 glass-card rounded-xl">
                            <p className="text-sm text-neutral-400 mb-3">Need help?</p>
                            <a
                                href="https://discord.gg/cXxFzBuG"
                                target="_blank"
                                className="text-sm text-emerald-400 hover:text-emerald-300 flex items-center gap-2"
                            >
                                Join Discord →
                            </a>
                        </div>
                    </div>
                </aside>

                {/* Content */}
                <main className="flex-1 min-w-0">
                    <h1 className="text-3xl font-bold mb-2">Documentation</h1>
                    <p className="text-neutral-500 mb-12">Learn how to get the most out of Dashy Tweaks</p>

                    <div className="space-y-16">
                        <Section id="installation" title="Installation">
                            <Step number={1} title="Download">
                                Get the installer from our <Link to="/download" className="text-emerald-400 hover:underline">download page</Link>.
                            </Step>
                            <Step number={2} title="Run Installer">
                                Double-click <code>DashyTweaks-Setup.exe</code> and follow the wizard.
                            </Step>
                            <Step number={3} title="Allow Admin Access">
                                Click "Yes" when Windows asks for administrator permissions. This is required for the tweaks to work.
                            </Step>
                            <Step number={4} title="Launch">
                                Open Dashy Tweaks from your desktop or Start menu.
                            </Step>
                        </Section>

                        <Section id="first-launch" title="First Launch">
                            <p>When you first open Dashy Tweaks, you'll see:</p>
                            <ul className="mt-4 space-y-3">
                                <li className="flex gap-3">
                                    <span className="text-emerald-400">•</span>
                                    <span><strong>Dashboard</strong> — Overview of your system (CPU, GPU, RAM)</span>
                                </li>
                                <li className="flex gap-3">
                                    <span className="text-emerald-400">•</span>
                                    <span><strong>Sidebar</strong> — All tweak categories (FPS, Input, Network, etc.)</span>
                                </li>
                                <li className="flex gap-3">
                                    <span className="text-emerald-400">•</span>
                                    <span><strong>Premium Badge</strong> — Shows which tweaks require Premium</span>
                                </li>
                            </ul>
                            <Tip>Free users can access basic tweaks in every category. Premium unlocks advanced optimizations.</Tip>
                        </Section>

                        <Section id="applying-tweaks" title="Applying Tweaks">
                            <p>Applying tweaks is simple:</p>
                            <ol className="mt-4 space-y-4">
                                <li className="flex gap-4">
                                    <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 text-sm flex items-center justify-center flex-shrink-0">1</span>
                                    <span>Navigate to a category (e.g., FPS Tweaks)</span>
                                </li>
                                <li className="flex gap-4">
                                    <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 text-sm flex items-center justify-center flex-shrink-0">2</span>
                                    <span>Click the toggle switch next to any tweak</span>
                                </li>
                                <li className="flex gap-4">
                                    <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 text-sm flex items-center justify-center flex-shrink-0">3</span>
                                    <span>The tweak is applied immediately</span>
                                </li>
                                <li className="flex gap-4">
                                    <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 text-sm flex items-center justify-center flex-shrink-0">4</span>
                                    <span>Restart if prompted (some tweaks require it)</span>
                                </li>
                            </ol>
                            <Tip>Hover over any tweak to see what it does and its risk level.</Tip>
                        </Section>

                        <Section id="reverting" title="Reverting Changes">
                            <p>All tweaks are 100% reversible:</p>
                            <ul className="mt-4 space-y-3">
                                <li className="flex gap-3">
                                    <span className="text-emerald-400">•</span>
                                    <span><strong>Single tweak</strong> — Toggle it off to restore the original setting</span>
                                </li>
                                <li className="flex gap-3">
                                    <span className="text-emerald-400">•</span>
                                    <span><strong>All tweaks</strong> — Use "Reset All" in Settings</span>
                                </li>
                            </ul>
                            <Warning>We never modify system files or install drivers. All changes are to Windows settings only.</Warning>
                        </Section>

                        <Section id="recommended" title="Recommended Tweaks">
                            <p>Start with these safe and effective tweaks:</p>
                            <div className="mt-6 grid gap-3">
                                <TweakCard name="Disable Game DVR" category="FPS" description="Stops background recording — big FPS boost" />
                                <TweakCard name="Disable Fullscreen Optimizations" category="FPS" description="Reduces input lag in games" />
                                <TweakCard name="Disable Mouse Acceleration" category="Input" description="Raw 1:1 mouse movement" />
                                <TweakCard name="Disable Nagle's Algorithm" category="Network" description="Lower ping in online games" />
                                <TweakCard name="High Performance Power Plan" category="System" description="Maximum CPU performance" />
                            </div>
                        </Section>

                        <Section id="faq" title="Frequently Asked Questions">
                            <FAQ question="Is it safe to use?">
                                Yes! All tweaks modify Windows settings that are fully reversible. We don't touch system files.
                            </FAQ>
                            <FAQ question="Will I get banned in games?">
                                No. Dashy Tweaks only changes Windows settings, not game files. It's safe for all games including competitive ones.
                            </FAQ>
                            <FAQ question="Do I need to restart after every tweak?">
                                Most tweaks apply instantly. Some require a restart — you'll see a notification when needed.
                            </FAQ>
                            <FAQ question="What's the difference between Free and Premium?">
                                Free includes basic optimizations. Premium unlocks advanced tweaks like GPU optimization, timer resolution, and memory management.
                            </FAQ>
                        </Section>
                    </div>
                </main>
            </div>
        </div>
    )
}

function Section({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
    return (
        <section id={id} className="scroll-mt-24">
            <h2 className="text-xl font-bold mb-6 pb-3 border-b border-neutral-800">{title}</h2>
            <div className="text-neutral-300 leading-relaxed">{children}</div>
        </section>
    )
}

function Step({ number, title, children }: { number: number; title: string; children: React.ReactNode }) {
    return (
        <div className="flex gap-4 mb-4">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center flex-shrink-0">
                {number}
            </div>
            <div>
                <h4 className="font-medium mb-1">{title}</h4>
                <p className="text-neutral-400 text-sm">{children}</p>
            </div>
        </div>
    )
}

function Tip({ children }: { children: React.ReactNode }) {
    return (
        <div className="mt-6 p-4 bg-emerald-500/5 border border-emerald-500/20 rounded-xl">
            <p className="text-sm text-neutral-300">
                <span className="text-emerald-400 font-medium">💡 Tip:</span> {children}
            </p>
        </div>
    )
}

function Warning({ children }: { children: React.ReactNode }) {
    return (
        <div className="mt-6 p-4 bg-emerald-500/5 border border-emerald-500/20 rounded-xl">
            <p className="text-sm text-neutral-300">
                <span className="text-emerald-400 font-medium">✓ Safe:</span> {children}
            </p>
        </div>
    )
}

function TweakCard({ name, category, description }: { name: string; category: string; description: string }) {
    return (
        <div className="flex items-center justify-between p-4 glass-card rounded-xl">
            <div>
                <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium">{name}</span>
                    <span className="px-2 py-0.5 bg-neutral-800 rounded text-xs text-neutral-400">{category}</span>
                </div>
                <p className="text-sm text-neutral-500">{description}</p>
            </div>
            <div className="w-2 h-2 rounded-full bg-emerald-400"></div>
        </div>
    )
}

function FAQ({ question, children }: { question: string; children: React.ReactNode }) {
    const [open, setOpen] = useState(false)

    return (
        <div className="border-b border-neutral-800 last:border-0">
            <button
                onClick={() => setOpen(!open)}
                className="w-full py-4 flex items-center justify-between text-left"
            >
                <span className="font-medium">{question}</span>
                <svg
                    className={`w-5 h-5 text-neutral-500 transition-transform ${open ? 'rotate-180' : ''}`}
                    fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
            </button>
            {open && (
                <p className="pb-4 text-neutral-400 text-sm">{children}</p>
            )}
        </div>
    )
}
