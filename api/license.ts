// License API - Redeem, Create, Manage
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
    process.env.SUPABASE_URL || 'https://purbzxxjgdumubhbjahf.supabase.co',
    process.env.SUPABASE_SERVICE_KEY || ''
)

const BOT_SECRET = process.env.BOT_SECRET || ''

export default async function handler(req: any, res: any) {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')

    if (req.method === 'OPTIONS') return res.status(200).end()

    const action = req.query.action as string

    try {
        // GET /api/license?action=get&user_id=XXX - Get user's license
        if (req.method === 'GET' && action === 'get') {
            const user_id = req.query.user_id as string
            if (!user_id) {
                return res.status(400).json({ success: false, error: 'user_id required' })
            }

            const { data: license, error } = await supabase
                .from('licenses')
                .select('*')
                .eq('user_id', user_id)
                .eq('is_active', true)
                .order('created_at', { ascending: false })
                .limit(1)
                .single()

            if (error || !license) {
                return res.status(200).json({ success: true, license: null })
            }

            return res.status(200).json({ success: true, license })
        }

        // POST /api/license?action=redeem - Redeem a license key
        if (req.method === 'POST' && action === 'redeem') {
            const { key, user_id } = req.body

            if (!key || !user_id) {
                return res.status(400).json({ success: false, error: 'Key and user_id required' })
            }

            // Find license
            const { data: license, error } = await supabase
                .from('licenses')
                .select('*')
                .eq('key', key.toUpperCase())
                .single()

            if (error || !license) {
                return res.status(200).json({ success: false, error: 'Invalid license key' })
            }

            if (!license.is_active) {
                return res.status(200).json({ success: false, error: 'License has been revoked' })
            }

            if (license.user_id) {
                return res.status(200).json({ success: false, error: 'License already redeemed' })
            }

            // Redeem license
            const { error: updateError } = await supabase
                .from('licenses')
                .update({
                    user_id,
                    redeemed_at: new Date().toISOString()
                })
                .eq('key', key.toUpperCase())

            if (updateError) {
                return res.status(500).json({ success: false, error: 'Failed to redeem license' })
            }

            return res.status(200).json({
                success: true,
                message: 'License redeemed successfully',
                license: {
                    plan: license.plan,
                    expires_at: license.expires_at
                }
            })
        }

        // POST /api/license?action=create - Create license (Bot only)
        if (req.method === 'POST' && action === 'create') {
            const authHeader = req.headers.authorization
            if (authHeader !== `Bearer ${BOT_SECRET}`) {
                return res.status(401).json({ success: false, error: 'Unauthorized' })
            }

            const { plan, days, created_by } = req.body

            // Generate unique key
            let key: string
            let attempts = 0
            do {
                key = generateKey()
                const { data } = await supabase.from('licenses').select('key').eq('key', key).single()
                if (!data) break
                attempts++
            } while (attempts < 10)

            // Calculate expiry
            let expires_at = null
            if (plan !== 'lifetime' && days) {
                const expiry = new Date()
                expiry.setDate(expiry.getDate() + parseInt(days))
                expires_at = expiry.toISOString()
            }

            // Insert license
            const { error } = await supabase.from('licenses').insert({
                key,
                plan: plan || 'premium',
                expires_at,
                created_by,
                is_active: true
            })

            if (error) {
                return res.status(500).json({ success: false, error: error.message })
            }

            return res.status(200).json({ success: true, key, plan, expires_at })
        }

        // GET /api/license?action=info&key=XXX - Get license info (Bot only)
        if (req.method === 'GET' && action === 'info') {
            const authHeader = req.headers.authorization
            if (authHeader !== `Bearer ${BOT_SECRET}`) {
                return res.status(401).json({ success: false, error: 'Unauthorized' })
            }

            const key = req.query.key as string
            if (!key) {
                return res.status(400).json({ success: false, error: 'Missing key' })
            }

            const { data: license } = await supabase
                .from('licenses')
                .select('*, profiles(username, email)')
                .eq('key', key.toUpperCase())
                .single()

            if (!license) {
                return res.status(200).json({ success: false, error: 'License not found' })
            }

            return res.status(200).json({ success: true, license })
        }

        // POST /api/license?action=revoke - Revoke license (Bot only)
        if (req.method === 'POST' && action === 'revoke') {
            const authHeader = req.headers.authorization
            if (authHeader !== `Bearer ${BOT_SECRET}`) {
                return res.status(401).json({ success: false, error: 'Unauthorized' })
            }

            const { key } = req.body
            if (!key) {
                return res.status(400).json({ success: false, error: 'Missing key' })
            }

            const { error } = await supabase
                .from('licenses')
                .update({ is_active: false })
                .eq('key', key.toUpperCase())

            if (error) {
                return res.status(500).json({ success: false, error: error.message })
            }

            return res.status(200).json({ success: true, message: 'License revoked' })
        }

        // POST /api/license?action=reset-hwid - Reset HWID (Bot only)
        if (req.method === 'POST' && action === 'reset-hwid') {
            const authHeader = req.headers.authorization
            if (authHeader !== `Bearer ${BOT_SECRET}`) {
                return res.status(401).json({ success: false, error: 'Unauthorized' })
            }

            const { key } = req.body
            if (!key) {
                return res.status(400).json({ success: false, error: 'Missing key' })
            }

            const { error } = await supabase
                .from('licenses')
                .update({ hwid: null })
                .eq('key', key.toUpperCase())

            if (error) {
                return res.status(500).json({ success: false, error: error.message })
            }

            return res.status(200).json({ success: true, message: 'HWID reset' })
        }

        return res.status(400).json({ success: false, error: 'Invalid action' })

    } catch (e: any) {
        console.error('License API error:', e)
        return res.status(500).json({ success: false, error: e.message })
    }
}

function generateKey(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
    let key = 'DASHY-'
    for (let j = 0; j < 3; j++) {
        for (let i = 0; i < 4; i++) {
            key += chars.charAt(Math.floor(Math.random() * chars.length))
        }
        if (j < 2) key += '-'
    }
    return key
}
