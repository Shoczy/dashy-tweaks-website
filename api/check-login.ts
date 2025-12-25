// Vercel Serverless Function - Check login status for desktop app
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
    process.env.VITE_SUPABASE_URL || 'https://purbzxxjgdumubhbjahf.supabase.co',
    process.env.SUPABASE_SERVICE_KEY || process.env.VITE_SUPABASE_ANON_KEY || ''
)

export default async function handler(req: any, res: any) {
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
        try {
            const { data, error } = await supabase
                .from('app_login_sessions')
                .select('user_data')
                .eq('session_id', session)
                .single()

            if (data && !error) {
                // Delete after reading (one-time use)
                await supabase
                    .from('app_login_sessions')
                    .delete()
                    .eq('session_id', session)

                return res.status(200).json({ success: true, user: data.user_data })
            }
            return res.status(200).json({ success: false })
        } catch {
            return res.status(200).json({ success: false })
        }
    }

    // POST - Store login completion
    if (req.method === 'POST') {
        const { user } = req.body || {}
        if (user) {
            try {
                // Delete old session if exists
                await supabase
                    .from('app_login_sessions')
                    .delete()
                    .eq('session_id', session)

                // Insert new session
                const { error } = await supabase
                    .from('app_login_sessions')
                    .insert({
                        session_id: session,
                        user_data: user,
                        created_at: new Date().toISOString()
                    })

                if (error) {
                    console.error('Supabase error:', error)
                    return res.status(500).json({ success: false, error: 'Database error' })
                }

                return res.status(200).json({ success: true })
            } catch (e) {
                console.error('Error:', e)
                return res.status(500).json({ success: false, error: 'Server error' })
            }
        }
        return res.status(400).json({ success: false, error: 'Missing user data' })
    }

    return res.status(405).json({ error: 'Method not allowed' })
}
