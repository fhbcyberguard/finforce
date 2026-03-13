import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { User, Session } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase/client'

export interface Profile {
  id: string
  full_name: string | null
  updated_at: string | null
  avatar_url: string | null
  email?: string | null
  plan?: string
  profile_type?: string | null
  birth_date?: string | null
  created_at?: string
}

interface AuthContextType {
  user: User | null
  session: Session | null
  profile: Profile | null
  isMasterAdmin: boolean
  signUp: (
    email: string,
    password: string,
    fullName: string,
    profileType?: string,
  ) => Promise<{ error: any }>
  signIn: (email: string, password: string) => Promise<{ error: any }>
  signOut: () => Promise<{ error: any }>
  loading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within an AuthProvider')
  return context
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)

  const isMasterAdmin = user?.email === 'fhbcyberguard@gmail.com' || profile?.plan === 'team'

  useEffect(() => {
    let mounted = true

    // Fetch initial session safely to avoid race conditions with onAuthStateChange
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (mounted) {
        setSession(session)
        setUser(session?.user ?? null)
        setLoading(false) // Only stop loading after accurate initial check
      }
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (mounted) {
        setSession(session)
        setUser(session?.user ?? null)
        // Do not set loading to false here to prevent unwanted redirects on slow INITIAL_SESSION
      }
    })

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [])

  useEffect(() => {
    let mounted = true

    const fetchProfile = async (userId: string) => {
      const { data } = await supabase.from('profiles').select('*').eq('id', userId).single()
      if (mounted && data) {
        setProfile(data as Profile)
      }
    }

    if (user) {
      fetchProfile(user.id)
    } else {
      setProfile(null)
    }

    return () => {
      mounted = false
    }
  }, [user])

  const signUp = async (
    email: string,
    password: string,
    fullName: string,
    profileType: string = 'personal',
  ) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName, profile_type: profileType },
        emailRedirectTo: `${window.location.origin}/`,
      },
    })
    return { error }
  }

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    return { error }
  }

  const signOut = async () => {
    const { error } = await supabase.auth.signOut()
    return { error }
  }

  return (
    <AuthContext.Provider
      value={{ user, session, profile, isMasterAdmin, signUp, signIn, signOut, loading }}
    >
      {children}
    </AuthContext.Provider>
  )
}
