export default function Privacy() {
    return (
        <div className="max-w-3xl mx-auto px-6 py-16">
            <h1 className="text-3xl font-bold mb-2">Privacy Policy</h1>
            <p className="text-neutral-500 mb-12">Last updated: December 2024</p>

            <div className="prose prose-invert prose-neutral max-w-none space-y-8">
                <Section title="1. Introduction">
                    <p>
                        Dashy Tweaks ("we", "our", or "us") respects your privacy. This Privacy Policy explains how we collect,
                        use, and protect your information when you use our website and software.
                    </p>
                </Section>

                <Section title="2. Information We Collect">
                    <p>We collect minimal information:</p>
                    <ul>
                        <li><strong>Account Information:</strong> Email address when you sign up (via Discord or Google)</li>
                        <li><strong>Payment Information:</strong> Processed securely by Stripe - we never see your card details</li>
                        <li><strong>Usage Data:</strong> Anonymous analytics to improve our service</li>
                    </ul>
                    <p>Our desktop application does NOT collect any personal data or telemetry.</p>
                </Section>

                <Section title="3. How We Use Your Information">
                    <ul>
                        <li>To provide and maintain our service</li>
                        <li>To process payments and manage subscriptions</li>
                        <li>To send important updates about your account</li>
                        <li>To improve our website and software</li>
                    </ul>
                </Section>

                <Section title="4. Data Sharing">
                    <p>We do NOT sell your data. We only share information with:</p>
                    <ul>
                        <li><strong>Stripe:</strong> For payment processing</li>
                        <li><strong>Discord/Google:</strong> For authentication (only what you authorize)</li>
                    </ul>
                </Section>

                <Section title="5. Data Security">
                    <p>
                        We use industry-standard security measures to protect your data. All connections are encrypted via HTTPS.
                    </p>
                </Section>

                <Section title="6. Your Rights">
                    <p>You have the right to:</p>
                    <ul>
                        <li>Access your personal data</li>
                        <li>Delete your account and data</li>
                        <li>Export your data</li>
                        <li>Opt out of marketing emails</li>
                    </ul>
                </Section>

                <Section title="7. Contact">
                    <p>
                        Questions? Contact us at <a href="mailto:privacy@dashytweaks.com" className="text-emerald-400 hover:underline">privacy@dashytweaks.com</a> or
                        join our <a href="https://discord.gg/cXxFzBuG" target="_blank" className="text-emerald-400 hover:underline">Discord</a>.
                    </p>
                </Section>
            </div>
        </div>
    )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <section>
            <h2 className="text-lg font-semibold mb-4">{title}</h2>
            <div className="text-neutral-400 space-y-3 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-2 [&_li]:text-neutral-400">
                {children}
            </div>
        </section>
    )
}
