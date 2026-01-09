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
    try {
        const { error } = await supabase.auth.signOut()
        if (error) console.error('Sign out error:', error)
        // Clear local storage
        localStorage.removeItem('dashboard-tab')
        return { error }
    } catch (e: any) {
        console.error('Sign out exception:', e)
        return { error: { message: e.message } }
    }
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
    try {
        // Get current user identities
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return { error: { message: 'Not logged in' } }

        const discordIdentity = user.identities?.find(i => i.provider === 'discord')
        if (!discordIdentity) return { error: { message: 'Discord not linked' } }

        const { error } = await supabase.auth.unlinkIdentity(discordIdentity)
        if (error) console.error('Unlink error:', error)
        return { error }
    } catch (e: any) {
        console.error('Unlink exception:', e)
        return { error: { message: e.message } }
    }
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
    try {
        console.log('getProfile called for:', userId)

        // Use API route with service key to bypass RLS issues
        const response = await fetch(`/api/profile?userId=${userId}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        })

        const result = await response.json()
        console.log('getProfile API result:', result)

        if (!result.success) {
            return { data: null, error: { message: result.error } }
        }

        return { data: result.profile, error: null }
    } catch (e: any) {
        console.error('getProfile exception:', e)
        return { data: null, error: { message: e.message } }
    }
}

export const getLicense = async (userId: string) => {
    try {
        // Use API route with service key to bypass RLS
        const response = await fetch(`/api/license?action=get&user_id=${userId}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        })

        const result = await response.json()
        console.log('getLicense result:', result)

        if (!result.success) {
            return { data: null, error: { message: result.error } }
        }

        return { data: result.license, error: null }
    } catch (e: any) {
        console.error('getLicense error:', e)
        return { data: null, error: { message: e.message } }
    }
}

export const redeemLicense = async (key: string, userId: string) => {
    try {
        // Use API route with service key to bypass RLS
        const response = await fetch('/api/license?action=redeem', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ key: key.trim(), user_id: userId })
        })

        const result = await response.json()
        console.log('Redeem result:', result)

        if (!result.success) {
            return { error: { message: result.error || 'Failed to redeem license' } }
        }

        return { data: result.license, error: null }
    } catch (e: any) {
        console.error('Redeem error:', e)
        return { error: { message: e.message || 'Network error' } }
    }
}
