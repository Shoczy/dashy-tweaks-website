import { useEffect, useRef } from 'react'

// Partner logos from /public/partners/ folder
// Add your partner logos as PNG files: partner1.png, partner2.png, etc.
const partners = [
    { name: 'Partner 1', logo: '/partners/partner1.png' },
]

export default function PartnerSlider() {
    const scrollRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const scroll = scrollRef.current
        if (!scroll) return

        let animationId: number
        let position = 0
        const speed = 0.5

        const animate = () => {
            position += speed
            if (position >= scroll.scrollWidth / 2) {
                position = 0
            }
            scroll.scrollLeft = position
            animationId = requestAnimationFrame(animate)
        }

        animationId = requestAnimationFrame(animate)
        return () => cancelAnimationFrame(animationId)
    }, [])

    return (
        <section className="py-16 px-6 border-y border-white/5">
            <div className="max-w-6xl mx-auto">
                <p className="text-center text-sm text-neutral-500 mb-8">Our Partners</p>

                <div className="relative overflow-hidden">
                    {/* Gradient overlays */}
                    <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-neutral-950 to-transparent z-10" />
                    <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-neutral-950 to-transparent z-10" />

                    <div
                        ref={scrollRef}
                        className="flex gap-16 overflow-hidden whitespace-nowrap"
                        style={{ scrollBehavior: 'auto' }}
                    >
                        {/* Double the items for seamless loop */}
                        {[...partners, ...partners].map((partner, i) => (
                            <div
                                key={i}
                                className="flex-shrink-0 flex items-center justify-center h-12 w-32 grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all duration-300"
                            >
                                <img
                                    src={partner.logo}
                                    alt={partner.name}
                                    className="max-h-full max-w-full object-contain filter invert"
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )
}
