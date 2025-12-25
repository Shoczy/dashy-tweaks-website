// Vercel Serverless Function - Check login status for desktop app

// In-memory store (resets on cold start - use Redis/Supabase for production)
const loginSessions = new Map<string, { user: any; timestamp: number }>()

export default function handler(req: any, res: any) {
    // CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

    if (req.method === 'OPTIONS') {
        return res.status(200).end()
    }

    const session = req.query.session as string

    if (!session) {
        return res.status(400).json({ success: false, error: 'Missing session ID' })
    }

    // GET - Check if login completed
    if (req.method === 'GET') {
        const data = loginSessions.get(session)
        if (data) {
            loginSessions.delete(session) // One-time use
            return res.status(200).json({ success: true, user: data.user })
        }
        return res.status(200).json({ success: false })
    }

    // POST - Store login completion
    if (req.method === 'POST') {
        const { user } = req.body || {}
        if (user) {
            loginSessions.set(session, { user, timestamp: Date.now() })
            // Cleanup old sessions
            const now = Date.now()
            for (const [key, value] of loginSessions.entries()) {
                if (now - value.timestamp > 5 * 60 * 1000) {
                    loginSessions.delete(key)
                }
            }
            return res.status(200).json({ success: true })
        }
        return res.status(400).json({ success: false, error: 'Missing user data' })
    }

    return res.status(405).json({ error: 'Method not allowed' })
}
