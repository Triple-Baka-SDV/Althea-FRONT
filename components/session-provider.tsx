import { createContext, ReactNode, useContext, useEffect, useState } from "react"
import { authClient } from "@/lib/auth-client"
import type { Session, User } from "better-auth/types"

interface AuthContextType {
  user: User | null
  session: Session | null
  isLoading: boolean
  isAuthenticated: boolean
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function SessionProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const response = await authClient.getSession()
        if (response.data) {
          setUser(response.data.user)
          setSession(response.data.session)
        }
      } catch (error) {
        console.error("Failed to initialize auth:", error)
      } finally {
        setIsLoading(false)
      }
    }

    initializeAuth()
  }, [])

  const signOut = async () => {
    try {
      await authClient.signOut()
      setUser(null)
      setSession(null)
    } catch (error) {
      console.error("Failed to sign out:", error)
      throw error
    }
  }

  const value: AuthContextType = {
    user,
    session,
    isLoading,
    isAuthenticated: !!user,
    signOut,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuthContext() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuthContext must be used within SessionProvider")
  }
  return context
}
