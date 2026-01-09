import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export const signUp = async (email: string, password: string, username: string) => {
    const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: { username }
        }
    })
    return { data, error }
}

export const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
    })
    return { data, error }
}

export const signOut = async () => {
    const { error } = await supabase.auth.signOut()
    return { error }
}

export const signInWithDiscord = async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'discord',
        options: {
            redirectTo: `${window.location.origin}/dashboard`
        }
    })
    return { data, error }
}

export const linkDiscordAccount = async () => {
    const { data, error } = await supabase.auth.linkIdentity({
        provider: 'discord',
        options: {
            redirectTo: `${window.location.origin}/dashboard?tab=settings`
        }
    })
    return { data, error }
}

export const unlinkDiscordAccount = async () => {
    // Get current user identities
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: { message: 'Not logged in' } }

    const discordIdentity = user.identities?.find(i => i.provider === 'discord')
    if (!discordIdentity) return { error: { message: 'Discord not linked' } }

    const { error } = await supabase.auth.unlinkIdentity(discordIdentity)
    return { error }
}

export const updateProfileDiscord = async (userId: string, discordData: { discord_id: string | null, discord_username: string | null, discord_avatar: string | null }) => {
    try {
        // Use API route with service key to bypass RLS
        const response = await fetch('/api/discord-sync', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                userId,
                discordId: discordData.discord_id,
                discordUsername: discordData.discord_username,
                discordAvatar: discordData.discord_avatar
            })
        })

        const data = await response.json()

        if (!data.success) {
            console.error('Discord sync failed:', data.error)
            return { error: { message: data.error } }
        }

        console.log('Discord synced successfully:', data.profile)
        return { data: data.profile, error: null }
    } catch (e: any) {
        console.error('Discord sync error:', e)
        return { error: { message: e.message } }
    }
}

export const signInWithGoogle = async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
            redirectTo: `${window.location.origin}/dashboard`
        }
    })
    return { data, error }
}

export const getSession = async () => {
    const { data: { session } } = await supabase.auth.getSession()
    return session
}

export const getProfile = async (userId: string) => {
    const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()
    return { data, error }
}

export const getLicense = async (userId: string) => {
    const { data, error } = await supabase
        .from('licenses')
        .select('*')
        .eq('user_id', userId)
        .eq('is_active', true)
        .order('created_at', { ascending: false })
        .limit(1)

    // Return first item or null (don't use .single() as it throws on no results)
    return { data: data?.[0] || null, error: data?.[0] ? null : error }
}

export const redeemLicense = async (key: string, userId: string) => {
    // First check if key exists and is not redeemed
    const { data: license, error: findError } = await supabase
        .from('licenses')
        .select('*')
        .eq('key', key.toUpperCase())
        .single()

    if (findError || !license) {
        return { error: { message: 'Invalid license key' } }
    }

    if (license.user_id) {
        return { error: { message: 'License already redeemed' } }
    }

    if (!license.is_active) {
        return { error: { message: 'License has been revoked' } }
    }

    // Redeem it
    const { error } = await supabase
        .from('licenses')
        .update({
            user_id: userId,
            redeemed_at: new Date().toISOString()
        })
        .eq('key', key.toUpperCase())

    if (error) {
        return { error: { message: 'Failed to redeem license' } }
    }

    return { data: license, error: null }
}
