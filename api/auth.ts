// Auth API - For Tauri App Login
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
    process.env.SUPABASE_URL || 'https://purbzxxjgdumubhbjahf.supabase.co',
    process.env.SUPABASE_SERVICE_KEY || ''
)

export default async function handler(req: any, res: any) {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

    if (req.method === 'OPTIONS') return res.status(200).end()
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

    const { action, email, password, hwid } = req.body

    try {
        // LOGIN - Validate credentials and return user data
        if (action === 'login') {
            if (!email || !password) {
                return res.status(400).json({ success: false, error: 'Email and password required' })
            }

            // Sign in with Supabase Auth
            const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
                email,
                password
            })

            if (authError || !authData.user) {
                return res.status(200).json({ success: false, error: 'Invalid email or password' })
            }

            // Get profile
            const { data: profile } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', authData.user.id)
                .single()

            // Get active license
            const { data: license } = await supabase
                .from('licenses')
                .select('*')
                .eq('user_id', authData.user.id)
                .eq('is_active', true)
                .order('created_at', { ascending: false })
                .limit(1)
                .single()

            // Check license expiry
            let isPremium = false
            let plan = 'free'
            let expiresAt = null

            if (license) {
                if (license.plan === 'lifetime') {
                    isPremium = true
                    plan = 'lifetime'
                } else if (license.expires_at) {
                    const expiry = new Date(license.expires_at)
                    if (expiry > new Date()) {
                        isPremium = true
                        plan = license.plan
                        expiresAt = license.expires_at
                    }
                }

                // Update HWID if provided
                if (hwid && (!license.hwid || license.hwid === hwid)) {
                    await supabase
                        .from('licenses')
                        .update({ hwid })
                        .eq('id', license.id)
                } else if (hwid && license.hwid && license.hwid !== hwid) {
                    // HWID mismatch - could be account sharing
                    // For now, just log it but allow login
                    console.log(`HWID mismatch for user ${authData.user.id}`)
                }
            }

            return res.status(200).json({
                success: true,
                user: {
                    id: authData.user.id,
                    email: authData.user.email,
                    username: profile?.username || email.split('@')[0],
                    avatar: profile?.avatar_url,
                    discord_id: profile?.discord_id,
                    discord_username: profile?.discord_username,
                    discord_avatar: profile?.discord_avatar,
                    created_at: profile?.created_at
                },
                license: {
                    plan,
                    is_premium: isPremium,
                    expires_at: expiresAt,
                    key: license?.key || null
                }
            })
        }

        // REGISTER - Create new account
        if (action === 'register') {
            const { username } = req.body

            if (!email || !password || !username) {
                return res.status(400).json({ success: false, error: 'Email, username and password required' })
            }

            if (password.length < 6) {
                return res.status(200).json({ success: false, error: 'Password must be at least 6 characters' })
            }

            // Check if username exists
            const { data: existingUser } = await supabase
                .from('profiles')
                .select('username')
                .eq('username', username)
                .single()

            if (existingUser) {
                return res.status(200).json({ success: false, error: 'Username already taken' })
            }

            // Create user
            const { data: authData, error: authError } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: { username }
                }
            })

            if (authError) {
                return res.status(200).json({ success: false, error: authError.message })
            }

            return res.status(200).json({
                success: true,
                message: 'Account created successfully',
                user: {
                    id: authData.user?.id,
                    email: authData.user?.email,
                    username
                }
            })
        }

        return res.status(400).json({ success: false, error: 'Invalid action' })

    } catch (e: any) {
        console.error('Auth API error:', e)
        return res.status(500).json({ success: false, error: 'Server error' })
    }
}
