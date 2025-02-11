'use client'

import { createContext, useContext, useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { ThemeProvider } from 'next-themes'
import { useRouter } from 'next/navigation'

const APP_LOG = '[APP:auth]'

interface AuthState {
  alias: string | null
  language: 'en' | 'es'
  isAdmin: boolean
}

interface AuthContextType {
  auth: AuthState
  signIn: (alias: string, language: 'en' | 'es') => Promise<void>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  auth: { alias: null, language: 'es', isAdmin: false },
  signIn: async () => {},
  signOut: async () => {}
})

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AppProvider')
  }
  return context
}

export default function AppProvider({ children }: { children: React.ReactNode }) {
  const supabase = createClientComponentClient()
  const router = useRouter()
  const [auth, setAuth] = useState<AuthState>({
    alias: null,
    language: 'es',
    isAdmin: false
  })

  const signIn = async (alias: string, language: 'en' | 'es') => {
    try {
      const { error } = await supabase.from('sessions')
        .upsert({
          user_alias: alias,
          language,
          last_seen_at: new Date().toISOString()
        }, {
          onConflict: 'user_alias'
        })

      if (error) throw error

      localStorage.setItem('language', language)
      localStorage.setItem('user_alias', alias)

      const isAdmin = alias === '_soyelputoamo_'
      setAuth({ alias, language, isAdmin })

      router.push('/welcome-back')
    } catch (error) {
      console.error(`${APP_LOG} Sign in error:`, error)
      throw error
    }
  }

  const signOut = async () => {
    try {
      const alias = localStorage.getItem('user_alias')
      if (alias) {
        await supabase.from('sessions')
          .delete()
          .eq('user_alias', alias)
      }

      localStorage.removeItem('user_alias')
      setAuth({ alias: null, language: 'es', isAdmin: false })
      router.replace('/auth')
    } catch (error) {
      console.error(`${APP_LOG} Sign out error:`, error)
      throw error
    }
  }

  return (
    <ThemeProvider attribute="data-theme" defaultTheme="dark" enableSystem={false}>
      <AuthContext.Provider value={{ auth, signIn, signOut }}>
        {children}
      </AuthContext.Provider>
    </ThemeProvider>
  )
}