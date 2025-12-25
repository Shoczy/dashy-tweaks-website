import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://purbzxxjgdumubhbjahf.supabase.co'
const supabaseAnonKey = 'sb_publishable_8yKtOy-s12i-XVQXLdq9QQ_FQ8nkJbq'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Auth helpers
export async function signInWithDiscord() {
    const { error } = await supabase.auth.signInWithOAuth({
        provider: 'discord',
        options: {
            redirectTo: `${window.location.origin}/auth/callback`
        }
    })
    if (error) throw error
}

export async function signInWithGoogle() {
    const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
            redirectTo: `${window.location.origin}/auth/callback`
        }
    })
    if (error) throw error
}

export async function signOut() {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
}

export async function getUser() {
    const { data: { user } } = await supabase.auth.getUser()
    return user
}

export async function getSession() {
    const { data: { session } } = await supabase.auth.getSession()
    return session
}
