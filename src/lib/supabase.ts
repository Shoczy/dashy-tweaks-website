import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://purbzxxjgdumubhbjahf.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB1cmJ6eHhqZ2R1bXViaGJqYWhmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzUwNjI0NzcsImV4cCI6MjA1MDYzODQ3N30.Ej8Ej8Ej8Ej8'

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
        .single()
    return { data, error }
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
