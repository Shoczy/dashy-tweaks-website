import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { User } from '@supabase/supabase-js'
import { supabase, getProfile, getLicense } from '../lib/supabase'

interface Profile {
    id: string
    username: string
    email: string
    avatar_url: string | null
    discord_id: string | null
    discord_username: string | null
    discord_avatar: string | null
    created_at: string
}

interface License {
    key: string
    plan: string
    expires_at: string | null
    is_active: boolean
}

interface AuthContextType {
    user: User | null
    profile: Profile | null
    license: License | null
    loading: boolean
    isPremium: boolean
    refreshData: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    profile: null,
    license: null,
    loading: true,
    isPremium: false,
    refreshData: async () => { }
})

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null)
    const [profile, setProfile] = useState<Profile | null>(null)
    const [license, setLicense] = useState<License | null>(null)
    const [loading, setLoading] = useState(true)

    const loadUserData = async (userId: string, userEmail?: string, userMeta?: any) => {
        let { data: profileData, error } = await getProfile(userId)

        // If profile doesn't exist, create it
        if (error || !profileData) {
            console.log('Profile not found, creating...')
            const username = userMeta?.username || userEmail?.split('@')[0] || 'User'
            const { data: newProfile, error: createError } = await supabase
                .from('profiles')
                .insert({
                    id: userId,
                    username: username,
                    email: userEmail || '',
                    created_at: new Date().toISOString()
                })
                .select()
                .single()

            if (createError) {
                console.error('Failed to create profile:', createError)
                // Use fallback profile from user data
                setProfile({
                    id: userId,
                    username: username,
                    email: userEmail || '',
                    avatar_url: null,
                    discord_id: null,
                    discord_username: null,
                    discord_avatar: null,
                    created_at: new Date().toISOString()
                })
            } else {
                setProfile(newProfile)
            }
        } else {
            setProfile(profileData)
        }

        const { data: licenseData } = await getLicense(userId)
        if (licenseData) setLicense(licenseData)
    }

    const refreshData = async () => {
        if (user) {
            await loadUserData(user.id)
        }
    }

    useEffect(() => {
        // Get initial session with timeout
        const timeout = setTimeout(() => {
            setLoading(false)
        }, 3000) // Max 3 seconds loading

        supabase.auth.getSession().then(({ data: { session } }) => {
            clearTimeout(timeout)
            setUser(session?.user ?? null)
            if (session?.user) {
                loadUserData(
                    session.user.id,
                    session.user.email,
                    session.user.user_metadata
                ).finally(() => setLoading(false))
            } else {
                setLoading(false)
            }
        }).catch(() => {
            clearTimeout(timeout)
            setLoading(false)
        })

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
            setUser(session?.user ?? null)
            if (session?.user) {
                await loadUserData(
                    session.user.id,
                    session.user.email,
                    session.user.user_metadata
                )
            } else {
                setProfile(null)
                setLicense(null)
            }
        })

        return () => {
            clearTimeout(timeout)
            subscription.unsubscribe()
        }
    }, [])

    // Check if premium
    const isPremium = (() => {
        if (!license || !license.is_active) return false
        if (license.plan === 'lifetime') return true
        if (license.expires_at) {
            return new Date(license.expires_at) > new Date()
        }
        return false
    })()

    return (
        <AuthContext.Provider value={{ user, profile, license, loading, isPremium, refreshData }}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    return useContext(AuthContext)
}
