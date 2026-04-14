import { useEffect, useState } from "react"
import { authClient } from "@/lib/auth-client"
import type { Session, User } from "better-auth/types"

interface UseAuthReturn {
  user: User | null
  session: Session | null
  isLoading: boolean
  isAuthenticated: boolean
  signOut: () => Promise<void>
}

export function useAuth(): UseAuthReturn {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const getSession = async () => {
      try {
        const response = await authClient.getSession()
        if (response.data) {
          setUser(response.data.user)
          setSession(response.data.session)
        }
      } catch (error) {
        console.error("Failed to fetch session:", error)
      } finally {
        setIsLoading(false)
      }
    }

    getSession()
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

  return {
    user,
    session,
    isLoading,
    isAuthenticated: !!user,
    signOut,
  }
}
