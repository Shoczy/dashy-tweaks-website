// Profile API - Get profile using service key (bypasses RLS)
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
    process.env.SUPABASE_URL || 'https://purbzxxjgdumubhbjahf.supabase.co',
    process.env.SUPABASE_SERVICE_KEY || ''
)

export default async function handler(req: any, res: any) {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')

    if (req.method === 'OPTIONS') return res.status(200).end()

    const { userId } = req.method === 'GET' ? req.query : req.body

    if (!userId) {
        return res.status(400).json({ success: false, error: 'User ID required' })
    }

    try {
        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', userId)
            .single()

        if (error) {
            console.error('Profile fetch error:', error)
            return res.status(200).json({ success: false, error: error.message })
        }

        return res.status(200).json({ success: true, profile: data })

    } catch (e: any) {
        console.error('Profile API error:', e)
        return res.status(500).json({ success: false, error: 'Server error' })
    }
}
