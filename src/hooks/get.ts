import { getCookie } from 'cookies-next';
import { User } from '@prisma/client'
import { useEffect, useState } from 'react';

export const api = async (token: string) => {
  try {
    const res = await fetch('/api/auth/session', { headers: { authorization: `Bearer ${token}` } })
    const data = (await res.json()).user
    return data
  } catch (e) {
    throw e
  }
}

export const useUserInfo = () => {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    (
      async () => {
        try {
          const tk = getCookie("mi-auth.token")?.toString() || ""
          const data = await api(tk)
          if (!tk || !data) throw new Error("Not Found")
          setToken(tk)
          setUser(data)
        } catch (e: any) {
          setError(e)
        } finally {
          setLoading(false)
        }
      }
    )()
  }, [])

  return { user, token, error, loading }
}