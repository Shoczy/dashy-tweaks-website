// Discord Sync API - Updates profile with Discord data using service key
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
    process.env.SUPABASE_URL || 'https://purbzxxjgdumubhbjahf.supabase.co',
    process.env.SUPABASE_SERVICE_KEY || ''
)

export default async function handler(req: any, res: any) {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')

    if (req.method === 'OPTIONS') return res.status(200).end()
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

    const { userId, discordId, discordUsername, discordAvatar } = req.body

    if (!userId) {
        return res.status(400).json({ success: false, error: 'User ID required' })
    }

    try {
        // Update profile with Discord data using service key (bypasses RLS)
        const { data, error } = await supabase
            .from('profiles')
            .update({
                discord_id: discordId || null,
                discord_username: discordUsername || null,
                discord_avatar: discordAvatar || null,
                updated_at: new Date().toISOString()
            })
            .eq('id', userId)
            .select()
            .single()

        if (error) {
            console.error('Discord sync error:', error)
            return res.status(200).json({ success: false, error: error.message })
        }

        return res.status(200).json({ success: true, profile: data })

    } catch (e: any) {
        console.error('Discord sync API error:', e)
        return res.status(500).json({ success: false, error: 'Server error' })
    }
}
