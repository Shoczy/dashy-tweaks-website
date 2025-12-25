export default function Impressum() {
    return (
        <div className="max-w-3xl mx-auto px-6 py-16">
            <h1 className="text-3xl font-bold mb-2">Impressum</h1>
            <p className="text-neutral-500 mb-12">Legal Notice</p>

            <div className="space-y-8">
                <Section title="Angaben gemäß § 5 TMG">
                    <p>[Dein vollständiger Name]</p>
                    <p>[Deine Straße und Hausnummer]</p>
                    <p>[PLZ und Stadt]</p>
                    <p>Deutschland</p>
                </Section>

                <Section title="Kontakt">
                    <p>E-Mail: contact@dashytweaks.com</p>
                    <p>Discord: <a href="https://discord.gg/cXxFzBuG" target="_blank" className="text-emerald-400 hover:underline">discord.gg/cXxFzBuG</a></p>
                </Section>

                <Section title="Umsatzsteuer-ID">
                    <p>Umsatzsteuer-Identifikationsnummer gemäß § 27 a Umsatzsteuergesetz:</p>
                    <p>[Deine USt-IdNr. falls vorhanden, sonst diesen Abschnitt entfernen]</p>
                </Section>

                <Section title="Verantwortlich für den Inhalt nach § 55 Abs. 2 RStV">
                    <p>[Dein vollständiger Name]</p>
                    <p>[Deine Adresse]</p>
                </Section>

                <Section title="Streitschlichtung">
                    <p className="text-neutral-400">
                        Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit:
                        <a href="https://ec.europa.eu/consumers/odr/" target="_blank" className="text-emerald-400 hover:underline ml-1">
                            https://ec.europa.eu/consumers/odr/
                        </a>
                    </p>
                    <p className="text-neutral-400 mt-2">
                        Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren vor einer
                        Verbraucherschlichtungsstelle teilzunehmen.
                    </p>
                </Section>

                <Section title="Haftung für Inhalte">
                    <p className="text-neutral-400">
                        Als Diensteanbieter sind wir gemäß § 7 Abs.1 TMG für eigene Inhalte auf diesen Seiten nach den
                        allgemeinen Gesetzen verantwortlich. Nach §§ 8 bis 10 TMG sind wir als Diensteanbieter jedoch nicht
                        verpflichtet, übermittelte oder gespeicherte fremde Informationen zu überwachen oder nach Umständen
                        zu forschen, die auf eine rechtswidrige Tätigkeit hinweisen.
                    </p>
                </Section>
            </div>

            <div className="mt-12 p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl">
                <p className="text-sm text-amber-400">
                    ⚠️ Wichtig: Ersetze die Platzhalter [in Klammern] mit deinen echten Daten bevor du die Website veröffentlichst.
                </p>
            </div>
        </div>
    )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <section>
            <h2 className="text-lg font-semibold mb-3">{title}</h2>
            <div className="text-neutral-300">{children}</div>
        </section>
    )
}
