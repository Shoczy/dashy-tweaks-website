export default function Terms() {
    return (
        <div className="max-w-3xl mx-auto px-6 py-16">
            <h1 className="text-3xl font-bold mb-2">Terms of Service</h1>
            <p className="text-neutral-500 mb-12">Last updated: December 2024</p>

            <div className="prose prose-invert prose-neutral max-w-none space-y-8">
                <Section title="1. Acceptance of Terms">
                    <p>
                        By using Dashy Tweaks, you agree to these Terms of Service. If you don't agree, please don't use our service.
                    </p>
                </Section>

                <Section title="2. Description of Service">
                    <p>
                        Dashy Tweaks is a Windows optimization tool that modifies system settings to improve gaming performance.
                        All changes are reversible and do not modify system files.
                    </p>
                </Section>

                <Section title="3. User Responsibilities">
                    <ul>
                        <li>You must be at least 13 years old to use our service</li>
                        <li>You are responsible for your account security</li>
                        <li>You agree not to share your license key with others</li>
                        <li>You agree not to reverse engineer or redistribute our software</li>
                    </ul>
                </Section>

                <Section title="4. Subscription Plans">
                    <ul>
                        <li><strong>Monthly:</strong> €7/month, cancel anytime</li>
                        <li><strong>Lifetime:</strong> €30 one-time payment, includes all future updates</li>
                        <li>Payments are processed via Discord (PayPal)</li>
                        <li>Refunds available within 7 days if you haven't used the software</li>
                    </ul>
                </Section>

                <Section title="5. Disclaimer">
                    <p>
                        Dashy Tweaks is provided "as is" without warranty. While we test all tweaks thoroughly:
                    </p>
                    <ul>
                        <li>We are not responsible for any system issues that may occur</li>
                        <li>Always create a system restore point before applying tweaks</li>
                        <li>Use at your own risk</li>
                    </ul>
                </Section>

                <Section title="6. Limitation of Liability">
                    <p>
                        To the maximum extent permitted by law, Dashy Tweaks shall not be liable for any indirect,
                        incidental, or consequential damages arising from your use of the service.
                    </p>
                </Section>

                <Section title="7. Changes to Terms">
                    <p>
                        We may update these terms from time to time. Continued use of the service after changes
                        constitutes acceptance of the new terms.
                    </p>
                </Section>

                <Section title="8. Contact">
                    <p>
                        Questions? Contact us at <a href="mailto:support@dashytweaks.com" className="text-emerald-400 hover:underline">support@dashytweaks.com</a> or
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
