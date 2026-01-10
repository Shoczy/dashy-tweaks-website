import type { VercelRequest, VercelResponse } from '@vercel/node'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
    process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_KEY!
)

// Discord Bot Token and Server Config
const DISCORD_BOT_TOKEN = process.env.DISCORD_BOT_TOKEN!
const DISCORD_GUILD_ID = process.env.DISCORD_GUILD_ID!
const MONTHLY_ROLE_ID = process.env.DISCORD_MONTHLY_ROLE_ID!
const LIFETIME_ROLE_ID = process.env.DISCORD_LIFETIME_ROLE_ID!

export default async function handler(req: VercelRequest, res: VercelResponse) {
    // CORS
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')

    if (req.method === 'OPTIONS') {
        return res.status(200).end()
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' })
    }

    try {
        const { action, userId } = req.body

        if (!userId) {
            return res.status(400).json({ error: 'User ID required' })
        }

        // Get user profile with discord_id
        const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('discord_id')
            .eq('id', userId)
            .single()

        if (profileError || !profile?.discord_id) {
            return res.status(400).json({ error: 'Discord not linked' })
        }

        // Get user's license
        const { data: license } = await supabase
            .from('licenses')
            .select('plan, is_active, expires_at')
            .eq('user_id', userId)
            .eq('is_active', true)
            .single()

        if (action === 'sync-role') {
            // Determine which role to assign based on license
            let roleToAdd: string | null = null
            let roleToRemove: string | null = null

            if (license) {
                if (license.plan === 'lifetime') {
                    roleToAdd = LIFETIME_ROLE_ID
                    roleToRemove = MONTHLY_ROLE_ID
                } else if (license.plan === 'premium' || license.plan === 'monthly') {
                    // Check if not expired
                    if (!license.expires_at || new Date(license.expires_at) > new Date()) {
                        roleToAdd = MONTHLY_ROLE_ID
                        roleToRemove = LIFETIME_ROLE_ID
                    }
                }
            }

            // Remove old role if exists
            if (roleToRemove) {
                await fetch(
                    `https://discord.com/api/v10/guilds/${DISCORD_GUILD_ID}/members/${profile.discord_id}/roles/${roleToRemove}`,
                    {
                        method: 'DELETE',
                        headers: { Authorization: `Bot ${DISCORD_BOT_TOKEN}` }
                    }
                )
            }

            // Add new role
            if (roleToAdd && license) {
                // First check if user is in the guild
                const memberCheck = await fetch(
                    `https://discord.com/api/v10/guilds/${DISCORD_GUILD_ID}/members/${profile.discord_id}`,
                    {
                        headers: { Authorization: `Bot ${DISCORD_BOT_TOKEN}` }
                    }
                )

                if (!memberCheck.ok) {
                    console.error('Member not found in guild:', await memberCheck.text())
                    return res.status(400).json({ error: 'You are not in the Discord server. Please join first: https://discord.gg/cXxFzBuG' })
                }

                const addResponse = await fetch(
                    `https://discord.com/api/v10/guilds/${DISCORD_GUILD_ID}/members/${profile.discord_id}/roles/${roleToAdd}`,
                    {
                        method: 'PUT',
                        headers: { Authorization: `Bot ${DISCORD_BOT_TOKEN}` }
                    }
                )

                if (!addResponse.ok) {
                    const error = await addResponse.text()
                    console.error('Discord API error:', error)
                    return res.status(500).json({ error: 'Failed to assign role. Bot may lack permissions.' })
                }

                return res.status(200).json({
                    success: true,
                    role: license.plan === 'lifetime' ? 'Lifetime' : 'Monthly',
                    message: `Role synced: ${license.plan === 'lifetime' ? 'Lifetime' : 'Monthly'}`
                })
            }

            return res.status(200).json({ success: true, role: null, message: 'No active license to sync' })
        }

        if (action === 'update-profile') {
            // Get Discord user info
            const userResponse = await fetch(
                `https://discord.com/api/v10/users/${profile.discord_id}`,
                {
                    headers: { Authorization: `Bot ${DISCORD_BOT_TOKEN}` }
                }
            )

            if (!userResponse.ok) {
                return res.status(500).json({ error: 'Failed to fetch Discord profile' })
            }

            const discordUser = await userResponse.json()

            // Update profile in Supabase
            const avatarUrl = discordUser.avatar
                ? `https://cdn.discordapp.com/avatars/${discordUser.id}/${discordUser.avatar}.png`
                : null

            await supabase
                .from('profiles')
                .update({
                    discord_username: discordUser.username,
                    discord_avatar: avatarUrl
                })
                .eq('id', userId)

            return res.status(200).json({
                success: true,
                username: discordUser.username,
                avatar: avatarUrl
            })
        }

        return res.status(400).json({ error: 'Invalid action' })

    } catch (error: any) {
        console.error('Discord sync error:', error)
        return res.status(500).json({ error: error.message })
    }
}
