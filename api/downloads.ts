import type { VercelRequest, VercelResponse } from '@vercel/node'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
    process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_KEY!
)

export default async function handler(req: VercelRequest, res: VercelResponse) {
    // CORS
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

    if (req.method === 'OPTIONS') {
        return res.status(200).end()
    }

    // POST - Track a new download
    if (req.method === 'POST') {
        try {
            const { version, source } = req.body

            const { error } = await supabase.from('downloads').insert({
                version: version || '1.3.0',
                source: source || 'website',
                ip_hash: hashIP(req.headers['x-forwarded-for'] as string || req.socket.remoteAddress || ''),
                user_agent: req.headers['user-agent'] || ''
            })

            if (error) throw error

            return res.status(200).json({ success: true })
        } catch (error: any) {
            return res.status(500).json({ error: error.message })
        }
    }

    // GET - Get download count
    if (req.method === 'GET') {
        try {
            const { count } = await supabase
                .from('downloads')
                .select('*', { count: 'exact', head: true })

            return res.status(200).json({ downloads: count || 0 })
        } catch (error: any) {
            return res.status(500).json({ error: error.message })
        }
    }

    return res.status(405).json({ error: 'Method not allowed' })
}

// Simple hash function for IP (privacy)
function hashIP(ip: string): string {
    let hash = 0
    for (let i = 0; i < ip.length; i++) {
        const char = ip.charCodeAt(i)
        hash = ((hash << 5) - hash) + char
        hash = hash & hash
    }
    return hash.toString(16)
}
