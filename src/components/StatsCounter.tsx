import { useEffect, useState } from 'react'
import { Users, Download, Sparkles } from 'lucide-react'
import { supabase } from '../lib/supabase'

interface Stats {
    users: number
    downloads: number
    tweaks: number
}

export default function StatsCounter() {
    const [stats, setStats] = useState<Stats>({ users: 0, downloads: 0, tweaks: 270 })
    const [displayStats, setDisplayStats] = useState<Stats>({ users: 0, downloads: 0, tweaks: 0 })
    const [hasAnimated, setHasAnimated] = useState(false)

    // Fetch real stats from Supabase
    useEffect(() => {
        const fetchStats = async () => {
            try {
                // Get registered user count from profiles table
                const { count: userCount } = await supabase
                    .from('profiles')
                    .select('*', { count: 'exact', head: true })

                // Get download count
                const { count: downloadCount } = await supabase
                    .from('downloads')
                    .select('*', { count: 'exact', head: true })

                setStats({
                    users: userCount || 0,
                    downloads: downloadCount || 0,
                    tweaks: 270
                })
            } catch (error) {
                console.error('Error fetching stats:', error)
            }
        }

        fetchStats()
    }, [])

    // Animate numbers on scroll into view
    useEffect(() => {
        if (hasAnimated) return

        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) {
                    setHasAnimated(true)
                    animateNumbers()
                }
            },
            { threshold: 0.5 }
        )

        const element = document.getElementById('stats-counter')
        if (element) observer.observe(element)

        return () => observer.disconnect()
    }, [hasAnimated, stats])

    const animateNumbers = () => {
        const duration = 2000
        const steps = 60
        const interval = duration / steps

        let step = 0
        const timer = setInterval(() => {
            step++
            const progress = step / steps
            const easeOut = 1 - Math.pow(1 - progress, 3)

            setDisplayStats({
                users: Math.floor(stats.users * easeOut),
                downloads: Math.floor(stats.downloads * easeOut),
                tweaks: Math.floor(stats.tweaks * easeOut)
            })

            if (step >= steps) {
                clearInterval(timer)
                setDisplayStats(stats)
            }
        }, interval)
    }

    const formatNumber = (num: number) => {
        if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M'
        if (num >= 1000) return (num / 1000).toFixed(num >= 10000 ? 0 : 1) + 'K'
        return num.toString()
    }

    return (
        <div id="stats-counter" className="flex items-center justify-center gap-8 mt-16 text-sm">
            <div className="text-center group">
                <div className="flex items-center justify-center gap-2 mb-1">
                    <Sparkles className="w-4 h-4 text-emerald-400 opacity-0 group-hover:opacity-100 transition" />
                    <p className="text-2xl font-bold text-emerald-400">{displayStats.tweaks}+</p>
                </div>
                <p className="text-neutral-500">Tweaks</p>
            </div>

            <div className="w-px h-10 bg-white/10" />

            <div className="text-center group">
                <div className="flex items-center justify-center gap-2 mb-1">
                    <Users className="w-4 h-4 text-emerald-400 opacity-0 group-hover:opacity-100 transition" />
                    <p className="text-2xl font-bold text-emerald-400">{formatNumber(displayStats.users)}+</p>
                </div>
                <p className="text-neutral-500">Users</p>
            </div>

            <div className="w-px h-10 bg-white/10" />

            <div className="text-center group">
                <div className="flex items-center justify-center gap-2 mb-1">
                    <Download className="w-4 h-4 text-emerald-400 opacity-0 group-hover:opacity-100 transition" />
                    <p className="text-2xl font-bold text-emerald-400">
                        {formatNumber(displayStats.downloads)}+
                    </p>
                </div>
                <p className="text-neutral-500">Downloads</p>
            </div>
        </div>
    )
}
