// Vercel Serverless Function - Check login status for desktop app
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
    'https://purbzxxjgdumubhbjahf.supabase.co',
    'sb_publishable_8yKtOy-s12i-XVQXLdq9QQ_FQ8nkJbq'
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
                .maybeSingle()

            if (error) {
                console.error('Supabase GET error:', error)
                return res.status(200).json({ success: false, error: error.message })
            }

            if (data) {
                // Delete after reading (one-time use)
                await supabase
                    .from('app_login_sessions')
                    .delete()
                    .eq('session_id', session)

                return res.status(200).json({ success: true, user: data.user_data })
            }
            return res.status(200).json({ success: false })
        } catch (e: any) {
            console.error('GET error:', e)
            return res.status(200).json({ success: false, error: e.message })
        }
    }

    // POST - Store login completion
    if (req.method === 'POST') {
        const { user } = req.body || {}
        if (!user) {
            return res.status(400).json({ success: false, error: 'Missing user data' })
        }

        try {
            // Upsert - insert or update if exists
            const { error } = await supabase
                .from('app_login_sessions')
                .upsert({
                    session_id: session,
                    user_data: user,
                    created_at: new Date().toISOString()
                }, {
                    onConflict: 'session_id'
                })

            if (error) {
                console.error('Supabase POST error:', error)
                return res.status(500).json({ success: false, error: error.message })
            }

            return res.status(200).json({ success: true, message: 'Session stored' })
        } catch (e: any) {
            console.error('POST error:', e)
            return res.status(500).json({ success: false, error: e.message })
        }
    }

    return res.status(405).json({ error: 'Method not allowed' })
}
