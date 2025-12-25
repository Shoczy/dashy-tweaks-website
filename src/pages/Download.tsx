import { Link } from 'react-router-dom'

const DOWNLOAD_LINK = '/DashyTweaks-Setup.exe'

// Download tracking function
function trackDownload() {
    // Option 1: Google Analytics (add gtag to index.html first)
    // window.gtag?.('event', 'download', { event_category: 'engagement' });

    // Option 2: Send to your backend API
    // fetch('https://your-api.com/api/track-download', { method: 'POST' });

    // Option 3: Use Plausible, Umami, or PostHog
    // window.plausible?.('Download');

    console.log('Download tracked:', new Date().toISOString());
}

export default function Download() {
    return (
        <div className="max-w-6xl mx-auto px-6 py-16">
            {/* Header */}
            <div className="text-center mb-16">
                <h1 className="text-3xl md:text-4xl font-bold mb-4">Download Dashy Tweaks</h1>
                <p className="text-neutral-500">Get started in under a minute</p>
            </div>

            {/* Download Card */}
            <div className="max-w-lg mx-auto mb-16">
                <div className="glass-card rounded-3xl p-8 glow-green">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center font-bold text-lg">
                            DT
                        </div>
                        <div>
                            <h2 className="font-semibold text-lg">Dashy Tweaks</h2>
                            <p className="text-sm text-neutral-500">v1.0.0 • Windows 10/11</p>
                        </div>
                    </div>

                    <div className="flex items-center justify-between p-4 glass-card rounded-xl mb-6">
                        <div className="flex items-center gap-3">
                            <svg className="w-5 h-5 text-neutral-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            <span className="text-sm">DashyTweaks-Setup.exe</span>
                        </div>
                        <span className="text-sm text-neutral-500">~15 MB</span>
                    </div>

                    <a
                        href={DOWNLOAD_LINK}
                        download
                        onClick={trackDownload}
                        className="w-full h-14 bg-emerald-500 hover:bg-emerald-400 rounded-2xl font-semibold flex items-center justify-center gap-3 transition"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                        Download for Windows
                    </a>

                    <p className="text-xs text-neutral-600 text-center mt-4">
                        By downloading, you agree to our Terms of Service
                    </p>
                </div>
            </div>

            {/* Info Grid */}
            <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
                {/* Requirements */}
                <div className="glass-card rounded-2xl p-6">
                    <h3 className="font-semibold mb-4 flex items-center gap-2">
                        <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        System Requirements
                    </h3>
                    <ul className="space-y-3 text-sm text-neutral-400">
                        <li className="flex items-center gap-3">
                            <span className="w-1.5 h-1.5 rounded-full bg-neutral-600"></span>
                            Windows 10 or Windows 11
                        </li>
                        <li className="flex items-center gap-3">
                            <span className="w-1.5 h-1.5 rounded-full bg-neutral-600"></span>
                            4 GB RAM minimum
                        </li>
                        <li className="flex items-center gap-3">
                            <span className="w-1.5 h-1.5 rounded-full bg-neutral-600"></span>
                            100 MB free disk space
                        </li>
                        <li className="flex items-center gap-3">
                            <span className="w-1.5 h-1.5 rounded-full bg-neutral-600"></span>
                            Administrator privileges
                        </li>
                    </ul>
                </div>

                {/* Installation */}
                <div className="glass-card rounded-2xl p-6">
                    <h3 className="font-semibold mb-4 flex items-center gap-2">
                        <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                        Quick Install
                    </h3>
                    <ol className="space-y-3 text-sm text-neutral-400">
                        <li className="flex items-start gap-3">
                            <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 text-xs flex items-center justify-center flex-shrink-0 mt-0.5">1</span>
                            Download the installer above
                        </li>
                        <li className="flex items-start gap-3">
                            <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 text-xs flex items-center justify-center flex-shrink-0 mt-0.5">2</span>
                            Run DashyTweaks-Setup.exe
                        </li>
                        <li className="flex items-start gap-3">
                            <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 text-xs flex items-center justify-center flex-shrink-0 mt-0.5">3</span>
                            Follow the installation wizard
                        </li>
                        <li className="flex items-start gap-3">
                            <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 text-xs flex items-center justify-center flex-shrink-0 mt-0.5">4</span>
                            Launch and start optimizing!
                        </li>
                    </ol>
                </div>
            </div>

            {/* Help Link */}
            <div className="text-center mt-12">
                <p className="text-neutral-500 text-sm">
                    Need help? Check out our{' '}
                    <Link to="/how-to-use" className="text-emerald-400 hover:text-emerald-300 transition">
                        documentation
                    </Link>
                    {' '}or join our{' '}
                    <a href="https://discord.gg/cXxFzBuG" target="_blank" className="text-emerald-400 hover:text-emerald-300 transition">
                        Discord
                    </a>
                </p>
            </div>
        </div>
    )
}
